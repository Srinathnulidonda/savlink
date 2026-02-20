// src/dashboard/components/header/MobileAddButton.jsx - Enhanced
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function MobileAddButton({
    onAddLink,
    position = 'auto',
    useSafeArea = true,
    customPosition = null
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Don't render on desktop
    if (!isMobile) return null;

    const getPositionStyles = () => {
        if (customPosition) return customPosition;
        
        const safeAreaBottom = useSafeArea ? 'calc(env(safe-area-inset-bottom) + 20px)' : '20px';
        
        return {
            bottom: safeAreaBottom,
            right: '20px'
        };
    };

    return (
        <motion.button
            onClick={onAddLink}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
                scale: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20,
                rotate: isVisible ? 0 : -180
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="fixed z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary-light shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            style={{
                ...getPositionStyles(),
                boxShadow: '0 8px 32px rgba(17, 60, 207, 0.3), 0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
        >
            {/* Plus Icon */}
            <motion.svg
                className="h-6 w-6 text-white transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                whileTap={{ rotate: 45 }}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </motion.svg>

            {/* Ripple effect */}
            <motion.div 
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.2 }}
            />

            {/* Floating shadow */}
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-lg scale-90 -z-10 group-hover:scale-100 transition-transform duration-300" />
        </motion.button>
    );
}