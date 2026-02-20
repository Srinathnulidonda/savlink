// src/dashboard/components/header/HeaderMobile.jsx - Responsive for 320-390px screens
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './UserMenu';

export default function HeaderMobile({
    stats,
    onMenuClick,
    onOpenCommandPalette,
    currentPage = 'Dashboard',
    user
}) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const dropdownRef = useRef(null);

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
        <div className="flex items-center h-14 px-2 xs:px-3 sm:px-4 gap-1 xs:gap-2 sm:gap-4">
            {/* Left - Hamburger Menu (48x48 touch target, 24x24 icon) */}
            <button
                onClick={onMenuClick}
                className="flex-shrink-0 flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 -ml-1 xs:-ml-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Main menu"
            >
                <svg className="h-5 xs:h-6 w-5 xs:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Middle - Search Bar (Google Drive style with responsive sizing) */}
            <div className="flex-1 min-w-0">
                <div className="relative">
                    <div className={`flex items-center h-9 xs:h-10 sm:h-12 rounded-full transition-all ${
                        isSearchFocused 
                            ? 'bg-gray-100 dark:bg-gray-800' 
                            : 'bg-gray-100 dark:bg-gray-900/50'
                    }`}>
                        <div className="pl-3 xs:pl-4 pr-2 flex-shrink-0">
                            <svg 
                                className="h-4 xs:h-5 w-4 xs:w-5 text-gray-600 dark:text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={1.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={isSearchFocused ? "Search" : "Search"}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="flex-1 min-w-0 h-full bg-transparent text-xs xs:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none pr-2"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="pr-2 xs:pr-3 flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            >
                                <svg className="h-4 xs:h-5 w-4 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right - User Profile (32x32 avatar) */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center justify-center w-9 xs:w-10 h-9 xs:h-10 -mr-1 xs:-mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="h-7 xs:h-8 w-7 xs:w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-7 xs:h-8 w-7 xs:w-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-[10px] xs:text-xs font-medium">
                            {getInitials(user?.name)}
                        </div>
                    )}
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
    );
}