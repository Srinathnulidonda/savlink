// src/dashboard/components/header/MobileAddButton.jsx - Google Drive Style
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileAddButton({
    onAddLink,
    onCreateFolder,
    onImportLinks,
    position = 'auto',
    useSafeArea = true,
    customPosition = null
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll visibility logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsExpanded(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const getPositionStyles = () => {
        if (customPosition) return customPosition;
        
        const safeAreaBottom = useSafeArea ? 'calc(env(safe-area-inset-bottom) + 20px)' : '20px';
        
        return {
            bottom: safeAreaBottom,
            right: '20px'
        };
    };

    const actions = [
        {
            id: 'add-link',
            label: 'Add Link',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            ),
            action: onAddLink,
            color: 'bg-blue-600'
        },
        {
            id: 'create-folder',
            label: 'New Folder',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            action: onCreateFolder,
            color: 'bg-amber-600'
        },
        {
            id: 'import-links',
            label: 'Import Links',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            ),
            action: onImportLinks,
            color: 'bg-emerald-600'
        }
    ];

    const handleMainAction = () => {
        setIsExpanded(!isExpanded);
    };

    const handleActionClick = (action) => {
        action.action();
        setIsExpanded(false);
    };

    // Don't render on desktop
    if (!isMobile) return null;

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        className="fixed inset-0 z-40 bg-black/10"
                        onClick={() => setIsExpanded(false)}
                    />
                )}
            </AnimatePresence>

            {/* Action Items Container */}
            <div className="fixed z-50" style={getPositionStyles()}>
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-16 right-0 flex flex-col-reverse gap-3"
                        >
                            {actions.map((action, index) => (
                                <motion.div
                                    key={action.id}
                                    initial={{ 
                                        scale: 0,
                                        opacity: 0,
                                        y: 20
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        scale: 0,
                                        opacity: 0,
                                        y: 10
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        mass: 0.5,
                                        delay: index * 0.05
                                    }}
                                    className="flex items-center justify-end gap-2"
                                >
                                    {/* Action Label */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                            delay: index * 0.05 + 0.1
                                        }}
                                        className="bg-white px-3 py-2 rounded-full shadow-lg border border-gray-100"
                                        style={{
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                            {action.label}
                                        </span>
                                    </motion.div>

                                    {/* Action Button */}
                                    <motion.button
                                        onClick={() => handleActionClick(action)}
                                        whileHover={{ 
                                            scale: 1.1,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileTap={{ 
                                            scale: 0.95,
                                            transition: { duration: 0.1 }
                                        }}
                                        className={`h-10 w-10 rounded-full ${action.color} hover:brightness-110 shadow-lg flex items-center justify-center relative overflow-hidden`}
                                        style={{
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
                                        }}
                                    >
                                        <div className="text-white relative z-10">
                                            {action.icon}
                                        </div>
                                        
                                        {/* Hover overlay */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB */}
                <motion.button
                    onClick={handleMainAction}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                        scale: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 20,
                        rotate: 0
                    }}
                    whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ 
                        scale: 0.95,
                        transition: { duration: 0.1 }
                    }}
                    className="h-12 w-12 rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                        boxShadow: isExpanded
                            ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15)'
                            : '0 6px 24px rgba(0, 0, 0, 0.2), 0 3px 12px rgba(0, 0, 0, 0.12)'
                    }}
                >
                    {/* Plus/Close Icon */}
                    <motion.svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        animate={{ 
                            rotate: isExpanded ? 45 : 0,
                            scale: isExpanded ? 0.9 : 1
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </motion.svg>

                    {/* Ripple effect */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                            scale: 1.2, 
                            opacity: [0.3, 0],
                            transition: { duration: 0.4 }
                        }}
                    />

                    {/* Background gradient animation */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700/20 to-transparent"
                        animate={{
                            scale: isExpanded ? 1.1 : 1,
                            opacity: isExpanded ? 0.8 : 0
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                    />
                </motion.button>
            </div>
        </>
    );
}