// src/dashboard/pages/myfiles/MyFiles.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextMenuProvider } from '../../components/common/ContextMenu';
import { useMyFiles } from './useMyFiles';
import MyFilesHeader from './MyFilesHeader';
import MyFilesToolbar from './MyFilesToolbar';
import MyFilesEmpty from './MyFilesEmpty';
import FolderTreePanel from './FolderTreePanel';
import LinkCard from '../../components/links/LinkCard';
import LinkDetails from '../../components/links/LinkDetails';
import LinkSkeleton from '../../components/links/LinkSkeleton';
import FoldersService from '../../../services/folders.service';
import { BOTTOM_NAV_HEIGHT } from '../../components/common/MobileBottomNav';
import toast from 'react-hot-toast';

function displayIcon(icon) {
  if (!icon) return '📁';
  return icon.length <= 2 ? icon : '📁';
}

export default function MyFiles({ onAddLink, onCreateFolder }) {
  const navigate = useNavigate();
  const {
    folders, links, meta, stats, loading, linksLoading,
    searchQuery, setSearchQuery, sortBy, setSortBy, sortOrder, setSortOrder,
    typeFilter, setTypeFilter, tagFilter, setTagFilter,
    loadMore, refresh, updateLink, deleteLink, pinLink, starLink, archiveLink,
    deleteFolder, bulkDelete, bulkArchive, bulkMove,
  } = useMyFiles();

  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem('savlink_myfiles_view') || 'list'; } catch { return 'list'; }
  });
  const [treeOpen, setTreeOpen] = useState(() => {
    try { return localStorage.getItem('savlink_tree_open') !== 'false'; } catch { return true; }
  });
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    try { localStorage.setItem('savlink_myfiles_view', mode); } catch {}
  }, []);

  const handleToggleTree = useCallback(() => {
    setTreeOpen(prev => {
      const next = !prev;
      try { localStorage.setItem('savlink_tree_open', String(next)); } catch {}
      return next;
    });
  }, []);

  const isSelectMode = selectedIds.size > 0;

  const toggleSelect = useCallback((id, e) => {
    e?.stopPropagation?.();
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleSelectById = useCallback((id) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(prev => prev.size === links.length ? new Set() : new Set(links.map(l => l.id)));
  }, [links]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleBulkDelete = useCallback(async () => {
    const ok = await bulkDelete([...selectedIds]);
    if (ok) clearSelection();
  }, [selectedIds, bulkDelete, clearSelection]);

  const handleBulkArchive = useCallback(async () => {
    const ok = await bulkArchive([...selectedIds]);
    if (ok) clearSelection();
  }, [selectedIds, bulkArchive, clearSelection]);

  const handleBulkMove = useCallback(async (folderId) => {
    const ok = await bulkMove([...selectedIds], folderId);
    if (ok) clearSelection();
  }, [selectedIds, bulkMove, clearSelection]);

  const openDetails = useCallback((link) => {
    if (isSelectMode) { toggleSelectById(link.id); return; }
    setSelectedLink(prev => prev?.id === link.id ? null : link);
  }, [isSelectMode, toggleSelectById]);

  const closeDetails = useCallback(() => setSelectedLink(null), []);

  const handleSortChange = useCallback((by, order) => { setSortBy(by); setSortOrder(order); }, [setSortBy, setSortOrder]);

  const clearFilters = useCallback(() => {
    setSearchQuery(''); setTypeFilter(''); setTagFilter([]);
  }, [setSearchQuery, setTypeFilter, setTagFilter]);

  const hasFilters = typeFilter || tagFilter.length > 0;
  const isEmpty = !loading && folders.length === 0 && links.length === 0;

  useEffect(() => {
    if (isMobile && selectedLink) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, selectedLink]);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowDown': case 'j': e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, links.length - 1)); break;
        case 'ArrowUp': case 'k': e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); break;
        case 'Enter': if (focusedIndex >= 0 && links[focusedIndex]) openDetails(links[focusedIndex]); break;
        case 'x': if (focusedIndex >= 0 && links[focusedIndex]) toggleSelectById(links[focusedIndex].id); break;
        case 'Escape': if (selectedIds.size > 0) clearSelection(); else if (selectedLink) closeDetails(); break;
        case 'a': if (e.metaKey || e.ctrlKey) { e.preventDefault(); selectAll(); } break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMobile, focusedIndex, links, selectedIds, selectedLink, openDetails, toggleSelectById, clearSelection, selectAll, closeDetails]);

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 min-w-0">
          <div className={`${isMobile ? 'px-4 pt-3 pb-3' : 'px-6 pt-5 pb-4'} border-b border-white/[0.05]`}>
            <div className="space-y-3">
              <div className="h-6 w-28 bg-white/[0.04] rounded animate-pulse" />
              <div className="h-3 w-40 bg-white/[0.04] rounded animate-pulse" />
              <div className="h-8 w-full max-w-sm bg-white/[0.04] rounded-lg animate-pulse" />
            </div>
          </div>
          <div className={`${isMobile ? 'p-3' : 'p-6'}`}><LinkSkeleton viewMode={viewMode} /></div>
        </div>
      </div>
    );
  }

  return (
    <ContextMenuProvider>
      <div className="flex h-full overflow-hidden">
        <AnimatePresence>
          {!isMobile && <FolderTreePanel isOpen={treeOpen} onClose={handleToggleTree} />}
        </AnimatePresence>

        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <MyFilesHeader
            stats={stats} searchQuery={searchQuery} onSearch={setSearchQuery}
            sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange}
            typeFilter={typeFilter} onTypeChange={setTypeFilter}
            tagFilter={tagFilter} onTagChange={setTagFilter}
            viewMode={viewMode} onViewModeChange={handleViewModeChange}
            onAddLink={onAddLink} onCreateFolder={() => onCreateFolder?.()}
            onToggleTree={handleToggleTree} treeOpen={treeOpen} isMobile={isMobile}
          />

          <AnimatePresence>
            {isSelectMode && (
              <MyFilesToolbar
                selectedCount={selectedIds.size} totalCount={links.length}
                onSelectAll={selectAll} onClearSelection={clearSelection}
                onBulkDelete={handleBulkDelete} onBulkArchive={handleBulkArchive}
                onBulkMove={handleBulkMove} isMobile={isMobile}
              />
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto overscroll-contain"
            style={isMobile ? { paddingBottom: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 8px)` } : undefined}>
            {isEmpty ? (
              <MyFilesEmpty searchQuery={searchQuery} hasFilters={hasFilters}
                onAddLink={onAddLink} onCreateFolder={() => onCreateFolder?.()}
                onClearFilters={clearFilters} />
            ) : (
              <>
                {folders.length > 0 && (
                  <div className={`${isMobile ? 'px-3 pt-3' : 'px-6 pt-5'}`}>
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Folders <span className="text-gray-700 font-normal ml-1">{folders.length}</span>
                    </h3>
                    <div className={viewMode === 'grid'
                      ? `grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'} mb-4`
                      : 'space-y-0.5 mb-4'}>
                      {folders.map((folder, i) => (
                        <FolderItem key={folder.id} folder={folder} viewMode={viewMode}
                          index={i} navigate={navigate} isMobile={isMobile}
                          onDelete={() => deleteFolder(folder.id)}
                          onTogglePin={async () => {
                            const r = await FoldersService.togglePin(folder.id);
                            if (r.success) { toast.success(folder.pinned ? 'Unpinned' : 'Pinned'); refresh(); }
                          }}
                        />
                      ))}
                    </div>
                    {links.length > 0 && <div className="border-t border-white/[0.04] mb-3" />}
                  </div>
                )}

                {links.length > 0 && (
                  <div className={folders.length === 0 ? (isMobile ? 'px-3 pt-3' : 'px-6 pt-5') : (isMobile ? 'px-3' : 'px-6')}>
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Links <span className="text-gray-700 font-normal ml-1">{meta.total ?? links.length}</span>
                    </h3>
                    <div className={viewMode === 'grid'
                      ? `grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`
                      : 'space-y-0.5'}
                      role="listbox">
                      <AnimatePresence mode="popLayout">
                        {links.map((link, index) => (
                          <LinkCard key={link.id} link={link} index={index} viewMode={viewMode}
                            isSelected={selectedIds.has(link.id)}
                            isActive={selectedLink?.id === link.id}
                            isFocused={focusedIndex === index}
                            isSelectMode={isSelectMode}
                            onClick={() => openDetails(link)}
                            onSelect={(e) => toggleSelect(link.id, e)}
                            onSelectById={toggleSelectById}
                            onPin={() => pinLink(link.id)}
                            onStar={() => starLink(link.id)}
                            onArchive={() => archiveLink(link.id)}
                            onDelete={() => deleteLink(link.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {meta.has_more && (
                      <div className="flex justify-center py-5">
                        <button onClick={loadMore} disabled={linksLoading}
                          className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-lg transition-colors disabled:opacity-50 touch-manipulation">
                          {linksLoading
                            ? <><div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" /> Loading…</>
                            : 'Load more'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className={isMobile ? 'h-4' : 'h-8'} />
              </>
            )}

            {linksLoading && links.length === 0 && folders.length === 0 && (
              <div className={isMobile ? 'p-3' : 'p-6'}><LinkSkeleton viewMode={viewMode} /></div>
            )}
          </div>

          {/* Status bar - desktop only */}
          {!isMobile && (
            <div className="flex-shrink-0 px-6 py-2 border-t border-white/[0.04] bg-[#09090b]/80">
              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span>
                  {folders.length} {folders.length === 1 ? 'folder' : 'folders'} · {meta.total ?? links.length} links
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <span>{selectedIds.size > 0 && `${selectedIds.size} selected · `}{viewMode === 'list' ? 'List' : 'Grid'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop details panel */}
        <AnimatePresence>
          {selectedLink && !isMobile && (
            <LinkDetails link={selectedLink} onClose={closeDetails}
              onUpdate={updateLink}
              onDelete={(id) => { deleteLink(id); closeDetails(); }}
              onPin={() => pinLink(selectedLink.id)}
              onStar={() => starLink(selectedLink.id)}
              onArchive={() => archiveLink(selectedLink.id)} />
          )}
        </AnimatePresence>

        {/* Mobile bottom sheet */}
        <AnimatePresence>
          {selectedLink && isMobile && (
            <MobileDetailSheet link={selectedLink} onClose={closeDetails}
              onPin={() => pinLink(selectedLink.id)}
              onStar={() => starLink(selectedLink.id)}
              onArchive={() => { archiveLink(selectedLink.id); closeDetails(); }}
              onDelete={() => { deleteLink(selectedLink.id); closeDetails(); }} />
          )}
        </AnimatePresence>
      </div>
    </ContextMenuProvider>
  );
}

function FolderItem({ folder, viewMode, index, navigate, isMobile, onDelete, onTogglePin }) {
  const color = folder.color || '#6B7280';

  if (viewMode === 'list') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }}
        onClick={() => navigate(`/dashboard/my-files/${folder.slug}`)}
        className={`group flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors touch-manipulation
          ${isMobile ? 'px-2.5 py-2.5' : 'px-3 py-2.5'}`}>
        <div className={`rounded-lg flex items-center justify-center flex-shrink-0
          ${isMobile ? 'w-9 h-9 text-base' : 'w-8 h-8 text-sm'}`}
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          {displayIcon(folder.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-gray-300 truncate group-hover:text-white transition-colors
            ${isMobile ? 'text-[14px]' : 'text-[13px]'}`}>{folder.name}</p>
          {isMobile && <p className="text-[11px] text-gray-600 mt-0.5">{folder.link_count ?? 0} items</p>}
        </div>
        {!isMobile && (
          <>
            <span className="text-[11px] text-gray-600 tabular-nums hidden sm:block">{folder.link_count ?? 0} items</span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                className={`p-1 rounded transition-colors ${folder.pinned ? 'text-primary' : 'text-gray-600 hover:text-gray-400'}`}>
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.146.146A.5.5 0 014.5 0h7a.5.5 0 01.5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 01-.5.5h-4v4.5a.5.5 0 01-1 0V10h-4A.5.5 0 013 9.5c0-.973.64-1.725 1.17-2.189A5.92 5.92 0 015 6.708V2.277a2.77 2.77 0 01-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 01.146-.354z" />
                </svg>
              </button>
            </div>
          </>
        )}
        {isMobile && folder.pinned && (
          <svg className="w-3 h-3 text-primary/60 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.146.146A.5.5 0 014.5 0h7a.5.5 0 01.5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 01-.5.5h-4v4.5a.5.5 0 01-1 0V10h-4A.5.5 0 013 9.5c0-.973.64-1.725 1.17-2.189A5.92 5.92 0 015 6.708V2.277a2.77 2.77 0 01-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 01.146-.354z" />
          </svg>
        )}
        <svg className={`w-4 h-4 text-gray-700 flex-shrink-0 ${isMobile ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.button initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => navigate(`/dashboard/my-files/${folder.slug}`)}
      className={`flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all text-left group active:scale-[0.98] touch-manipulation
        ${isMobile ? 'px-3 py-3' : 'px-3 py-3'}`}>
      <div className={`rounded-lg flex items-center justify-center flex-shrink-0
        ${isMobile ? 'w-10 h-10 text-lg' : 'w-9 h-9 text-base'}`}
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
        {displayIcon(folder.icon)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-medium text-gray-300 truncate group-hover:text-white transition-colors
          ${isMobile ? 'text-[14px]' : 'text-[13px]'}`}>{folder.name}</p>
        <p className={`text-gray-600 ${isMobile ? 'text-[11px]' : 'text-[10px]'}`}>{folder.link_count ?? 0} items</p>
      </div>
      {folder.pinned && (
        <svg className="w-3 h-3 text-primary/60 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.146.146A.5.5 0 014.5 0h7a.5.5 0 01.5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 01-.5.5h-4v4.5a.5.5 0 01-1 0V10h-4A.5.5 0 013 9.5c0-.973.64-1.725 1.17-2.189A5.92 5.92 0 015 6.708V2.277a2.77 2.77 0 01-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 01.146-.354z" />
        </svg>
      )}
    </motion.button>
  );
}

function MobileDetailSheet({ link, onClose, onPin, onStar, onArchive, onDelete }) {
  const domain = link.domain || '';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 380 }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 300) onClose(); }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/[0.08] rounded-t-2xl overflow-hidden max-h-[75vh]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-1 rounded-full bg-white/[0.15]" /></div>
        <div className="px-5 pt-2 pb-3">
          <h2 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">{link.title || 'Untitled'}</h2>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{domain}</p>
        </div>
        <div className="px-5 pb-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <SheetBtn onClick={() => window.open(link.original_url, '_blank', 'noopener')} primary>Open link</SheetBtn>
            <SheetBtn onClick={async () => { try { await navigator.clipboard.writeText(link.original_url); toast.success('Copied'); } catch {} }}>Copy URL</SheetBtn>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <SheetBtn onClick={onStar} active={link.starred}>{link.starred ? '★ Unstar' : '☆ Star'}</SheetBtn>
            <SheetBtn onClick={onPin} active={link.pinned}>{link.pinned ? 'Unpin' : 'Pin'}</SheetBtn>
          </div>
          <SheetBtn onClick={onArchive}>{link.archived ? 'Restore' : 'Archive'}</SheetBtn>
          <button onClick={() => { if (window.confirm('Delete this link?')) onDelete?.(); }}
            className="w-full py-2.5 text-[12px] font-medium text-gray-600 hover:text-red-400 rounded-xl transition-colors touch-manipulation">
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}

function SheetBtn({ onClick, primary, active, children }) {
  return (
    <button onClick={onClick}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium transition-colors touch-manipulation active:scale-[0.97]
        ${primary ? 'bg-primary text-white' : active ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/[0.03] text-gray-300 border border-white/[0.06]'}`}>
      {children}
    </button>
  );
}