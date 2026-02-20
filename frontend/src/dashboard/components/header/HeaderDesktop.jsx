// src/dashboard/components/header/HeaderDesktop.jsx - Fixed dropdown
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from './SearchInput';
import UserMenu from './UserMenu';

export default function HeaderDesktop({
    stats,
    onAddLink,
    currentPage = 'Dashboard',
    user
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const dropdownRef = useRef(null);

    // Get page icon
    const getPageIcon = () => {
        switch (currentPage) {
            case 'Home': return '🏠';
            case 'My Files': return '📁';
            case 'All Links': return '🔗';
            case 'Recent': return '🕒';
            case 'Starred': return '⭐';
            case 'Archive': return '📦';
            case 'Search': return '🔍';
            case 'Profile': return '👤';
            case 'Settings': return '⚙️';
            default: return '🏠';
        }
    };

    const getInitials = (name) => {
        if (!name) return 'US';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between">
            {/* Left side - Current Page Title and stats */}
            <div>
                <h1 className="text-base lg:text-lg font-semibold text-white flex items-center gap-2">
                    <span>{getPageIcon()}</span>
                    {currentPage}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">
                    {(stats.all || 0).toLocaleString()} links total
                </p>
            </div>

            {/* Right side - Search, view options, add button, user profile */}
            <div className="flex items-center gap-2 lg:gap-3">
                <SearchInput
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                />

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-gray-800 p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`rounded p-1.5 transition-all ${
                            viewMode === 'grid'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-500 hover:text-white'
                        }`}
                        title="Grid view"
                    >
                        <svg className="h-3.5 lg:h-4 w-3.5 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`rounded p-1.5 transition-all ${
                            viewMode === 'list'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-500 hover:text-white'
                        }`}
                        title="List view"
                    >
                        <svg className="h-3.5 lg:h-4 w-3.5 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Add Link Button */}
                <button
                    onClick={onAddLink}
                    className="btn-primary flex items-center gap-2 text-xs lg:text-sm px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-lg bg-primary hover:bg-primary-light text-white font-medium transition-all"
                    title="Add new link (⌘N)"
                >
                    <svg className="h-3.5 lg:h-4 w-3.5 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Add</span>
                </button>

                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <div className="relative">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-semibold">
                                    {getInitials(user?.name)}
                                </div>
                            )}
                        </div>
                        <div className="hidden lg:block text-left">
                            <div className="text-sm font-medium text-white truncate max-w-32">
                                {user?.name || 'User'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {stats.all || 0} links
                            </div>
                        </div>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* User Menu Dropdown */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowUserMenu(false)} 
                                />
                                <UserMenu onClose={() => setShowUserMenu(false)} />
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}