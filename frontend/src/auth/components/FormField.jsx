// frontend/src/auth/components/FormField.jsx
import { useState } from 'react'

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  error,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false)

  const id = `field-${name}`
  const hasError = !!error
  const borderColor = hasError
    ? 'border-red-500/50 focus-within:border-red-500'
    : focused
      ? 'border-[#333] focus-within:border-primary/60'
      : 'border-[#1e1e1e] hover:border-[#2a2a2a]'

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-[#999]">
          {label}
        </label>
      )}
      <div className={`relative rounded-lg border transition-colors duration-150 ${borderColor}`}>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-[#444] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {hasError && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}