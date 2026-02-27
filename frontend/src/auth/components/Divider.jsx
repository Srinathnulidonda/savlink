// frontend/src/auth/components/Divider.jsx
export default function Divider({ text = 'or' }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#1e1e1e]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[#111111] px-3 text-xs text-[#555] uppercase tracking-wider">{text}</span>
      </div>
    </div>
  )
}