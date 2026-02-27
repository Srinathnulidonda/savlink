// frontend/src/auth/pages/Login.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthService } from '../services/auth.service'
import { useAuthForm } from '../hooks/useAuthForm'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import GoogleButton from '../components/GoogleButton'
import Divider from '../components/Divider'
import toast from 'react-hot-toast'

export default function Login() {
  const { values, errors, loading, generalError, handleChange, setLoading, setGeneralError } = useAuthForm({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(true)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, initialized } = useAuth()
  const hasNavigated = useRef(false)

  const destination = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user && initialized && !hasNavigated.current) {
      hasNavigated.current = true
      navigate(destination, { replace: true })
    }
  }, [user, initialized, navigate, destination])

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  useEffect(() => {
    const onSuccess = () => {
      setLoginSuccess(true)
      toast.success('Welcome!')
    }
    window.addEventListener('auth:redirect-success', onSuccess)
    return () => window.removeEventListener('auth:redirect-success', onSuccess)
  }, [])

  if (!initialized || user || loginSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-[#222] border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-[#555]">
            {user || loginSuccess ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || loginSuccess) return
    setLoading(true)
    setGeneralError('')

    try {
      const response = await AuthService.login({
        email: values.email.trim(),
        password: values.password,
        rememberMe,
      })

      if (!response.success) {
        setGeneralError(response.error?.message || 'Login failed')
        setLoading(false)
        return
      }

      const fbUser = AuthService.getFirebaseUser()
      if (fbUser && !fbUser.emailVerified) {
        toast.error('Please verify your email to continue')
        navigate('/verify-email', { state: { email: values.email } })
        return
      }

      setLoginSuccess(true)
      toast.success('Welcome back!')
    } catch {
      setGeneralError('An unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (loading || loginSuccess) return
    setLoading(true)
    setGeneralError('')

    try {
      const response = await AuthService.loginWithGoogle()

      if (response.cancelled) {
        setLoading(false)
        return
      }

      if (response.pending) {
        toast('Redirecting to Google...', { icon: '🔄' })
        return
      }

      if (!response.success) {
        setGeneralError(response.error?.message || 'Google sign-in failed')
        setLoading(false)
        return
      }

      setLoginSuccess(true)
      toast.success('Welcome!')
    } catch {
      setGeneralError('Google sign-in failed.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign up
          </Link>
        </>
      }
    >
      {generalError && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
          {generalError}
        </div>
      )}

      <GoogleButton onClick={handleGoogle} loading={loading} />

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="name@example.com"
          autoComplete="email"
          required
          disabled={loading}
          error={errors.email}
          autoFocus
        />

        <div>
          <PasswordField
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={loading}
            error={errors.password}
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-3.5 w-3.5 rounded border-[#333] bg-transparent text-primary focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-[#666]">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !values.email || !values.password}
          className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}