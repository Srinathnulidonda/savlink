// src/dashboard/components/sidebar/Collections.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const EMOJI_OPTIONS = ['📁', '⚡', '🎨', '📈', '📚', '🔬', '💡', '🎯', '🚀', '🔧', '💻', '📱'];

export default function Collections({ collections, onCreateCollection, activeCollection, onCollectionChange }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('📁');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-focus input
    useEffect(() => {
        if (isCreating && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isCreating]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            await onCreateCollection({
                name: newName.trim(),
                emoji: selectedEmoji,
                color: 'from-blue-600 to-blue-500',
            });
            setNewName('');
            setSelectedEmoji('📁');
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create collection:', error);
        }
    };

    const handleCollectionClick = (collection) => {
        onCollectionChange?.(collection.id);
        navigate(`/dashboard/collections/${collection.id}`);
    };

    const formatCount = (count) => {
        if (count > 999) return `${(count / 1000).toFixed(1)}k`;
        return count.toString();
    };

    const isCollectionActive = (id) => {
        return activeCollection === id || location.pathname.includes(`/collections/${id}`);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 border-t border-gray-800/40">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
                <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                    Collections
                </span>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-1 rounded-md text-gray-600 hover:text-gray-400 
                               hover:bg-gray-800/50 transition-colors"
                    title={isCreating ? 'Cancel' : 'New collection'}
                >
                    <motion.svg
                        className="h-3.5 w-3.5"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        animate={{ rotate: isCreating ? 45 : 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </motion.svg>
                </button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden px-3"
                    >
                        <form onSubmit={handleCreate} className="p-3 mb-2 rounded-lg border border-gray-800/50 
                                                                   bg-gray-900/30 space-y-2.5">
                            {/* Emoji Row */}
                            <div className="flex flex-wrap gap-1">
                                {EMOJI_OPTIONS.slice(0, 8).map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setSelectedEmoji(emoji)}
                                        className={`w-7 h-7 rounded-md text-sm flex items-center justify-center
                                                   transition-all ${selectedEmoji === emoji
                                                ? 'bg-primary/10 ring-1 ring-primary/30 scale-110'
                                                : 'hover:bg-gray-800/50'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>

                            {/* Name Input */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Collection name…"
                                className="w-full px-2.5 py-1.5 text-[13px] bg-gray-900/50 
                                           border border-gray-800/50 rounded-md text-white 
                                           placeholder-gray-600 focus:border-gray-700/50 
                                           focus:outline-none focus:ring-1 focus:ring-primary/20
                                           transition-colors"
                                onKeyDown={(e) => e.key === 'Escape' && setIsCreating(false)}
                            />

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={!newName.trim()}
                                    className="flex-1 px-2.5 py-1.5 text-[12px] font-medium 
                                               bg-primary text-white rounded-md
                                               hover:bg-primary-light disabled:opacity-40 
                                               disabled:cursor-not-allowed transition-colors"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewName('');
                                    }}
                                    className="px-2.5 py-1.5 text-[12px] text-gray-500 
                                               hover:text-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent 
                            scrollbar-thumb-gray-800 px-3 pb-2 space-y-0.5">
                {collections.length === 0 && !isCreating ? (
                    <div className="text-center py-8 px-4">
                        <div className="w-9 h-9 mx-auto rounded-lg bg-gray-800/30 border border-gray-800/40
                                        flex items-center justify-center mb-2.5">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" 
                                 stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>
                        </div>
                        <p className="text-[11px] text-gray-600 mb-2">No collections yet</p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="text-[11px] text-primary hover:text-primary-light transition-colors"
                        >
                            Create your first
                        </button>
                    </div>
                ) : (
                    collections.map((col) => {
                        const active = isCollectionActive(col.id);

                        return (
                            <button
                                key={col.id}
                                onClick={() => handleCollectionClick(col)}
                                className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg 
                                           text-[13px] transition-all group
                                           ${active
                                        ? 'bg-white/[0.06] text-white'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                                    }`}
                            >
                                {/* Emoji */}
                                <span className={`text-sm flex-shrink-0 transition-transform
                                                 ${active ? '' : 'opacity-70 group-hover:opacity-100'}
                                                 group-hover:scale-110`}>
                                    {col.emoji || '📁'}
                                </span>

                                {/* Name */}
                                <span className="flex-1 text-left truncate font-medium">
                                    {col.name}
                                </span>

                                {/* Count */}
                                <span className={`text-[11px] tabular-nums flex-shrink-0
                                                 ${active ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {formatCount(col.count)}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}