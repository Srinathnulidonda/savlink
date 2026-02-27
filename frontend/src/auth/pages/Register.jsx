// frontend/src/auth/pages/Register.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import { useAuthForm } from '../hooks/useAuthForm'
import { usePasswordStrength } from '../hooks/usePasswordStrength'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import PasswordRequirements from '../components/PasswordRequirements'
import GoogleButton from '../components/GoogleButton'
import Divider from '../components/Divider'
import toast from 'react-hot-toast'

export default function Register() {
  const { values, errors, loading, generalError, handleChange, setLoading, setGeneralError, setError } = useAuthForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { validation, isValid: isPasswordValid } = usePasswordStrength(values.password)
  const navigate = useNavigate()

  const passwordsMatch = values.password === values.confirmPassword
  const canSubmit = values.name && values.email && isPasswordValid && passwordsMatch && agreedToTerms && !loading

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    if (!values.name.trim()) {
      setError('name', 'Name is required')
      return
    }

    if (!isPasswordValid) {
      setError('password', 'Password does not meet requirements')
      return
    }

    if (!passwordsMatch) {
      setError('confirmPassword', 'Passwords do not match')
      return
    }

    setLoading(true)
    setGeneralError('')

    try {
      const response = await AuthService.register({
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
      })

      if (!response.success) {
        setGeneralError(response.error?.message || 'Registration failed')
        setLoading(false)
        return
      }

      toast.success('Account created! Check your email to verify.')
      navigate('/verify-email', {
        state: {
          email: values.email,
          message: 'Please check your email to verify your account.',
        },
      })
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (loading) return
    setLoading(true)
    setGeneralError('')

    try {
      const response = await AuthService.loginWithGoogle()

      if (response.cancelled) {
        setLoading(false)
        return
      }

      if (!response.success) {
        setGeneralError(response.error?.message || 'Google sign-up failed')
        setLoading(false)
        return
      }

      toast.success('Account created successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setGeneralError(err.message || 'Google sign-up failed.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start organizing your links"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      {generalError && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
          {generalError}
        </div>
      )}

      <GoogleButton onClick={handleGoogle} loading={loading} label="Sign up with Google" />

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          required
          disabled={loading}
          error={errors.name}
          autoFocus
        />

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
        />

        <div>
          <PasswordField
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            required
            disabled={loading}
            error={errors.password}
          />
          <PasswordRequirements validation={validation} show={values.password.length > 0} />
        </div>

        <div>
          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            disabled={loading}
            error={errors.confirmPassword || (values.confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined)}
          />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={loading}
            className="mt-0.5 h-3.5 w-3.5 rounded border-[#333] bg-transparent text-primary focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-[#666] leading-relaxed">
            I agree to the{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}