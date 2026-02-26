// frontend/src/dashboard/DashboardApp.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from './layout/DashboardLayout';
import HomePage from './pages/home/HomePage';
import MyFiles from './pages/myfiles/MyFiles';
import LinksView from './components/links/LinksView';
import AddLinkModal from './modals/AddLink/AddLinkModal';
import CommandPalette from './modals/CommandPalette/CommandPalette';
import DashboardService from '../services/dashboard.service';
import LinksService from '../services/links.service';
import { useAuth } from '../auth/context/AuthContext';
import toast from 'react-hot-toast';
import apiService from '../utils/api';

function LinksPageWrapper({
    links,
    searchQuery,
    viewMode,
    onUpdateLink,
    onDeleteLink,
    onPinLink,
    onStarLink,
    onArchiveLink,
    onRefresh,
    loading,
}) {
    const { filterView } = useParams();
    const view = filterView || 'all';

    return (
        <LinksView
            links={links}
            view={view}
            searchQuery={searchQuery}
            viewMode={viewMode}
            onUpdateLink={onUpdateLink}
            onDeleteLink={onDeleteLink}
            onPinLink={onPinLink}
            onStarLink={onStarLink}
            onArchiveLink={onArchiveLink}
            onRefresh={onRefresh}
            loading={loading}
        />
    );
}

const ROUTES_NEEDING_LINKS = ['/links'];

