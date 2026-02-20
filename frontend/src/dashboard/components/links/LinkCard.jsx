// src/dashboard/components/links/LinkCard.jsx - Enhanced mobile responsive
import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef } from 'react';
import LinkMeta from './LinkMeta';
import LinkActions from './LinkActions';

const LinkCard = forwardRef(({
    link,
    index = 0,
    viewMode = 'grid',
    isHovered,
    onHover,
    onClick,
    onPin,
    onArchive,
    onDelete,
    onEdit
}, ref) => {
    const [showActions, setShowActions] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const isMobile = window.innerWidth < 768;

    const getColorFromLink = () => {
        const colors = [
            'from-purple-500/20 to-indigo-500/20',
            'from-blue-500/20 to-cyan-500/20',
            'from-gray-600/20 to-gray-500/20',
            'from-cyan-500/20 to-teal-500/20',
            'from-blue-400/20 to-blue-600/20',
            'from-pink-500/20 to-rose-500/20',
        ];
        return colors[index % colors.length];
    };

    const getFaviconEmoji = () => {
        const emojis = ['🟣', '🔵', '▲', '🎨', '⚛️', '🎭'];
        return emojis[index % emojis.length];
    };

    // Handle touch events for mobile
    const handleTouchStart = () => {
        if (isMobile) {
            setIsPressed(true);
            setTimeout(() => setIsPressed(false), 150);
        }
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={onClick}
                onMouseEnter={() => !isMobile && onHover?.(link.id)}
                onMouseLeave={() => !isMobile && onHover?.(null)}
                onTouchStart={handleTouchStart}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border border-gray-900 bg-gray-950/50 p-3 sm:p-4 transition-all hover:border-gray-800 hover:bg-gray-950 ${
                    isPressed ? 'scale-95 bg-gray-900' : ''
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br ${getColorFromLink()} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg sm:text-xl">{link.favicon || getFaviconEmoji()}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <LinkMeta link={link} />
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                        {link.tags && link.tags.length > 0 && (
                            <div className="hidden lg:flex gap-1">
                                {link.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">{link.relative_time}</span>
                    </div>

                    <LinkActions 
                        link={link}
                        onPin={onPin}
                        onArchive={onArchive}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isListView={true}
                    />
                </div>
                
                {/* Mobile time display */}
                <div className="sm:hidden mt-2 text-xs text-gray-500">
                    {link.relative_time}
                </div>
            </motion.div>
        );
    }

    // Grid View
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                scale: isPressed ? 0.95 : 1 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onMouseEnter={() => !isMobile && onHover?.(link.id)}
            onMouseLeave={() => !isMobile && onHover?.(null)}
            onTouchStart={handleTouchStart}
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl border border-gray-900 bg-gray-950/50 transition-all hover:border-gray-800 hover:bg-gray-950 active:scale-95"
        >
            {/* Preview Area */}
            <div className={`aspect-[16/12] sm:aspect-[16/10] overflow-hidden bg-gradient-to-br ${getColorFromLink()}`}>
                <div className="flex h-full items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl">{link.favicon || getFaviconEmoji()}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
                <LinkMeta link={link} />

                {link.notes_preview && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-400 line-clamp-2">
                        {link.notes_preview}
                    </p>
                )}

                {link.tags && link.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {link.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] sm:text-xs text-gray-400"
                            >
                                {tag}
                            </span>
                        ))}
                        {link.tags.length > 3 && (
                            <span className="text-[10px] sm:text-xs text-gray-600">
                                +{link.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-2 sm:mt-3 flex items-center justify-between border-t border-gray-900 pt-2 sm:pt-3">
                    <span className="text-[10px] sm:text-xs text-gray-500">{link.relative_time}</span>
                    {link.link_type === 'shortened' && (
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {link.click_count || 0}
                        </span>
                    )}
                    {/* Pin indicator */}
                    {link.pinned && (
                        <span className="text-yellow-500 text-sm">📌</span>
                    )}
                </div>
            </div>

            {/* Hover Actions - Desktop only */}
            <AnimatePresence>
                {!isMobile && isHovered && (
                    <LinkActions 
                        link={link}
                        onPin={onPin}
                        onArchive={onArchive}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isHovered={true}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
});

LinkCard.displayName = 'LinkCard';
export default LinkCard;