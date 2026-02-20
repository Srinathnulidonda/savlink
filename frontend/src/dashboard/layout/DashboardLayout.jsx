// src/dashboard/layout/DashboardLayout.jsx - Updated
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileShell from './MobileShell';
import ActivityBar from '../components/common/ActivityBar';

export default function DashboardLayout({
    user,
    stats,
    currentPage,
    onAddLink,
    onOpenCommandPalette,
    children
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCollection, setActiveCollection] = useState(null);
    const [collections, setCollections] = useState([]);

    // Detect mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load user collections
    useEffect(() => {
        const loadCollections = () => {
            const mockCollections = [
                { id: 1, name: 'Engineering', color: '#3B82F6', count: 432, emoji: '⚡', pinned: true },
                { id: 2, name: 'Design', color: '#8B5CF6', count: 234, emoji: '🎨', pinned: false },
                { id: 3, name: 'Marketing', color: '#10B981', count: 156, emoji: '📈', pinned: true },
                { id: 4, name: 'Research', color: '#F59E0B', count: 89, emoji: '🔬', pinned: false },
            ];
            setCollections(mockCollections);
        };
        
        loadCollections();
    }, []);

    const handleCreateCollection = async (collectionData) => {
        console.log('Creating collection:', collectionData);
        const newCollection = {
            id: Date.now(),
            name: collectionData.name,
            emoji: collectionData.emoji,
            color: collectionData.color || '#3B82F6',
            count: 0,
            pinned: false
        };
        setCollections(prev => [...prev, newCollection]);
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Sidebar - Hidden on mobile */}
            {!isMobile && (
                <Sidebar
                    user={user}
                    stats={stats}
                    collections={collections}
                    activeCollection={activeCollection}
                    onCollectionChange={setActiveCollection}
                    onOpenCommandPalette={onOpenCommandPalette}
                    onCreateCollection={handleCreateCollection}
                    onAddLink={onAddLink}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    stats={stats}
                    currentPage={currentPage}
                    onAddLink={onAddLink}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    onOpenCommandPalette={onOpenCommandPalette}
                    user={user}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-black" style={{
                    paddingBottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 60px)' : '0'
                }}>
                    {children}
                </div>

                {/* Activity Bar - Desktop only */}
                {!isMobile && <ActivityBar />}
            </div>

            {/* Mobile Shell */}
            {isMobile && (
                <MobileShell
                    isMenuOpen={isMobileMenuOpen}
                    onCloseMenu={() => setIsMobileMenuOpen(false)}
                    onAddLink={onAddLink}
                    user={user}
                    stats={stats}
                    collections={collections}
                    activeCollection={activeCollection}
                    onCollectionChange={setActiveCollection}
                    onCreateCollection={handleCreateCollection}
                />
            )}
        </div>
    );
}