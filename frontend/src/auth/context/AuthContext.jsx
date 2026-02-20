import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthService } from '../services/auth.service'

const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    signIn: async () => { },
    signOut: async () => { },
    updateUser: () => { },
    isFromCache: false,
    needsVerification: false
})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const authInitializedRef = useRef(false)

    useEffect(() => {
        if (authInitializedRef.current) return
        authInitializedRef.current = true

        let unsubscribe
        let sessionExpiredHandler

        const initializeAuth = async () => {
            try {
                const cachedUser = AuthService.getCachedUser()
                if (cachedUser) {
                    setUser(cachedUser)
                    setLoading(false)
                }

                await AuthService.ensureInitialized()

                unsubscribe = AuthService.onAuthStateChange((currentUser) => {
                    setUser(currentUser)
                    
                    if (!cachedUser) {
                        setLoading(false)
                    }
                    
                    setError(null)
                })

                sessionExpiredHandler = (event) => {
                    setError(`Session expired: ${event.detail.reason}`)
                    setUser(null)
                }

                window.addEventListener('auth-session-expired', sessionExpiredHandler)

            } catch (error) {
                console.error('Auth context initialization error:', error)
                setError('Failed to initialize authentication')
                setLoading(false)
            }
        }

        initializeAuth()

        return () => {
            if (unsubscribe) unsubscribe()
            if (sessionExpiredHandler) {
                window.removeEventListener('auth-session-expired', sessionExpiredHandler)
            }
        }
    }, [])

    const signIn = async (email, password, rememberMe = true) => {
        setLoading(true)
        setError(null)

        try {
            const response = await AuthService.login({ email, password, rememberMe })

            if (response.success) {
                return { success: true, message: response.message }
            } else {
                const errorMessage = response.error?.message || 'Login failed'
                setError(errorMessage)
                return { success: false, error: errorMessage }
            }
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        setLoading(true)
        setError(null)

        try {
            await AuthService.logout()
            setUser(null)
            navigate('/')
            return { success: true }
        } catch (error) {
            console.error('Logout error:', error)
            const errorMessage = 'Failed to sign out. Please try again.'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const updateUser = (updates) => {
        if (user) {
            setUser(prevUser => ({ ...prevUser, ...updates }))
        }
    }

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const value = {
        user,
        loading,
        error,
        signIn,
        signOut,
        updateUser,
        isAuthenticated: !!user,
        isEmailVerified: user?.email_verified ?? false,
        isFromCache: user?._fromCache ?? false,
        needsVerification: user?._needsVerification ?? false
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext