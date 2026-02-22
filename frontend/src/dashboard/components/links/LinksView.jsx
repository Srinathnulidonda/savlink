// src/dashboard/components/links/LinksView.jsx - Update the container layout

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkCard from './LinkCard';
import LinkDetails from './LinkDetails';
import LinkSkeleton from './LinkSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

export default function LinksView({
    links,
    view,
    searchQuery,
    viewMode = 'grid',
    onUpdateLink,
    onDeleteLink,
    onPinLink,
    onArchiveLink,
    onRefresh,
    loading = false,
    error = null
}) {
    const [selectedLink, setSelectedLink] = useState(null);
    const [hoveredLinkId, setHoveredLinkId] = useState(null);

    // Filter links based on search
    const filteredLinks = links.filter(link => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            link.title?.toLowerCase().includes(query) ||
            link.original_url?.toLowerCase().includes(query) ||
            link.notes?.toLowerCase().includes(query) ||
            link.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    });

    // Error state
    if (error) {
        return (
            <ErrorState
                title="Failed to load links"
                message={error.message || "We couldn't load your links. Please try again."}
                onRetry={onRefresh}
                retryLabel="Reload Links"
            />
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex h-full">
                <div className="flex-1 p-3 sm:p-4 lg:p-6">
                    <LinkSkeleton viewMode={viewMode} count={6} />
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredLinks.length === 0) {
        const getEmptyStateProps = () => {
            if (searchQuery) {
                return {
                    icon: (
                        <svg className="h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    ),
                    title: 'No results found',
                    description: `No links found matching "${searchQuery}". Try different keywords or check your spelling.`,
                    action: null,
                    actionLabel: null
                };
            }

            const viewTitles = {
                all: 'No links yet',
                recent: 'No recent links',
                starred: 'No starred links',
                archive: 'No archived links'
            };

            const viewDescriptions = {
                all: 'Start saving links to build your personal library. Click the button below to add your first link.',
                recent: 'Links you\'ve added recently will appear here.',
                starred: 'Links you\'ve starred will appear here. Star important links to find them quickly.',
                archive: 'Links you\'ve archived will appear here. Archived links are hidden from your main view.'
            };

            return {
                icon: (
                    <svg className="h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                ),
                title: viewTitles[view] || viewTitles.all,
                description: viewDescriptions[view] || viewDescriptions.all,
                action: view === 'all' ? onRefresh : null,
                actionLabel: view === 'all' ? 'Add your first link' : null
            };
        };

        return <EmptyState {...getEmptyStateProps()} />;
    }

    return (
        <div className="flex h-full">
            {/* Main content area - Takes remaining space */}
            <div className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-3 sm:p-4 lg:p-6">
                    <div className={
                        viewMode === 'grid'
                            ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "space-y-2 sm:space-y-3"
                    }>
                        <AnimatePresence mode="popLayout">
                            {filteredLinks.map((link, index) => (
                                <LinkCard
                                    key={link.id}
                                    link={link}
                                    index={index}
                                    viewMode={viewMode}
                                    isHovered={hoveredLinkId === link.id}
                                    onHover={setHoveredLinkId}
                                    onClick={() => setSelectedLink(link)}
                                    onPin={() => onPinLink(link.id)}
                                    onArchive={() => onArchiveLink(link.id)}
                                    onDelete={() => onDeleteLink(link.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Link Details Panel - Fixed width, full height */}
            <AnimatePresence>
                {selectedLink && window.innerWidth >= 768 && (
                    <LinkDetails
                        link={selectedLink}
                        onClose={() => setSelectedLink(null)}
                        onUpdate={onUpdateLink}
                        onDelete={(linkId) => {
                            onDeleteLink(linkId);
                            setSelectedLink(null); // Close panel after delete
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}