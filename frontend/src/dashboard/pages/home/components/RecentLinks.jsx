// src/dashboard/pages/home/components/RecentLinks.jsx

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLinkColor, getDomain, getDomainInitial, formatRelativeTime } from '../utils';
import toast from 'react-hot-toast';

export default function RecentLinks({ links = [], onAddLink }) {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState(null);

    const openLink = useCallback((e, link) => {
        e.stopPropagation();
        window.open(link.original_url, '_blank', 'noopener,noreferrer');
    }, []);

    const copyUrl = useCallback(async (e, link) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(link.original_url);
            setCopiedId(link.id);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    }, []);

    return (
        <section className="rounded-xl border border-gray-800/50 bg-gray-900/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800/30">
                <h2 className="text-[13px] font-medium text-gray-300">
                    Recent
                </h2>
                {links.length > 0 && (
                    <button
                        onClick={() => navigate('/dashboard/links/recent')}
                        className="text-[12px] text-gray-600 hover:text-gray-400 transition-colors 
                                   flex items-center gap-1 group"
                    >
                        View all
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Empty State */}
            {links.length === 0 ? (
                <div className="px-5 py-16 text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-800/30 border border-gray-800/50 
                                    flex items-center justify-center mb-5">
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-200 mb-1.5">
                        Start building your library
                    </p>
                    <p className="text-[13px] text-gray-500 max-w-[260px] mx-auto leading-relaxed mb-5">
                        Save links from anywhere on the web to access them later.
                    </p>
                    <button
                        onClick={onAddLink}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium 
                                   text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Save your first link
                    </button>
                </div>
            ) : (
                <div>
                    {links.slice(0, 8).map((link, index) => {
                        const color = getLinkColor(link.original_url);
                        const domain = getDomain(link.original_url);
                        const initial = getDomainInitial(link.original_url);
                        const isCopied = copiedId === link.id;

                        return (
                            <motion.div
                                key={link.id || index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.025 }}
                                onClick={(e) => openLink(e, link)}
                                className="flex items-center gap-3.5 px-5 py-3 cursor-pointer
                                           border-b border-gray-800/20 last:border-b-0
                                           hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Favicon */}
                                <div className={`w-9 h-9 rounded-lg ${color.bg} border ${color.border}
                                                 flex items-center justify-center flex-shrink-0
                                                 group-hover:scale-105 transition-transform`}>
                                    <span className={`text-xs font-bold ${color.text}`}>
                                        {initial}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[13px] font-medium text-gray-200 truncate 
                                                      group-hover:text-white transition-colors">
                                            {link.title || 'Untitled'}
                                        </p>
                                        {/* ── Star = favorite ── */}
                                        {link.starred && (
                                            <svg className="w-3 h-3 text-amber-500/60 flex-shrink-0"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                        )}
                                        {/* ── Pin = quick-access ── */}
                                        {link.pinned && (
                                            <svg className="w-3 h-3 text-primary/60 flex-shrink-0"
                                                viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M4.146.146A.5.5 0 014.5 0h7a.5.5 0 01.5.5c0
                                                        .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36
                                                        7.775 13 8.527 13 9.5a.5.5 0 01-.5.5h-4v4.5a.5.5 0
                                                        01-1 0V10h-4A.5.5 0 013 9.5c0-.973.64-1.725
                                                        1.17-2.189A5.92 5.92 0 015 6.708V2.277a2.77 2.77 0
                                                        01-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 01.146-.354z" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-600 truncate mt-0.5">
                                        {domain}
                                    </p>
                                </div>

                                {/* Time */}
                                <span className="text-[11px] text-gray-600 tabular-nums flex-shrink-0 
                                                 hidden sm:block">
                                    {link.relative_time || formatRelativeTime(link.created_at)}
                                </span>

                                {/* Actions — visible on hover */}
                                <div className="flex items-center gap-0.5 flex-shrink-0 
                                                opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Copy */}
                                    <button
                                        onClick={(e) => copyUrl(e, link)}
                                        className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 
                                                   hover:bg-gray-800/50 transition-colors"
                                        title="Copy URL"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isCopied ? (
                                                <motion.svg
                                                    key="check"
                                                    initial={{ scale: 0.5 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-3.5 h-3.5 text-emerald-400"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </motion.svg>
                                            ) : (
                                                <motion.svg
                                                    key="copy"
                                                    className="w-3.5 h-3.5"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                </motion.svg>
                                            )}
                                        </AnimatePresence>
                                    </button>

                                    {/* External link */}
                                    <button
                                        onClick={(e) => openLink(e, link)}
                                        className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 
                                                   hover:bg-gray-800/50 transition-colors"
                                        title="Open in new tab"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}