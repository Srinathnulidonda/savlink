// src/dashboard/layout/DashboardSkeleton.jsx

import { useState, useEffect } from 'react';

function P({ className = '' }) {
    return <div className={`animate-pulse bg-white/[0.04] rounded ${className}`} />;
}

export default function DashboardSkeleton() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (isMobile) return <MobileSkeleton />;
    return <DesktopSkeleton />;
}

function DesktopSkeleton() {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <div className="w-[240px] lg:w-[260px] flex-shrink-0 border-r border-white/[0.06] bg-[#0a0a0a] flex flex-col">

                <div className="h-14 flex items-center px-5 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <P className="w-7 h-7 rounded-lg" />
                        <P className="w-20 h-4 rounded" />
                    </div>
                </div>

                <div className="px-3 py-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                        <P className="w-4 h-4 rounded" />
                        <P className="w-24 h-3 rounded" />
                        <div className="flex-1" />
                        <P className="w-6 h-4 rounded" />
                    </div>
                </div>

                <div className="px-5 pt-4 pb-2">
                    <P className="w-14 h-2.5 rounded" />
                </div>

                <div className="px-3 space-y-0.5">
                    {[
                        { w: 'w-12', active: true },
                        { w: 'w-16' },
                        { w: 'w-20' },
                        { w: 'w-14' },
                        { w: 'w-16' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg
                                ${item.active ? 'bg-white/[0.03]' : ''}`}
                        >
                            <P className="w-4 h-4 rounded" />
                            <P className={`h-3.5 rounded ${item.w}`} />
                            <div className="flex-1" />
                            {i < 4 && <P className="w-6 h-4 rounded-md" />}
                        </div>
                    ))}
                </div>

                <div className="px-5 pt-6 pb-2 flex items-center justify-between">
                    <P className="w-20 h-2.5 rounded" />
                    <P className="w-4 h-4 rounded" />
                </div>

                <div className="px-3 space-y-0.5">
                    {['w-24', 'w-16', 'w-20', 'w-12', 'w-18'].map((w, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                            <P className="w-5 h-5 rounded-md" />
                            <P className={`h-3 rounded ${w}`} />
                            <div className="flex-1" />
                            <P className="w-5 h-3.5 rounded" />
                        </div>
                    ))}
                </div>

                <div className="flex-1" />

                <div className="p-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02]">
                        <P className="w-4 h-4 rounded" />
                        <P className="w-20 h-3.5 rounded" />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">

                <div className="h-14 flex items-center px-6 border-b border-white/[0.04] bg-[#0a0a0a]/80 flex-shrink-0">
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <P className="w-20 h-5 rounded" />
                        <P className="w-8 h-5 rounded-md" />
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2 w-[280px] lg:w-[340px] xl:w-[400px]
                        rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                        <P className="w-4 h-4 rounded flex-shrink-0" />
                        <P className="w-24 h-3 rounded" />
                        <div className="flex-1" />
                        <P className="w-4 h-4 rounded flex-shrink-0" />
                    </div>

                    <div className="w-px h-5 bg-white/[0.06] mx-4" />

                    <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.04] p-[3px]">
                        <P className="w-[30px] h-[30px] rounded-md" />
                        <P className="w-[30px] h-[30px] rounded-md" />
                    </div>

                    <div className="w-px h-5 bg-white/[0.06] mx-4" />

                    <P className="w-24 h-9 rounded-lg" />

                    <div className="w-px h-5 bg-white/[0.06] mx-4" />

                    <div className="flex items-center gap-2.5">
                        <P className="w-8 h-8 rounded-lg" />
                        <div className="hidden xl:block space-y-1">
                            <P className="w-16 h-3 rounded" />
                            <P className="w-10 h-2.5 rounded" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 py-2.5
                    border-b border-white/[0.04] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <P className="w-4 h-4 rounded" />
                        <P className="w-16 h-3.5 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <P className="w-24 h-7 rounded-md" />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ContentSkeleton />
                </div>
            </div>
        </div>
    );
}

function MobileSkeleton() {
    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">

            <div className="h-12 flex items-center justify-between px-3
                border-b border-white/[0.04] bg-[#0a0a0a]/80 flex-shrink-0">
                <P className="w-5 h-5 rounded" />
                <P className="w-24 h-4 rounded" />
                <div className="flex items-center gap-1.5">
                    <P className="w-5 h-5 rounded" />
                    <P className="w-7 h-7 rounded-lg" />
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2
                border-b border-white/[0.04] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <P className="w-4 h-4 rounded" />
                    <P className="w-14 h-3.5 rounded" />
                </div>
                <P className="w-20 h-6 rounded-md" />
            </div>

            <div className="flex-1 overflow-hidden">
                <MobileContentSkeleton />
            </div>

            <div className="absolute bottom-6 right-4">
                <P className="w-14 h-14 rounded-full !bg-primary/20" />
            </div>
        </div>
    );
}

function ContentSkeleton() {
    const rows = Array.from({ length: 24 });

    return (
        <div className="p-4 sm:p-5 lg:p-6 pt-3 space-y-px">
            {rows.map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 px-4 h-[52px] rounded-lg"
                >
                    <P className="w-4 h-4 rounded flex-shrink-0" />

                    <P className="w-8 h-8 rounded-lg flex-shrink-0" />

                    <div className="flex-1 min-w-0 space-y-1.5">
                        <P
                            className="h-3.5 rounded"
                            style={{ width: TITLE_WIDTHS[i % TITLE_WIDTHS.length] }}
                        />
                        <P
                            className="h-2.5 rounded"
                            style={{ width: URL_WIDTHS[i % URL_WIDTHS.length] }}
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                        {i % 3 !== 2 && (
                            <P className={`h-[22px] rounded-md ${TAG_WIDTHS[i % TAG_WIDTHS.length]}`} />
                        )}
                        {i % 2 === 0 && (
                            <P className={`h-[22px] rounded-md ${TAG_WIDTHS[(i + 1) % TAG_WIDTHS.length]}`} />
                        )}
                    </div>

                    <div className="hidden lg:block flex-shrink-0">
                        {i % 2 === 0 && <P className="h-3 w-7 rounded" />}
                    </div>

                    <P className="h-3 w-7 rounded hidden sm:block flex-shrink-0" />

                    <P className="w-7 h-7 rounded-md flex-shrink-0" />
                </div>
            ))}
        </div>
    );
}

function MobileContentSkeleton() {
    const rows = Array.from({ length: 20 });

    return (
        <div className="p-3 space-y-px">
            {rows.map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 h-[56px]">
                    <P className="w-9 h-9 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <P
                            className="h-3.5 rounded"
                            style={{ width: TITLE_WIDTHS[i % TITLE_WIDTHS.length] }}
                        />
                        <P
                            className="h-2.5 rounded"
                            style={{ width: URL_WIDTHS[i % URL_WIDTHS.length] }}
                        />
                    </div>
                    <P className="w-6 h-6 rounded-md flex-shrink-0" />
                </div>
            ))}
        </div>
    );
}

const TITLE_WIDTHS = [
    '65%', '48%', '72%', '55%', '80%',
    '42%', '68%', '58%', '75%', '50%',
    '62%', '45%', '70%', '53%', '78%',
    '44%', '66%', '56%', '74%', '49%',
    '60%', '47%', '71%', '54%', '76%',
];

const URL_WIDTHS = [
    '35%', '28%', '40%', '32%', '38%',
    '25%', '36%', '30%', '42%', '27%',
    '33%', '26%', '39%', '31%', '37%',
    '24%', '34%', '29%', '41%', '28%',
    '36%', '27%', '38%', '30%', '35%',
];

const TAG_WIDTHS = [
    'w-12', 'w-14', 'w-10', 'w-16', 'w-11',
    'w-13', 'w-9', 'w-15', 'w-12', 'w-10',
];