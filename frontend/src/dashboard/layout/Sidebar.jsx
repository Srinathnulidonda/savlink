// src/dashboard/layout/Sidebar.jsx

import { useState } from 'react';
import SidebarBranding from '../components/sidebar/SidebarBranding';
import SidebarSearch from '../components/sidebar/SidebarSearch';
import Navigation from '../components/sidebar/Navigation';
import Collections from '../components/sidebar/Collections';
import SidebarFooter from '../components/sidebar/SidebarFooter';

export default function Sidebar({
    stats,
    activeView,
    onViewChange,
    collections,
    activeCollection,
    onCollectionChange,
    onOpenCommandPalette,
    onAddLink,
    onCreateCollection,
}) {
    return (
        <div className="w-[240px] lg:w-[260px] flex-shrink-0 border-r border-gray-800/60 
                         bg-[#0a0a0a] flex flex-col select-none">
            
            {/* Branding */}
            <SidebarBranding />

            {/* Search Trigger */}
            <SidebarSearch onOpenCommandPalette={onOpenCommandPalette} />

            {/* Navigation */}
            <Navigation
                stats={stats}
                activeView={activeView}
                onViewChange={onViewChange}
            />

            {/* Collections */}
            <Collections
                collections={collections}
                activeCollection={activeCollection}
                onCollectionChange={onCollectionChange}
                onCreateCollection={onCreateCollection}
            />

            {/* Footer */}
            <SidebarFooter onAddLink={onAddLink} />
        </div>
    );
}