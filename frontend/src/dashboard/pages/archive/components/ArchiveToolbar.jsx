// src/dashboard/pages/archive/components/ArchiveToolbar.jsx
import { motion } from 'framer-motion';

export default function ArchiveToolbar({
  selectedCount, totalCount,
  onSelectAll, onClearSelection,
  onBulkRestore, onBulkDelete,
}) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="flex-shrink-0 border-b border-primary/20 bg-primary/[0.04]"
    >
      <div className="px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onSelectAll}
            className="text-[12px] text-primary hover:text-primary-light font-medium transition-colors">
            {selectedCount === totalCount ? 'Deselect all' : 'Select all'}
          </button>
          <span className="text-[12px] text-gray-400">{selectedCount} selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onBulkRestore}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium
                       text-emerald-400 bg-emerald-500/[0.06] hover:bg-emerald-500/10
                       border border-emerald-500/20 rounded-md transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button onClick={onBulkDelete}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium
                       text-red-400 bg-red-500/[0.06] hover:bg-red-500/10
                       border border-red-500/20 rounded-md transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
                   1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0
                   01-2.244 2.077H8.084a2.25 2.25 0
                   01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0
                   00-3.478-.397m-12 .562c.34-.059.68-.114
                   1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5
                   0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0
                   00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5
                   0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
          <button onClick={onClearSelection}
            className="p-1.5 text-gray-500 hover:text-white rounded-md transition-colors ml-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}