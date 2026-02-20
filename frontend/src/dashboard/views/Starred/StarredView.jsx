// src/dashboard/views/Starred/StarredView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import useStarredData from './useStarredData';
import FilesToolbar from '../MyFiles/FilesToolbar';
import FilesGrid from '../MyFiles/FilesGrid';
import FilesEmptyState from '../MyFiles/FilesEmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function StarredView() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [filters, setFilters] = useState({
        folder_id: null,
        tag_ids: [],
        starred: true, // Always filter for starred
        pinned: false,
        link_type: null
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
    } = useStarredData({
        searchQuery,
        sortBy,
        filters
    });

    const handleBulkAction = async (action, items) => {
        try {
            switch (action) {
                case 'pin':
                    await Promise.all(items.map(id => updateLink(id, { pinned: true })));
                    break;
                case 'unstar':
                    await Promise.all(items.map(id => updateLink(id, { starred: false })));
                    break;
                case 'archive':
                    await Promise.all(items.map(id => updateLink(id, { archived: true })));
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
                            <svg className="h-8 w-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No starred links</h3>
                        <p className="text-gray-400 mb-6 max-w-md">Star your favorite links to see them here for quick access</p>
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