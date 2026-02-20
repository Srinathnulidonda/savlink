// src/dashboard/modals/AddLink/AddLinkModal.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useAddLink from './useAddLink';

export default function AddLinkModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        original_url: '',
        title: '',
        notes: '',
        link_type: 'saved',
        tags: [],
        folder_id: null,
    });
    const [currentTag, setCurrentTag] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
        loading, 
        error, 
        duplicateWarning, 
        createLink, 
        fetchTitleFromUrl, 
        clearError 
    } = useAddLink();

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                original_url: '',
                title: '',
                notes: '',
                link_type: 'saved',
                tags: [],
                folder_id: null,
            });
            setCurrentTag('');
            setIsSubmitting(false);
            // Clear any previous errors when opening
            clearError();
        }
    }, [isOpen, clearError]);

    // Handle body scroll lock
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isMobile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting || loading) return;
        
        setIsSubmitting(true);

        try {
            const link = await createLink(formData);
            if (link) {
                await onSubmit(link);
                onClose();
            }
        } catch (err) {
            // Error is already handled by the hook
            console.error('Link creation error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && (text.startsWith('http') || text.includes('.'))) {
                // Clear previous error when pasting new URL
                clearError();
                
                setFormData(prev => ({ ...prev, original_url: text }));
                
                // Auto-fetch metadata
                const metadata = await fetchTitleFromUrl(text);
                if (metadata) {
                    setFormData(prev => ({
                        ...prev,
                        title: prev.title || metadata.title || '',
                        notes: prev.notes || metadata.description || ''
                    }));
                }
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    }, [fetchTitleFromUrl, clearError]);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            const tag = currentTag.trim().toLowerCase();
            if (!formData.tags.includes(tag)) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, tag]
                });
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{
                    scale: 0.95,
                    opacity: 0,
                    y: isMobile ? 20 : 0
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    scale: 0.95,
                    opacity: 0,
                    y: isMobile ? 20 : 0
                }}
                className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-4">
                    <h2 className="text-lg font-semibold text-white">
                        Add New Link
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    {/* Link Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            What do you want to do?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, link_type: 'saved' })}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                    formData.link_type === 'saved'
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                            >
                                <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Save Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, link_type: 'shortened' })}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                    formData.link_type === 'shortened'
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                            >
                                <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Shorten
                            </button>
                        </div>
                    </div>

                    {/* URL Input */}
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                            URL <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="url"
                                type="url"
                                value={formData.original_url}
                                onChange={(e) => {
                                    setFormData({ ...formData, original_url: e.target.value });
                                    // Clear error when user types
                                    if (error) clearError();
                                }}
                                className="flex-1 rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="https://example.com"
                                required
                                autoFocus={!isMobile}
                            />
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                                title="Paste from clipboard"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </button>
                        </div>
                        {error && (
                            <p className="mt-1 text-sm text-red-400">{error}</p>
                        )}
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Optional title"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            placeholder="Add notes or description..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                            Tags
                        </label>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-gray-500 hover:text-white"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <input
                            id="tags"
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Type and press Enter to add tags..."
                        />
                    </div>

                    {/* Duplicate Warning */}
                    {duplicateWarning && (
                        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
                            <p className="text-sm text-yellow-400">
                                ⚠️ You already have this URL saved: "{duplicateWarning.existing_title}"
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isSubmitting || !formData.original_url}
                            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading || isSubmitting ? 'Creating...' : formData.link_type === 'shortened' ? 'Create Short Link' : 'Save Link'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}