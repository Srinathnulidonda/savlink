// src/dashboard/pages/recent/RecentEmpty.jsx
import { motion } from 'framer-motion';

export default function RecentEmpty({ searchQuery, onAddLink, onClearSearch }) {
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
            No recent links match "{searchQuery}"
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
          className="w-16 h-16 rounded-2xl bg-blue-500/[0.06] border border-blue-500/10
                     flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-blue-500/40" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h3 className="text-[16px] font-medium text-white mb-2">No recent links</h3>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Links you've added recently will appear here. Save your first link to get started.
        </p>
        <button onClick={onAddLink}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium
                     text-white bg-primary hover:bg-primary-light rounded-lg
                     transition-colors mx-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Save a link
        </button>
      </motion.div>
    </div>
  );
}