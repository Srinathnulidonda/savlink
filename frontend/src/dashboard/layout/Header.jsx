// src/dashboard/layout/Header.jsx - Updated with exact Google Drive mobile height
import { useState, useEffect } from 'react';
import HeaderMobile from '../components/header/HeaderMobile';
import HeaderDesktop from '../components/header/HeaderDesktop';

export default function Header({
    stats,
    onAddLink,
    onMenuClick,
    onOpenCommandPalette,
    currentPage,
    user
}) {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={`border-b border-gray-900 bg-gray-950/50 ${
            isMobileView ? 'h-14' : 'px-4 lg:px-6 py-3 sm:py-4'
        }`}>
            {isMobileView ? (
                <HeaderMobile
                    stats={stats}
                    onMenuClick={onMenuClick}
                    onOpenCommandPalette={onOpenCommandPalette}
                    currentPage={currentPage}
                    user={user}
                />
            ) : (
                <HeaderDesktop
                    stats={stats}
                    onAddLink={onAddLink}
                    currentPage={currentPage}
                    user={user}
                />
            )}
        </div>
    );
}