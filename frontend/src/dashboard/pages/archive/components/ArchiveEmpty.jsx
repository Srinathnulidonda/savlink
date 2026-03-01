// src/dashboard/pages/archive/components/ArchiveEmpty.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ArchiveEmpty({ searchQuery, onClearSearch }) {
  const navigate = useNavigate();

  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-gray-800/30 border border-gray-800/50
                          flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-medium text-gray-300 text-center mb-1">
            No results
          </h3>
          <p className="text-[13px] text-gray-600 text-center mb-4">
            No archived links match "{searchQuery}"
          </p>
          <button onClick={onClearSearch}
            className="mx-auto block text-[13px] text-primary hover:text-primary-light
                       font-medium transition-colors">
            Clear search
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-2xl bg-gray-500/[0.06] border border-gray-500/10
                     flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gray-500/40" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25
                 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621
                 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621
                 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </motion.div>
        <h3 className="text-[16px] font-medium text-white mb-2">Archive is empty</h3>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Links you archive will appear here. Archive links you want to keep but don't need quick access to.
        </p>
        <button onClick={() => navigate('/dashboard/links/all')}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium
                     text-gray-400 bg-white/[0.03] border border-white/[0.06]
                     hover:bg-white/[0.06] rounded-lg transition-colors mx-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0
                 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0
                 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          Browse all links
        </button>
      </motion.div>
    </div>
  );
}