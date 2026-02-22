// src/dashboard/components/links/LinkDetails.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LinkDetails({ link, onClose, onUpdate, onDelete }) {
    const [loading, setLoading] = useState({});
    const [copied, setCopied] = useState({});

    // Handle copy to clipboard with feedback
    const handleCopy = async (text, type) => {
        try {
            setLoading(prev => ({ ...prev, [type]: true }));
            await navigator.clipboard.writeText(text);
            setCopied(prev => ({ ...prev, [type]: true }));
            toast.success(`${type} copied to clipboard!`);
            
            // Reset copied state after animation
            setTimeout(() => {
                setCopied(prev => ({ ...prev, [type]: false }));
            }, 2000);
        } catch (error) {
            toast.error('Failed to copy to clipboard');
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    // Handle share functionality
    const handleShare = async () => {
        const shareData = {
            title: link.title || 'Check out this link',
            text: link.notes || 'Found this interesting link',
            url: link.short_url || link.original_url,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                toast.success('Link shared successfully!');
            } else {
                // Fallback to copying
                await handleCopy(link.short_url || link.original_url, 'share');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                // Fallback to copying if share fails
                await handleCopy(link.short_url || link.original_url, 'share');
            }
        }
    };

    // Handle open link with feedback
    const handleOpenLink = () => {
        setLoading(prev => ({ ...prev, open: true }));
        window.open(link.original_url, '_blank', 'noopener,noreferrer');
        toast.success('Link opened in new tab');
        setTimeout(() => {
            setLoading(prev => ({ ...prev, open: false }));
        }, 1000);
    };

    // Handle delete with confirmation
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
            setLoading(prev => ({ ...prev, delete: true }));
            try {
                await onDelete(link.id);
                toast.success('Link deleted successfully');
            } catch (error) {
                toast.error('Failed to delete link');
                setLoading(prev => ({ ...prev, delete: false }));
            }
        }
    };

    // Button component with enhanced UX
    const ActionButton = ({ 
        onClick, 
        icon, 
        children, 
        variant = 'secondary', 
        loading = false, 
        copied = false, 
        className = '',
        disabled = false 
    }) => {
        const variants = {
            primary: 'bg-primary hover:bg-primary-light text-white',
            secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
            danger: 'bg-transparent border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300',
            success: 'bg-green-600 hover:bg-green-700 text-white'
        };

        return (
            <motion.button
                onClick={onClick}
                disabled={loading || disabled}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                className={`w-full font-medium py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 ${
                    copied ? variants.success : variants[variant]
                } ${loading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            >
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            Loading...
                        </motion.div>
                    ) : copied ? (
                        <motion.div
                            key="copied"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </motion.div>
                    ) : (
                        <motion.div
                            key="normal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            {icon}
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        );
    };

    return (
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-l border-gray-900 bg-gray-950/50 overflow-hidden flex-shrink-0 backdrop-blur-sm"
        >
            <div className="h-full flex flex-col">
                {/* Enhanced Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border-b border-gray-900 flex-shrink-0 bg-gray-950/80"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{link.favicon || '🔗'}</span>
                        <h3 className="text-sm font-medium text-white">Link Details</h3>
                    </div>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>
                </motion.div>

                {/* Enhanced Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4 text-sm"
                    >
                        {/* Title */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Title</label>
                            <p className="mt-1 text-white font-medium break-words">{link.title || 'Untitled'}</p>
                        </div>

                        {/* URL with copy button */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">URL</label>
                            <div className="mt-1 flex items-center gap-2">
                                <p className="flex-1 text-gray-400 font-mono text-xs break-all bg-gray-900/50 p-2 rounded border">
                                    {link.original_url}
                                </p>
                                <motion.button
                                    onClick={() => handleCopy(link.original_url, 'url')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                                    title="Copy URL"
                                >
                                    {copied.url ? (
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Short URL */}
                        {link.short_url && (
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Short URL</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="flex-1 text-primary font-mono text-xs bg-primary/10 p-2 rounded border border-primary/20">
                                        {link.short_url}
                                    </p>
                                    <motion.button
                                        onClick={() => handleCopy(link.short_url, 'shortUrl')}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1.5 text-primary hover:text-primary-light hover:bg-primary/20 rounded transition-colors"
                                        title="Copy Short URL"
                                    >
                                        {copied.shortUrl ? (
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Notes</label>
                            <p className="mt-1 text-gray-400 text-xs bg-gray-900/30 p-2 rounded border min-h-[60px]">
                                {link.notes || link.notes_preview || 'No notes added'}
                            </p>
                        </div>

                        {/* Tags */}
                        {link.tags && link.tags.length > 0 && (
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tags</label>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {link.tags.map((tag) => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300 border border-gray-700"
                                        >
                                            #{tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Created</label>
                                <p className="mt-1 text-gray-400 text-xs">{link.created_at || link.relative_time}</p>
                            </div>
                            
                            {link.click_count !== undefined && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Clicks</label>
                                    <p className="mt-1 text-white text-xs font-mono">{link.click_count}</p>
                                </div>
                            )}
                        </div>

                        {/* Status indicators */}
                        <div className="flex flex-wrap gap-2">
                            {link.pinned && (
                                <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">
                                    ⭐ Pinned
                                </span>
                            )}
                            {link.archived && (
                                <span className="flex items-center gap-1 text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded border border-gray-500/30">
                                    📦 Archived
                                </span>
                            )}
                            {link.is_public && (
                                <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                    🌐 Public
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Enhanced Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-shrink-0 p-4 border-t border-gray-900 bg-gray-950/80 backdrop-blur-sm"
                >
                    <div className="space-y-2">
                        {/* Primary Actions */}
                        <ActionButton
                            onClick={handleOpenLink}
                            variant="primary"
                            loading={loading.open}
                            icon={
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            }
                        >
                            Open Link
                        </ActionButton>

                        {/* Share Button */}
                        <ActionButton
                            onClick={handleShare}
                            variant="secondary"
                            loading={loading.share}
                            copied={copied.share}
                            icon={
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            }
                        >
                            Share Link
                        </ActionButton>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <ActionButton
                                onClick={() => handleCopy(link.short_url || link.original_url, 'copy')}
                                variant="secondary"
                                loading={loading.copy}
                                copied={copied.copy}
                                icon={
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                Copy
                            </ActionButton>

                            <ActionButton
                                onClick={() => onUpdate && onUpdate(link.id)}
                                variant="secondary"
                                icon={
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                }
                            >
                                Edit
                            </ActionButton>
                        </div>

                        {/* Danger Zone */}
                        <ActionButton
                            onClick={handleDelete}
                            variant="danger"
                            loading={loading.delete}
                            icon={
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            }
                        >
                            Delete Link
                        </ActionButton>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}