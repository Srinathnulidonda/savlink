// frontend/src/auth/pages/ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import { useAuthForm } from '../hooks/useAuthForm'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import toast from 'react-hot-toast'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function ForgotPassword() {
  const { values, errors, loading, generalError, handleChange, setLoading, setGeneralError } = useAuthForm({
    email: '',
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || !values.email.trim()) return
    setLoading(true)
    setGeneralError('')

    try {
      const response = await AuthService.resetPassword(values.email.trim())

      if (!response.success) {
        setGeneralError(response.error?.message || 'Failed to send reset email')
        setLoading(false)
        return
      }

      setSent(true)
      toast.success('Reset email sent!')
    } catch {
      setGeneralError('An unexpected error occurred.')
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        footer={
          <Link to="/login" className="text-[#666] hover:text-[#999] transition-colors">
            ← Back to login
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border border-primary/20">
            <EnvelopeIcon className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-white">Check your email</h2>
          <p className="text-sm text-[#666]">
            We sent a password reset link to
          </p>
          <p className="text-sm font-medium text-white bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-2 w-full text-center truncate">
            {values.email}
          </p>
          <div className="w-full pt-4 space-y-3">
            <button
              onClick={() => setSent(false)}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-[#ccc] border border-[#1e1e1e] bg-[#161616] hover:bg-[#1a1a1a] hover:border-[#2a2a2a] transition-all"
            >
              Try a different email
            </button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send a reset link"
      footer={
        <>
          Remember your password?{' '}
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

        <button
          type="submit"
          disabled={loading || !values.email}
          className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}