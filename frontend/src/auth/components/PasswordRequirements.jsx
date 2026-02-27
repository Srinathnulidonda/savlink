// frontend/src/auth/components/PasswordRequirements.jsx
import { CheckIcon } from '@heroicons/react/16/solid'

const rules = [
  { key: 'minLength', label: '8+ characters' },
  { key: 'hasUpper', label: 'Uppercase' },
  { key: 'hasLower', label: 'Lowercase' },
  { key: 'hasNumber', label: 'Number' },
  { key: 'hasSpecial', label: 'Special char' },
]

export default function PasswordRequirements({ validation, show = true }) {
  if (!show) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {rules.map(({ key, label }) => {
        const met = validation[key]
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors duration-200 ${
              met
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-[#1a1a1a] text-[#555] border border-[#1e1e1e]'
            }`}
          >
            {met && <CheckIcon className="h-3 w-3" />}
            {label}
          </span>
        )
      })}
    </div>
  )
}