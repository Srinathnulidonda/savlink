// src/dashboard/components/links/LinkActions.jsx
import { motion } from 'framer-motion';

export default function LinkActions({ 
    link, 
    onPin, 
    onArchive, 
    onDelete, 
    onEdit,
    isListView = false,
    isHovered = false 
}) {
    const handleOpenLink = (e) => {
        e.stopPropagation();
        window.open(link.original_url, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link.short_url || link.original_url);
    };

    if (isListView) {
        return (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleOpenLink}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="Open link"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPin?.();
                    }}
                    className={`p-1.5 transition-colors ${link.pinned ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                    title={link.pinned ? 'Unpin' : 'Pin'}
                >
                    <svg className="h-4 w-4" fill={link.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            </div>
        );
    }

    // Grid view hover actions
    if (isHovered) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-2 flex gap-1"
            >
                <button
                    onClick={handleOpenLink}
                    className="rounded-lg bg-black/80 backdrop-blur-sm p-1.5 sm:p-2 text-white hover:bg-black transition-all"
                >
                    <svg className="h-3.5 sm:h-4 w-3.5 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </button>
                <button
                    onClick={handleCopyLink}
                    className="rounded-lg bg-black/80 backdrop-blur-sm p-1.5 sm:p-2 text-white hover:bg-black transition-all"
                >
                    <svg className="h-3.5 sm:h-4 w-3.5 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </motion.div>
        );
    }

    return null;
}