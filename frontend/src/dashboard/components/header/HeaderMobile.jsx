// src/dashboard/components/header/HeaderMobile.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../auth/services/auth.service';

export default function HeaderMobile({
    user,
    searchQuery: externalSearchQuery,
    onSearch: onExternalSearch,
    onMenuClick,
    onOpenCommandPalette,
}) {
    const navigate = useNavigate();

    /* ── Search state ──────────────────────────────────────── */
    const [localQuery, setLocalQuery] = useState('');
    const searchQuery = externalSearchQuery ?? localQuery;
    const setSearchQuery = useCallback((val) => {
        if (onExternalSearch) onExternalSearch(val);
        else setLocalQuery(val);
    }, [onExternalSearch]);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef(null);

    /* ── User menu state ───────────────────────────────────── */
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!showUserMenu) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [showUserMenu]);

    /* ── Helpers ────────────────────────────────────────────── */
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const handleLogout = async () => {
        setShowUserMenu(false);
        await AuthService.logout();
        navigate('/');
    };

    return (
        <div
            className="flex items-center h-14 gap-2"
            style={{
                paddingLeft: 'max(env(safe-area-inset-left, 0px), 8px)',
                paddingRight: 'max(env(safe-area-inset-right, 0px), 8px)',
            }}
        >
            {/* ── Hamburger ──────────────────────────────── */}
            <motion.button
                onClick={onMenuClick}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 flex items-center justify-center
                           w-10 h-10 -ml-1 rounded-full
                           text-gray-500 hover:text-gray-300
                           active:bg-white/[0.04] transition-colors
                           touch-manipulation"
                aria-label="Open menu"
            >
                <svg
                    className="h-[22px] w-[22px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </motion.button>

            {/* ── Search bar (Google Drive pill) ──────────── */}
            <div className="flex-1 min-w-0">
                <div
                    className={`
                        flex items-center h-10 rounded-full transition-all duration-200
                        ${isSearchFocused
                            ? 'bg-gray-800/80 ring-1 ring-primary/20'
                            : 'bg-gray-900/60'
                        }
                    `}
                >
                    {/* Search icon */}
                    <div className="pl-3.5 pr-2 flex-shrink-0">
                        <svg
                            className={`h-[18px] w-[18px] transition-colors duration-200
                                ${isSearchFocused ? 'text-gray-400' : 'text-gray-600'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0
                                   105.196 5.196a7.5 7.5 0
                                   0010.607 10.607z"
                            />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        ref={searchInputRef}
                        type="text"
                        inputMode="search"
                        enterKeyHint="search"
                        placeholder="Search links…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="flex-1 min-w-0 h-full bg-transparent
                                   text-[14px] text-white placeholder-gray-600
                                   focus:outline-none pr-2"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                    />

                    {/* Clear button */}
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.12 }}
                                onClick={() => {
                                    setSearchQuery('');
                                    searchInputRef.current?.focus();
                                }}
                                className="mr-2 flex-shrink-0 p-1 rounded-full
                                           text-gray-500 hover:text-gray-300
                                           active:bg-white/[0.06] transition-colors
                                           touch-manipulation"
                                aria-label="Clear search"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── User avatar ────────────────────────────── */}
            <div className="relative flex-shrink-0" ref={menuRef}>
                <motion.button
                    onClick={() => setShowUserMenu((v) => !v)}
                    whileTap={{ scale: 0.92 }}
                    className="flex items-center justify-center w-10 h-10 -mr-1
                               rounded-full active:bg-white/[0.04]
                               transition-colors touch-manipulation"
                    aria-label="Account menu"
                    aria-expanded={showUserMenu}
                >
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover
                                       ring-1 ring-white/[0.06]"
                        />
                    ) : (
                        <div
                            className="h-8 w-8 rounded-full bg-gradient-to-br
                                        from-primary/80 to-primary
                                        flex items-center justify-center
                                        ring-1 ring-white/[0.06]"
                        >
                            <span className="text-[11px] font-bold text-white leading-none">
                                {getInitials(user?.name)}
                            </span>
                        </div>
                    )}
                </motion.button>

                {/* ── Dropdown ────────────────────────────── */}
                <AnimatePresence>
                    {showUserMenu && (
                        <>
                            {/* Scrim */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.12 }}
                                className="fixed inset-0 z-[100]"
                                onClick={() => setShowUserMenu(false)}
                            />

                            {/* Panel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute right-0 top-full mt-2 w-[240px] z-[110]
                                           rounded-xl border border-gray-800/60
                                           bg-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.7)]
                                           overflow-hidden"
                                style={{
                                    marginRight: 'env(safe-area-inset-right, 0px)',
                                }}
                            >
                                {/* User card */}
                                <div className="px-4 py-3.5 border-b border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        {user?.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt=""
                                                className="h-10 w-10 rounded-xl object-cover
                                                           ring-1 ring-white/[0.06]"
                                            />
                                        ) : (
                                            <div
                                                className="h-10 w-10 rounded-xl bg-gradient-to-br
                                                            from-primary/80 to-primary
                                                            flex items-center justify-center
                                                            ring-1 ring-white/[0.06]"
                                            >
                                                <span className="text-xs font-bold text-white">
                                                    {getInitials(user?.name)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-medium text-white truncate">
                                                {user?.name || 'User'}
                                            </p>
                                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                                {user?.email || ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-1.5">
                                    <MenuBtn
                                        icon={<SettingsIcon />}
                                        label="Settings"
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/dashboard/settings');
                                        }}
                                    />
                                    <MenuBtn
                                        icon={<ProfileIcon />}
                                        label="Profile"
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/dashboard/profile');
                                        }}
                                    />
                                </div>

                                {/* Sign out */}
                                <div className="p-1.5 border-t border-gray-800/50">
                                    <MenuBtn
                                        icon={<LogoutIcon />}
                                        label="Sign out"
                                        onClick={handleLogout}
                                        danger
                                    />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ── Reusable dropdown button ────────────────────────────── */
function MenuBtn({ icon, label, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-[13px] font-medium transition-colors touch-manipulation
                ${danger
                    ? 'text-red-400 hover:bg-red-500/10 active:bg-red-500/15'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-white active:bg-white/[0.07]'
                }
            `}
        >
            <span className="flex-shrink-0 text-current opacity-60">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
        </button>
    );
}

/* ── Icons ───────────────────────────────────────────────── */
function SettingsIcon() {
    return (
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0
                   1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257
                   1.075.124l1.217-.456a1.125 1.125 0
                   011.37.49l1.296 2.247a1.125 1.125 0
                   01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759
                   6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26
                   1.43l-1.298 2.247a1.125 1.125 0
                   01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57
                   6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213
                   1.28c-.09.543-.56.941-1.11.941h-2.594c-.55
                   0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52
                   6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125
                   1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0
                   01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932
                   6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125
                   1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0
                   011.37-.491l1.216.456c.356.133.751.072
                   1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0
                   017.5 0zM4.501 20.118a7.5 7.5 0
                   0114.998 0A17.933 17.933 0 0112
                   21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5
                   3h-6a2.25 2.25 0 00-2.25
                   2.25v13.5A2.25 2.25 0 007.5
                   21h6a2.25 2.25 0 002.25-2.25V15m3
                   0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );
}