// frontend/src/auth/services/auth.service.js

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence
} from 'firebase/auth'
import { app } from '../../config/firebase'
import axios from 'axios'

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
    prompt: 'select_account'
})

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.baseURL = API_BASE_URL
axios.defaults.timeout = 30000

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const STORAGE_KEYS = {
    PERSISTENCE_TYPE: 'savlink_auth_persistence',
    USER_PREFERENCE: 'savlink_remember_preference',
    AUTH_TIMESTAMP: 'savlink_auth_timestamp'
}

const CACHE_KEYS = {
    USER_DATA: 'savlink_cached_user',
    TOKEN: 'savlink_cached_token',
    CACHE_TIMESTAMP: 'savlink_cache_timestamp',
    TOKEN_EXPIRY: 'savlink_token_expiry'
}

const CACHE_DURATION = 24 * 60 * 60 * 1000
const BACKGROUND_VERIFY_INTERVAL = 3 * 60 * 1000
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000

let currentUser = null
let authStateListeners = []
let authInitialized = false
let authInitPromise = null
let backgroundVerificationInterval = null
let lastVerificationTime = 0
let verificationInProgress = false
let warmupInterval = null
let isWarmedUp = false

axios.interceptors.request.use(
    config => {
        config.metadata = { startTime: new Date() }
        return config
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    response => {
        const duration = new Date() - response.config.metadata.startTime
        if (duration > 10000) {
            console.warn(`Slow API call: ${response.config.url} took ${duration}ms`)
        }
        return response
    },
    async error => {
        const config = error.config

        if (!config || !config.retry) {
            config.retry = 0
        }

        const shouldRetry =
            config.retry < MAX_RETRIES &&
            (error.code === 'ECONNABORTED' ||
                error.code === 'NETWORK_ERROR' ||
                error.message.includes('timeout') ||
                (error.response && error.response.status >= 500))

        if (shouldRetry) {
            config.retry++
            await new Promise(resolve =>
                setTimeout(resolve, RETRY_DELAY * Math.pow(2, config.retry - 1))
            )
            config.timeout = config.timeout * 1.5
            return axios(config)
        }

        return Promise.reject(error)
    }
)

const checkStorage = (storage) => {
    try {
        const test = '__storage_test__'
        storage.setItem(test, 'test')
        const value = storage.getItem(test)
        storage.removeItem(test)
        return value === 'test'
    } catch (e) {
        return false
    }
}

const hasSessionStorage = checkStorage(sessionStorage)
const hasLocalStorage = checkStorage(localStorage)

const safeStorage = {
    setItem: (key, value) => {
        try {
            if (hasLocalStorage) {
                localStorage.setItem(key, value)
                return true
            }
        } catch (e) {
            console.warn('Failed to set localStorage:', e)
        }
        return false
    },
    getItem: (key) => {
        try {
            if (hasLocalStorage) {
                return localStorage.getItem(key)
            }
        } catch (e) {
            console.warn('Failed to get localStorage:', e)
        }
        return null
    },
    removeItem: (key) => {
        try {
            if (hasLocalStorage) {
                localStorage.removeItem(key)
                return true
            }
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e)
        }
        return false
    }
}

const authCache = {
    set(userData, token) {
        try {
            const cacheData = {
                user: userData,
                token: token,
                timestamp: Date.now(),
                tokenExpiry: Date.now() + (55 * 60 * 1000)
            }
            
            safeStorage.setItem(CACHE_KEYS.USER_DATA, JSON.stringify(cacheData))
            
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
            
            return true
        } catch (error) {
            console.error('Failed to cache auth data:', error)
            return false
        }
    },

    get() {
        try {
            const cached = safeStorage.getItem(CACHE_KEYS.USER_DATA)
            if (!cached) return null

            const cacheData = JSON.parse(cached)
            const now = Date.now()

            if (now - cacheData.timestamp > CACHE_DURATION) {
                this.clear()
                return null
            }

            if (cacheData.tokenExpiry && now > cacheData.tokenExpiry - TOKEN_REFRESH_BUFFER) {
                cacheData.tokenNeedsRefresh = true
            }

            return cacheData
        } catch (error) {
            console.error('Failed to get cached auth data:', error)
            this.clear()
            return null
        }
    },

    clear() {
        try {
            safeStorage.removeItem(CACHE_KEYS.USER_DATA)
            delete axios.defaults.headers.common['Authorization']
        } catch (error) {
            console.error('Failed to clear auth cache:', error)
        }
    },

    isValid() {
        const cached = this.get()
        return cached && cached.user && cached.token
    }
}

