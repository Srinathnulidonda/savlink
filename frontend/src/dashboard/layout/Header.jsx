// src/dashboard/layout/Header.jsx

import { useState, useEffect } from 'react';
import HeaderDesktop from '../components/header/HeaderDesktop';
import HeaderMobile from '../components/header/HeaderMobile';

export default function Header({
    user,
    activeView,
    stats,
    searchQuery,
    onSearch,
    viewMode,
    onViewModeChange,
    onAddLink,
    onOpenCommandPalette,
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <header className="flex-shrink-0 relative z-[60] border-b border-gray-800/40 bg-[#0a0a0a]">
            {isMobile ? (
                <HeaderMobile
                    user={user}
                    activeView={activeView}
                    stats={stats}
                    onOpenCommandPalette={onOpenCommandPalette}
                />
            ) : (
                <HeaderDesktop
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
            )}
        </header>
    );
}