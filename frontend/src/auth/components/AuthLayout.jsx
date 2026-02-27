// frontend/src/auth/components/AuthLayout.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../../assets/savlink.png'

export default function AuthLayout({ title, subtitle, children, footer, maxWidth = 'max-w-[420px]' }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative w-full ${maxWidth}`}
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-block">
            <img src={logo} alt="Savlink" className="h-9 w-auto" />
          </Link>
        </div>

        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {(title || subtitle) && (
            <div className="text-center mb-6">
              {title && <h1 className="text-[22px] font-semibold text-white tracking-tight">{title}</h1>}
              {subtitle && <p className="mt-2 text-sm text-[#888]">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-[#666]">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  )
}