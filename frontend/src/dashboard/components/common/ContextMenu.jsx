// src/dashboard/components/common/ContextMenu.jsx

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Context for nested menus ────────────────────────────────
const ContextMenuContext = createContext({
    closeAll: () => {},
});

export function useContextMenu() {
    return useContext(ContextMenuContext);
}

// ── Provider — wraps any area that needs right-click ────────
export function ContextMenuProvider({ children }) {
    const [menu, setMenu] = useState(null);

    const open = useCallback((e, items, meta = {}) => {
        e.preventDefault();
        e.stopPropagation();

        const x = e.clientX;
        const y = e.clientY;

        // Calculate position to keep menu in viewport
        const menuWidth = 220;
        const menuHeight = items.length * 36 + 20;
        const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
        const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

        setMenu({
            x: Math.max(8, adjustedX),
            y: Math.max(8, adjustedY),
            items,
            meta,
        });
    }, []);

    const close = useCallback(() => {
        setMenu(null);
    }, []);

    // Close on scroll
    useEffect(() => {
        if (!menu) return;
        const handler = () => close();
        window.addEventListener('scroll', handler, true);
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('scroll', handler, true);
            window.removeEventListener('resize', handler);
        };
    }, [menu, close]);

    // Close on Escape
    useEffect(() => {
        if (!menu) return;
        const handler = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [menu, close]);

    return (
        <ContextMenuContext.Provider value={{ open, close, closeAll: close }}>
            {children}

            <AnimatePresence>
                {menu && (
                    <ContextMenuOverlay
                        x={menu.x}
                        y={menu.y}
                        items={menu.items}
                        onClose={close}
                    />
                )}
            </AnimatePresence>
        </ContextMenuContext.Provider>
    );
}

// ── Menu Overlay ────────────────────────────────────────────

function ContextMenuOverlay({ x, y, items, onClose }) {
    const menuRef = useRef(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Get only actionable items (skip dividers)
    const actionableItems = items.filter(i => !i.type);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setFocusedIndex(prev => {
                        const next = prev + 1;
                        return next >= actionableItems.length ? 0 : next;
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex(prev => {
                        const next = prev - 1;
                        return next < 0 ? actionableItems.length - 1 : next;
                    });
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (focusedIndex >= 0 && actionableItems[focusedIndex]) {
                        actionableItems[focusedIndex].action?.();
                        onClose();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [focusedIndex, actionableItems, onClose]);

    let actionIndex = -1;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60]"
                onClick={onClose}
                onContextMenu={(e) => { e.preventDefault(); onClose(); }}
            />

            {/* Menu */}
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.08 }}
                style={{ left: x, top: y }}
                className="fixed z-[70] w-[220px] rounded-xl border border-gray-800/60 
                           bg-[#111111] shadow-2xl shadow-black/60 overflow-hidden py-1
                           backdrop-blur-xl"
            >
                {items.map((item, i) => {
                    if (item.type === 'divider') {
                        return <div key={`d-${i}`} className="my-1 mx-2.5 border-t border-gray-800/50" />;
                    }

                    if (item.type === 'label') {
                        return (
                            <div key={`l-${i}`} className="px-3 pt-2 pb-1">
                                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    actionIndex++;
                    const currentActionIndex = actionIndex;
                    const isFocused = focusedIndex === currentActionIndex;

                    return (
                        <button
                            key={item.id || item.label}
                            onClick={() => { item.action?.(); onClose(); }}
                            onMouseEnter={() => setFocusedIndex(currentActionIndex)}
                            disabled={item.disabled}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-[7px] 
                                       text-[13px] transition-colors outline-none
                                       ${item.disabled
                                    ? 'text-gray-700 cursor-not-allowed'
                                    : item.danger
                                        ? `text-red-400 ${isFocused ? 'bg-red-500/10 text-red-300' : 'hover:bg-red-500/10'}`
                                        : item.active
                                            ? `text-amber-400 ${isFocused ? 'bg-white/[0.05]' : 'hover:bg-white/[0.04]'}`
                                            : `text-gray-300 ${isFocused ? 'bg-white/[0.06] text-white' : 'hover:bg-white/[0.04] hover:text-white'}`
                                }`}
                        >
                            <span className="flex items-center gap-2.5 min-w-0">
                                {item.icon && (
                                    <span className={`flex-shrink-0 ${item.danger ? 'text-red-400' : item.active ? 'text-amber-400' : 'text-gray-500'}`}>
                                        {item.icon}
                                    </span>
                                )}
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                    <span className="text-[10px] text-gray-500 bg-gray-800/60 px-1.5 py-0.5 rounded">
                                        {item.badge}
                                    </span>
                                )}
                            </span>

                            {item.shortcut && (
                                <span className="flex items-center gap-0.5 flex-shrink-0">
                                    {item.shortcut.split('+').map((key, ki) => (
                                        <kbd key={ki}
                                            className="min-w-[18px] h-[18px] flex items-center justify-center
                                                       text-[10px] font-mono text-gray-600 
                                                       bg-gray-800/40 border border-gray-700/30 
                                                       rounded px-1 leading-none">
                                            {key}
                                        </kbd>
                                    ))}
                                </span>
                            )}
                        </button>
                    );
                })}
            </motion.div>
        </>
    );
}

export default ContextMenuProvider;