// src/dashboard/layout/MobileMenu.jsx

import { motion } from 'framer-motion';
import SidebarBranding from '../components/sidebar/SidebarBranding';
import Navigation from '../components/sidebar/Navigation';
import Collections from '../components/sidebar/Collections';

export default function MobileMenu({
    isOpen,
    onClose,
    user,
    stats,
    activeView,
    onViewChange,
    collections,
    activeCollection,
    onCollectionChange,
    onCreateCollection,
}) {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 z-50 h-full w-[280px] bg-[#0a0a0a] 
                           border-r border-gray-800/60 md:hidden overflow-hidden flex flex-col"
            >
                {/* Close + Branding */}
                <div className="flex items-center justify-between pr-3">
                    <SidebarBranding />
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-600 hover:text-gray-400 rounded-lg 
                                   hover:bg-gray-800/50 transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Card */}
                <div className="mx-3 mb-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-gray-800/40">
                    <div className="flex items-center gap-2.5">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-8 w-8 rounded-lg object-cover ring-1 ring-gray-800/60"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary 
                                            flex items-center justify-center ring-1 ring-gray-800/60">
                                <span className="text-[10px] font-bold text-white">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-gray-200 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[11px] text-gray-600 truncate">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>

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
            </motion.div>
        </>
    );
}