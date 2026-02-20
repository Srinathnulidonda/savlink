// src/dashboard/components/folders/FolderItem.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import FolderIcon from './FolderIcon';

export default function FolderItem({ 
    folder, 
    isActive, 
    onClick, 
    onEdit, 
    onDelete,
    depth = 0 
}) {
    const [showActions, setShowActions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group relative ${depth > 0 ? 'ml-4' : ''}`}
        >
            <button
                onClick={onClick}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
            >
                <FolderIcon 
                    icon={folder.icon} 
                    color={folder.color}
                    size="sm"
                />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className="text-xs text-gray-500">{folder.count || 0}</span>
                
                {showActions && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(folder);
                            }}
                            className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(folder);
                            }}
                            className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </button>
        </motion.div>
    );
}