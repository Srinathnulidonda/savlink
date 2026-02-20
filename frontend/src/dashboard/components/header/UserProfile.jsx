// src/dashboard/components/sidebar/UserProfile.jsx - Minimal version
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './UserMenu';

export default function UserProfile({ user, stats }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'US';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="border-b border-gray-900 p-3 relative">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="h-8 w-8 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(user?.name)}
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                        {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {stats.all || 0} links
                    </div>
                </div>

                {/* Dropdown Toggle */}
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1 text-gray-500 hover:text-gray-400 transition-colors rounded hover:bg-gray-900"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            {/* User Menu Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <UserMenu onClose={() => setShowDropdown(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}