const startWarmup = () => {
    if (warmupInterval) return

    const warmup = async () => {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000)

            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (response.ok) {
                isWarmedUp = true
            }
        } catch (e) {
            // Silent fail
        }
    }

    warmup()
    setTimeout(warmup, 2000)
    setTimeout(warmup, 5000)
    setTimeout(warmup, 10000)
    warmupInterval = setInterval(warmup, 2 * 60 * 1000)
}

const stopWarmup = () => {
    if (warmupInterval) {
        clearInterval(warmupInterval)
        warmupInterval = null
    }
}

async function forceLogout(reason) {
    try {
        await signOut(auth)
    } catch (e) {
        console.error('Force logout error:', e)
    }
    
    authCache.clear()
    currentUser = null
    stopBackgroundVerification()
    
    authStateListeners.forEach(listener => listener(null))
    
    if (typeof window !== 'undefined' && window.location) {
        window.dispatchEvent(new CustomEvent('auth-session-expired', { 
            detail: { reason } 
        }))
    }
}

async function performBackgroundVerification() {
    if (verificationInProgress || !auth.currentUser) {
        return
    }

    const now = Date.now()
    if (now - lastVerificationTime < BACKGROUND_VERIFY_INTERVAL) {
        return
    }

    verificationInProgress = true
    lastVerificationTime = now

    try {
        let token = await auth.currentUser.getIdToken()
        const cached = authCache.get()
        
        if (cached?.tokenNeedsRefresh || !cached?.token) {
            token = await auth.currentUser.getIdToken(true)
        }

        const response = await axios.get('/auth/me', {
            timeout: 15000,
            validateStatus: (status) => status < 500,
            headers: { Authorization: `Bearer ${token}` }
        })

        if (response.status === 200 && response.data.success) {
            const freshUserData = {
                ...response.data.data,
                firebaseUser: auth.currentUser,
                _syncedWithBackend: true,
                _lastVerified: now
            }

            authCache.set(freshUserData, token)
            currentUser = freshUserData
            authStateListeners.forEach(listener => listener(currentUser))
            
        } else if (response.status === 401) {
            await forceLogout('Invalid authentication token')
        }

    } catch (error) {
        if (error.response?.status === 401 || 
            error.code === 'auth/user-token-expired' ||
            error.code === 'auth/user-not-found') {
            await forceLogout('Authentication expired')
        }
    } finally {
        verificationInProgress = false
    }
}

function startBackgroundVerification() {
    stopBackgroundVerification()
    
    if (auth.currentUser && authCache.isValid()) {
        const cached = authCache.get()
        if (!cached?._lastVerified || Date.now() - cached._lastVerified > BACKGROUND_VERIFY_INTERVAL) {
            setTimeout(performBackgroundVerification, 1000)
        }
        
        backgroundVerificationInterval = setInterval(
            performBackgroundVerification, 
            BACKGROUND_VERIFY_INTERVAL
        )
    }
}

function stopBackgroundVerification() {
    if (backgroundVerificationInterval) {
        clearInterval(backgroundVerificationInterval)
        backgroundVerificationInterval = null
    }
}

const getBestPersistence = () => {
    const userPreference = safeStorage.getItem(STORAGE_KEYS.USER_PREFERENCE)

    if (userPreference === 'session') {
        return browserSessionPersistence
    }

    if (hasLocalStorage) {
        return browserLocalPersistence
    }

    if (hasSessionStorage) {
        return browserSessionPersistence
    }

    return inMemoryPersistence
}

