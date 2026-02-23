// src/dashboard/components/sidebar/SidebarSearch.jsx

import { motion } from 'framer-motion';

export default function SidebarSearch({ onOpenCommandPalette }) {
    return (
        <div className="px-3 py-3 border-b border-gray-800/40">
            <motion.button
                onClick={onOpenCommandPalette}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-500 
                           bg-gray-900/40 border border-gray-800/50 rounded-lg
                           hover:border-gray-700/50 hover:bg-gray-900/60 hover:text-gray-400 
                           transition-all"
            >
                <svg className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" 
                     stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="flex-1 text-left">Search…</span>
                <div className="flex items-center gap-0.5">
                    <kbd className="min-w-[18px] h-[18px] flex items-center justify-center text-[9px] 
                                    font-mono text-gray-600 bg-gray-800/60 border border-gray-700/30 
                                    rounded px-1 leading-none">
                        ⌘
                    </kbd>
                    <kbd className="min-w-[18px] h-[18px] flex items-center justify-center text-[9px] 
                                    font-mono text-gray-600 bg-gray-800/60 border border-gray-700/30 
                                    rounded px-1 leading-none">
                        K
                    </kbd>
                </div>
            </motion.button>
        </div>
    );
}