// src/dashboard/components/links/LinkActions.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LinkActions({ 
    link, 
    onPin, 
    onArchive, 
    onDelete, 
    onEdit, 
    compact = false 
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(link.original_url);
            toast.success('URL copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy URL');
        }
    };

    const handleCopyShortUrl = async () => {
        if (!link.short_url) return;
        
        try {
            await navigator.clipboard.writeText(link.short_url);
            toast.success('Short URL copied');
        } catch (error) {
            toast.error('Failed to copy short URL');
        }
    };

    const handleOpenLink = () => {
        window.open(link.original_url, '_blank', 'noopener,noreferrer');
    };

    const handleAction = async (action) => {
        setLoading(true);
        try {
            await action();
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    const actions = [
        {
            label: 'Open Link',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            ),
            action: handleOpenLink,
            shortcut: 'Enter'
        },
        {
            label: 'Copy URL',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            action: handleCopyUrl,
            shortcut: '⌘C'
        },
        ...(link.short_url ? [{
            label: 'Copy Short URL',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            ),
            action: handleCopyShortUrl,
            shortcut: '⌘⇧C'
        }] : []),
        {
            label: link.pinned ? 'Unpin' : 'Pin',
            icon: (
                <svg className="h-4 w-4" fill={link.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            action: onPin,
            shortcut: 'P',
            color: link.pinned ? 'text-yellow-500' : 'text-gray-400'
        },
        {
            label: 'Edit',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            action: onEdit,
            shortcut: 'E'
        },
        {
            label: link.archived ? 'Restore' : 'Archive',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {link.archived ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    )}
                </svg>
            ),
            action: onArchive,
            shortcut: 'A'
        },
        {
            label: 'Delete',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            action: onDelete,
            shortcut: '⌫',
            color: 'text-red-400',
            divider: true
        }
    ];

    if (compact) {
        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={handleOpenLink}
                    className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                    title="Open link"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </button>
                
                <button
                    onClick={() => handleAction(onPin)}
                    className={`p-1 transition-colors rounded ${link.pinned ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                    title={link.pinned ? 'Unpin' : 'Pin'}
                >
                    <svg className="h-3.5 w-3.5" fill={link.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
                title="More actions"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>

            <AnimatePresence>
                {showMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-1 z-20 w-48 rounded-lg border border-gray-800 bg-gray-950 shadow-xl"
                        >
                            <div className="p-1">
                                {actions.map((action, index) => (
                                    <div key={action.label}>
                                        {action.divider && <div className="my-1 border-t border-gray-800" />}
                                        <button
                                            onClick={() => handleAction(action.action)}
                                            disabled={loading}
                                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-md transition-all hover:bg-gray-900 disabled:opacity-50 ${action.color || 'text-gray-400 hover:text-white'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {action.icon}
                                                {action.label}
                                            </span>
                                            <kbd className="text-[10px] text-gray-600 font-mono">
                                                {action.shortcut}
                                            </kbd>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}