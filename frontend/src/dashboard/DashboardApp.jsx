// src/dashboard/DashboardApp.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from './layout/DashboardLayout';
import HomePage from './pages/home/HomePage';
import MyFiles from './pages/myfiles/MyFiles';
import CollectionView from './pages/collections/CollectionView';
import AllLinksPage from './pages/alllinks/AllLinksPage';
import StarredPage from './pages/starred/StarredPage';
import RecentPage from './pages/recent/RecentPage';
import ArchivePage from './pages/archive/ArchivePage';
import AddLinkModal from './modals/AddLink/AddLinkModal';
import CreateFolderModal from './modals/CreateFolder/CreateFolderModal';
import ImportLinksModal from './modals/ImportLinks/ImportLinksModal';
import CommandPalette from './modals/CommandPalette/CommandPalette';
import { useAuth } from '../auth/context/AuthContext';
import { useOverview } from '../hooks/useOverview';
import { invalidateHome, invalidateFolders } from '../cache';
import apiService from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, refetch: refetchOverview } = useOverview();

  const [view, setView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem('savlink_view_mode') || 'list'; } catch { return 'list'; }
  });

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    try { localStorage.setItem('savlink_view_mode', mode); } catch {}
  }, []);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        setIsAddLinkOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        openCreateFolder();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setIsImportOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAddLinkOpen(false);
        setIsImportOpen(false);
        setIsCreateFolderOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const refresh = useCallback(() => {
    apiService.invalidateCache();
    invalidateHome();
    refetchOverview();
  }, [refetchOverview]);

  const openCreateFolder = useCallback((parentId = null) => {
    setCreateFolderParentId(parentId);
    setIsCreateFolderOpen(true);
  }, []);

  const handleFolderCreated = useCallback(() => {
    invalidateFolders();
    refetchOverview();
  }, [refetchOverview]);

  const handleLinkAdded = useCallback(() => {
    setIsAddLinkOpen(false);
    refresh();
  }, [refresh]);

  const handleImportDone = useCallback(() => {
    setIsImportOpen(false);
    refresh();
  }, [refresh]);

  return (
    <DashboardLayout
      user={user}
      stats={stats}
      activeView={view}
      onViewChange={setView}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
      onAddLink={() => setIsAddLinkOpen(true)}
      onCreateFolder={openCreateFolder}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/myfiles" element={
          <MyFiles
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddLink={() => setIsAddLinkOpen(true)}
            onCreateFolder={openCreateFolder}
          />
        } />

        <Route path="/myfiles/:slug" element={
          <CollectionView
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddLink={() => setIsAddLinkOpen(true)}
            onCreateFolder={openCreateFolder}
          />
        } />

        <Route path="/links/all" element={
          <AllLinksPage
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddLink={() => setIsAddLinkOpen(true)}
          />
        } />

        <Route path="/links/starred" element={
          <StarredPage
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        } />

        <Route path="/links/recent" element={
          <RecentPage
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddLink={() => setIsAddLinkOpen(true)}
          />
        } />

        <Route path="/links/archive" element={
          <ArchivePage
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        } />

        <Route path="/collections/:id" element={
          <Navigate to="/dashboard/myfiles" replace />
        } />

        <Route path="/settings" element={<div>Settings</div>} />

        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>

      <AnimatePresence>
        {isAddLinkOpen && (
          <AddLinkModal
            isOpen
            onClose={() => setIsAddLinkOpen(false)}
            onSubmit={handleLinkAdded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateFolderOpen && (
          <CreateFolderModal
            isOpen
            onClose={() => setIsCreateFolderOpen(false)}
            onCreated={handleFolderCreated}
            parentId={createFolderParentId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImportOpen && (
          <ImportLinksModal
            isOpen
            onClose={() => setIsImportOpen(false)}
            onComplete={handleImportDone}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette
            isOpen
            onClose={() => setIsCommandPaletteOpen(false)}
            onAddLink={() => {
              setIsCommandPaletteOpen(false);
              setIsAddLinkOpen(true);
            }}
            onCreateFolder={() => {
              setIsCommandPaletteOpen(false);
              openCreateFolder();
            }}
            onImport={() => {
              setIsCommandPaletteOpen(false);
              setIsImportOpen(true);
            }}
            onNavigate={(path) => {
              setIsCommandPaletteOpen(false);
              navigate(path);
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}