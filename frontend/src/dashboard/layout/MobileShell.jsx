// src/dashboard/layout/MobileShell.jsx

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeaderMobile from '../components/header/HeaderMobile';
import MobileMenu from './MobileMenu';
import MobileAddButton from '../components/common/MobileAddButton';

export default function MobileShell({
    user,
    stats,
    activeView,
    onViewChange,
    onSearch,
    searchQuery,
    onAddLink,
    onOpenCommandPalette,
    collections,
    activeCollection,
    onCollectionChange,
    onCreateCollection,
    children,
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex-shrink-0 border-b border-gray-800/40 bg-[#0a0a0a]/80 
                                   backdrop-blur-sm safe-area-top">
                    <HeaderMobile
                        user={user}
                        activeView={activeView}
                        stats={stats}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        onOpenCommandPalette={onOpenCommandPalette}
                    />
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-black safe-area-bottom">
                    {children}
                </div>
            </div>

            {/* FAB */}
            <MobileAddButton onAddLink={onAddLink} useSafeArea />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        user={user}
                        stats={stats}
                        activeView={activeView}
                        onViewChange={(view) => {
                            onViewChange(view);
                            setIsMobileMenuOpen(false);
                        }}
                        collections={collections || []}
                        activeCollection={activeCollection}
                        onCollectionChange={(id) => {
                            onCollectionChange?.(id);
                            setIsMobileMenuOpen(false);
                        }}
                        onCreateCollection={onCreateCollection}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}