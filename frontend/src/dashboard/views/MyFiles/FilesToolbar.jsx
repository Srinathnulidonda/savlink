// src/dashboard/views/MyFiles/FilesToolbar.jsx - Mobile responsive
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilesToolbar({
    viewMode,
    onViewModeChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filters,
    onFiltersChange,
    selectedItems,
    onBulkAction,
    stats,
    folders
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const sortOptions = [
        { value: 'updated_at', label: 'Last Modified' },
        { value: 'created_at', label: 'Date Added' },
        { value: 'title', label: 'Title' },
        { value: 'click_count', label: 'Most Clicked' }
    ];

    const hasActiveFilters = Object.values(filters).some(v => 
        Array.isArray(v) ? v.length > 0 : v !== null && v !== false
    );

    return (
        <div className="border-b border-gray-800 bg-gray-950/50">
            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {showMobileSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-0 left-0 right-0 z-20 bg-gray-950 border-b border-gray-800 p-4"
                    >
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search your links..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 pl-10 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                autoFocus
                            />
                            <button
                                onClick={() => setShowMobileSearch(false)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 p-1"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toolbar */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Mobile First Row */}
                <div className="flex items-center justify-between md:hidden">
                    <div className="text-sm text-gray-500">
                        {stats.total || 0} items
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowMobileSearch(true)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Mobile Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-all ${
                                hasActiveFilters
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                            </svg>
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 rounded-lg border border-gray-800 p-1">
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`rounded p-1.5 transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`rounded p-1.5 transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Row */}
                <div className="hidden md:flex items-center justify-between gap-4">
                    {/* Left: Search and Stats */}
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search your links..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => onSearchChange('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            {stats.total || 0} items
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                hasActiveFilters
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <svg className="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                            {hasActiveFilters && (
                                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                                    •
                                </span>
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 rounded-lg border border-gray-800 p-1">
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`rounded p-1.5 transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`rounded p-1.5 transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sort Row */}
                <div className="flex items-center justify-between md:hidden">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none mr-2"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedItems.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center justify-between rounded-lg bg-primary/10 border-t border-primary/20 p-3 m-3 sm:m-4"
                    >
                        <span className="text-sm font-medium text-primary">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onBulkAction('pin', selectedItems)}
                                className="rounded-md bg-primary/20 px-3 py-1 text-sm text-primary hover:bg-primary/30 transition-colors"
                            >
                                Pin
                            </button>
                            <button
                                onClick={() => onBulkAction('archive', selectedItems)}
                                className="rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => onBulkAction('delete', selectedItems)}
                                className="rounded-md bg-red-600/20 px-3 py-1 text-sm text-red-400 hover:bg-red-600/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-800 bg-gray-900/50 p-3 sm:p-4 space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Folder Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Collection
                                </label>
                                <select
                                    value={filters.folder_id || ''}
                                    onChange={(e) => onFiltersChange({
                                        ...filters,
                                        folder_id: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white"
                                >
                                    <option value="">All Collections</option>
                                    <option value="unassigned">Unassigned</option>
                                    {folders.map(folder => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.emoji} {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Link Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Type
                                </label>
                                <select
                                    value={filters.link_type || ''}
                                    onChange={(e) => onFiltersChange({
                                        ...filters,
                                        link_type: e.target.value || null
                                    })}
                                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white"
                                >
                                    <option value="">All Types</option>
                                    <option value="saved">Saved Links</option>
                                    <option value="shortened">Short Links</option>
                                </select>
                            </div>

                            {/* Status Filters */}
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Status
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.pinned}
                                            onChange={(e) => onFiltersChange({
                                                ...filters,
                                                pinned: e.target.checked
                                            })}
                                            className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">Pinned</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.starred}
                                            onChange={(e) => onFiltersChange({
                                                ...filters,
                                                starred: e.target.checked
                                            })}
                                            className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">Starred</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-1">
                                <button
                                    onClick={() => {
                                        onFiltersChange({
                                            folder_id: null,
                                            tag_ids: [],
                                            starred: false,
                                            pinned: false,
                                            link_type: null
                                        });
                                        setShowFilters(false);
                                    }}
                                    className="w-full rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}