function routeNeedsLinks(pathname) {
    return ROUTES_NEEDING_LINKS.some(r => pathname.includes(r));
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [links, setLinks] = useState([]);
    const [stats, setStats] = useState({ all: 0, recent: 0, starred: 0, archive: 0 });
    const [view, setView] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const [viewMode, setViewMode] = useState(() => {
        try { return localStorage.getItem('savlink_view_mode') || 'grid'; }
        catch { return 'grid'; }
    });

    const handleViewModeChange = useCallback((mode) => {
        setViewMode(mode);
        try { localStorage.setItem('savlink_view_mode', mode); } catch {}
    }, []);

    const fetchingRef = useRef(false);
    const mountedRef = useRef(true);
    const fetchIdRef = useRef(0);
    const lastFetchParamsRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        const paramsKey = `${view}|${searchQuery}`;
        if (lastFetchParamsRef.current === paramsKey) return;
        lastFetchParamsRef.current = paramsKey;
        fetchDashboardData();
    }, [view, searchQuery]);

    function applyStats(s) {
        if (s) setStats({ all: s.all || 0, recent: s.recent || 0, starred: s.starred || 0, archive: s.archive || 0 });
    }

    const fetchDashboardData = useCallback(async () => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        const currentFetchId = ++fetchIdRef.current;

        try {
            setDataLoading(true);

            const needsLinks = routeNeedsLinks(location.pathname);
            const promises = [DashboardService.getStats()];

            if (needsLinks) {
                promises.unshift(DashboardService.getLinks({ view, search: searchQuery }));
            }

            const results = await Promise.allSettled(promises);

            if (!mountedRef.current || currentFetchId !== fetchIdRef.current) return;

            if (needsLinks) {
                const linksResult = results[0];
                const statsResult = results[1];

                if (linksResult.status === 'fulfilled' && linksResult.value?.success) {
                    setLinks(linksResult.value.data?.links || []);
                } else {
                    setLinks([]);
                }

                if (statsResult?.status === 'fulfilled' && statsResult.value?.success) {
                    applyStats(statsResult.value.data?.stats);
                }
            } else {
                const statsResult = results[0];
                if (statsResult.status === 'fulfilled' && statsResult.value?.success) {
                    applyStats(statsResult.value.data?.stats);
                }
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            fetchingRef.current = false;
            if (mountedRef.current && currentFetchId === fetchIdRef.current) {
                setDataLoading(false);
            }
        }
    }, [view, searchQuery, location.pathname]);

    const handleViewChange = (newView) => setView(newView);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCommandPaletteOpen(true); }
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); setIsAddLinkOpen(true); }
            if (e.key === 'Escape') { setIsCommandPaletteOpen(false); setIsAddLinkOpen(false); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLinkAdded = useCallback(() => {
        setIsAddLinkOpen(false);
        lastFetchParamsRef.current = null;
        apiService.invalidateCache();
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleUpdateLink = async (linkId, updates) => {
        try {
            const result = await LinksService.updateLink(linkId, updates);
            if (result?.success && result?.data) {
                setLinks(prev => prev.map(l => (l.id === linkId ? result.data : l)));
                toast.success('Link updated');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update link');
        }
    };

    const handleDeleteLink = async (linkId) => {
        const prevLinks = links;
        try {
            setLinks(prev => prev.filter(l => l.id !== linkId));
            await LinksService.deleteLink(linkId);
            toast.success('Link deleted');
            lastFetchParamsRef.current = null;
            fetchDashboardData();
        } catch (error) {
            setLinks(prevLinks);
            toast.error(error.message || 'Failed to delete link');
        }
    };

    const handlePinLink = async (linkId) => {
        try {
            const link = links.find(l => l.id === linkId);
            if (link?.pinned) {
                await LinksService.unpinLink(linkId);
                toast.success('Link unpinned');
            } else {
                await LinksService.pinLink(linkId);
                toast.success('Link pinned');
            }
            lastFetchParamsRef.current = null;
            fetchDashboardData();
        } catch (error) {
            toast.error(error.message || 'Failed to update pin');
        }
    };

    const handleStarLink = async (linkId) => {
        try {
            const link = links.find(l => l.id === linkId);
            if (link?.starred) {
                await LinksService.unstarLink(linkId);
                toast.success('Removed from favorites');
            } else {
                await LinksService.starLink(linkId);
                toast.success('Added to favorites');
            }
            lastFetchParamsRef.current = null;
            fetchDashboardData();
        } catch (error) {
            toast.error(error.message || 'Failed to update favorite');
        }
    };

    const handleArchiveLink = async (linkId) => {
        const prevLinks = links;
        try {
            const link = links.find(l => l.id === linkId);
            setLinks(prev => prev.filter(l => l.id !== linkId));
            if (link?.archived) {
                await LinksService.restoreLink(linkId);
                toast.success('Link restored');
            } else {
                await LinksService.archiveLink(linkId);
                toast.success('Link archived');
            }
            lastFetchParamsRef.current = null;
            fetchDashboardData();
        } catch (error) {
            setLinks(prevLinks);
            toast.error(error.message || 'Failed to archive link');
        }
    };

    const linkViewProps = {
        links,
        searchQuery,
        viewMode,
        onUpdateLink: handleUpdateLink,
        onDeleteLink: handleDeleteLink,
        onPinLink: handlePinLink,
        onStarLink: handleStarLink,
        onArchiveLink: handleArchiveLink,
        onRefresh: () => setIsAddLinkOpen(true),
        loading: dataLoading,
    };

    return (
        <DashboardLayout
            user={user}
            stats={stats}
            activeView={view}
            onViewChange={handleViewChange}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
            onAddLink={() => setIsAddLinkOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
        >
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/my-files" element={<MyFiles viewMode={viewMode} />} />
                <Route path="/links/:filterView" element={<LinksPageWrapper {...linkViewProps} />} />
                <Route path="/collections/:id" element={<div>Collection View</div>} />
                <Route path="/settings" element={<div>Settings</div>} />
                <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
            </Routes>

            <AnimatePresence>
                {isAddLinkOpen && (
                    <AddLinkModal
                        isOpen={isAddLinkOpen}
                        onClose={() => setIsAddLinkOpen(false)}
                        onSubmit={handleLinkAdded}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCommandPaletteOpen && (
                    <CommandPalette
                        isOpen={isCommandPaletteOpen}
                        onClose={() => setIsCommandPaletteOpen(false)}
                        onAddLink={() => { setIsCommandPaletteOpen(false); setIsAddLinkOpen(true); }}
                        onNavigate={(path) => { setIsCommandPaletteOpen(false); navigate(path); }}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}