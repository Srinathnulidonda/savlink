// src/dashboard/pages/starred/StarredPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContextMenuProvider } from '../../components/common/ContextMenu';
import { useStarredLinks } from './useStarredLinks';
import StarredHeader from '../starred/components/StarredHeader';
import StarredEmpty from '../starred/components/StarredEmpty';
import MobileSelectionBar from '../../components/mobile/MobileSelectionBar';
import LinkCard from '../../components/links/LinkCard';
import LinkDetails from '../../components/links/LinkDetails';
import LinksToolbar from '../../components/links/LinksToolbar';
import LinkSkeleton from '../../components/links/LinkSkeleton';
import MobileLinkSheet from '../../components/links/MobileLinkSheet';
import LinksService from '../../../services/links.service';
import { BOTTOM_NAV_HEIGHT } from '../../components/common/MobileBottomNav';
import toast from 'react-hot-toast';

function haptic(ms = 50) {
  try { navigator?.vibrate?.(ms); } catch {}
}

export default function StarredPage({
  searchQuery: externalSearchQuery,
  onSearch: externalOnSearch,
  viewMode: externalViewMode,
  onViewModeChange: externalOnViewModeChange,
}) {
  const {
    links, meta, loading, linksLoading,
    searchQuery: localSearchQuery, setSearchQuery: setLocalSearchQuery,
    sortBy, setSortBy, sortOrder, setSortOrder,
    loadMore, refresh, updateLink, deleteLink,
    pinLink, starLink, archiveLink,
    bulkDelete, bulkArchive,
  } = useStarredLinks();

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearchQuery;
  const setSearchQuery = externalOnSearch || setLocalSearchQuery;

  const [localViewMode, setLocalViewMode] = useState(() => {
    try { return localStorage.getItem('savlink_starred_view') || 'list'; } catch { return 'list'; }
  });

  const viewMode = externalViewMode !== undefined ? externalViewMode : localViewMode;
  const handleViewModeChange = externalOnViewModeChange || ((mode) => {
    setLocalViewMode(mode);
    try { localStorage.setItem('savlink_starred_view', mode); } catch {}
  });

  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSelectMode, setMobileSelectMode] = useState(false);

  const lpTimerRef = useRef(null);
  const lpPosRef = useRef(null);
  const lpFiredRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile && mobileSelectMode && selectedIds.size === 0) setMobileSelectMode(false);
  }, [isMobile, mobileSelectMode, selectedIds.size]);

  useEffect(() => {
    if (isMobile && selectedLink && !mobileSelectMode) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, selectedLink, mobileSelectMode]);

  useEffect(() => () => clearTimeout(lpTimerRef.current), []);

  const startLongPress = useCallback((e, id) => {
    if (!isMobile) return;
    lpFiredRef.current = false;
    const touch = e.touches?.[0];
    lpPosRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    lpTimerRef.current = setTimeout(() => {
      lpFiredRef.current = true;
      haptic(50);
      setMobileSelectMode(true);
      setSelectedIds(new Set([id]));
      setSelectedLink(null);
    }, 500);
  }, [isMobile]);

  const moveLongPress = useCallback((e) => {
    if (!lpPosRef.current) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    if (Math.abs(touch.clientX - lpPosRef.current.x) > 10 ||
      Math.abs(touch.clientY - lpPosRef.current.y) > 10) {
      clearTimeout(lpTimerRef.current);
      lpPosRef.current = null;
    }
  }, []);

  const endLongPress = useCallback(() => {
    clearTimeout(lpTimerRef.current);
    lpPosRef.current = null;
  }, []);

  const wasLongPress = useCallback(() => {
    if (lpFiredRef.current) { lpFiredRef.current = false; return true; }
    return false;
  }, []);

  const isSelectMode = mobileSelectMode || selectedIds.size > 0;

  const toggleSelectById = useCallback((id) => {
    haptic(4);
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleSelect = useCallback((id, e) => {
    e?.stopPropagation?.();
    toggleSelectById(id);
  }, [toggleSelectById]);

  const selectAll = useCallback(() => {
    setSelectedIds(prev => prev.size === links.length ? new Set() : new Set(links.map(l => l.id)));
  }, [links]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const exitSelectionMode = useCallback(() => {
    setMobileSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleMobileDelete = useCallback(async () => {
    const ids = [...selectedIds];
    if (!window.confirm(`Delete ${ids.length} link${ids.length > 1 ? 's' : ''}?`)) return;
    const r = await LinksService.bulkDelete(ids);
    if (r?.success) { toast.success(`${ids.length} deleted`); refresh(); }
    exitSelectionMode();
  }, [selectedIds, refresh, exitSelectionMode]);

  const handleMobileArchive = useCallback(async () => {
    const ids = [...selectedIds];
    const r = await LinksService.bulkArchive(ids);
    if (r?.success) { toast.success(`${ids.length} archived`); refresh(); }
    exitSelectionMode();
  }, [selectedIds, refresh, exitSelectionMode]);

  const handleMobileMove = useCallback(async (folderId) => {
    const ids = [...selectedIds];
    let moved = 0;
    for (const id of ids) {
      const r = await LinksService.moveToFolder(id, folderId);
      if (r?.success) moved++;
    }
    if (moved > 0) { toast.success(`${moved} moved`); refresh(); }
    exitSelectionMode();
  }, [selectedIds, refresh, exitSelectionMode]);

  const handleMobileStar = useCallback(async () => {
    for (const id of selectedIds) await starLink(id);
    exitSelectionMode();
  }, [selectedIds, starLink, exitSelectionMode]);

  const handleMobilePin = useCallback(async () => {
    for (const id of selectedIds) await pinLink(id);
    exitSelectionMode();
  }, [selectedIds, pinLink, exitSelectionMode]);

  const handleMobileCopyLinks = useCallback(async () => {
    const urls = [...selectedIds]
      .map(id => links.find(l => l.id === id))
      .filter(Boolean)
      .map(l => l.original_url)
      .join('\n');
    if (!urls) { exitSelectionMode(); return; }
    try { await navigator.clipboard.writeText(urls); toast.success('URLs copied'); }
    catch { toast.error('Copy failed'); }
    exitSelectionMode();
  }, [selectedIds, links, exitSelectionMode]);

  const handleMobileCopyMarkdown = useCallback(async () => {
    const md = [...selectedIds]
      .map(id => links.find(l => l.id === id))
      .filter(Boolean)
      .map(l => `[${l.title || l.original_url}](${l.original_url})`)
      .join('\n');
    if (!md) { exitSelectionMode(); return; }
    try { await navigator.clipboard.writeText(md); toast.success('Markdown copied'); }
    catch { toast.error('Copy failed'); }
    exitSelectionMode();
  }, [selectedIds, links, exitSelectionMode]);

  const handleMobileOpenLinks = useCallback(() => {
    [...selectedIds]
      .map(id => links.find(l => l.id === id))
      .filter(Boolean)
      .forEach(l => window.open(l.original_url, '_blank', 'noopener,noreferrer'));
    exitSelectionMode();
  }, [selectedIds, links, exitSelectionMode]);

  const handleBulkDelete = useCallback(async () => {
    const ok = await bulkDelete([...selectedIds]);
    if (ok) clearSelection();
  }, [selectedIds, bulkDelete, clearSelection]);

  const handleBulkArchive = useCallback(async () => {
    const ok = await bulkArchive([...selectedIds]);
    if (ok) clearSelection();
  }, [selectedIds, bulkArchive, clearSelection]);

  const openDetails = useCallback((link) => {
    if (mobileSelectMode) { toggleSelectById(link.id); return; }
    if (isSelectMode && !isMobile) { toggleSelectById(link.id); return; }
    setSelectedLink(prev => prev?.id === link.id ? null : link);
  }, [mobileSelectMode, isSelectMode, isMobile, toggleSelectById]);

  const closeDetails = useCallback(() => setSelectedLink(null), []);

  const handleLinkClick = useCallback((link) => {
    if (wasLongPress()) return;
    openDetails(link);
  }, [wasLongPress, openDetails]);

  const handleSortChange = useCallback((by, order) => {
    setSortBy(by); setSortOrder(order);
  }, [setSortBy, setSortOrder]);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowDown': case 'j':
          e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, links.length - 1)); break;
        case 'ArrowUp': case 'k':
          e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); break;
        case 'Enter':
          if (focusedIndex >= 0 && links[focusedIndex]) openDetails(links[focusedIndex]); break;
        case 'x':
          if (focusedIndex >= 0 && links[focusedIndex]) toggleSelectById(links[focusedIndex].id); break;
        case 'Escape':
          if (selectedIds.size > 0) clearSelection();
          else if (selectedLink) closeDetails(); break;
        case 'a':
          if (e.metaKey || e.ctrlKey) { e.preventDefault(); selectAll(); } break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMobile, focusedIndex, links, selectedIds, selectedLink,
    openDetails, toggleSelectById, clearSelection, selectAll, closeDetails]);

  if (loading && links.length === 0) {
    return (
      <div className="flex h-full">
        <div className="flex-1 min-w-0">
          <div className={isMobile ? 'p-3' : 'px-6 pt-5 pb-4 border-b border-white/[0.05]'}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-white/[0.04] rounded animate-pulse" />
                  <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
                </div>
              </div>
              {!isMobile && <div className="h-8 w-full max-w-sm bg-white/[0.04] rounded-lg animate-pulse" />}
            </div>
          </div>
          <div className={isMobile ? 'p-3' : 'p-6'}>
            <LinkSkeleton viewMode={viewMode} />
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !loading && links.length === 0;

  return (
    <ContextMenuProvider>
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

          <AnimatePresence>
            {isMobile && mobileSelectMode && (
              <MobileSelectionBar
                selectedCount={selectedIds.size}
                onClose={exitSelectionMode}
                onMove={handleMobileMove}
                onArchive={handleMobileArchive}
                onDelete={handleMobileDelete}
                onStar={handleMobileStar}
                onPin={handleMobilePin}
                onCopyLinks={handleMobileCopyLinks}
                onCopyMarkdown={handleMobileCopyMarkdown}
                onOpenLinks={handleMobileOpenLinks}
                onSelectAll={selectAll}
                hasLinks={selectedIds.size > 0}
                hasFolders={false}
                totalItems={links.length}
              />
            )}
          </AnimatePresence>

          <StarredHeader
            totalCount={meta.total ?? links.length}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            isMobile={isMobile}
          />

          {!isMobile && links.length > 0 && (
            <LinksToolbar
              totalCount={meta.total ?? links.length}
              selectedCount={selectedIds.size}
              isSelectMode={selectedIds.size > 0}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onSelectAll={selectAll}
              onClearSelection={clearSelection}
              onBulkDelete={handleBulkDelete}
              onBulkArchive={handleBulkArchive}
              searchQuery={searchQuery}
            />
          )}

          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={isMobile
              ? { paddingBottom: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 8px)` }
              : undefined}
          >
            {isEmpty ? (
              <StarredEmpty
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            ) : (
              <div className={isMobile ? 'px-3 pt-3' : 'px-6 pt-5'}>
                <div
                  className={viewMode === 'grid'
                    ? `grid gap-2 ${isMobile
                        ? 'grid-cols-1'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`
                    : 'space-y-px'}
                  role="listbox"
                >
                  <AnimatePresence mode="popLayout">
                    {links.map((link, index) => (
                      <div
                        key={link.id}
                        onTouchStart={(e) => startLongPress(e, link.id)}
                        onTouchMove={moveLongPress}
                        onTouchEnd={endLongPress}
                        onTouchCancel={endLongPress}
                        onContextMenu={(e) => { if (isMobile) e.preventDefault(); }}
                      >
                        <LinkCard
                          link={link}
                          index={index}
                          viewMode={viewMode}
                          isSelected={selectedIds.has(link.id)}
                          isActive={selectedLink?.id === link.id}
                          isFocused={focusedIndex === index}
                          isSelectMode={mobileSelectMode || (!isMobile && selectedIds.size > 0)}
                          onClick={() => handleLinkClick(link)}
                          onSelect={(e) => toggleSelect(link.id, e)}
                          onSelectById={toggleSelectById}
                          onPin={() => pinLink(link.id)}
                          onStar={() => starLink(link.id)}
                          onArchive={() => archiveLink(link.id)}
                          onDelete={() => deleteLink(link.id)}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>

                {meta.has_more && (
                  <div className="flex justify-center py-5">
                    <button onClick={loadMore} disabled={linksLoading}
                      className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium
                                 text-gray-400 bg-white/[0.03] border border-white/[0.06]
                                 hover:bg-white/[0.06] rounded-lg transition-colors
                                 disabled:opacity-50 touch-manipulation">
                      {linksLoading
                        ? <><div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-gray-300
                                            rounded-full animate-spin" /> Loading…</>
                        : 'Load more'}
                    </button>
                  </div>
                )}

                <div className={isMobile ? 'h-4' : 'h-8'} />
              </div>
            )}

            {linksLoading && links.length === 0 && (
              <div className={isMobile ? 'p-3' : 'p-6'}>
                <LinkSkeleton viewMode={viewMode} />
              </div>
            )}
          </div>

          {!isMobile && (
            <div className="flex-shrink-0 px-6 py-2 border-t border-white/[0.04] bg-[#09090b]/80">
              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span>
                  {meta.total ?? links.length} starred
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <span>
                  {selectedIds.size > 0 && `${selectedIds.size} selected · `}
                  {viewMode === 'list' ? 'List' : 'Grid'}
                </span>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedLink && !isMobile && (
            <LinkDetails
              link={selectedLink}
              onClose={closeDetails}
              onUpdate={updateLink}
              onDelete={(id) => { deleteLink(id); closeDetails(); }}
              onPin={() => pinLink(selectedLink.id)}
              onStar={() => starLink(selectedLink.id)}
              onArchive={() => archiveLink(selectedLink.id)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedLink && isMobile && !mobileSelectMode && (
            <MobileLinkSheet
              link={selectedLink}
              onClose={closeDetails}
              onPin={() => pinLink(selectedLink.id)}
              onStar={() => starLink(selectedLink.id)}
              onArchive={() => { archiveLink(selectedLink.id); closeDetails(); }}
              onDelete={() => { deleteLink(selectedLink.id); closeDetails(); }}
            />
          )}
        </AnimatePresence>
      </div>
    </ContextMenuProvider>
  );
}