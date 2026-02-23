// src/dashboard/pages/home/components/ActivityFeed.jsx

import { motion } from 'framer-motion';

const ACTIVITY_ICONS = {
    created: { color: 'bg-emerald-500', icon: '+' },
    deleted: { color: 'bg-red-500', icon: '−' },
    updated: { color: 'bg-blue-500', icon: '~' },
    pinned: { color: 'bg-amber-500', icon: '★' },
    archived: { color: 'bg-gray-500', icon: '▼' },
    default: { color: 'bg-gray-600', icon: '•' },
};

function getActivityStyle(activity) {
    const type = activity.type || activity.action || 'default';
    return ACTIVITY_ICONS[type] || ACTIVITY_ICONS.default;
}

export default function ActivityFeed({ activities = [] }) {
    return (
        <section className="rounded-xl border border-gray-800/50 bg-gray-900/20 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-800/30">
                <h2 className="text-[13px] font-medium text-gray-300">Activity</h2>
            </div>

            {/* Empty */}
            {activities.length === 0 ? (
                <div className="px-5 py-14 text-center">
                    <div className="mx-auto w-10 h-10 rounded-full bg-gray-800/30 border border-gray-800/50
                                    flex items-center justify-center mb-3">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-[13px] text-gray-500 mb-0.5">No activity yet</p>
                    <p className="text-[11px] text-gray-600">
                        Your actions will appear here
                    </p>
                </div>
            ) : (
                <div className="px-5 py-4">
                    <div className="relative ml-[5px]">
                        {/* Timeline line */}
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-800/60" aria-hidden />

                        <div className="space-y-4">
                            {activities.slice(0, 8).map((activity, i) => {
                                const style = getActivityStyle(activity);

                                return (
                                    <motion.div
                                        key={activity.id || i}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex gap-4 relative pl-5"
                                    >
                                        {/* Dot */}
                                        <div
                                            className={`absolute left-[-3px] top-[7px] w-[7px] h-[7px] rounded-full 
                                                        ${style.color} ring-[3px] ring-black z-10`}
                                        />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] text-gray-400 leading-snug">
                                                {activity.description}
                                            </p>
                                            <p className="text-[11px] text-gray-600 mt-1 tabular-nums">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}