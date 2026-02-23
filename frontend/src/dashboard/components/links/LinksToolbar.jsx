// src/dashboard/components/links/LinksToolbar.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
    { value: 'created_at', label: 'Date created', mobileLabel: 'Date' },
    { value: 'title', label: 'Title', mobileLabel: 'Title' },
    { value: 'click_count', label: 'Most clicked', mobileLabel: 'Clicks' },
];

const SAFE_PADDING = {
    paddingLeft:  'max(env(safe-area-inset-left, 0px), 0px)',
    paddingRight: 'max(env(safe-area-inset-right, 0px), 0px)',
};

export default function LinksToolbar({
    totalCount,
    selectedCount,
    isSelectMode,
    sortBy,
    sortOrder,
    onSortChange,
    onSelectAll,
    onClearSelection,
    onBulkDelete,
    onBulkArchive,
    searchQuery,
}) {
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        if (!sortOpen) return;
        const close = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [sortOpen]);

    const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy);

    return (
        <div
            className="flex-shrink-0 border-b border-white/[0.04]
                        px-3 py-1.5
                        sm:px-4 sm:py-2
                        lg:px-6"
            style={SAFE_PADDING}
        >
            <div className="flex items-center justify-between gap-2 
                           min-h-[32px] sm:min-h-[40px]">

                {/* ── Left: Checkbox + Info text ────────────── */}
                <div className="flex items-center min-w-0">

                    {/* Select-all checkbox — nudged 2px right with ml-0.5 */}
                    <div 
                        className="flex items-center justify-center 
                                   w-8 h-8 sm:w-9 sm:h-9
                                   ml-0.5
                                   mr-2 sm:mr-3
                                   flex-shrink-0 touch-manipulation cursor-pointer
                                   rounded-md hover:bg-white/[0.04] active:bg-white/[0.06]
                                   transition-colors"
                        onClick={onSelectAll}
                        role="button"
                        aria-label="Select all"
                        title="Select all"
                    >
                        <span
                            className={`flex items-center justify-center border transition-all
                                       w-4 h-4 rounded
                                       ${selectedCount > 0
                                    ? 'bg-primary border-primary'
                                    : 'border-gray-600 hover:border-gray-500 active:border-gray-400'
                                }`}
                        >
                            {selectedCount > 0 && selectedCount === totalCount && (
                                <svg
                                    className="w-2.5 h-2.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {selectedCount > 0 && selectedCount < totalCount && (
                                <span className="block w-2 h-0.5 bg-white rounded-full" />
                            )}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-4 bg-white/[0.06] mr-2.5 sm:mr-3 flex-shrink-0" />

                    {/* Info text */}
                    <AnimatePresence mode="wait">
                        {isSelectMode ? (
                            <motion.div
                                key="sel"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                            >
                                <span className="text-[11px] sm:text-[13px] font-medium 
                                                text-white whitespace-nowrap leading-none">
                                    {selectedCount}
                                    <span className="hidden xs:inline"> selected</span>
                                    <span className="xs:hidden"> sel</span>
                                </span>
                                <button
                                    onClick={onClearSelection}
                                    className="text-[10px] sm:text-[12px] text-gray-500 
                                               hover:text-gray-300 active:text-gray-200 
                                               transition-colors touch-manipulation
                                               py-0.5 px-1 rounded leading-none"
                                >
                                    Clear
                                </button>
                            </motion.div>
                        ) : (
                            <motion.span
                                key="count"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                className="text-[11px] sm:text-[13px] text-gray-500 
                                          truncate min-w-0 leading-none"
                            >
                                {totalCount} {totalCount === 1 ? 'link' : 'links'}
                                {searchQuery && (
                                    <span className="text-gray-600 hidden sm:inline">
                                        {' '}for "{searchQuery}"
                                    </span>
                                )}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Right: Bulk actions + Sort ────────────── */}
                <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">

                    {/* Bulk actions */}
                    <AnimatePresence>
                        {isSelectMode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, width: 0 }}
                                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                                exit={{ opacity: 0, scale: 0.85, width: 0 }}
                                className="flex items-center gap-0.5 sm:gap-1 overflow-hidden"
                            >
                                <BulkBtn onClick={onBulkArchive} label="Archive">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </BulkBtn>
                                <BulkBtn onClick={onBulkDelete} label="Delete" danger>
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </BulkBtn>

                                <div className="w-px h-3.5 sm:h-4 bg-white/[0.06] mx-0.5 sm:mx-1" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sort */}
                    <div ref={sortRef} className="relative">
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className={`flex items-center gap-1 sm:gap-1.5 
                                       px-2 py-1.5 sm:px-2.5 sm:py-1.5
                                       text-[10px] sm:text-[12px] rounded-md 
                                       transition-colors touch-manipulation
                                       min-h-[28px] sm:min-h-[34px]
                                       ${sortOpen
                                    ? 'bg-white/[0.04] text-gray-300'
                                    : 'text-gray-500 hover:text-gray-300 active:text-gray-200 hover:bg-white/[0.03]'
                                }`}
                        >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                            </svg>
                            <span className="hidden sm:inline">{currentSort?.label}</span>
                            <span className="sm:hidden">{currentSort?.mobileLabel}</span>
                        </button>

                        <AnimatePresence>
                            {sortOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10 sm:hidden"
                                        onClick={() => setSortOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-1 
                                                   w-40 sm:w-44 
                                                   rounded-lg border border-gray-800/60 
                                                   bg-[#0c0c0c] shadow-xl z-20 
                                                   overflow-hidden py-1"
                                    >
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    onSortChange(
                                                        opt.value,
                                                        sortBy === opt.value
                                                            ? sortOrder === 'asc' ? 'desc' : 'asc'
                                                            : 'desc',
                                                    );
                                                    setSortOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between 
                                                           px-3 py-2.5 sm:py-2 
                                                           text-[12px] transition-colors touch-manipulation
                                                           ${sortBy === opt.value
                                                        ? 'text-white bg-white/[0.04]'
                                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03] active:bg-white/[0.06]'
                                                    }`}
                                            >
                                                <span>{opt.label}</span>
                                                {sortBy === opt.value && (
                                                    <svg
                                                        className={`w-3 h-3 transition-transform 
                                                                   ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24"
                                                        stroke="currentColor" strokeWidth={2}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BulkBtn({ onClick, label, danger = false, children }) {
    return (
        <button
            onClick={onClick}
            className={`p-1.5 rounded-md transition-colors touch-manipulation
                       min-w-[28px] min-h-[28px] sm:min-w-[36px] sm:min-h-[36px]
                       flex items-center justify-center
                       ${danger
                    ? 'text-gray-500 hover:text-red-400 active:text-red-300 hover:bg-red-500/10'
                    : 'text-gray-500 hover:text-gray-300 active:text-gray-200 hover:bg-white/[0.04]'
                }`}
            title={label}
            aria-label={label}
        >
            {children}
        </button>
    );
}