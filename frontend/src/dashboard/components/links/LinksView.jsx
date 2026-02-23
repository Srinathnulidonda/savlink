// src/dashboard/components/links/LinksView.jsx

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ContextMenuProvider } from '../common/ContextMenu';
import { getDomain, getFavicon, formatUrl, timeAgo } from './LinkMeta';
import LinkCard from './LinkCard';
import LinkDetails from './LinkDetails';
import LinkSkeleton from './LinkSkeleton';
import LinksToolbar from './LinksToolbar';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import toast from 'react-hot-toast';

// ── Safe padding for curved / notched screens ───────────
const SAFE_CONTENT_STYLE = {
    paddingLeft:   'max(env(safe-area-inset-left, 0px), 0px)',
    paddingRight:  'max(env(safe-area-inset-right, 0px), 0px)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
};

export default function LinksView({
    links = [],
    view,
    searchQuery,
    viewMode = 'grid',
    onUpdateLink,
    onDeleteLink,
    onPinLink,
    onArchiveLink,
    onRefresh,
    loading = false,
    error = null,
}) {
    const [selectedLink, setSelectedLink] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [hoveredId, setHoveredId] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isMobile, setIsMobile] = useState(false);

    // ── Responsive detection ────────────────────────────
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Filter + sort ───────────────────────────────────
    const processedLinks = useMemo(() => {
        let result = [...links];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (l) =>
                    l.title?.toLowerCase().includes(q) ||
                    l.original_url?.toLowerCase().includes(q) ||
                    l.notes?.toLowerCase().includes(q) ||
                    l.tags?.some((t) => t.toLowerCase().includes(q)),
            );
        }

        result.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            if (sortBy === 'title') {
                aVal = (aVal || '').toLowerCase();
                bVal = (bVal || '').toLowerCase();
            }
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [links, searchQuery, sortBy, sortOrder]);

    const isSelectMode = selectedIds.size > 0;

    // ── Selection ───────────────────────────────────────
    const toggleSelect = useCallback((id, e) => {
        e?.stopPropagation?.();
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleSelectById = useCallback((id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds((prev) =>
            prev.size === processedLinks.length
                ? new Set()
                : new Set(processedLinks.map((l) => l.id)),
        );
    }, [processedLinks]);

    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    // ── Bulk ops ────────────────────────────────────────
    const bulkDelete = useCallback(async () => {
        if (!window.confirm(`Delete ${selectedIds.size} links?`)) return;
        for (const id of selectedIds) await onDeleteLink(id);
        clearSelection();
    }, [selectedIds, onDeleteLink, clearSelection]);

    const bulkArchive = useCallback(async () => {
        for (const id of selectedIds) await onArchiveLink(id);
        clearSelection();
    }, [selectedIds, onArchiveLink, clearSelection]);

    // ── Detail panel / sheet ────────────────────────────
    const openDetails = useCallback(
        (link) => {
            if (isSelectMode) return;
            setSelectedLink((prev) => (prev?.id === link.id ? null : link));
        },
        [isSelectMode],
    );

    const closeDetails = useCallback(() => setSelectedLink(null), []);

    // ── Keyboard nav (desktop) ──────────────────────────
    useEffect(() => {
        if (isMobile) return;

        const handler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'ArrowDown':
                case 'j':
                    e.preventDefault();
                    setFocusedIndex((i) => Math.min(i + 1, processedLinks.length - 1));
                    break;
                case 'ArrowUp':
                case 'k':
                    e.preventDefault();
                    setFocusedIndex((i) => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    if (focusedIndex >= 0) openDetails(processedLinks[focusedIndex]);
                    break;
                case 'x':
                    if (focusedIndex >= 0) toggleSelectById(processedLinks[focusedIndex].id);
                    break;
                case 'Escape':
                    if (selectedIds.size > 0) clearSelection();
                    else if (selectedLink) closeDetails();
                    break;
                case 'a':
                    if (e.metaKey || e.ctrlKey) { e.preventDefault(); selectAll(); }
                    break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [
        isMobile, focusedIndex, processedLinks, selectedIds,
        selectedLink, openDetails, toggleSelectById, clearSelection,
        selectAll, closeDetails,
    ]);

    useEffect(() => { setFocusedIndex(-1); }, [view, searchQuery]);

    // Lock body scroll when mobile sheet is open
    useEffect(() => {
        if (isMobile && selectedLink) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobile, selectedLink]);

    // ── States ──────────────────────────────────────────
    if (error) {
        return (
            <div className="h-full flex items-center justify-center p-4 sm:p-6">
                <ErrorState
                    title="Failed to load links"
                    message={error.message || 'Something went wrong.'}
                    onRetry={onRefresh}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-2.5 sm:p-4 lg:p-6" style={SAFE_CONTENT_STYLE}>
                <LinkSkeleton viewMode={viewMode} />
            </div>
        );
    }

    if (processedLinks.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-4 sm:p-6">
                <EmptyState {...getEmptyProps(view, searchQuery, onRefresh)} />
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────
    return (
        <ContextMenuProvider>
            <div className="flex h-full">

                {/* ── Main column ─────────────────────────── */}
                <div className="flex-1 min-w-0 flex flex-col">

                    <LinksToolbar
                        totalCount={processedLinks.length}
                        selectedCount={selectedIds.size}
                        isSelectMode={isSelectMode}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={(by, order) => { setSortBy(by); setSortOrder(order); }}
                        onSelectAll={selectAll}
                        onClearSelection={clearSelection}
                        onBulkDelete={bulkDelete}
                        onBulkArchive={bulkArchive}
                        searchQuery={searchQuery}
                    />

                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div
                            className="p-2.5 pt-2 sm:p-4 sm:pt-3 lg:p-6 lg:pt-3"
                            style={SAFE_CONTENT_STYLE}
                        >
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'space-y-0.5'
                                }
                                role="listbox"
                                aria-label="Links"
                            >
                                <AnimatePresence mode="popLayout">
                                    {processedLinks.map((link, index) => (
                                        <LinkCard
                                            key={link.id}
                                            link={link}
                                            index={index}
                                            viewMode={viewMode}
                                            isSelected={selectedIds.has(link.id)}
                                            isActive={selectedLink?.id === link.id}
                                            isFocused={focusedIndex === index}
                                            isSelectMode={isSelectMode}
                                            onHover={setHoveredId}
                                            onClick={() => openDetails(link)}
                                            onSelect={(e) => toggleSelect(link.id, e)}
                                            onSelectById={toggleSelectById}
                                            onPin={() => onPinLink(link.id)}
                                            onArchive={() => onArchiveLink(link.id)}
                                            onDelete={() => onDeleteLink(link.id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Bottom spacer for safe area */}
                            <div className="h-4 sm:h-6" />
                        </div>
                    </div>
                </div>

                {/* ── Desktop detail panel ────────────────── */}
                <AnimatePresence>
                    {selectedLink && !isMobile && (
                        <LinkDetails
                            link={selectedLink}
                            onClose={closeDetails}
                            onUpdate={onUpdateLink}
                            onDelete={(id) => { onDeleteLink(id); closeDetails(); }}
                            onPin={() => onPinLink(selectedLink.id)}
                            onArchive={() => onArchiveLink(selectedLink.id)}
                        />
                    )}
                </AnimatePresence>

                {/* ── Mobile bottom sheet ─────────────────── */}
                <AnimatePresence>
                    {selectedLink && isMobile && (
                        <MobileLinkSheet
                            link={selectedLink}
                            onClose={closeDetails}
                            onUpdate={onUpdateLink}
                            onPin={() => onPinLink(selectedLink.id)}
                            onArchive={() => { onArchiveLink(selectedLink.id); closeDetails(); }}
                            onDelete={() => { onDeleteLink(selectedLink.id); closeDetails(); }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </ContextMenuProvider>
    );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOBILE BOTTOM SHEET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MobileLinkSheet({ link, onClose, onUpdate, onPin, onArchive, onDelete }) {
    const [faviconErr, setFaviconErr] = useState(false);

    const domain   = getDomain(link.original_url);
    const favicon  = getFavicon(link.original_url, 64);
    const time     = link.relative_time || timeAgo(link.created_at);
    const displayUrl = formatUrl(link.original_url);

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(link.short_url || link.original_url);
            toast.success('Copied');
        } catch {
            toast.error('Copy failed');
        }
    };

    const openLink = () => {
        window.open(link.original_url, '_blank', 'noopener,noreferrer');
    };

    const handleDelete = () => {
        if (window.confirm('Delete this link?')) onDelete?.();
    };

    return (
        <>
            {/* ── Backdrop ────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* ── Sheet ───────────────────────────────────── */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 380 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 80 || info.velocity.y > 300) onClose();
                }}
                className="fixed bottom-0 left-0 right-0 z-50
                           bg-[#111] border-t border-white/[0.08]
                           rounded-t-2xl overflow-hidden
                           max-h-[85vh]"
                style={{
                    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                }}
            >
                {/* ── Drag handle ─────────────────────────── */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-9 h-1 rounded-full bg-white/[0.15]" />
                </div>

                {/* ── Scrollable content ──────────────────── */}
                <div className="overflow-y-auto overscroll-contain max-h-[calc(85vh-120px)]">

                    {/* ── Link header ─────────────────────── */}
                    <div className="px-5 pt-2 pb-4">
                        <div className="flex items-start gap-3">
                            {/* Favicon */}
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06]
                                           flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                                {favicon && !faviconErr ? (
                                    <img src={favicon} alt="" className="w-6 h-6"
                                        onError={() => setFaviconErr(true)} />
                                ) : (
                                    <span className="text-sm font-bold text-gray-500 uppercase">
                                        {domain?.[0] || '?'}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <h2 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">
                                    {link.title || 'Untitled'}
                                </h2>

                                {/* Domain + time */}
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[11px] text-gray-500 truncate">
                                        {displayUrl}
                                    </span>
                                    <span className="text-[11px] text-gray-700">·</span>
                                    <span className="text-[11px] text-gray-600 flex-shrink-0 tabular-nums">
                                        {time}
                                    </span>
                                </div>

                                {/* Badges */}
                                {(link.pinned || link.archived || link.link_type === 'shortened') && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {link.pinned && (
                                            <MobileBadge color="amber">★ Starred</MobileBadge>
                                        )}
                                        {link.archived && (
                                            <MobileBadge color="gray">Archived</MobileBadge>
                                        )}
                                        {link.link_type === 'shortened' && (
                                            <MobileBadge color="blue">Short link</MobileBadge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {link.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3 ml-[52px]">
                                {link.tags.map((tag) => (
                                    <span key={tag}
                                        className="text-[11px] text-gray-300 bg-white/[0.04]
                                                   border border-white/[0.06] px-2 py-0.5 rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Notes */}
                        {link.notes && (
                            <div className="mt-3 ml-[52px]">
                                <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-3">
                                    {link.notes}
                                </p>
                            </div>
                        )}

                        {/* Stats row */}
                        {link.click_count > 0 && (
                            <div className="mt-3 ml-[52px]">
                                <span className="text-[11px] text-gray-500 tabular-nums">
                                    {link.click_count.toLocaleString()} clicks
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mx-5 border-t border-white/[0.05]" />

                    {/* ── Actions grid ─────────────────────── */}
                    <div className="px-5 py-4">
                        {/* Primary row */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <SheetAction
                                icon={<ExternalIcon />}
                                label="Open link"
                                onClick={openLink}
                                primary
                            />
                            <SheetAction
                                icon={<CopyIcon />}
                                label="Copy URL"
                                onClick={copyUrl}
                            />
                        </div>

                        {/* Secondary row */}
                        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            <SheetAction
                                icon={<StarIcon filled={link.pinned} />}
                                label={link.pinned ? 'Unstar' : 'Star'}
                                onClick={onPin}
                                active={link.pinned}
                            />
                            <SheetAction
                                icon={<ArchiveIcon />}
                                label={link.archived ? 'Restore' : 'Archive'}
                                onClick={onArchive}
                            />
                        </div>

                        {/* Markdown copy */}
                        <button
                            onClick={async () => {
                                const md = `[${link.title || link.original_url}](${link.original_url})`;
                                try {
                                    await navigator.clipboard.writeText(md);
                                    toast.success('Markdown copied');
                                } catch {
                                    toast.error('Copy failed');
                                }
                            }}
                            className="w-full mt-2.5 py-2.5 flex items-center justify-center gap-2
                                      text-[12px] text-gray-500 
                                      bg-white/[0.02] border border-white/[0.05]
                                      hover:bg-white/[0.04] active:bg-white/[0.06]
                                      rounded-xl transition-colors touch-manipulation"
                        >
                            <CodeIcon />
                            Copy as Markdown
                        </button>

                        {/* Delete */}
                        <button
                            onClick={handleDelete}
                            className="w-full mt-4 py-2.5 flex items-center justify-center gap-1.5
                                      text-[12px] font-medium text-gray-600
                                      hover:text-red-400 active:text-red-300
                                      hover:bg-red-500/[0.06] active:bg-red-500/[0.1]
                                      rounded-xl transition-colors touch-manipulation"
                        >
                            <TrashIcon />
                            Delete link
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}


// ── Sheet action button ─────────────────────────────────

function SheetAction({ icon, label, onClick, primary = false, active = false }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl
                       text-[13px] font-medium transition-colors touch-manipulation
                       active:scale-[0.97] transform
                       ${primary
                    ? 'bg-primary text-white active:bg-primary-light'
                    : active
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 active:bg-amber-500/20'
                        : 'bg-white/[0.03] text-gray-300 border border-white/[0.06] active:bg-white/[0.06]'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function MobileBadge({ color, children }) {
    const colors = {
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/15',
        gray:  'bg-white/[0.04] text-gray-400 border-white/[0.06]',
        blue:  'bg-blue-500/10 text-blue-400 border-blue-500/15',
        green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
    };
    return (
        <span className={`inline-flex items-center text-[10px] font-semibold
                         px-1.5 py-px rounded border ${colors[color]}`}>
            {children}
        </span>
    );
}


// ── Empty state config ──────────────────────────────────

function getEmptyProps(view, searchQuery, onRefresh) {
    const linkIcon = (
        <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
    );

    if (searchQuery) {
        return {
            icon: (
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: 'No results',
            description: `Nothing matches "${searchQuery}"`,
        };
    }

    const config = {
        all:     { title: 'No links yet',    description: 'Save your first link to get started.', action: onRefresh, actionLabel: 'Add a link' },
        recent:  { title: 'No recent links',  description: 'Links you save will appear here.' },
        starred: { title: 'No starred links', description: 'Star links for quick access.' },
        archive: { title: 'Archive is empty', description: 'Archived links will appear here.' },
    };

    return { icon: linkIcon, ...(config[view] || config.all) };
}


// ── Icons ───────────────────────────────────────────────

function ExternalIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
    );
}

function StarIcon({ filled }) {
    return (
        <svg className={`w-4 h-4 ${filled ? 'text-amber-400' : ''}`}
            fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    );
}

function ArchiveIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function CodeIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}