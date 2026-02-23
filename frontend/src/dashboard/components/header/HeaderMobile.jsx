// src/dashboard/components/header/HeaderMobile.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../../auth/services/auth.service';

const VIEW_LABELS = {
    home: 'Home',
    myfiles: 'My Files',
    all: 'All Links',
    starred: 'Starred',
    recent: 'Recent',
    archive: 'Archive',
};

export default function HeaderMobile({
    user,
    activeView,
    onMenuClick,
    onOpenCommandPalette,
    stats,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const getCurrentView = () => {
        const path = location.pathname;
        if (path.includes('/home') || path === '/dashboard' || path === '/dashboard/') return 'home';
        if (path.includes('/my-files')) return 'myfiles';
        if (path.includes('/all')) return 'all';
        if (path.includes('/starred')) return 'starred';
        if (path.includes('/recent')) return 'recent';
        if (path.includes('/archive')) return 'archive';
        return activeView || 'home';
    };

    const currentView = getCurrentView();

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        setProfileOpen(false);
        await AuthService.logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex items-center justify-between h-12 px-3">
            {/* Left: Menu */}
            <button
                onClick={onMenuClick}
                className="p-1.5 -ml-1 text-gray-500 hover:text-white transition-colors rounded-lg"
                aria-label="Open menu"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Center: Title */}
            <h1 className="text-[14px] font-semibold text-white">
                {VIEW_LABELS[currentView] || 'Dashboard'}
            </h1>

            {/* Right: Search + Avatar */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onOpenCommandPalette}
                    className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg"
                    aria-label="Search"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>

                {/* Avatar */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="p-0.5"
                    >
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/[0.06]"
                            />
                        ) : (
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/80 to-primary 
                                            flex items-center justify-center ring-1 ring-white/[0.06]">
                                <span className="text-[10px] font-bold text-white">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                        )}
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-full mt-2 w-56 z-40 
                                               rounded-xl border border-gray-800/60 bg-[#0c0c0c] 
                                               shadow-2xl overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-800/40">
                                        <p className="text-[13px] font-medium text-white truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                    <div className="p-1.5">
                                        <MobileDropdownItem
                                            label="Settings"
                                            onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                                        />
                                        <MobileDropdownItem
                                            label="Profile"
                                            onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }}
                                        />
                                    </div>
                                    <div className="p-1.5 border-t border-gray-800/40">
                                        <MobileDropdownItem label="Sign out" onClick={handleLogout} danger />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function MobileDropdownItem({ label, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors
                       ${danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                }`}
        >
            {label}
        </button>
    );
}