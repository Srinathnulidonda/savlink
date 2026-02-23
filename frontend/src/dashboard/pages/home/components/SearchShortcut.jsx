// src/dashboard/pages/home/components/SearchShortcut.jsx

export default function SearchShortcut({ onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="hidden sm:flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-500 
                       bg-gray-900/30 border border-gray-800/50 rounded-lg 
                       hover:border-gray-700/50 hover:bg-gray-900/50 hover:text-gray-400 
                       transition-all active:scale-[0.98]"
        >
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search…</span>
            <div className="flex items-center gap-0.5 ml-3">
                <kbd className="min-w-[20px] h-[20px] flex items-center justify-center text-[10px] 
                                font-mono text-gray-500 bg-gray-800/50 border border-gray-700/30 
                                rounded px-1 leading-none">
                    ⌘
                </kbd>
                <kbd className="min-w-[20px] h-[20px] flex items-center justify-center text-[10px] 
                                font-mono text-gray-500 bg-gray-800/50 border border-gray-700/30 
                                rounded px-1 leading-none">
                    K
                </kbd>
            </div>
        </button>
    );
}