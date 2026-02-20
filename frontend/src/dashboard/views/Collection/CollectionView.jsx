// src/dashboard/views/Collection/CollectionView.jsx - Mobile responsive
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCollectionData from './useCollectionData';
import FilesToolbar from '../MyFiles/FilesToolbar';
import FilesGrid from '../MyFiles/FilesGrid';
import FilesEmptyState from '../MyFiles/FilesEmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function CollectionView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [filters, setFilters] = useState({
        folder_id: parseInt(id),
        tag_ids: [],
        starred: false,
        pinned: false,
        link_type: null
    });

    const {
        collection,
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
    } = useCollectionData({
        collectionId: parseInt(id),
        searchQuery,
        sortBy,
        filters
    });

    useEffect(() => {
        setFilters(prev => ({ ...prev, folder_id: parseInt(id) }));
    }, [id]);

    const handleBulkAction = async (action, items) => {
        try {
            switch (action) {
                case 'pin':
                    await Promise.all(items.map(id => updateLink(id, { pinned: true })));
                    break;
                case 'archive':
                    await Promise.all(items.map(id => updateLink(id, { archived: true })));
                    break;
                case 'move':
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

    if (error && !collection) {
        return <ErrorState message={error} onRetry={() => navigate('/dashboard')} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Collection Header */}
            {collection && (
                <div className="bg-gray-900/50 border-b border-gray-800 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800 touch-target flex-shrink-0"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-lg sm:text-xl flex-shrink-0">{collection.emoji || '📁'}</span>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-sm sm:text-lg font-semibold text-white truncate">{collection.name}</h1>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {collection.count || 0} item{collection.count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {collection.pinned && (
                                <span className="text-yellow-500 text-sm sm:text-base">⭐</span>
                            )}
                            <button className="p-1.5 text-gray-400 hover:text-white transition-colors touch-target">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                folder_id: parseInt(id),
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