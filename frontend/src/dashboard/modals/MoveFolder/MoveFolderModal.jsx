// src/dashboard/modals/MoveFolder/MoveFolderModal.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useMoveFolder from './useMoveFolder';
import FolderTree from '../../components/folders/FolderTree';

export default function MoveFolderModal({ 
    isOpen, 
    onClose, 
    selectedItems, 
    onSuccess 
}) {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const { 
        folders, 
        loading, 
        error, 
        moveItems, 
        fetchFolders 
    } = useMoveFolder();

    useEffect(() => {
        if (isOpen) {
            fetchFolders();
        }
    }, [isOpen, fetchFolders]);

    const handleMove = async () => {
        try {
            await moveItems(selectedItems, selectedFolder);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to move items:', err);
        }
    };

    if (!isOpen) return null;

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
                className="w-full max-w-md mx-4 rounded-lg border border-gray-800 bg-gray-950 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-4">
                    <h2 className="text-lg font-semibold text-white">
                        Move {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
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

                {/* Content */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-6 w-6 rounded-full border-2 border-gray-800 border-t-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Choose destination folder:
                                </label>
                                
                                {/* Root folder option */}
                                <button
                                    onClick={() => setSelectedFolder(null)}
                                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all mb-2 ${
                                        selectedFolder === null
                                            ? 'bg-primary/10 text-primary border border-primary/20'
                                            : 'text-gray-400 hover:bg-gray-900 hover:text-white border border-gray-800'
                                    }`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    Root (No folder)
                                </button>
                            </div>

                            {/* Folder tree */}
                            {folders.length > 0 && (
                                <div className="max-h-64 overflow-y-auto border border-gray-800 rounded-lg p-2">
                                    <FolderTree
                                        folders={folders}
                                        activeFolder={selectedFolder}
                                        onFolderSelect={setSelectedFolder}
                                        onEditFolder={() => {}} // Disabled in move modal
                                        onDeleteFolder={() => {}} // Disabled in move modal
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-gray-800 p-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleMove}
                        disabled={loading}
                        className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Moving...' : 'Move Items'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}