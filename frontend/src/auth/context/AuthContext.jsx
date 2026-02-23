// frontend/src/auth/context/AuthContext.jsx
// Clean React wrapper around AuthService - NO duplicate auth management

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { AuthService } from '../services/auth.service'
import apiService from '../../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Restore cached user for instant UI
    try {
      const cached = localStorage.getItem('savlink_user')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // Subscribe to AuthService state changes (SINGLE source of truth)
    const unsubscribe = AuthService.onAuthStateChange(({ user: authUser, token }) => {
      if (!mountedRef.current) return

      if (authUser) {
        setUser(authUser)
        // Keep api.js in sync
        if (token) apiService.setAuthToken(token)
      } else {
        setUser(null)
        apiService.removeAuthToken()
      }
      
      setLoading(false)
      setInitialized(true)
    })

    // Ensure AuthService is initialized
    AuthService.ensureInitialized().then(() => {
      if (mountedRef.current) {
        setLoading(false)
        setInitialized(true)
      }
    })

    // Timeout safety: don't show loading forever
    const safetyTimer = setTimeout(() => {
      if (mountedRef.current && loading) {
        setLoading(false)
        setInitialized(true)
      }
    }, 5000)

    return () => {
      mountedRef.current = false
      unsubscribe()
      clearTimeout(safetyTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth Methods ──
  const signIn = useCallback(async (email, password, rememberMe = true) => {
    setLoading(true)
    try {
      const result = await AuthService.login({ email, password, rememberMe })
      
      if (result.success) {
        toast.success(result.message || 'Welcome back!')
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email, password, name) => {
    setLoading(true)
    try {
      const result = await AuthService.register({ email, password, name })
      
      if (result.success) {
        toast.success(result.message || 'Account created!')
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setLoading(true)
    try {
      const result = await AuthService.loginWithGoogle()

      if (result.cancelled) {
        return result
      }

      if (result.pending) {
        return result
      }
      
      if (result.success) {
        toast.success(result.message || 'Welcome!')
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const signOutUser = useCallback(async () => {
    try {
      const result = await AuthService.logout()
      
      if (result.success) {
        toast.success('Signed out successfully')
      }
      
      return result
    } catch (error) {
      toast.error('Failed to sign out')
      return { success: false, error: error.message }
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      const result = await AuthService.resetPassword(email)
      
      if (result.success) {
        toast.success('Password reset email sent!')
      } else {
        toast.error(result.error?.message || 'Failed to send reset email')
      }
      
      return result
    } catch (error) {
      toast.error('Failed to send reset email')
      return { success: false, error: error.message }
    }
  }, [])

  // ── Listen for session expiry from AuthService ──
  useEffect(() => {
    const handleExpiry = () => {
      toast.error('Session expired. Please sign in again.')
      setUser(null)
    }

    window.addEventListener('auth:session-expired', handleExpiry)
    return () => window.removeEventListener('auth:session-expired', handleExpiry)
  }, [])

  const value = {
    user,
    loading,
    initialized,
    isFromCache: user && !user._synced,
    isSynced: user?._synced === true,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: signOutUser,
    resetPassword,
    forceSync: AuthService.forceSync.bind(AuthService),
    getToken: AuthService.getIdToken.bind(AuthService)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}