// frontend/src/auth/pages/ResetPassword.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { confirmPasswordReset, verifyPasswordResetCode, getAuth } from 'firebase/auth'
import { useAuthForm } from '../hooks/useAuthForm'
import { usePasswordStrength } from '../hooks/usePasswordStrength'
import AuthLayout from '../components/AuthLayout'
import PasswordField from '../components/PasswordField'
import PasswordRequirements from '../components/PasswordRequirements'
import toast from 'react-hot-toast'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  SUCCESS: 'success',
  INVALID: 'invalid',
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const oobCode = searchParams.get('oobCode')

  const [status, setStatus] = useState(STATUS.LOADING)
  const [email, setEmail] = useState('')
  const { values, errors, loading, generalError, handleChange, setLoading, setGeneralError } = useAuthForm({
    password: '',
    confirmPassword: '',
  })
  const { validation, isValid } = usePasswordStrength(values.password)
  const passwordsMatch = values.password === values.confirmPassword

  useEffect(() => {
    if (!oobCode) {
      setStatus(STATUS.INVALID)
      return
    }
    const auth = getAuth()
    verifyPasswordResetCode(auth, oobCode)
      .then((resolvedEmail) => {
        setEmail(resolvedEmail)
        setStatus(STATUS.READY)
      })
      .catch(() => {
        setStatus(STATUS.INVALID)
      })
  }, [oobCode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || !passwordsMatch || loading) return
    setLoading(true)
    setGeneralError('')

    try {
      const auth = getAuth()
      await confirmPasswordReset(auth, oobCode, values.password)
      setStatus(STATUS.SUCCESS)
      toast.success('Password reset successfully!')
    } catch (err) {
      const messages = {
        'auth/expired-action-code': 'This reset link has expired.',
        'auth/invalid-action-code': 'This reset link is invalid.',
        'auth/weak-password': 'Password is too weak.',
      }
      setGeneralError(messages[err.code] || 'Failed to reset password.')
      setLoading(false)
    }
  }

  if (status === STATUS.LOADING) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 border-2 border-[#222] border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-[#555]">Verifying reset link...</p>
        </div>
      </AuthLayout>
    )
  }

  if (status === STATUS.INVALID) {
    return (
      <AuthLayout
        footer={
          <Link to="/forgot-password" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Request a new reset link
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20">
            <ExclamationCircleIcon className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Invalid reset link</h2>
          <p className="text-sm text-[#666]">This link is invalid or has expired. Please request a new one.</p>
        </div>
      </AuthLayout>
    )
  }

  if (status === STATUS.SUCCESS) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckIcon className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Password updated</h2>
          <p className="text-sm text-[#666]">Your password has been reset successfully.</p>
          <button
            onClick={() => navigate('/login', { state: { email } })}
            className="w-full mt-4 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all"
          >
            Sign in with new password
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle={email ? `For ${email}` : 'Choose a new password'}
      footer={
        <Link to="/login" className="text-[#666] hover:text-[#999] transition-colors">
          ← Back to login
        </Link>
      }
    >
      {generalError && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PasswordField
            label="New password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Enter new password"
            autoComplete="new-password"
            required
            disabled={loading}
            error={errors.password}
          />
          <PasswordRequirements validation={validation} show={values.password.length > 0} />
        </div>

        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          disabled={loading}
          error={values.confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined}
        />

        <button
          type="submit"
          disabled={!isValid || !passwordsMatch || loading}
          className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Resetting...
            </span>
          ) : (
            'Reset password'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}