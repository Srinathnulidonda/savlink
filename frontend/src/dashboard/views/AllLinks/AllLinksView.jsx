// src/dashboard/views/AllLinks/AllLinksView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import useAllLinksData from './useAllLinksData';
import FilesToolbar from '../MyFiles/FilesToolbar';
import FilesGrid from '../MyFiles/FilesGrid';
import FilesEmptyState from '../MyFiles/FilesEmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function AllLinksView() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [filters, setFilters] = useState({
        folder_id: null,
        tag_ids: [],
        starred: false,
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
    } = useAllLinksData({
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
                    <FilesEmptyState
                        searchQuery={searchQuery}
                        filters={filters}
                        onClearFilters={() => {
                            setSearchQuery('');
                            setFilters({
                                folder_id: null,
                                tag_ids: [],
                                starred: false,
                                pinned: false,
                                link_type: null
                            });
                        }}
                    />
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