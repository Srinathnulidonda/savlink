// frontend/src/auth/hooks/usePasswordStrength.js
import { useState, useEffect, useCallback } from 'react'

export function usePasswordStrength(password = '') {
  const [validation, setValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  })

  useEffect(() => {
    setValidation({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'`~]/.test(password),
    })
  }, [password])

  const isValid = Object.values(validation).every(Boolean)

  const score = Object.values(validation).filter(Boolean).length

  const strength = useCallback(() => {
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500' }
    if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500' }
    if (score <= 4) return { label: 'Good', color: 'bg-blue-500' }
    return { label: 'Strong', color: 'bg-emerald-500' }
  }, [score])

  return { validation, isValid, score, strength: strength() }
}