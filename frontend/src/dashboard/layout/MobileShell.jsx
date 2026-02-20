// src/dashboard/layout/MobileShell.jsx - Cleaned up
import { motion, AnimatePresence } from 'framer-motion';
import SidebarBranding from '../components/sidebar/SidebarBranding';
import Navigation from '../components/sidebar/Navigation';
import Collections from '../components/sidebar/Collections';
import MobileBottomNav from '../components/navigation/MobileBottomNav';
import MobileAddButton from '../components/header/MobileAddButton';

export default function MobileShell({
    isMenuOpen,
    onCloseMenu,
    onAddLink,
    user,
    stats,
    collections,
    activeCollection,
    onCollectionChange,
    onCreateCollection
}) {
    const handleCollectionChange = (collectionId) => {
        onCollectionChange?.(collectionId);
        onCloseMenu();
    };

    const handleCreateCollection = async (collectionData) => {
        await onCreateCollection?.(collectionData);
    };

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* Mobile FAB with dropdown */}
            <MobileAddButton
                onAddLink={onAddLink}
                customPosition={{
                    bottom: 'calc(env(safe-area-inset-bottom) + 70px)',
                    right: '20px'
                }}
                useSafeArea={false}
            />

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={onCloseMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ 
                                type: 'spring', 
                                damping: 25, 
                                stiffness: 200,
                                mass: 0.8
                            }}
                            className="fixed left-0 top-0 z-50 h-full w-72 bg-gray-950 border-r border-gray-800 md:hidden overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Branding Header */}
                            <SidebarBranding />

                            {/* Navigation */}
                            <div className="px-3 pt-3">
                                <Navigation stats={stats} />
                            </div>

                            {/* Collections */}
                            <Collections
                                collections={collections}
                                activeCollection={activeCollection}
                                onCollectionChange={handleCollectionChange}
                                onCreateCollection={handleCreateCollection}
                            />

                            {/* Footer */}
                            <div className="mt-auto p-3 border-t border-gray-900">
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-600">
                                        © {new Date().getFullYear()} Savlink
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}