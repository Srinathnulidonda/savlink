// frontend/src/auth/pages/VerifyEmail.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { applyActionCode, getAuth } from 'firebase/auth'
import { AuthService } from '../services/auth.service'
import AuthLayout from '../components/AuthLayout'
import toast from 'react-hot-toast'
import { CheckIcon, EnvelopeIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const STATUS = {
  WAITING: 'waiting',
  VERIFYING: 'verifying',
  VERIFIED: 'verified',
  ERROR: 'error',
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState(STATUS.WAITING)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [resending, setResending] = useState(false)

  const oobCode = searchParams.get('oobCode')
  const mode = searchParams.get('mode')
  const continueUrl = searchParams.get('continueUrl')

  const email = (() => {
    if (continueUrl) {
      try {
        return new URL(continueUrl).searchParams.get('email')
      } catch {}
    }
    return location.state?.email || AuthService.getFirebaseUser()?.email || ''
  })()

  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode) {
      handleVerification()
    }
  }, [mode, oobCode])

  useEffect(() => {
    if (status !== STATUS.VERIFIED) return
    if (countdown <= 0) {
      navigate('/dashboard')
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [status, countdown, navigate])

  const handleVerification = async () => {
    setStatus(STATUS.VERIFYING)
    setError('')

    try {
      const auth = getAuth()
      await applyActionCode(auth, oobCode)
      if (auth.currentUser) await auth.currentUser.reload()
      setStatus(STATUS.VERIFIED)
      toast.success('Email verified!')
    } catch (err) {
      setStatus(STATUS.ERROR)
      setError(getErrorMessage(err.code))
    }
  }

  const getErrorMessage = (code) => {
    const messages = {
      'auth/invalid-action-code': 'This link is invalid or has already been used.',
      'auth/expired-action-code': 'This link has expired. Request a new one below.',
      'auth/user-disabled': 'This account has been disabled.',
    }
    return messages[code] || 'Verification failed. Please try again.'
  }

  const resendVerification = async () => {
    setResending(true)
    try {
      const response = await AuthService.resendVerificationEmail()
      if (response.success) {
        toast.success('Verification email sent!')
      } else {
        toast.error(response.error?.message || 'Failed to send email')
      }
    } catch {
      toast.error('Failed to send verification email')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      footer={
        <Link to="/login" className="text-[#666] hover:text-[#999] transition-colors">
          ← Back to login
        </Link>
      }
    >
      <AnimatePresence mode="wait">
        {status === STATUS.VERIFYING && (
          <StatusView key="verifying">
            <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <h2 className="text-lg font-semibold text-white">Verifying your email</h2>
            <p className="text-sm text-[#666]">This will only take a moment...</p>
          </StatusView>
        )}

        {status === STATUS.VERIFIED && (
          <StatusView key="verified">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <CheckIcon className="h-7 w-7 text-emerald-400" />
            </motion.div>
            <h2 className="text-lg font-semibold text-white">Email verified</h2>
            <p className="text-sm text-[#666]">Your email has been confirmed successfully.</p>
            <div className="w-full space-y-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all"
              >
                Go to Dashboard
              </button>
              <p className="text-xs text-[#444] text-center">
                Redirecting in {countdown}s...
              </p>
            </div>
          </StatusView>
        )}

        {status === STATUS.ERROR && (
          <StatusView key="error">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20">
              <ExclamationCircleIcon className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Verification failed</h2>
            <p className="text-sm text-[#666]">{error}</p>
            <div className="w-full space-y-3 pt-2">
              <ResendButton loading={resending} onClick={resendVerification} />
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-[#999] border border-[#1e1e1e] bg-[#161616] hover:bg-[#1a1a1a] transition-all"
              >
                Back to Login
              </button>
            </div>
          </StatusView>
        )}

        {status === STATUS.WAITING && (
          <StatusView key="waiting">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border border-primary/20">
              <EnvelopeIcon className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-white">Check your email</h2>
            <p className="text-sm text-[#666]">
              We sent a verification link to
            </p>
            {email && (
              <p className="text-sm font-medium text-white bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-2 w-full text-center truncate">
                {email}
              </p>
            )}

            <div className="w-full space-y-4 pt-2">
              <div className="bg-[#161616] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-xs font-medium text-[#888] mb-2">Didn't receive the email?</p>
                <ul className="text-xs text-[#555] space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Verify the email address is correct</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>

              <ResendButton loading={resending} onClick={resendVerification} />
            </div>
          </StatusView>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

function StatusView({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-3 py-4 text-center"
    >
      {children}
    </motion.div>
  )
}

function ResendButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#ccc] border border-[#1e1e1e] bg-[#161616] hover:bg-[#1a1a1a] hover:border-[#2a2a2a] transition-all disabled:opacity-50"
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
      ) : (
        <ArrowPathIcon className="h-4 w-4" />
      )}
      {loading ? 'Sending...' : 'Resend verification email'}
    </button>
  )
}