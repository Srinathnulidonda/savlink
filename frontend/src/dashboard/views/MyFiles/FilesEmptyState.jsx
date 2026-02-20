// src/dashboard/views/MyFiles/FilesEmptyState.jsx
import { motion } from 'framer-motion';
import EmptyState from '../../components/common/EmptyState';

export default function FilesEmptyState({ searchQuery, filters, onClearFilters }) {
    const hasActiveFilters = searchQuery || Object.values(filters).some(v => 
        Array.isArray(v) ? v.length > 0 : v !== null && v !== false
    );

    if (hasActiveFilters) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full p-8"
            >
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        No results found
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {searchQuery 
                            ? `No links match "${searchQuery}"`
                            : "No links match your current filters"
                        }
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="btn-primary"
                    >
                        Clear {searchQuery ? 'search' : 'filters'}
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <EmptyState
            icon={
                <svg className="h-16 w-16 text-gray-600 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            }
            title="No links yet"
            description="Start building your collection by adding your first link"
            actionLabel="Add Your First Link"
            onAction={() => {
                // This will be handled by the parent component
                window.dispatchEvent(new CustomEvent('openAddLink'));
            }}
        />
    );
}