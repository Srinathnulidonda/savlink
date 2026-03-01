// src/dashboard/components/links/LinkSkeleton.jsx

import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

function Pulse({ className = '' }) {
    return <div className={`animate-pulse bg-white/[0.04] rounded ${className}`} />;
}

const LIST_ROW_HEIGHT = 53;
const GRID_CARD_ESTIMATE = 210;
const GRID_GAP = 12;
const MIN_FILL = 300;

function getGridColumns() {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    if (w >= 1280) return 4;
    if (w >= 1024) return 3;
    if (w >= 640)  return 2;
    return 1;
}

function findScrollParent(el) {
    let node = el?.parentElement;
    while (node && node !== document.documentElement) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === 'auto' || overflowY === 'scroll') return node;
        node = node.parentElement;
    }
    return document.documentElement;
}

export default function LinkSkeleton({ viewMode = 'grid' }) {
    const containerRef = useRef(null);

    const [count, setCount] = useState(() => {
        if (typeof window === 'undefined') return 12;
        const h = window.innerHeight;
        if (viewMode === 'list') return Math.ceil(h / LIST_ROW_HEIGHT);
        const cols = getGridColumns();
        return Math.ceil(h / GRID_CARD_ESTIMATE) * cols;
    });

    const measure = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const scrollParent = findScrollParent(el);
        const spRect = scrollParent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const topOffset = elRect.top - spRect.top;
        const fillH = Math.max(spRect.height - topOffset, MIN_FILL);

        if (viewMode === 'list') {
            const firstRow = el.firstElementChild;
            const rowH = firstRow
                ? firstRow.getBoundingClientRect().height + 1
                : LIST_ROW_HEIGHT;
            setCount(Math.ceil(fillH / rowH));
        } else {
            const cols = getGridColumns();
            const firstCard = el.firstElementChild;
            const cardH = firstCard
                ? firstCard.getBoundingClientRect().height + GRID_GAP
                : GRID_CARD_ESTIMATE;
            const rows = Math.ceil(fillH / cardH);
            setCount(rows * cols);
        }
    }, [viewMode]);

    useLayoutEffect(() => {
        measure();
    }, [measure]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(measure);
        ro.observe(el);

        const sp = findScrollParent(el);
        if (sp !== document.documentElement) ro.observe(sp);

        return () => ro.disconnect();
    }, [measure]);

    const items = Array.from({ length: count });

    if (viewMode === 'list') {
        return (
            <div ref={containerRef} className="space-y-px">
                {items.map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 h-[52px]">
                        <Pulse className="w-4 h-4 rounded flex-shrink-0" />
                        <Pulse className="w-8 h-8 rounded-lg flex-shrink-0" />

                        <div className="flex-1 min-w-0 space-y-1.5">
                            <Pulse
                                className={`h-3.5 rounded ${
                                    i % 3 === 0 ? 'w-3/5' : i % 3 === 1 ? 'w-2/4' : 'w-4/6'
                                }`}
                            />
                            <Pulse
                                className={`h-2.5 rounded ${i % 2 === 0 ? 'w-2/5' : 'w-1/3'}`}
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-1.5">
                            {i % 3 !== 2 && <Pulse className="h-[22px] w-14 rounded-md" />}
                            {i % 2 === 0 && <Pulse className="h-[22px] w-11 rounded-md" />}
                        </div>

                        <Pulse className="h-3 w-7 rounded hidden lg:block" />
                        <Pulse className="h-3 w-6 rounded hidden sm:block" />
                        <Pulse className="w-7 h-7 rounded-md flex-shrink-0" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {items.map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.04] p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <Pulse className="w-9 h-9 rounded-lg" />
                            <div className="space-y-1">
                                <Pulse
                                    className={`h-3 rounded ${i % 2 === 0 ? 'w-16' : 'w-20'}`}
                                />
                                <Pulse className="h-2.5 w-8 rounded" />
                            </div>
                        </div>
                        <Pulse className="w-7 h-7 rounded-md" />
                    </div>

                    <div className="space-y-1.5 mb-2">
                        <Pulse
                            className={`h-4 rounded ${
                                i % 3 === 0
                                    ? 'w-[85%]'
                                    : i % 3 === 1
                                      ? 'w-[70%]'
                                      : 'w-[90%]'
                            }`}
                        />
                        {i % 2 === 0 && (
                            <Pulse
                                className={`h-4 rounded ${
                                    i % 4 === 0 ? 'w-[45%]' : 'w-[55%]'
                                }`}
                            />
                        )}
                    </div>

                    <Pulse
                        className={`h-2.5 rounded mb-1 ${
                            i % 2 === 0 ? 'w-[60%]' : 'w-[50%]'
                        }`}
                    />

                    {i % 5 === 0 && (
                        <div className="mt-2.5 space-y-1">
                            <Pulse className="h-3 w-full rounded" />
                            <Pulse className="h-3 w-3/4 rounded" />
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03]">
                        <div className="flex gap-1.5">
                            <Pulse className="h-[22px] w-12 rounded-md" />
                            {i % 2 === 0 && (
                                <Pulse className="h-[22px] w-10 rounded-md" />
                            )}
                            {i % 4 === 0 && (
                                <Pulse className="h-[22px] w-9 rounded-md" />
                            )}
                        </div>
                        <Pulse
                            className={`h-3 rounded ${
                                i % 2 === 0 ? 'w-16' : 'w-10'
                            }`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}