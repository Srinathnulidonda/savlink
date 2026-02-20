// src/dashboard/layout/Sidebar.jsx - Updated with QuickActions
import SidebarBranding from '../components/sidebar/SidebarBranding';
import QuickActions from '../components/sidebar/QuickActions';
import Navigation from '../components/sidebar/Navigation';
import Collections from '../components/sidebar/Collections';
import SidebarFooter from '../components/sidebar/SidebarFooter';

export default function Sidebar({
    user,
    stats,
    collections,
    activeCollection,
    onCollectionChange,
    onOpenCommandPalette,
    onCreateCollection,
    onAddLink  
}) {
    return (
        <div className="w-56 lg:w-64 flex-shrink-0 border-r border-gray-900 bg-gray-950/50 flex flex-col">
            {/* Branding Section */}
            <SidebarBranding />

            {/* Quick Actions Section - NEW Button */}
            <QuickActions 
                onOpenCommandPalette={onOpenCommandPalette}
                onAddLink={onAddLink}
                onAddCollection={onCreateCollection}
            />

            {/* Navigation Section */}
            <Navigation stats={stats} />

            {/* Collections Section */}
            <Collections
                collections={collections}
                activeCollection={activeCollection}
                onCollectionChange={onCollectionChange}
                onCreateCollection={onCreateCollection}
            />

            {/* Footer Section */}
            <SidebarFooter />
        </div>
    );
}