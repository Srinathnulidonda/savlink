// src/dashboard/layout/DashboardLayout.jsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileShell from './MobileShell';
import DashboardErrorBoundary from './DashboardErrorBoundary';

export default function DashboardLayout({
    user,
    stats,
    activeView,
    onViewChange,
    onSearch,
    searchQuery,
    onAddLink,
    onOpenCommandPalette,
    viewMode,            // ✅ From parent
    onViewModeChange,    // ✅ From parent
    children,
}) {
    const [activeCollection, setActiveCollection] = useState(null);
    const [collections, setCollections] = useState([
        { id: 1, name: 'Engineering', color: 'from-blue-600 to-blue-500', count: 432, emoji: '⚡' },
        { id: 2, name: 'Design', color: 'from-purple-600 to-purple-500', count: 234, emoji: '🎨' },
        { id: 3, name: 'Marketing', color: 'from-green-600 to-green-500', count: 156, emoji: '📈' },
        { id: 4, name: 'Docs', color: 'from-amber-600 to-amber-500', count: 89, emoji: '📚' },
        { id: 5, name: 'Research', color: 'from-red-600 to-red-500', count: 67, emoji: '🔬' },
    ]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleCreateCollection = async (data) => {
        const newCollection = {
            id: Date.now(),
            name: data.name,
            emoji: data.emoji,
            color: data.color || 'from-blue-600 to-blue-500',
            count: 0,
        };
        setCollections(prev => [...prev, newCollection]);
    };

    if (isMobile) {
        return (
            <DashboardErrorBoundary>
                <MobileShell
                    user={user}
                    stats={stats}
                    activeView={activeView}
                    onViewChange={onViewChange}
                    onSearch={onSearch}
                    searchQuery={searchQuery}
                    onAddLink={onAddLink}
                    onOpenCommandPalette={onOpenCommandPalette}
                    collections={collections}
                    activeCollection={activeCollection}
                    onCollectionChange={setActiveCollection}
                    onCreateCollection={handleCreateCollection}
                >
                    {children}
                </MobileShell>
            </DashboardErrorBoundary>
        );
    }

    return (
        <DashboardErrorBoundary>
            <div className="flex h-screen bg-black overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    stats={stats}
                    activeView={activeView}
                    onViewChange={onViewChange}
                    collections={collections}
                    activeCollection={activeCollection}
                    onCollectionChange={setActiveCollection}
                    onOpenCommandPalette={onOpenCommandPalette}
                    onAddLink={onAddLink}
                    onCreateCollection={handleCreateCollection}
                />

                {/* Main area */}
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
        </DashboardErrorBoundary>
    );
}