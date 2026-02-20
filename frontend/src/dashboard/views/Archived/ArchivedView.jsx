// src/dashboard/views/Archived/ArchivedView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import useArchivedData from './useArchivedData';
import FilesToolbar from '../MyFiles/FilesToolbar';
import FilesGrid from '../MyFiles/FilesGrid';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function ArchivedView() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('archived_at');
    const [filters, setFilters] = useState({
        folder_id: null,
        tag_ids: [],
        starred: false,
        pinned: false,
        link_type: null,
        archived: true // Always filter for archived
    });

    const {
        links,
        folders,
        stats,
        loading,
        error,
        hasMore,
        loadMore,
        refreshData,
        updateLink,
        deleteLink
    } = useArchivedData({
        searchQuery,
        sortBy,
        filters
    });

    const handleBulkAction = async (action, items) => {
        try {
            switch (action) {
                case 'restore':
                    await Promise.all(items.map(id => updateLink(id, { archived: false })));
                    break;
                case 'delete':
                    await Promise.all(items.map(id => deleteLink(id)));
                    break;
            }
            setSelectedItems([]);
            refreshData();
        } catch (err) {
            console.error('Bulk action failed:', err);
        }
    };

    if (loading && !links.length) {
        return <LoadingState variant="skeleton" viewMode={viewMode} />;
    }

    if (error && !links.length) {
        return <ErrorState message={error} onRetry={refreshData} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Archive Notice */}
            <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-13 0h3m-3 0v-3m3 3v3" />
                    </svg>
                    <span>These are your archived links. You can restore or permanently delete them.</span>
                </div>
            </div>

            <FilesToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filters={filters}
                onFiltersChange={setFilters}
                selectedItems={selectedItems}
                onBulkAction={handleBulkAction}
                stats={stats}
                folders={folders}
            />

            <div className="flex-1 overflow-hidden">
                {links.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-13 0h3m-3 0v-3m3 3v3" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Archive is empty</h3>
                        <p className="text-gray-400 mb-6 max-w-md">Archived links will appear here</p>
                    </div>
                ) : (
                    <FilesGrid
                        links={links}
                        viewMode={viewMode}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        onUpdateLink={updateLink}
                        onDeleteLink={deleteLink}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                        loading={loading}
                    />
                )}
            </div>
        </motion.div>
    );
}