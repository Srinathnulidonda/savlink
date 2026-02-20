// src/dashboard/views/Search/SearchView.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSearchData from './useSearchData';
import FilesGrid from '../MyFiles/FilesGrid';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function SearchView() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const {
        results,
        suggestions,
        stats,
        loading,
        error,
        hasMore,
        loadMore,
        updateLink,
        deleteLink
    } = useSearchData(query);

    if (!query) {
        return (
            <div className="p-6">
                <EmptyState
                    title="Start searching"
                    description="Enter a search term to find your links"
                    icon={
                        <svg className="h-16 w-16 text-gray-600 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
            </div>
        );
    }

    if (loading && !results.length) {
        return <LoadingState variant="skeleton" />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Search Header */}
            <div className="border-b border-gray-800 bg-gray-950/50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-white">
                            Search Results
                        </h1>
                        <p className="text-sm text-gray-500">
                            {results.length > 0 
                                ? `Found ${results.length} results for "${query}"`
                                : `No results found for "${query}"`
                            }
                        </p>
                    </div>
                </div>

                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-400 mb-2">
                            Related searches:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        window.location.href = `/dashboard/search?q=${encodeURIComponent(suggestion)}`;
                                    }}
                                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-hidden">
                {results.length === 0 ? (
                    <EmptyState
                        title="No results found"
                        description={`Try searching with different keywords or check your spelling`}
                        icon={
                            <svg className="h-16 w-16 text-gray-600 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                    />
                ) : (
                    <FilesGrid
                        links={results}
                        viewMode="grid"
                        selectedItems={[]}
                        onSelectionChange={() => {}}
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