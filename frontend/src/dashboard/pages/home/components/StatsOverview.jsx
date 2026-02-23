// src/dashboard/pages/home/components/StatsOverview.jsx

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const STATS = [
    {
        key: 'total',
        label: 'Total links',
        icon: (props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
        ),
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/8',
    },
    {
        key: 'thisWeek',
        label: 'This week',
        icon: (props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
        ),
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/8',
    },
    {
        key: 'starred',
        label: 'Starred',
        icon: (props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        ),
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/8',
    },
    {
        key: 'collections',
        label: 'Collections',
        icon: (props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
        ),
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/8',
    },
];

export default function StatsOverview({ stats = {} }) {
    const statData = useMemo(() =>
        STATS.map(s => ({ ...s, value: stats[s.key] || 0 })),
        [stats]
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statData.map((stat, i) => (
                <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group rounded-xl border border-gray-800/50 bg-gray-900/20 p-4
                               hover:border-gray-700/50 hover:bg-gray-900/40 transition-all cursor-default
                               relative overflow-hidden"
                >
                    {/* Subtle gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} to-transparent 
                                     opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                    <div className="relative">
                        {/* Icon */}
                        <div className={`mb-3 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                            <stat.icon className="h-4 w-4" />
                        </div>

                        {/* Value */}
                        <p className="text-2xl font-semibold text-white tabular-nums tracking-tight leading-none">
                            {stat.value.toLocaleString()}
                        </p>

                        {/* Label */}
                        <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                            {stat.label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}