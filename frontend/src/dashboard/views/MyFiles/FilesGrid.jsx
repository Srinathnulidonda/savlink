// src/dashboard/views/MyFiles/FilesGrid.jsx - Fixed
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LinkCard from '../../components/links/LinkCard';
import LoadingState from '../../components/common/LoadingState';

export default function FilesGrid({
    links,
    viewMode,
    selectedItems,
    onSelectionChange,
    onUpdateLink,
    onDeleteLink,
    hasMore,
    onLoadMore,
    loading
}) {
    const [hoveredLink, setHoveredLink] = useState(null);
    const loadMoreRef = useRef(null);

    // Simple intersection observer implementation
    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { threshold: 0 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasMore, loading, onLoadMore]);

    const handleLinkClick = useCallback((link) => {
        if (selectedItems.length > 0) {
            // If in selection mode, toggle selection
            if (selectedItems.includes(link.id)) {
                onSelectionChange(selectedItems.filter(id => id !== link.id));
            } else {
                onSelectionChange([...selectedItems, link.id]);
            }
        } else {
            // Normal click - open link
            window.open(link.original_url, '_blank', 'noopener,noreferrer');
        }
    }, [selectedItems, onSelectionChange]);

    const handleLinkSelect = useCallback((linkId, selected) => {
        if (selected) {
            onSelectionChange([...selectedItems, linkId]);
        } else {
            onSelectionChange(selectedItems.filter(id => id !== linkId));
        }
    }, [selectedItems, onSelectionChange]);

    const containerClasses = viewMode === 'grid'
        ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "space-y-3";

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className={containerClasses}>
                {links.map((link, index) => (
                    <LinkCard
                        key={link.id}
                        link={link}
                        index={index}
                        viewMode={viewMode}
                        isHovered={hoveredLink === link.id}
                        isSelected={selectedItems.includes(link.id)}
                        onHover={setHoveredLink}
                        onClick={() => handleLinkClick(link)}
                        onSelect={(selected) => handleLinkSelect(link.id, selected)}
                        onPin={() => onUpdateLink(link.id, { pinned: !link.pinned })}
                        onStar={() => onUpdateLink(link.id, { starred: !link.starred })}
                        onArchive={() => onUpdateLink(link.id, { archived: !link.archived })}
                        onDelete={() => onDeleteLink(link.id)}
                        onEdit={(updates) => onUpdateLink(link.id, updates)}
                    />
                ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={loadMoreRef} className="mt-8">
                    <LoadingState variant="minimal" />
                </div>
            )}

            {/* End of Results */}
            {!hasMore && links.length > 10 && (
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                        You've reached the end of your links
                    </p>
                </div>
            )}
        </div>
    );
}