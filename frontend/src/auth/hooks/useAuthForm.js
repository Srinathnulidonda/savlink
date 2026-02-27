// frontend/src/auth/hooks/useAuthForm.js
import { useState, useCallback } from 'react'

export function useAuthForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setErrors(prev => {
      if (prev[name]) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return prev
    })
    setGeneralError('')
  }, [])

  const handleChange = useCallback((e) => {
    setValue(e.target.name, e.target.value)
  }, [setValue])

  const setError = useCallback((name, message) => {
    if (name === 'general') {
      setGeneralError(message)
    } else {
      setErrors(prev => ({ ...prev, [name]: message }))
    }
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
    setGeneralError('')
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setGeneralError('')
    setLoading(false)
  }, [initialValues])

  const validate = useCallback((rules) => {
    const newErrors = {}
    for (const [field, checks] of Object.entries(rules)) {
      for (const check of checks) {
        const error = check(values[field], values)
        if (error) {
          newErrors[field] = error
          break
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values])

  return {
    values,
    errors,
    loading,
    generalError,
    setValues,
    setValue,
    handleChange,
    setError,
    setErrors,
    clearErrors,
    setLoading,
    setGeneralError,
    reset,
    validate,
  }
}