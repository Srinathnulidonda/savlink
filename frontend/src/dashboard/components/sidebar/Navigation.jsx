// src/dashboard/components/sidebar/Navigation.jsx - Minimal version
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation({ stats }) {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract current view from URL
    const getCurrentView = () => {
        if (location.pathname === '/dashboard') return 'home';
        if (location.pathname === '/dashboard/files') return 'myfiles';
        if (location.pathname === '/dashboard/all') return 'all';
        if (location.pathname === '/dashboard/recent') return 'recent';
        if (location.pathname === '/dashboard/starred') return 'starred';
        if (location.pathname === '/dashboard/archive') return 'archive';
        if (location.pathname.startsWith('/dashboard/collections')) return 'collections';
        if (location.pathname.startsWith('/dashboard/search')) return 'search';
        return 'home';
    };

    const activeView = getCurrentView();

    // Top level navigation items
    const topLevelTabs = [
        { 
            id: 'home', 
            label: 'Home', 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            path: '/dashboard'
        },
        { 
            id: 'myfiles', 
            label: 'My Files', 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            path: '/dashboard/files'
        },
    ];

    // Link management tabs
    const linkTabs = [
        { 
            id: 'all', 
            label: 'All Links', 
            count: stats.all, 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            path: '/dashboard/all'
        },
        { 
            id: 'recent', 
            label: 'Recent', 
            count: stats.recent, 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            path: '/dashboard/recent'
        },
        { 
            id: 'starred', 
            label: 'Starred', 
            count: stats.starred, 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            path: '/dashboard/starred'
        },
        { 
            id: 'archive', 
            label: 'Archive', 
            count: stats.archive, 
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-13 0h3m-3 0v-3m3 3v3" />
                </svg>
            ),
            path: '/dashboard/archive'
        },
    ];

    const getCountDisplay = (count) => {
        if (!count || count === 0) return '';
        if (count > 9999) return '9999+';
        if (count > 999) return `${Math.floor(count / 1000)}k`;
        return count.toString();
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="px-3 pb-3">
            {/* Top Level Navigation */}
            <div className="space-y-1 mb-4">
                {topLevelTabs.map((tab) => {
                    const isActive = activeView === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => handleNavigation(tab.path)}
                            whileHover={{ scale: isActive ? 1 : 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                            }`}
                        >
                            <div className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                                {tab.icon}
                            </div>
                            <span>{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Link Management Navigation */}
            <div className="space-y-1">
                {linkTabs.map((tab) => {
                    const isActive = activeView === tab.id;
                    const count = tab.count || 0;
                    const countDisplay = getCountDisplay(count);

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => handleNavigation(tab.path)}
                            whileHover={{ scale: isActive ? 1 : 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                                    {tab.icon}
                                </div>
                                <span>{tab.label}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Count Display */}
                                {countDisplay && (
                                    <span className={`text-xs transition-all ${
                                        isActive
                                            ? 'text-primary/70'
                                            : 'text-gray-500'
                                    }`}>
                                        {countDisplay}
                                    </span>
                                )}
                                
                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="linkActiveIndicator"
                                        className="h-1.5 w-1.5 rounded-full bg-primary"
                                    />
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
}