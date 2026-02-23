// src/dashboard/pages/home/components/PinnedLinks.jsx

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLinkColor, getDomain, getDomainInitial } from '../utils';

export default function PinnedLinks({ links = [] }) {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [canScroll, setCanScroll] = useState({ left: false, right: false });

    const pinned = links.filter(l => l.pinned).slice(0, 12);

    // Detect scroll position for fade indicators
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const check = () => {
            setCanScroll({
                left: el.scrollLeft > 4,
                right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
            });
        };

        check();
        el.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        return () => {
            el.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, [pinned.length]);

    if (pinned.length === 0) return null;

    const openLink = (link) => {
        if (link.original_url) {
            window.open(link.original_url, '_blank', 'noopener,noreferrer');
        }
    };

    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
    };

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-[13px] font-medium text-gray-400 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-amber-500/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    Quick access
                </h2>

                <div className="flex items-center gap-1">
                    {/* Scroll arrows */}
                    <button
                        onClick={() => scroll(-1)}
                        className={`p-1 rounded-md transition-colors ${canScroll.left
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            : 'text-gray-800 cursor-default'}`}
                        disabled={!canScroll.left}
                        aria-label="Scroll left"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className={`p-1 rounded-md transition-colors ${canScroll.right
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            : 'text-gray-800 cursor-default'}`}
                        disabled={!canScroll.right}
                        aria-label="Scroll right"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scrollable row */}
            <div className="relative">
                {/* Left fade */}
                {canScroll.left && (
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                )}
                {/* Right fade */}
                {canScroll.right && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-2.5 overflow-x-auto scrollbar-none -mx-1 px-1 py-0.5"
                >
                    {pinned.map((link, i) => {
                        const color = getLinkColor(link.original_url);
                        const domain = getDomain(link.original_url);
                        const initial = getDomainInitial(link.original_url);

                        return (
                            <motion.button
                                key={link.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => openLink(link)}
                                className="flex-shrink-0 w-[140px] sm:w-[156px] p-3 rounded-xl
                                           border border-gray-800/50 bg-gray-900/20
                                           hover:border-gray-700/50 hover:bg-gray-900/50
                                           transition-all text-left group active:scale-[0.98]"
                            >
                                <div className={`w-8 h-8 rounded-lg ${color.bg} border ${color.border} 
                                                 flex items-center justify-center mb-2.5 
                                                 group-hover:scale-105 transition-transform`}>
                                    <span className={`text-xs font-bold ${color.text}`}>
                                        {initial}
                                    </span>
                                </div>

                                <p className="text-[13px] font-medium text-gray-300 truncate 
                                              group-hover:text-white transition-colors leading-snug">
                                    {link.title || 'Untitled'}
                                </p>
                                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                                    {domain}
                                </p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}