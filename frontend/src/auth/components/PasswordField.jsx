// frontend/src/auth/components/PasswordField.jsx
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function PasswordField({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  required = false,
  disabled = false,
  error,
}) {
  const [visible, setVisible] = useState(false)
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
      <div className={`relative flex items-center rounded-lg border transition-colors duration-150 ${borderColor}`}>
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full min-w-0 bg-transparent pl-3.5 py-2.5 pr-12 text-sm text-white placeholder-[#444] outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
          className="absolute right-0 flex items-center justify-center w-10 h-full text-[#555] hover:text-[#888] transition-colors shrink-0"
        >
          {visible
            ? <EyeSlashIcon className="h-[18px] w-[18px]" />
            : <EyeIcon className="h-[18px] w-[18px]" />
          }
        </button>
      </div>
      {hasError && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}