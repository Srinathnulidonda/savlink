// src/dashboard/pages/myfiles/MyFilesToolbar.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOverview } from '../../../../hooks/useOverview';

export default function MyFilesToolbar({
  selectedCount, totalCount, onSelectAll, onClearSelection,
  onBulkDelete, onBulkArchive, onBulkMove, isMobile,
}) {
  const [moveOpen, setMoveOpen] = useState(false);
  const { folders } = useOverview();
  const moveRef = useRef(null);

  useEffect(() => {
    if (!moveOpen) return;
    const handler = (e) => {
      if (moveRef.current && !moveRef.current.contains(e.target)) setMoveOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moveOpen]);

  if (selectedCount === 0) return null;

  if (isMobile) {
    return (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="flex-shrink-0 border-b border-primary/20 bg-primary/[0.04]">
        <div className="px-4 py-2 flex items-center justify-between gap-2">
          <span className="text-[12px] text-gray-300 font-medium">{selectedCount} selected</span>
          <div className="flex items-center gap-1">
            <MBtn onClick={() => setMoveOpen(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026" />
              </svg>
            </MBtn>
            <MBtn onClick={onBulkArchive}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </MBtn>
            <MBtn onClick={onBulkDelete} danger>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79" />
              </svg>
            </MBtn>
            <button onClick={onClearSelection} className="p-2 text-gray-500 hover:text-white rounded-md transition-colors touch-manipulation">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {moveOpen && (
            <MobileMoveSheet folders={folders} onMove={(id) => { onBulkMove?.(id); setMoveOpen(false); }}
              onClose={() => setMoveOpen(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="flex-shrink-0 border-b border-primary/20 bg-primary/[0.04]">
      <div className="px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onSelectAll} className="text-[12px] text-primary hover:text-primary-light font-medium transition-colors">
            {selectedCount === totalCount ? 'Deselect all' : 'Select all'}
          </button>
          <span className="text-[12px] text-gray-400">{selectedCount} selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative" ref={moveRef}>
            <TBtn onClick={() => setMoveOpen(!moveOpen)} label="Move">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026" />
              </svg>
            </TBtn>
            <AnimatePresence>
              {moveOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-[#111] border border-gray-800/60 rounded-lg shadow-2xl z-20 py-1 max-h-60 overflow-y-auto">
                  <button onClick={() => { onBulkMove?.(null); setMoveOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[13px] text-gray-300 hover:bg-white/[0.04]">📂 Root</button>
                  <div className="mx-2 my-1 border-t border-gray-800/40" />
                  {(folders || []).map(f => (
                    <button key={f.id} onClick={() => { onBulkMove?.(f.id); setMoveOpen(false); }}
                      className="w-full text-left px-3 py-2 text-[13px] text-gray-300 hover:bg-white/[0.04] truncate">
                      {f.emoji || '📁'} {f.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <TBtn onClick={onBulkArchive} label="Archive">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
            </svg>
          </TBtn>
          <TBtn onClick={onBulkDelete} label="Delete" danger>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21" />
            </svg>
          </TBtn>
          <button onClick={onClearSelection} className="p-1.5 text-gray-500 hover:text-white rounded-md transition-colors ml-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TBtn({ onClick, label, danger, children }) {
  return (
    <button onClick={onClick} title={label}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors
        ${danger ? 'text-red-400 bg-red-500/[0.06] hover:bg-red-500/10 border border-red-500/20'
          : 'text-gray-300 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'}`}>
      {children}<span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function MBtn({ onClick, danger, children }) {
  return (
    <button onClick={onClick}
      className={`p-2 rounded-lg transition-colors touch-manipulation
        ${danger ? 'text-red-400 active:bg-red-500/10' : 'text-gray-300 active:bg-white/[0.06]'}`}>
      {children}
    </button>
  );
}

function MobileMoveSheet({ folders, onMove, onClose }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 380 }}
        className="fixed bottom-0 left-0 right-0 z-[95] bg-[#111] border-t border-white/[0.08] rounded-t-2xl max-h-[60vh] overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-1 rounded-full bg-white/[0.15]" /></div>
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <h3 className="text-[15px] font-semibold text-white">Move to folder</h3>
        </div>
        <div className="overflow-y-auto max-h-[40vh]">
          <button onClick={() => onMove(null)}
            className="w-full text-left px-5 py-3.5 text-[14px] text-gray-300 active:bg-white/[0.04] transition-colors touch-manipulation border-b border-white/[0.04]">
            📂 Root (no folder)
          </button>
          {(folders || []).map(f => (
            <button key={f.id} onClick={() => onMove(f.id)}
              className="w-full text-left px-5 py-3.5 text-[14px] text-gray-300 active:bg-white/[0.04] transition-colors touch-manipulation border-b border-white/[0.04] truncate">
              {f.emoji || '📁'} {f.name}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}