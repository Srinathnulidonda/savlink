// src/dashboard/pages/myfiles/MyFilesEmpty.jsx
import { motion } from 'framer-motion';

export default function MyFilesEmpty({ searchQuery, hasFilters, onAddLink, onCreateFolder, onClearFilters }) {
  if (searchQuery || hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-gray-800/30 border border-gray-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-medium text-gray-300 text-center mb-1">No results</h3>
          <p className="text-[13px] text-gray-600 text-center mb-4">
            {searchQuery ? `Nothing matches "${searchQuery}"` : 'No items match your filters'}
          </p>
          <button onClick={onClearFilters}
            className="mx-auto block text-[13px] text-primary hover:text-primary-light font-medium transition-colors">
            Clear filters
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
          className="w-16 h-16 rounded-2xl bg-gray-800/30 border border-gray-800/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
        </motion.div>
        <h3 className="text-[16px] font-medium text-white mb-2">Your workspace is empty</h3>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Start by saving a link or creating a folder to organize your content.
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <button onClick={onAddLink}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Save a link
          </button>
          <button onClick={onCreateFolder}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            New folder
          </button>
        </div>
      </motion.div>
    </div>
  );
}