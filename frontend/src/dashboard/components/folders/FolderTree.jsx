// src/dashboard/components/folders/FolderTree.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FolderItem from './FolderItem';

export default function FolderTree({ 
    folders, 
    activeFolder, 
    onFolderSelect, 
    onEditFolder, 
    onDeleteFolder 
}) {
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const toggleExpanded = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    const buildTree = (folders, parentId = null, depth = 0) => {
        return folders
            .filter(folder => folder.parent_id === parentId)
            .map(folder => {
                const hasChildren = folders.some(f => f.parent_id === folder.id);
                const isExpanded = expandedFolders.has(folder.id);

                return (
                    <div key={folder.id}>
                        <div className="flex items-center" style={{ paddingLeft: `${depth * 12}px` }}>
                            {hasChildren && (
                                <button
                                    onClick={() => toggleExpanded(folder.id)}
                                    className="mr-1 p-0.5 text-gray-500 hover:text-white transition-colors"
                                >
                                    <motion.svg
                                        animate={{ rotate: isExpanded ? 90 : 0 }}
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                </button>
                            )}
                            <div className="flex-1">
                                <FolderItem
                                    folder={folder}
                                    isActive={activeFolder === folder.id}
                                    onClick={() => onFolderSelect(folder.id)}
                                    onEdit={onEditFolder}
                                    onDelete={onDeleteFolder}
                                    depth={depth}
                                />
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {hasChildren && isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    {buildTree(folders, folder.id, depth + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            });
    };

    return (
        <div className="space-y-1">
            {buildTree(folders)}
        </div>
    );
}