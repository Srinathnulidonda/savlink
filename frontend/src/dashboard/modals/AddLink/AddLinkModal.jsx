// src/dashboard/modals/AddLink/AddLinkModal.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAddLink } from './useAddLink';
import LoadingState from '../../components/common/LoadingState';

export default function AddLinkModal({ isOpen, onClose, onSubmit }) {
    const { addLink, loading, error, clearError, validateUrl, extractMetadata } = useAddLink();
    
    const [formData, setFormData] = useState({
        original_url: '',
        title: '',
        notes: '',
        link_type: 'saved',
        tags: [],
        collection_id: null,
    });
    const [currentTag, setCurrentTag] = useState('');
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [screenSize, setScreenSize] = useState('normal');
    const [urlMetadata, setUrlMetadata] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            if (width < 360) {
                setScreenSize('small');
            } else if (width < 390) {
                setScreenSize('compact');
            } else if (width < 430) {
                setScreenSize('normal');
            } else if (width < 500) {
                setScreenSize('large');
            } else if (width < 768) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                original_url: '',
                title: '',
                notes: '',
                link_type: 'saved',
                tags: [],
                collection_id: null,
            });
            clearError();
            setDuplicateWarning(null);
            setUrlMetadata(null);
        }
    }, [isOpen, clearError]);

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen, isMobile]);

    // Auto-extract metadata when URL changes
    useEffect(() => {
        if (formData.original_url && !formData.title) {
            const timeoutId = setTimeout(async () => {
                const validation = validateUrl(formData.original_url);
                if (validation.valid) {
                    const metadata = await extractMetadata(formData.original_url);
                    setUrlMetadata(metadata);
                    setFormData(prev => ({
                        ...prev,
                        title: prev.title || metadata.title
                    }));
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [formData.original_url, formData.title, validateUrl, extractMetadata]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await addLink(formData);
        
        if (result.success) {
            await onSubmit(formData);
            onClose();
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && (text.startsWith('http') || text.includes('.'))) {
                setFormData({ ...formData, original_url: text });
                clearError();
            } else {
                clearError();
                // Show error through the hook's error system would be better
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(currentTag.trim())) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, currentTag.trim()]
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

    // Responsive sizing functions (same as before)
    const getModalWidth = () => {
        switch (screenSize) {
            case 'small': return 'w-[95vw] max-w-[300px]';
            case 'compact': return 'w-[90vw] max-w-[320px]';
            case 'normal': return 'w-[85vw] max-w-[340px]';
            case 'large': return 'w-[80vw] max-w-[380px]';
            case 'tablet': return 'w-[70vw] max-w-[420px]';
            default: return 'w-full max-w-lg';
        }
    };

    const getModalPadding = () => {
        switch (screenSize) {
            case 'small': return 'p-2';
            case 'compact':
            case 'normal': return 'p-2.5';
            case 'large': return 'p-3';
            case 'tablet': return 'p-3';
            default: return 'p-4';
        }
    };

    const getTextSize = () => {
        switch (screenSize) {
            case 'small': return { title: 'text-sm', label: 'text-[10px]', input: 'text-xs', button: 'text-[10px]' };
            case 'compact': return { title: 'text-sm', label: 'text-[11px]', input: 'text-xs', button: 'text-[11px]' };
            case 'normal':
            case 'large': return { title: 'text-base', label: 'text-xs', input: 'text-sm', button: 'text-xs' };
            case 'tablet': return { title: 'text-base', label: 'text-xs', input: 'text-sm', button: 'text-xs' };
            default: return { title: 'text-lg', label: 'text-sm', input: 'text-sm', button: 'text-sm' };
        }
    };

    const getSpacing = () => {
        switch (screenSize) {
            case 'small': return 'mb-2';
            case 'compact':
            case 'normal': return 'mb-2.5';
            case 'large':
            case 'tablet': return 'mb-3';
            default: return 'mb-4';
        }
    };

    const getInputPadding = () => {
        switch (screenSize) {
            case 'small': return 'px-2 py-1.5';
            case 'compact':
            case 'normal': return 'px-2.5 py-1.5';
            case 'large':
            case 'tablet': return 'px-3 py-2';
            default: return 'px-3 py-2';
        }
    };

    const textSizes = getTextSize();
    const spacing = getSpacing();
    const inputPadding = getInputPadding();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm safe-area-all"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: isMobile ? 20 : 0 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: isMobile ? 20 : 0 }}
                className={`${getModalWidth()} mx-3 rounded-lg border border-gray-800 bg-gray-950 shadow-2xl ${isMobile ? 'max-h-[90vh] overflow-y-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between border-b border-gray-800 ${getModalPadding()}`}>
                    <h2 className={`${textSizes.title} font-semibold text-white`}>
                        Add New Link
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-0.5 rounded hover:bg-gray-800"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="p-8">
                        <LoadingState message="Saving link..." size="default" />
                    </div>
                )}

                {/* Form */}
                {!loading && (
                    <form onSubmit={handleSubmit} className={getModalPadding()}>
                        {/* Link Type Toggle */}
                        <div className={spacing}>
                            <label className={`block ${textSizes.label} font-medium text-gray-300 mb-1.5`}>
                                What do you want to do?
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, link_type: 'saved' })}
                                    className={`rounded-md px-2 py-2 ${textSizes.button} font-medium transition-all ${formData.link_type === 'saved'
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
                                        }`}
                                >
                                    <svg className="inline h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, link_type: 'shortened' })}
                                    className={`rounded-md px-2 py-2 ${textSizes.button} font-medium transition-all ${formData.link_type === 'shortened'
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
                                        }`}
                                >
                                    <svg className="inline h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                    </svg>
                                    Shorten
                                </button>
                            </div>
                        </div>

                        {/* URL Input */}
                        <div className={spacing}>
                            <label htmlFor="url" className={`block ${textSizes.label} font-medium text-gray-300 mb-1`}>
                                URL <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-1.5">
                                <input
                                    id="url"
                                    type="url"
                                    value={formData.original_url}
                                    onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                                    className={`flex-1 rounded-md border border-gray-800 bg-gray-900 ${inputPadding} ${textSizes.input} text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                                    placeholder="example.com"
                                    required
                                    autoFocus={!isMobile}
                                />
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className={`rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-all`}
                                    title="Paste"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </button>
                            </div>
                            {error && (
                                <p className={`mt-1 ${textSizes.button} text-red-400`}>{error}</p>
                            )}
                            {urlMetadata && (
                                <p className={`mt-1 ${textSizes.button} text-green-400`}>
                                    ✓ Detected: {urlMetadata.domain}
                                </p>
                            )}
                        </div>

                        {/* Title Input */}
                        <div className={spacing}>
                            <label htmlFor="title" className={`block ${textSizes.label} font-medium text-gray-300 mb-1`}>
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full rounded-md border border-gray-800 bg-gray-900 ${inputPadding} ${textSizes.input} text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                                placeholder="Title (optional)"
                            />
                        </div>

                        {/* Notes */}
                        <div className={spacing}>
                            <label htmlFor="notes" className={`block ${textSizes.label} font-medium text-gray-300 mb-1`}>
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={screenSize === 'small' ? 2 : 2}
                                className={`w-full rounded-md border border-gray-800 bg-gray-900 ${inputPadding} ${textSizes.input} text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none`}
                                placeholder="Notes..."
                            />
                        </div>

                        {/* Tags */}
                        <div className={spacing}>
                            <label htmlFor="tags" className={`block ${textSizes.label} font-medium text-gray-300 mb-1`}>
                                Tags
                            </label>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-1.5">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center gap-0.5 rounded-full bg-gray-800 px-1.5 py-0.5 ${textSizes.button} text-gray-300`}
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-gray-500 hover:text-white ml-0.5"
                                            >
                                                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                className={`w-full rounded-md border border-gray-800 bg-gray-900 ${inputPadding} ${textSizes.input} text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                                placeholder="Add tags..."
                            />
                        </div>

                        {/* Duplicate Warning */}
                        {duplicateWarning && (
                            <div className={`${spacing} rounded-md bg-yellow-500/10 border border-yellow-500/20 p-2`}>
                                <p className={`${textSizes.button} text-yellow-400`}>
                                    ⚠️ URL already saved: "{duplicateWarning.existing_title}"
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 rounded-md border border-gray-800 bg-gray-900 ${inputPadding} ${textSizes.button} font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.original_url}
                                className={`flex-1 rounded-md bg-primary ${inputPadding} ${textSizes.button} font-medium text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                            >
                                {loading ? 'Saving...' : formData.link_type === 'shortened' ? 'Create' : 'Save'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
}