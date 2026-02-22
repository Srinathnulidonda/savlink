// src/dashboard/layout/Sidebar.jsx

import UserProfile from '../components/sidebar/UserProfile';
import QuickActions from '../components/sidebar/QuickActions';
import Navigation from '../components/sidebar/Navigation';
import Collections from '../components/sidebar/Collections';
import SidebarFooter from '../components/sidebar/SidebarFooter';

export default function Sidebar({
    user,
    stats,
    activeView,
    onViewChange,
    collections,
    activeCollection,
    onCollectionChange,
    onOpenCommandPalette,
    onAddLink
}) {
    const handleCreateCollection = async (collectionData) => {
        // This would typically call your collections service
        console.log('Creating collection:', collectionData);
        // Add your collection creation logic here
    };

    return (
        <div className="w-56 lg:w-64 flex-shrink-0 border-r border-gray-900 bg-gray-950/50 flex flex-col">
            {/* User Profile Section */}
            <UserProfile user={user} stats={stats} />

            {/* Quick Actions Section */}
            <QuickActions
                onOpenCommandPalette={onOpenCommandPalette}
            />

            {/* Navigation Section */}
            <Navigation
                stats={stats}
                activeView={activeView}
                onViewChange={onViewChange}
            />

            {/* Collections Section */}
            <Collections
                collections={collections}
                activeCollection={activeCollection}
                onCollectionChange={onCollectionChange}
                onCreateCollection={handleCreateCollection}
            />

            {/* Footer Section */}
            <SidebarFooter />
        </div>
    );
}