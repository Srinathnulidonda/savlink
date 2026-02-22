// src/dashboard/modals/CommandPalette/CommandPalette.jsx

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCommandPalette } from './useCommandPalette';

export default function CommandPalette({ isOpen, onClose, onAddLink, onNavigate }) {
    const inputRef = useRef(null);
    
    const commands = [
        {
            id: 'add-link',
            icon: '➕',
            label: 'Add new link',
            shortcut: 'N',
            action: onAddLink,
            category: 'Quick Actions',
            keywords: ['new', 'create', 'add', 'save']
        },
        {
            id: 'create-collection',
            icon: '📁',
            label: 'Create collection',
            shortcut: 'C',
            action: () => console.log('Create collection'),
            category: 'Quick Actions',
            keywords: ['folder', 'organize', 'group']
        },
        {
            id: 'search',
            icon: '🔍',
            label: 'Search links',
            shortcut: 'S',
            action: () => console.log('Search'),
            category: 'Quick Actions',
            keywords: ['find', 'filter', 'look']
        },
        {
            id: 'import',
            icon: '📥',
            label: 'Import bookmarks',
            shortcut: 'I',
            action: () => console.log('Import'),
            category: 'Quick Actions',
            keywords: ['upload', 'transfer', 'migrate']
        },
        {
            id: 'export',
            icon: '📤',
            label: 'Export links',
            shortcut: 'E',
            action: () => console.log('Export'),
            category: 'Quick Actions',
            keywords: ['download', 'backup', 'save']
        },
        {
            id: 'settings',
            icon: '⚙️',
            label: 'Settings',
            shortcut: ',',
            action: () => onNavigate('/dashboard/settings'),
            category: 'Navigation',
            keywords: ['preferences', 'config', 'options']
        },
        {
            id: 'profile',
            icon: '👤',
            label: 'Profile',
            shortcut: 'P',
            action: () => onNavigate('/dashboard/profile'),
            category: 'Navigation',
            keywords: ['account', 'user', 'me']
        },
        {
            id: 'help',
            icon: '❓',
            label: 'Help & Support',
            shortcut: '?',
            action: () => window.open('/help', '_blank'),
            category: 'Help',
            keywords: ['support', 'docs', 'documentation', 'faq']
        },
    ];

    const {
        query,
        setQuery,
        selectedIndex,
        selectCommand,
        filteredCommands,
        groupedCommands,
        handleKeyDown,
        executeCommand,
        clearQuery
    } = useCommandPalette(commands, isOpen);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDownEvent = (e) => {
            handleKeyDown(e);
            
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDownEvent);
            return () => window.removeEventListener('keydown', handleKeyDownEvent);
        }
    }, [isOpen, handleKeyDown, onClose]);

    const handleCommandClick = (command, index) => {
        selectCommand(index);
        executeCommand(command);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-10 sm:pt-20"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-[calc(100%-2rem)] sm:w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-950 shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-gray-900 p-3 sm:p-4">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                        {query && (
                            <button
                                onClick={clearQuery}
                                className="text-gray-500 hover:text-gray-400 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <kbd className="text-[10px] sm:text-xs text-gray-500 font-mono">ESC</kbd>
                    </div>
                </div>

                {/* Commands List */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="h-8 w-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">No commands found</p>
                            <p className="text-xs text-gray-600 mt-1">
                                Try searching for "add", "settings", or "help"
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                            <div key={category} className="mb-4">
                                <div className="text-[10px] sm:text-xs text-gray-500 px-3 py-2 uppercase tracking-wider font-semibold">
                                    {category}
                                </div>
                                {categoryCommands.map((command, index) => {
                                    const globalIndex = filteredCommands.indexOf(command);
                                    return (
                                        <button
                                            key={command.id}
                                            onClick={() => handleCommandClick(command, globalIndex)}
                                            className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs sm:text-sm text-gray-400 hover:bg-gray-900 hover:text-white text-left transition-all ${globalIndex === selectedIndex ? 'bg-gray-900 text-white' : ''
                                                }`}
                                        >
                                            <span className="flex items-center gap-2 sm:gap-3">
                                                <span className="text-sm sm:text-base">{command.icon}</span>
                                                {command.label}
                                            </span>
                                            <kbd className="text-[10px] sm:text-xs text-gray-600 font-mono">
                                                <span className="hidden sm:inline">⌘</span>{command.shortcut}
                                            </kbd>
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                {filteredCommands.length > 0 && (
                    <div className="border-t border-gray-900 px-4 py-2">
                        <p className="text-[10px] sm:text-xs text-gray-600">
                            Use ↑↓ to navigate, Enter to select, ESC to close
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}