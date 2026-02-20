// src/dashboard/components/header/UserMenu.jsx - Moved from sidebar
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserMenuItem from './UserMenuItem';
import { AuthService } from '../../../auth/services/auth.service';

export default function UserMenu({ onClose }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await AuthService.logout();
        navigate('/');
    };

    const menuItems = [
        {
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            label: 'Profile',
            onClick: () => {
                onClose();
                navigate('/dashboard/profile');
            }
        },
        {
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: 'Settings',
            onClick: () => {
                onClose();
                navigate('/dashboard/settings');
            }
        }
    ];

    const logoutItem = {
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ),
        label: 'Sign Out',
        onClick: () => {
            onClose();
            handleLogout();
        },
        variant: 'danger'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-gray-800 bg-gray-950 shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-2">
                {menuItems.map((item) => (
                    <UserMenuItem key={item.label} {...item} />
                ))}
                
                <div className="border-t border-gray-800 mt-2 pt-2">
                    <UserMenuItem {...logoutItem} />
                </div>
            </div>
        </motion.div>
    );
}