// src/dashboard/modals/EditLink/EditLinkModal.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEditLink from './useEditLink';

export default function EditLinkModal({ 
    isOpen, 
    onClose, 
    link, 
    onUpdate, 
    onDelete 
}) {
    const [formData, setFormData] = useState({
        title: '',
        notes: '',
        tags: [],
        collection_id: null
    });
    const [currentTag, setCurrentTag] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { 
        loading, 
        error, 
        updateLink, 
        deleteLink, 
        togglePin, 
        toggleArchive, 
        clearError 
    } = useEditLink(link?.id);

    useEffect(() => {
        if (isOpen && link) {
            setFormData({
                title: link.title || '',
                notes: link.notes || '',
                tags: link.tags || [],
                collection_id: link.collection_id || null
            });
            clearError();
        }
    }, [isOpen, link, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const updatedLink = await updateLink(formData);
            onUpdate(updatedLink);
            onClose();
        } catch (err) {
            // Error handled by hook
        }
    };

    const handleDelete = async () => {
        try {
            await deleteLink();
            onDelete(link.id);
            onClose();
        } catch (err) {
            // Error handled by hook
        }
    };

    const handleTogglePin = async () => {
        try {
            const updatedLink = await togglePin();
            onUpdate(updatedLink);
        } catch (err) {
            // Error handled by hook
        }
    };

    const handleToggleArchive = async () => {
        try {
            const updatedLink = await toggleArchive();
            onUpdate(updatedLink);
        } catch (err) {
            // Error handled by hook
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

    if (!isOpen || !link) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg mx-4 rounded-lg border border-gray-800 bg-gray-950 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-4">
                    <h2 className="text-lg font-semibold text-white">Edit Link</h2>
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
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* URL Display */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            URL
                        </label>
                        <div className="rounded-md border border-gray-800 bg-gray-900 px-3 py-2">
                            <p className="text-sm text-gray-400 font-mono break-all">
                                {link.original_url}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            id="edit-title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Link title"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            placeholder="Add notes..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-300 mb-1">
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
                            id="edit-tags"
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Type and press Enter to add tags..."
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={handleTogglePin}
                            disabled={loading}
                            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                link.pinned
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'border border-gray-800 text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            {link.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            type="button"
                            onClick={handleToggleArchive}
                            disabled={loading}
                            className="flex-1 rounded-md border border-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all"
                        >
                            {link.archived ? 'Restore' : 'Archive'}
                        </button>
                    </div>

                    {/* Main Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Delete Section */}
                    <div className="border-t border-gray-800 pt-4">
                        {!showDeleteConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full rounded-md border border-red-800 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                Delete Link
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400 text-center">
                                    Are you sure? This cannot be undone.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 rounded-md border border-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}