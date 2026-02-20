// src/dashboard/components/navigation/MobileBottomNav.jsx - Google Drive style
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            icon: (active) => (
                <svg className="h-5 w-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            path: '/dashboard',
            badge: null
        },
        {
            id: 'starred',
            label: 'Starred',
            icon: (active) => (
                <svg className="h-5 w-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            path: '/dashboard/starred',
            badge: null
        },
        {
            id: 'short',
            label: 'Short',
            icon: (active) => (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            path: '/dashboard/short',
            badge: null
        },
        {
            id: 'files',
            label: 'Files',
            icon: (active) => (
                <svg className="h-5 w-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            path: '/dashboard/files',
            badge: null
        }
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950 border-t border-gray-800 md:hidden"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}
        >
            <div className="flex items-center justify-around h-14">
                {navItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className="relative flex flex-col items-center justify-center p-2 min-w-0 flex-1 h-full"
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Icon with badge */}
                            <div className="relative mb-0.5">
                                <div className={`transition-colors ${
                                    active ? 'text-primary' : 'text-gray-500'
                                }`}>
                                    {item.icon(active)}
                                </div>
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs font-medium text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            
                            {/* Label */}
                            <span className={`text-[10px] font-medium transition-colors ${
                                active ? 'text-primary' : 'text-gray-500'
                            }`}>
                                {item.label}
                            </span>

                            {/* Active indicator bar */}
                            {active && (
                                <motion.div
                                    layoutId="mobileActiveTab"
                                    className="absolute top-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", duration: 0.3 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.nav>
    );
}