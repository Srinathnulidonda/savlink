// src/dashboard/components/sidebar/Collections.jsx - Minimal version
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Collections({ 
    collections, 
    onCreateCollection, 
    activeCollection, 
    onCollectionChange 
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('📁');
    const [selectedColor, setSelectedColor] = useState('#3B82F6');

    const emojiOptions = ['📁', '⚡', '🎨', '📈', '📚', '🔬', '💡', '🎯', '🚀', '🔧', '💻', '📱', '🌟', '🎵', '🎬', '📰'];

    const colorOptions = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
    ];

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        try {
            await onCreateCollection({
                name: newCollectionName.trim(),
                emoji: selectedEmoji,
                color: selectedColor,
                pinned: false
            });

            setNewCollectionName('');
            setSelectedEmoji('📁');
            setSelectedColor('#3B82F6');
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create collection:', error);
        }
    };

    const handleCollectionClick = (collection) => {
        onCollectionChange?.(collection.id);
        navigate(`/dashboard/collections/${collection.id}`);
    };

    const getCountDisplay = (count) => {
        if (!count || count === 0) return '';
        if (count > 9999) return '9999+';
        if (count > 999) return `${Math.floor(count / 1000)}k`;
        return count.toString();
    };

    const isCollectionActive = (collection) => {
        return location.pathname === `/dashboard/collections/${collection.id}` || activeCollection === collection.id;
    };

    // Separate pinned and regular collections
    const pinnedCollections = collections.filter(c => c.pinned);
    const regularCollections = collections.filter(c => !c.pinned);

    return (
        <div className="flex-1 border-t border-gray-900 px-3 pt-3 overflow-y-auto min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collections
                </h3>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-1 text-gray-500 hover:text-gray-400 transition-colors rounded hover:bg-gray-900"
                    title="Create new collection"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {isCreating ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Create Collection Form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <form onSubmit={handleCreateCollection} className="p-3 bg-gray-900/30 rounded-lg border border-gray-800 space-y-3">
                            {/* Emoji Selector */}
                            <div>
                                <label className="text-xs text-gray-500 block mb-2">Icon</label>
                                <div className="grid grid-cols-8 gap-1">
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setSelectedEmoji(emoji)}
                                            className={`p-1.5 rounded text-sm hover:bg-gray-800 transition-colors ${
                                                selectedEmoji === emoji ? 'bg-gray-800 ring-1 ring-primary/50' : ''
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <label className="text-xs text-gray-500 block mb-2">Color</label>
                                <div className="flex gap-1">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-6 h-6 rounded border-2 ${
                                                selectedColor === color ? 'border-white' : 'border-gray-700'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <input
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Collection name..."
                                    className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
                                    autoFocus
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={!newCollectionName.trim()}
                                    className="flex-1 px-3 py-2 text-xs bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collections List */}
            <div className="space-y-1 pb-4">
                {/* Pinned Collections */}
                {pinnedCollections.map((collection) => (
                    <CollectionItem
                        key={collection.id}
                        collection={collection}
                        isActive={isCollectionActive(collection)}
                        onClick={() => handleCollectionClick(collection)}
                        getCountDisplay={getCountDisplay}
                    />
                ))}

                {/* Regular Collections */}
                {regularCollections.map((collection) => (
                    <CollectionItem
                        key={collection.id}
                        collection={collection}
                        isActive={isCollectionActive(collection)}
                        onClick={() => handleCollectionClick(collection)}
                        getCountDisplay={getCountDisplay}
                    />
                ))}

                {/* Empty State */}
                {collections.length === 0 && !isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="text-gray-600 mb-2">
                            <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-xs text-gray-500 mb-3">No collections yet</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="text-xs text-primary hover:text-primary-light transition-colors font-medium"
                        >
                            Create your first collection
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Minimal Collection Item Component
function CollectionItem({ collection, isActive, onClick, getCountDisplay }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: isActive ? 1 : 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all group ${
                isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <span 
                    className={`text-sm transition-transform group-hover:scale-110`}
                    style={{ color: isActive ? collection.color : undefined }}
                >
                    {collection.emoji}
                </span>
                <span className="font-medium truncate">{collection.name}</span>
            </div>

            <div className="flex items-center gap-2">
                {/* Pin indicator */}
                {collection.pinned && (
                    <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4v12l-4-2-4 2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
                    </svg>
                )}

                {/* Count */}
                {getCountDisplay(collection.count) && (
                    <span className={`text-xs ${
                        isActive ? 'text-primary/70' : 'text-gray-500'
                    }`}>
                        {getCountDisplay(collection.count)}
                    </span>
                )}

                {/* Active indicator */}
                {isActive && (
                    <motion.div
                        layoutId="collectionActiveIndicator"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                    />
                )}
            </div>
        </motion.button>
    );
}