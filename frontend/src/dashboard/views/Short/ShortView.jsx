// src/dashboard/views/Short/ShortView.jsx - New view for short links
import { useState } from 'react';
import { motion } from 'framer-motion';
import useShortData from './useShortData';
import FilesToolbar from '../MyFiles/FilesToolbar';
import FilesGrid from '../MyFiles/FilesGrid';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function ShortView() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [filters, setFilters] = useState({
        folder_id: null,
        tag_ids: [],
        starred: false,
        pinned: false,
        link_type: 'shortened' // Only show short links
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
    } = useShortData({
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
                            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No short links</h3>
                        <p className="text-gray-400 mb-6 max-w-md">Create short, shareable links that are perfect for social media and messaging</p>
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