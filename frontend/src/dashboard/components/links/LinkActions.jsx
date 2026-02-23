// src/dashboard/components/links/LinkActions.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LinkActions({
    link,
    onPin,
    onStar,
    onArchive,
    onDelete,
    align = 'right',
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(link.short_url || link.original_url);
            toast.success('Copied');
        } catch { toast.error('Copy failed'); }
        setOpen(false);
    };

    const act = (fn) => (e) => { e.stopPropagation(); fn?.(); setOpen(false); };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={`p-1.5 rounded-md transition-colors
                    ${open ? 'bg-white/[0.06] text-gray-300'
                           : 'text-gray-600 hover:text-gray-400 hover:bg-white/[0.04]'}`}
                aria-label="More actions" aria-expanded={open}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-30"
                            onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.1 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute top-full mt-1 w-52 rounded-lg border border-gray-800/60
                                bg-[#111] shadow-2xl shadow-black/60 z-40 overflow-hidden py-1
                                ${align === 'right' ? 'right-0' : 'left-0'}`}
                        >
                            <ActionItem
                                onClick={(e) => { e.stopPropagation(); window.open(link.original_url, '_blank', 'noopener,noreferrer'); setOpen(false); }}
                                shortcut="↵"
                            >
                                Open in new tab
                            </ActionItem>
                            <ActionItem onClick={handleCopy} shortcut="⌘C">
                                Copy link
                            </ActionItem>

                            <div className="my-1 mx-2.5 border-t border-gray-800/40" />

                            {/* ── Star (favorite) ───────────── */}
                            <ActionItem onClick={act(onStar)} shortcut="S" active={link.starred}>
                                {link.starred ? 'Remove from favorites' : 'Add to favorites'}
                            </ActionItem>

                            {/* ── Pin (sidebar placement) ──── */}
                            <ActionItem onClick={act(onPin)} shortcut="P" active={link.pinned}>
                                {link.pinned ? 'Unpin' : 'Pin'}
                            </ActionItem>

                            <ActionItem onClick={act(onArchive)} shortcut="E">
                                {link.archived ? 'Restore' : 'Archive'}
                            </ActionItem>

                            <div className="my-1 mx-2.5 border-t border-gray-800/40" />

                            <ActionItem onClick={act(onDelete)} shortcut="⌫" danger>
                                Delete
                            </ActionItem>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function ActionItem({ onClick, shortcut, danger = false, active = false, children }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-[7px] text-[13px] transition-colors
                ${danger
                    ? 'text-red-400 hover:bg-red-500/[0.08]'
                    : active
                        ? 'text-amber-400 hover:bg-white/[0.04]'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'}`}
        >
            <span className="truncate">{children}</span>
            {shortcut && <kbd className="text-[10px] font-mono text-gray-600 ml-3 flex-shrink-0">{shortcut}</kbd>}
        </button>
    );
}