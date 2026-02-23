// src/dashboard/components/sidebar/Navigation.jsx

import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    {
        section: 'workspace',
        items: [
            {
                id: 'home',
                label: 'Home',
                path: '/dashboard/home',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                ),
            },
            {
                id: 'myfiles',
                label: 'My Files',
                path: '/dashboard/my-files',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: 'links',
        label: 'Links',
        items: [
            {
                id: 'all',
                label: 'All Links',
                path: '/dashboard/links/all',
                countKey: 'all',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                ),
            },
            {
                id: 'starred',
                label: 'Starred',
                path: '/dashboard/links/starred',
                countKey: 'starred',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                ),
            },
            {
                id: 'recent',
                label: 'Recent',
                path: '/dashboard/links/recent',
                countKey: 'recent',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
            },
            {
                id: 'archive',
                label: 'Archive',
                path: '/dashboard/links/archive',
                countKey: 'archive',
                icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                ),
            },
        ],
    },
];

export default function Navigation({ stats = {}, activeView, onViewChange }) {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentView = () => {
        const path = location.pathname;
        if (path.includes('/home') || path === '/dashboard' || path === '/dashboard/') return 'home';
        if (path.includes('/my-files')) return 'myfiles';
        if (path.includes('/all')) return 'all';
        if (path.includes('/starred')) return 'starred';
        if (path.includes('/recent')) return 'recent';
        if (path.includes('/archive')) return 'archive';
        return 'home';
    };

    const currentView = getCurrentView();

    const handleClick = (item) => {
        navigate(item.path);
        onViewChange?.(item.id);
    };

    const formatCount = (count) => {
        if (!count) return null;
        if (count > 9999) return '9.9k';
        if (count > 999) return `${(count / 1000).toFixed(1)}k`;
        return count.toString();
    };

    return (
        <nav className="px-3 py-2 flex-shrink-0">
            {NAV_ITEMS.map((section, si) => (
                <div key={section.section}>
                    {/* Section label */}
                    {section.label && (
                        <div className="px-3 pt-4 pb-1.5">
                            <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                                {section.label}
                            </span>
                        </div>
                    )}

                    {/* Items */}
                    <div className="space-y-0.5">
                        {section.items.map((item) => {
                            const isActive = currentView === item.id;
                            const count = item.countKey ? formatCount(stats[item.countKey]) : null;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item)}
                                    className={`w-full flex items-center gap-3 px-3 py-[7px] rounded-lg 
                                               text-[13px] font-medium transition-all relative group
                                               ${isActive
                                            ? 'bg-white/[0.06] text-white'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                                        }`}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActiveIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 
                                                       bg-primary rounded-r-full"
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <span className={`flex-shrink-0 transition-colors
                                                     ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                        {item.icon}
                                    </span>

                                    {/* Label */}
                                    <span className="flex-1 text-left truncate">
                                        {item.label}
                                    </span>

                                    {/* Count */}
                                    {count && (
                                        <span className={`text-[11px] tabular-nums flex-shrink-0
                                                         ${isActive ? 'text-gray-400' : 'text-gray-700'}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Divider between sections */}
                    {si < NAV_ITEMS.length - 1 && (
                        <div className="mx-3 my-2 border-t border-gray-800/40" />
                    )}
                </div>
            ))}
        </nav>
    );
}