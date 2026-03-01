// src/dashboard/modals/AddLink/AddLinkModal.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddLink } from './useAddLink';

export default function AddLinkModal({ isOpen, onClose, onSubmit }) {
    const { addLink, loading, error, clearError } = useAddLink();

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [linkType, setLinkType] = useState('saved');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [urlMeta, setUrlMeta] = useState(null);
    const [fetchingMeta, setFetchingMeta] = useState(false);
    const [screenType, setScreenType] = useState(() => {
        const width = window.innerWidth;
        if (width >= 768) return 'desktop';
        if (width >= 640) return 'tablet';
        if (width >= 430) return 'large-mobile';
        if (width >= 390) return 'medium-mobile';
        if (width >= 375) return 'small-mobile';
        return 'mini-mobile';
    });
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    const urlInputRef = useRef(null);
    const lastFetchedUrl = useRef('');
    const isInitialized = useRef(false);
    const modalContentRef = useRef(null);
    const handleSubmitRef = useRef(null);

    // ── Screen type detection ───────────────────────────
    useEffect(() => {
        const detectScreen = () => {
            const width = window.innerWidth;

            if (width >= 768) {
                setScreenType('desktop');
            } else if (width >= 640) {
                setScreenType('tablet');
            } else if (width >= 430) {
                setScreenType('large-mobile');
            } else if (width >= 390) {
                setScreenType('medium-mobile');
            } else if (width >= 375) {
                setScreenType('small-mobile');
            } else {
                setScreenType('mini-mobile');
            }
        };

        window.addEventListener('resize', detectScreen);
        return () => window.removeEventListener('resize', detectScreen);
    }, []);

    // ── Keyboard detection (for mobile) ─────────────────
    useEffect(() => {
        if (screenType === 'desktop' || screenType === 'tablet') return;

        const detectKeyboard = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const windowHeight = window.innerHeight;
            setKeyboardOpen(viewportHeight < windowHeight * 0.75);
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', detectKeyboard);
            return () => window.visualViewport?.removeEventListener('resize', detectKeyboard);
        }
    }, [screenType]);

    // ── Reset on open ───────────────────────────────────
    useEffect(() => {
        if (isOpen && !isInitialized.current) {
            isInitialized.current = true;
            setUrl('');
            setTitle('');
            setNotes('');
            setLinkType('saved');
            setTags([]);
            setTagInput('');
            setShowAdvanced(false);
            setUrlMeta(null);
            lastFetchedUrl.current = '';
            clearError();

            const timer = setTimeout(() => {
                if (screenType === 'desktop' || screenType === 'tablet') {
                    urlInputRef.current?.focus();
                }
            }, 300);
            return () => clearTimeout(timer);
        }

        if (!isOpen) {
            isInitialized.current = false;
        }
    }, [isOpen, screenType, clearError]);

    // ── Lock body scroll ────────────────────────────────
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // ── Escape to close ─────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;

        const handler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && url.trim()) {
                e.preventDefault();
                handleSubmitRef.current?.();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose, url]);

    // ── Fetch metadata ──────────────────────────────────
    useEffect(() => {
        if (!isOpen || !url.trim()) {
            setUrlMeta(null);
            return;
        }

        const trimmedUrl = url.trim();
        if (lastFetchedUrl.current === trimmedUrl) return;

        let urlObj;
        try {
            const formatted = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
            urlObj = new URL(formatted);
            if (!['http:', 'https:'].includes(urlObj.protocol)) return;
        } catch {
            return;
        }

        const timeoutId = setTimeout(() => {
            setFetchingMeta(true);
            const domain = urlObj.hostname.replace('www.', '');
            const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

            lastFetchedUrl.current = trimmedUrl;
            setUrlMeta({ domain, favicon });
            setFetchingMeta(false);

            if (!title.trim()) {
                setTitle(domain);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [url, isOpen, title]);

    // ── Paste from clipboard ────────────────────────────
    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && (text.startsWith('http') || text.includes('.'))) {
                setUrl(text.startsWith('http') ? text : `https://${text}`);
                clearError();
            }
        } catch {
            // Clipboard access denied
        }
    }, [clearError]);

    // ── Tag management ──────────────────────────────────
    const addTag = useCallback((tag) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && tags.length < 5) {
            setTags(prev => {
                if (prev.includes(trimmed)) return prev;
                return [...prev, trimmed];
            });
        }
        setTagInput('');
    }, [tags.length]);

    const removeTag = useCallback((tagToRemove) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    }, []);

    const handleTagKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (tagInput.trim()) addTag(tagInput);
        } else if (e.key === 'Backspace' && !tagInput) {
            setTags(prev => prev.slice(0, -1));
        }
    }, [tagInput, addTag]);

    // ── Submit ──────────────────────────────────────────
    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();

        const trimmedUrl = url.trim();
        if (!trimmedUrl || loading) return;

        const formattedUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;

        const linkData = {
            original_url: formattedUrl,
            title: title.trim() || urlMeta?.domain || '',
            notes: notes.trim(),
            link_type: linkType,
            tags,
        };

        const result = await addLink(linkData);

        if (result.success) {
            onSubmit?.(linkData);
            onClose();
        }
    }, [url, title, notes, linkType, tags, urlMeta, loading, addLink, onSubmit, onClose]);

    handleSubmitRef.current = handleSubmit;

    // ── Responsive styles ───────────────────────────────
    const getModalStyles = () => {
        const isMobile = ['mini-mobile', 'small-mobile', 'medium-mobile', 'large-mobile'].includes(screenType);

        if (isMobile) {
            const pad = screenType === 'mini-mobile' ? 'p-3' : 'p-4';
            const headerPad = screenType === 'mini-mobile' ? 'px-3 py-2.5' : 'px-4 py-3';
            return {
                wrapper: 'items-end',
                modal: 'w-screen rounded-t-2xl rounded-b-none max-h-[92vh]',
                padding: pad,
                headerPadding: headerPad,
            };
        }

        return {
            wrapper: 'items-center pt-0',
            modal: 'w-full max-w-[520px] rounded-xl mx-4 max-h-[85vh]',
            padding: 'p-5',
            headerPadding: 'px-5 py-4',
        };
    };

    const getInputStyles = () => {
        switch (screenType) {
            case 'mini-mobile':
                return { height: 'h-10', text: 'text-[14px]', label: 'text-[11px]' };
            case 'small-mobile':
                return { height: 'h-10', text: 'text-[14px]', label: 'text-[11px]' };
            case 'medium-mobile':
            case 'large-mobile':
                return { height: 'h-11', text: 'text-[15px]', label: 'text-[11px]' };
            default:
                return { height: 'h-11', text: 'text-[14px]', label: 'text-[12px]' };
        }
    };

    const styles = getModalStyles();
    const inputStyles = getInputStyles();
    const isMobile = ['mini-mobile', 'small-mobile', 'medium-mobile', 'large-mobile'].includes(screenType);
    const isSmallMobile = ['mini-mobile', 'small-mobile'].includes(screenType);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`fixed inset-0 z-[200] flex justify-center 
                               bg-black/80 backdrop-blur-sm ${styles.wrapper}`}
                    style={{
                        paddingTop: isMobile ? '0' : 'max(env(safe-area-inset-top), 20px)',
                        paddingBottom: isMobile ? '0' : 'env(safe-area-inset-bottom)',
                    }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={isMobile
                            ? { y: '100%', opacity: 1 }
                            : { opacity: 0, scale: 0.96, y: 10 }
                        }
                        animate={isMobile
                            ? { y: 0, opacity: 1 }
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        exit={isMobile
                            ? { y: '100%', opacity: 1 }
                            : { opacity: 0, scale: 0.96, y: 10 }
                        }
                        transition={isMobile
                            ? { type: 'spring', damping: 30, stiffness: 350 }
                            : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                        }
                        drag={isMobile ? 'y' : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        className={`bg-[#111] shadow-2xl shadow-black/50 overflow-hidden flex flex-col
                                   ${isMobile ? 'border-t border-gray-800/60' : 'border-t border-x border-gray-800/60'}
                                   ${styles.modal}`}
                        style={{
                            paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0',
                            margin: isMobile ? 0 : undefined,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ── Drag Handle (Mobile) ───────────── */}
                        {isMobile && (
                            <div className="flex justify-center pt-2 pb-0.5 flex-shrink-0">
                                <div className="w-8 h-1 rounded-full bg-gray-700" />
                            </div>
                        )}

                        {/* ── Header ─────────────────────────── */}
                        <div className={`flex items-center justify-between border-b border-gray-800/40 
                                        flex-shrink-0 ${styles.headerPadding}`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0
                                                ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}>
                                    <svg className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}
                                         fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" strokeWidth={2}
                                         style={{ color: 'var(--color-primary, #6366f1)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <h2 className={`font-semibold text-white truncate
                                                   ${isMobile ? 'text-[14px]' : 'text-[15px]'}`}>
                                        {linkType === 'shortened' ? 'Shorten Link' : 'Save Link'}
                                    </h2>
                                    <p className={`text-gray-500 truncate
                                                  ${isMobile ? 'text-[11px] mt-0' : 'text-[11px] mt-0.5'}`}>
                                        {linkType === 'shortened' ? 'Create a short URL' : 'Save to your collection'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] 
                                           rounded-lg transition-colors flex-shrink-0
                                           ${isMobile ? 'p-2 -mr-1' : 'p-2 -mr-1'}`}
                            >
                                <svg className={isMobile ? 'w-4 h-4' : 'w-4 h-4'}
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* ── Scrollable Content ─────────────── */}
                        <div
                            ref={modalContentRef}
                            className={`flex-1 overflow-y-auto overscroll-contain ${styles.padding}`}
                            style={{
                                maxHeight: isMobile && keyboardOpen ? '50vh' : undefined,
                            }}
                        >
                            <form onSubmit={handleSubmit} className="flex flex-col">

                                {/* Link Type Toggle */}
                                <div className={`flex items-center gap-1 p-1 bg-gray-900/50 rounded-xl
                                                ${isMobile ? 'mb-3.5' : 'mb-5'}`}>
                                    <TypeButton
                                        active={linkType === 'saved'}
                                        onClick={() => setLinkType('saved')}
                                        label="Save"
                                        icon={<BookmarkIcon small={isMobile} />}
                                        isMobile={isMobile}
                                        isSmallMobile={isSmallMobile}
                                    />
                                    <TypeButton
                                        active={linkType === 'shortened'}
                                        onClick={() => setLinkType('shortened')}
                                        label="Shorten"
                                        icon={<LinkIcon small={isMobile} />}
                                        isMobile={isMobile}
                                        isSmallMobile={isSmallMobile}
                                    />
                                </div>

                                {/* URL Input */}
                                <div className={isMobile ? 'mb-3.5' : 'mb-4'}>
                                    <label className={`block font-medium text-gray-400 ${inputStyles.label}
                                                      ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                                        URL
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center
                                                        ${isMobile ? 'left-3' : 'left-3.5'}`}>
                                            {fetchingMeta ? (
                                                <div className={`border-2 border-gray-700 border-t-primary rounded-full animate-spin
                                                                ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                            ) : urlMeta?.favicon ? (
                                                <img
                                                    src={urlMeta.favicon}
                                                    alt=""
                                                    className={`rounded ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <GlobeIcon className={`text-gray-600 ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                            )}
                                        </div>
                                        <input
                                            ref={urlInputRef}
                                            type="text"
                                            value={url}
                                            onChange={(e) => { setUrl(e.target.value); clearError(); }}
                                            placeholder="https://example.com"
                                            className={`w-full text-white 
                                                       bg-gray-900/50 border rounded-xl
                                                       placeholder-gray-600 outline-none transition-all
                                                       ${isMobile ? 'pl-9 pr-[52px]' : 'pl-11 pr-[70px]'}
                                                       ${inputStyles.height} ${inputStyles.text}
                                                       ${error
                                                           ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                           : 'border-gray-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
                                                       }`}
                                            autoComplete="off"
                                            autoCapitalize="off"
                                            autoCorrect="off"
                                            spellCheck={false}
                                            enterKeyHint="next"
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePaste}
                                            className={`absolute right-1 top-1/2 -translate-y-1/2 
                                                       font-medium transition-colors active:scale-95
                                                       ${isMobile 
                                                           ? 'text-[11px] text-primary hover:text-primary-light px-2 py-1' 
                                                           : 'px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-gray-300 bg-gray-800/60 hover:bg-gray-800 rounded-lg'}`}
                                        >
                                            Paste
                                        </button>
                                    </div>
                                    {error && (
                                        <p className={`mt-1.5 text-red-400 flex items-center gap-1.5
                                                      ${isMobile ? 'text-[11px]' : 'text-[11px]'}`}>
                                            <WarningIcon className="w-3 h-3 flex-shrink-0" />
                                            {error}
                                        </p>
                                    )}
                                    {urlMeta && !error && (
                                        <p className={`mt-1.5 text-emerald-500 flex items-center gap-1.5
                                                      ${isMobile ? 'text-[11px]' : 'text-[11px]'}`}>
                                            <CheckIcon className="w-3 h-3 flex-shrink-0" />
                                            {urlMeta.domain}
                                        </p>
                                    )}
                                </div>

                                {/* Title Input */}
                                <div className={isMobile ? 'mb-3.5' : 'mb-4'}>
                                    <label className={`block font-medium text-gray-400 ${inputStyles.label}
                                                      ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                                        Title <span className="text-gray-600 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter a title"
                                        className={`w-full px-3 text-white 
                                                   bg-gray-900/50 border border-gray-800 rounded-xl
                                                   placeholder-gray-600 outline-none transition-all
                                                   focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                                                   ${inputStyles.height} ${inputStyles.text}`}
                                        enterKeyHint="next"
                                    />
                                </div>

                                {/* Advanced Options Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`flex items-center gap-1.5 text-gray-500 
                                               hover:text-gray-300 active:text-gray-200 
                                               transition-colors touch-manipulation
                                               ${isMobile ? 'text-[12px] mb-3 py-0.5' : 'text-[12px] mb-4'}`}
                                >
                                    <motion.svg
                                        className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        animate={{ rotate: showAdvanced ? 90 : 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                    More options
                                </button>

                                {/* Advanced Options */}
                                <AnimatePresence>
                                    {showAdvanced && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`${isMobile ? 'space-y-3 pb-3' : 'space-y-4 pb-4'}`}>
                                                {/* Notes */}
                                                <div>
                                                    <label className={`block font-medium text-gray-400 ${inputStyles.label}
                                                                      ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                                                        Notes
                                                    </label>
                                                    <textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Add a note..."
                                                        rows={isMobile ? 3 : 3}
                                                        className={`w-full px-3 py-2.5 text-white 
                                                                   bg-gray-900/50 border border-gray-800 rounded-xl
                                                                   placeholder-gray-600 outline-none transition-all
                                                                   focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                                                                   resize-none ${inputStyles.text}`}
                                                    />
                                                </div>

                                                {/* Tags */}
                                                <div>
                                                    <label className={`block font-medium text-gray-400 ${inputStyles.label}
                                                                      ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                                                        Tags <span className="text-gray-600 font-normal">(max 5)</span>
                                                    </label>
                                                    <div className={`flex flex-wrap items-center gap-1.5
                                                                   bg-gray-900/50 border border-gray-800 rounded-xl
                                                                   focus-within:border-primary/50 focus-within:ring-2 
                                                                   focus-within:ring-primary/20 transition-all
                                                                   ${isMobile ? 'p-2.5 min-h-[42px]' : 'p-3 min-h-[44px]'}`}>
                                                        {tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className={`inline-flex items-center gap-1 
                                                                           text-gray-300 bg-gray-800 
                                                                           border border-gray-700/50 rounded-md
                                                                           ${isMobile ? 'px-2 py-1 text-[11px]' : 'px-2 py-1 text-[12px]'}`}
                                                            >
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTag(tag)}
                                                                    className="text-gray-500 hover:text-gray-300 
                                                                               transition-colors p-0.5"
                                                                >
                                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24"
                                                                         stroke="currentColor" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                                              d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        ))}
                                                        {tags.length < 5 && (
                                                            <input
                                                                type="text"
                                                                value={tagInput}
                                                                onChange={(e) => setTagInput(e.target.value)}
                                                                onKeyDown={handleTagKeyDown}
                                                                placeholder={tags.length === 0 ? "Add tags..." : ""}
                                                                className={`flex-1 min-w-[80px] bg-transparent text-white 
                                                                           placeholder-gray-600 outline-none
                                                                           ${isMobile ? 'text-[13px]' : 'text-[13px]'}`}
                                                                enterKeyHint="done"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className={`mt-1 text-gray-600 
                                                                  ${isMobile ? 'text-[10px]' : 'text-[10px]'}`}>
                                                        Press Enter or comma to add
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        {/* ── Footer ─────────────────────────── */}
                        <div
                            className={`flex-shrink-0 border-t border-gray-800/40 
                                       ${isMobile ? 'px-4 pt-3 pb-1' : styles.padding}`}
                            style={{
                                paddingBottom: isMobile
                                    ? 'max(env(safe-area-inset-bottom), 12px)'
                                    : undefined,
                            }}
                        >
                            {/* Desktop: Keyboard hint + buttons */}
                            {!isMobile && (
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 
                                                        border border-gray-700/50 rounded">⌘</kbd>
                                        <span>+</span>
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 
                                                        border border-gray-700/50 rounded">↵</kbd>
                                        <span className="ml-1">to save</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-[13px] font-medium text-gray-400 
                                                       hover:text-gray-200 hover:bg-white/[0.05] 
                                                       rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!url.trim() || loading}
                                            className="px-5 py-2 text-[13px] font-medium text-white 
                                                       bg-primary hover:bg-primary-light 
                                                       disabled:opacity-50 disabled:cursor-not-allowed
                                                       rounded-lg transition-all flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-white/30 
                                                                    border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                linkType === 'shortened' ? 'Create Short Link' : 'Save Link'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Mobile: Compact buttons */}
                            {isMobile && (
                                <div className="space-y-2">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!url.trim() || loading}
                                        className={`w-full font-semibold text-white 
                                                   bg-primary hover:bg-primary-light active:brightness-90
                                                   disabled:opacity-50 disabled:cursor-not-allowed
                                                   rounded-xl transition-all flex items-center justify-center gap-2
                                                   ${isSmallMobile ? 'py-2.5 text-[13px]' : 'py-3 text-[14px]'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className={`border-2 border-white/30 
                                                                border-t-white rounded-full animate-spin
                                                                ${isSmallMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                                Saving...
                                            </>
                                        ) : (
                                            linkType === 'shortened' ? 'Create Short Link' : 'Save Link'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`w-full font-medium text-gray-400 
                                                   hover:text-gray-200 active:bg-white/[0.05] 
                                                   rounded-xl transition-colors
                                                   ${isSmallMobile ? 'py-2 text-[12px]' : 'py-2.5 text-[13px]'}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── Sub Components ──────────────────────────────────────────

function TypeButton({ active, onClick, icon, label, isMobile, isSmallMobile }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 
                       font-medium rounded-lg transition-all active:scale-[0.98]
                       ${isSmallMobile
                           ? 'px-3 py-2 text-[12px]'
                           : isMobile
                               ? 'px-3 py-2.5 text-[13px]'
                               : 'px-3 py-2.5 text-[13px]'
                       }
                       ${active
                           ? 'bg-white/[0.1] text-white shadow-sm'
                           : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] active:bg-white/[0.05]'
                       }`}
        >
            {icon}
            {label}
        </button>
    );
}

// ── Icons ───────────────────────────────────────────────────

function BookmarkIcon({ small }) {
    return (
        <svg className={small ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
    );
}

function LinkIcon({ small }) {
    return (
        <svg className={small ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
    );
}

function GlobeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    );
}

function WarningIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}

function CheckIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}