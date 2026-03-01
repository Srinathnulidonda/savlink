// src/dashboard/pages/starred/StarredEmpty.jsx
import { motion } from 'framer-motion';

export default function StarredEmpty({ searchQuery, onClearSearch }) {
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
            No starred links match "{searchQuery}"
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
          className="w-16 h-16 rounded-2xl bg-amber-500/[0.06] border border-amber-500/10
                     flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-amber-500/40" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0
                 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204
                 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0
                 01-.84.61l-4.725-2.885a.563.563 0 00-.586
                 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562
                 0 00-.182-.557l-4.204-3.602a.563.563 0
                 01.321-.988l5.518-.442a.563.563 0
                 00.475-.345L11.48 3.5z" />
          </svg>
        </motion.div>
        <h3 className="text-[16px] font-medium text-white mb-2">No starred links</h3>
        <p className="text-[13px] text-gray-500 mb-2 leading-relaxed">
          Star your most important links to find them quickly. Click the star icon on any link to add it here.
        </p>
      </motion.div>
    </div>
  );
}