const initializeAuth = async () => {
    if (authInitPromise) return authInitPromise

    authInitPromise = new Promise(async (resolve) => {
        try {
            const cached = authCache.get()
            if (cached?.user && cached?.token) {
                currentUser = {
                    ...cached.user,
                    _fromCache: true,
                    _needsVerification: true
                }
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${cached.token}`
                authStateListeners.forEach(listener => listener(currentUser))
            }

            const persistence = getBestPersistence()
            try {
                await setPersistence(auth, persistence)
                safeStorage.setItem(STORAGE_KEYS.PERSISTENCE_TYPE, persistence.type)
            } catch (persistenceError) {
                const fallbacks = [browserSessionPersistence, inMemoryPersistence]
                for (const fallback of fallbacks) {
                    try {
                        await setPersistence(auth, fallback)
                        safeStorage.setItem(STORAGE_KEYS.PERSISTENCE_TYPE, fallback.type)
                        break
                    } catch (e) {
                        continue
                    }
                }
            }

            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe()
                    resolve(user)
                })
            })

            try {
                const result = await getRedirectResult(auth)
                if (result?.user) {
                    await handleSuccessfulAuth(result.user, true)

                    if (hasSessionStorage) {
                        sessionStorage.removeItem('auth_redirect_pending')
                    }

                    window.dispatchEvent(new CustomEvent('auth-redirect-success', {
                        detail: { user: currentUser }
                    }))
                }
            } catch (redirectError) {
                if (redirectError.code === 'auth/missing-initial-state' ||
                    redirectError.code === 'auth/web-storage-unsupported') {

                    await new Promise(resolve => setTimeout(resolve, 2000))

                    if (auth.currentUser) {
                        await handleSuccessfulAuth(auth.currentUser)
                    }
                } else if (redirectError.code !== 'auth/no-auth-event') {
                    console.error('Redirect error:', redirectError)
                }

                if (hasSessionStorage) {
                    sessionStorage.removeItem('auth_redirect_pending')
                }
            }

            authInitialized = true

            if (import.meta.env.PROD) {
                startWarmup()
            }

            resolve(true)
        } catch (error) {
            console.error('Auth initialization error:', error)
            authInitialized = true
            resolve(false)
        }
    })

    return authInitPromise
}

async function handleSuccessfulAuth(firebaseUser, forceSync = false) {
    if (!firebaseUser) return null

    try {
        const token = await firebaseUser.getIdToken()
        
        const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            email_verified: firebaseUser.emailVerified,
            auth_provider: firebaseUser.providerData[0]?.providerId || 'password',
            created_at: firebaseUser.metadata.creationTime,
            last_login_at: firebaseUser.metadata.lastSignInTime,
            firebaseUser,
            _syncedWithBackend: false,
            _lastUpdated: Date.now()
        }

        authCache.set(userData, token)
        currentUser = userData
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        authStateListeners.forEach(listener => listener(currentUser))
        
        safeStorage.setItem(STORAGE_KEYS.AUTH_TIMESTAMP, new Date().toISOString())
        
        startBackgroundVerification()
        
        if (forceSync || !authCache.get()?._syncedWithBackend) {
            setTimeout(async () => {
                try {
                    if (!isWarmedUp && import.meta.env.PROD) {
                        await axios.get('/health', {
                            timeout: 5000,
                            validateStatus: () => true
                        })
                        isWarmedUp = true
                    }

                    const response = await axios.get('/auth/me', { 
                        timeout: isWarmedUp ? 10000 : 20000 
                    })
                    
                    if (response.data.success) {
                        const syncedUserData = {
                            ...response.data.data,
                            firebaseUser,
                            _syncedWithBackend: true,
                            _lastVerified: Date.now()
                        }
                        
                        authCache.set(syncedUserData, token)
                        currentUser = syncedUserData
                        authStateListeners.forEach(listener => listener(currentUser))
                    }
                } catch (syncError) {
                    console.warn('Background sync failed:', syncError.message)
                }
            }, 100)
        }

        return currentUser
    } catch (error) {
        console.error('Auth handler error:', error)
        currentUser = null
        delete axios.defaults.headers.common['Authorization']
        throw error
    }
}

onAuthStateChanged(auth, async (firebaseUser) => {
    if (!authInitialized) return

    if (firebaseUser) {
        const cached = authCache.get()
        if (cached?.user?.id === firebaseUser.uid) {
            startBackgroundVerification()
            return
        }
        
        try {
            await handleSuccessfulAuth(firebaseUser)
        } catch (error) {
            console.error('Auth state change error:', error)
            currentUser = null
        }
    } else {
        authCache.clear()
        currentUser = null
        stopBackgroundVerification()
        stopWarmup()
        safeStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP)
        authStateListeners.forEach(listener => listener(null))
    }
})

let tokenRefreshInterval = null

const startTokenRefresh = () => {
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval)
    }

    tokenRefreshInterval = setInterval(async () => {
        if (auth.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken(true)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

                if (currentUser && !currentUser._syncedWithBackend) {
                    try {
                        const response = await axios.get('/auth/me', { timeout: 15000 })
                        if (response.data.success) {
                            currentUser = {
                                ...response.data.data,
                                firebaseUser: auth.currentUser,
                                _syncedWithBackend: true
                            }
                            authStateListeners.forEach(listener => listener(currentUser))
                        }
                    } catch (e) {
                        // Silent fail
                    }
                }
            } catch (error) {
                if (error.code === 'auth/user-token-expired') {
                    try {
                        await auth.currentUser.reload()
                        const newToken = await auth.currentUser.getIdToken(true)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                    } catch (reloadError) {
                        console.error('Failed to reload user:', reloadError)
                    }
                }
            }
        }
    }, 45 * 60 * 1000)
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        startTokenRefresh()
        if (import.meta.env.PROD) {
            startWarmup()
        }
    } else {
        if (tokenRefreshInterval) {
            clearInterval(tokenRefreshInterval)
            tokenRefreshInterval = null
        }
        stopWarmup()
    }
})

initializeAuth()

export const AuthService = {
    async ensureInitialized() {
        if (!authInitialized) {
            await initializeAuth()
        }
        return authInitialized
    },

    async register({ email, password, name }) {
        try {
            await this.ensureInitialized()

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (name) {
                await updateProfile(user, { displayName: name })
            }

            await setPersistence(auth, browserLocalPersistence)
            safeStorage.setItem(STORAGE_KEYS.USER_PREFERENCE, 'local')

            await sendEmailVerification(user, {
                url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`
            })

            const userData = await handleSuccessfulAuth(user)

            return {
                success: true,
                data: {
                    user: userData,
                    token: await user.getIdToken()
                }
            }
        } catch (error) {
            console.error('Registration error:', error)
            return {
                success: false,
                error: {
                    code: error.code,
                    message: this.getErrorMessage(error.code)
                }
            }
        }
    },

    async login({ email, password, rememberMe = true }) {
        try {
            await this.ensureInitialized()

            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence

            try {
                await setPersistence(auth, persistence)
                safeStorage.setItem(STORAGE_KEYS.USER_PREFERENCE, rememberMe ? 'local' : 'session')
            } catch (persistError) {
                console.warn('Failed to set persistence, continuing with current setting:', persistError)
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const userData = await handleSuccessfulAuth(userCredential.user)

            return {
                success: true,
                data: {
                    user: userData,
                    token: await userCredential.user.getIdToken()
                },
                message: 'Welcome back!'
            }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                error: {
                    code: error.code,
                    message: this.getErrorMessage(error.code)
                }
            }
        }
    },

    async loginWithGoogle(forceRedirect = false) {
        try {
            await this.ensureInitialized()

            try {
                await setPersistence(auth, browserLocalPersistence)
                safeStorage.setItem(STORAGE_KEYS.USER_PREFERENCE, 'local')
            } catch (e) {
                console.warn('Failed to set persistence for Google login')
            }

            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
            const hasStorageIssues = !hasSessionStorage || !hasLocalStorage
            const isIframe = window !== window.parent
            const isPrivateBrowsing = !hasLocalStorage && hasSessionStorage

            let hasCOOPIssues = false
            try {
                hasCOOPIssues = window.crossOriginIsolated === true
            } catch (e) {
                // Can't detect, assume false
            }

            const shouldUseRedirect = forceRedirect || isMobile || hasStorageIssues ||
                isIframe || hasCOOPIssues || isPrivateBrowsing

            if (shouldUseRedirect) {
                if (hasSessionStorage) {
                    sessionStorage.setItem('auth_redirect_pending', 'true')
                }
                await signInWithRedirect(auth, googleProvider)
                return {
                    success: true,
                    pending: true,
                    message: 'Redirecting to Google...'
                }
            }

            try {
                const userCredential = await signInWithPopup(auth, googleProvider)
                const userData = await handleSuccessfulAuth(userCredential.user)

                return {
                    success: true,
                    data: {
                        user: userData,
                        token: await userCredential.user.getIdToken()
                    },
                    message: 'Welcome!'
                }
            } catch (popupError) {
                if (popupError.code === 'auth/popup-blocked' ||
                    popupError.code === 'auth/cancelled-popup-request' ||
                    popupError.code === 'auth/popup-closed-by-user') {

                    if (popupError.code === 'auth/popup-closed-by-user') {
                        return { success: false, cancelled: true }
                    }

                    return this.loginWithGoogle(true)
                }

                throw popupError
            }
        } catch (error) {
            console.error('Google login error:', error)

            if (error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/cancelled-popup-request') {
                return { success: false, cancelled: true }
            }

            return {
                success: false,
                error: {
                    code: error.code,
                    message: this.getErrorMessage(error.code)
                }
            }
        }
    },

    async logout() {
        try {
            await signOut(auth)
            delete axios.defaults.headers.common['Authorization']

            authCache.clear()
            safeStorage.removeItem(STORAGE_KEYS.USER_PREFERENCE)
            safeStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP)
            safeStorage.removeItem(STORAGE_KEYS.PERSISTENCE_TYPE)

            if (hasSessionStorage) {
                sessionStorage.clear()
            }

            stopBackgroundVerification()
            stopWarmup()
            currentUser = null

            return { success: true }
        } catch (error) {
            console.error('Logout error:', error)
            return {
                success: false,
                error: { message: 'Failed to sign out' }
            }
        }
    },

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            })

            return {
                success: true,
                message: 'Password reset email sent.'
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    code: error.code,
                    message: this.getErrorMessage(error.code)
                }
            }
        }
    },

    async resendVerificationEmail() {
        try {
            const user = auth.currentUser
            if (!user) throw new Error('No user logged in')

            await sendEmailVerification(user, {
                url: `${window.location.origin}/login?email=${encodeURIComponent(user.email)}`
            })

            return {
                success: true,
                message: 'Verification email sent'
            }
        } catch (error) {
            return {
                success: false,
                error: { message: 'Failed to send verification email' }
            }
        }
    },

    getCurrentUser() {
        return currentUser
    },

    getCachedUser() {
        const cached = authCache.get()
        return cached?.user || null
    },

    getFirebaseUser() {
        return auth.currentUser
    },

    isAuthenticated() {
        return !!auth.currentUser
    },

    isCacheValid() {
        return authCache.isValid()
    },

    isBackendSynced() {
        return currentUser?._syncedWithBackend || false
    },

    getSyncStatus() {
        if (!currentUser) return { synced: false, reason: 'not_authenticated' }

        return {
            synced: currentUser._syncedWithBackend || false,
            pending: currentUser._syncPending || false,
            error: currentUser._syncError || null
        }
    },

    async getIdToken(forceRefresh = false) {
        try {
            if (auth.currentUser) {
                return await auth.currentUser.getIdToken(forceRefresh)
            }
            return null
        } catch (error) {
            console.error('Get ID token error:', error)
            return null
        }
    },

    onAuthStateChange(callback) {
        authStateListeners.push(callback)

        if (authInitialized) {
            callback(currentUser)
        }

        return () => {
            authStateListeners = authStateListeners.filter(listener => listener !== callback)
        }
    },

    async retryBackendSync() {
        if (auth.currentUser) {
            try {
                await handleSuccessfulAuth(auth.currentUser)
                return {
                    success: true,
                    synced: currentUser?._syncedWithBackend || false
                }
            } catch (error) {
                return { success: false, error: error.message }
            }
        }
        return { success: false, error: 'No authenticated user' }
    },

    async verifyNow() {
        await performBackgroundVerification()
    },

    clearCache() {
        authCache.clear()
    },

    getCacheInfo() {
        const cached = authCache.get()
        if (!cached) return { cached: false }
        
        return {
            cached: true,
            timestamp: cached.timestamp,
            tokenExpiry: cached.tokenExpiry,
            needsRefresh: cached.tokenNeedsRefresh,
            lastVerified: cached.user?._lastVerified
        }
    },

    async debugAuthState() {
        const debugInfo = {
            initialized: authInitialized,
            hasCurrentUser: !!currentUser,
            hasFirebaseUser: !!auth.currentUser,
            persistenceType: safeStorage.getItem(STORAGE_KEYS.PERSISTENCE_TYPE),
            userPreference: safeStorage.getItem(STORAGE_KEYS.USER_PREFERENCE),
            lastAuthTime: safeStorage.getItem(STORAGE_KEYS.AUTH_TIMESTAMP),
            storageAvailable: {
                local: hasLocalStorage,
                session: hasSessionStorage
            }
        }

        console.log('Auth Debug Info:', debugInfo)
        return debugInfo
    },

    getErrorMessage(code) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/operation-not-allowed': 'This operation is not allowed.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-credential': 'Invalid email or password.',
            'auth/too-many-requests': 'Too many failed attempts. Try again later.',
            'auth/network-request-failed': 'Network error. Check your connection.',
            'auth/popup-closed-by-user': 'Sign-in was cancelled.',
            'auth/cancelled-popup-request': 'Another sign-in in progress.',
            'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
            'auth/popup-blocked': 'Sign-in popup blocked. Please allow popups.',
            'auth/requires-recent-login': 'Please login again.',
            'auth/missing-initial-state': 'Session storage issue detected. Please try again.',
            'auth/user-token-expired': 'Your session has expired. Please login again.'
        }

        return errorMessages[code] || 'An error occurred. Please try again.'
    }
}

if (typeof window !== 'undefined') {
    window.SavlinkAuth = {
        debugAuthState: AuthService.debugAuthState,
        getCurrentUser: AuthService.getCurrentUser,
        getFirebaseUser: AuthService.getFirebaseUser,
        getCacheInfo: AuthService.getCacheInfo
    }
}

export { auth }