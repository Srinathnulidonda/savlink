// src/dashboard/DashboardApp.jsx - Updated
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './layout/DashboardLayout';
import HomeView from './views/Home/HomeView';
import { DashboardService } from '../services/dashboard.service';
import { useAuth } from '../auth/context/AuthContext';
import AddLinkModal from './modals/AddLink/AddLinkModal';
import CommandPalette from './components/common/CommandPalette';
import toast from 'react-hot-toast';

// Lazy load other views
import { lazy, Suspense } from 'react';
const MyFilesView = lazy(() => import('./views/MyFiles/MyFilesView'));
const AllLinksView = lazy(() => import('./views/AllLinks/AllLinksView'));
const RecentView = lazy(() => import('./views/Recent/RecentView'));
const StarredView = lazy(() => import('./views/Starred/StarredView'));
const ArchivedView = lazy(() => import('./views/Archived/ArchivedView'));
const CollectionView = lazy(() => import('./views/Collection/CollectionView'));
const SearchView = lazy(() => import('./views/Search/SearchView'));
const ProfileView = lazy(() => import('./views/Profile/ProfileView'));
const SettingsView = lazy(() => import('./views/Settings/SettingsView'));
const ShortView = lazy(() => import('./views/Short/ShortView'));

function ViewLoader() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 rounded-full border-2 border-gray-800 border-t-primary animate-spin" />
        </div>
    );
}

export default function DashboardApp() {
    const { user } = useAuth();
    const location = useLocation();
    
    const [stats, setStats] = useState({
        all: 0,
        recent: 0,
        starred: 0,
        pinned: 0,
        archive: 0,
        unassigned: 0
    });
    const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    // Get current page title based on route
    const getCurrentPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Home';
        if (path.includes('/files')) return 'My Files';
        if (path.includes('/all')) return 'All Links';
        if (path.includes('/recent')) return 'Recent';
        if (path.includes('/starred')) return 'Starred';
        if (path.includes('/archive')) return 'Archive';
        if (path.includes('/collections')) return 'Collection';
        if (path.includes('/search')) return 'Search';
        if (path.includes('/profile')) return 'Profile';
        if (path.includes('/settings')) return 'Settings';
        return 'Dashboard';
    };

    // Fetch dashboard stats
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const result = await DashboardService.getStats();
            if (result?.success && result?.data?.stats?.counts) {
                setStats({
                    all: result.data.stats.counts.all || 0,
                    recent: result.data.stats.counts.recent || 0,
                    starred: result.data.stats.counts.starred || 0,
                    pinned: result.data.stats.counts.pinned || 0,
                    archive: result.data.stats.counts.archive || 0,
                    unassigned: result.data.stats.counts.unassigned || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                setIsAddLinkOpen(true);
            }
            if (e.key === 'Escape') {
                if (isCommandPaletteOpen) {
                    setIsCommandPaletteOpen(false);
                } else if (isAddLinkOpen) {
                    setIsAddLinkOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, isAddLinkOpen]);

    const handleAddLink = async (linkData) => {
        setIsAddLinkOpen(false);
        toast.success('Link saved successfully');
        fetchStats();
        window.dispatchEvent(new CustomEvent('linkCreated', { detail: linkData }));
    };

    useEffect(() => {
        const handleOpenAddLink = () => setIsAddLinkOpen(true);
        window.addEventListener('openAddLink', handleOpenAddLink);
        return () => window.removeEventListener('openAddLink', handleOpenAddLink);
    }, []);

    return (
        <DashboardLayout
            user={user}
            stats={stats}
            currentPage={getCurrentPageTitle()}
            onAddLink={() => setIsAddLinkOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        >
            <Suspense fallback={<ViewLoader />}>
                <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/files" element={<MyFilesView />} />
                    <Route path="/all" element={<AllLinksView />} />
                    <Route path="/recent" element={<RecentView />} />
                    <Route path="/starred" element={<StarredView />} />
                    <Route path="/archive" element={<ArchivedView />} />
                    <Route path="/collections/:id" element={<CollectionView />} />
                    <Route path="/search" element={<SearchView />} />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/settings/*" element={<SettingsView />} />
                    <Route path="/short" element={<ShortView />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>

            {/* Modals */}
            <AnimatePresence>
                {isAddLinkOpen && (
                    <AddLinkModal
                        isOpen={isAddLinkOpen}
                        onClose={() => setIsAddLinkOpen(false)}
                        onSubmit={handleAddLink}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCommandPaletteOpen && (
                    <CommandPalette
                        isOpen={isCommandPaletteOpen}
                        onClose={() => setIsCommandPaletteOpen(false)}
                        onAddLink={() => {
                            setIsCommandPaletteOpen(false);
                            setIsAddLinkOpen(true);
                        }}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}