// src/dashboard/layout/DashboardLayout.jsx

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileShell from './MobileShell';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import { ContextMenuProvider } from '../components/common/ContextMenu';

export default function DashboardLayout({
    user,
    stats,
    activeView,
    onViewChange,
    onSearch,
    searchQuery,
    onAddLink,
    onOpenCommandPalette,
    viewMode,
    onViewModeChange,
    children,
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Folders — now carry both `pinned` and `starred` ─────
    const [folders, setFolders] = useState([
        { id: 1, name: 'Engineering', emoji: '⚡', pinned: true,  starred: false, lastOpened: Date.now() - 1000 * 60 * 5 },
        { id: 2, name: 'Design',      emoji: '🎨', pinned: true,  starred: true,  lastOpened: Date.now() - 1000 * 60 * 30 },
        { id: 3, name: 'Marketing',   emoji: '📈', pinned: false, starred: false, lastOpened: Date.now() - 1000 * 60 * 60 },
        { id: 4, name: 'Docs',        emoji: '📚', pinned: false, starred: true,  lastOpened: Date.now() - 1000 * 60 * 60 * 3 },
        { id: 5, name: 'Research',    emoji: '🔬', pinned: false, starred: false, lastOpened: Date.now() - 1000 * 60 * 60 * 24 },
    ]);

    const handleTogglePin = useCallback((folderId) => {
        setFolders((prev) =>
            prev.map((f) => (f.id === folderId ? { ...f, pinned: !f.pinned } : f)),
        );
    }, []);

    const handleToggleStar = useCallback((folderId) => {
        setFolders((prev) =>
            prev.map((f) => (f.id === folderId ? { ...f, starred: !f.starred } : f)),
        );
    }, []);

    // ── Shared props for both layouts ────────────────────────
    const folderProps = {
        folders,
        onTogglePin: handleTogglePin,
        onToggleStar: handleToggleStar,
    };

    /* ── Render ──────────────────────────────────────────── */
    const content = isMobile ? (
        <MobileShell
            user={user}
            stats={stats}
            activeView={activeView}
            onViewChange={onViewChange}
            onSearch={onSearch}
            searchQuery={searchQuery}
            onAddLink={onAddLink}
            onOpenCommandPalette={onOpenCommandPalette}
            {...folderProps}
        >
            {children}
        </MobileShell>
    ) : (
        <div className="flex h-screen bg-black overflow-hidden">
            <Sidebar
                stats={stats}
                activeView={activeView}
                onViewChange={onViewChange}
                onOpenCommandPalette={onOpenCommandPalette}
                onAddLink={onAddLink}
                {...folderProps}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    user={user}
                    activeView={activeView}
                    stats={stats}
                    searchQuery={searchQuery}
                    onSearch={onSearch}
                    viewMode={viewMode}
                    onViewModeChange={onViewModeChange}
                    onAddLink={onAddLink}
                    onOpenCommandPalette={onOpenCommandPalette}
                />
                <div className="flex-1 overflow-y-auto bg-black">
                    {children}
                </div>
            </div>
        </div>
    );

    return (
        <ContextMenuProvider>
            <DashboardErrorBoundary>
                {content}
            </DashboardErrorBoundary>
        </ContextMenuProvider>
    );
}