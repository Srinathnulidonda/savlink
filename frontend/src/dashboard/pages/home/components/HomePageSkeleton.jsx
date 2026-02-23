// src/dashboard/pages/home/components/HomePageSkeleton.jsx

import { motion } from 'framer-motion';

function Pulse({ className }) {
    return <div className={`animate-pulse bg-gray-800/50 rounded ${className}`} />;
}

export default function HomePageSkeleton() {
    return (
        <div className="h-full overflow-hidden">
            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-2">
                        <Pulse className="h-7 w-52" />
                        <Pulse className="h-4 w-36" />
                    </div>
                    <Pulse className="h-9 w-40 rounded-lg hidden sm:block" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-xl border border-gray-800/40 p-4 space-y-3"
                        >
                            <Pulse className="h-4 w-4 rounded" />
                            <Pulse className="h-7 w-16" />
                            <Pulse className="h-3 w-20" />
                        </motion.div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Recent */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="rounded-xl border border-gray-800/40 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-800/30">
                                <Pulse className="h-4 w-20" />
                            </div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-gray-800/20 last:border-0">
                                    <Pulse className="w-9 h-9 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <Pulse className="h-4 w-3/4" />
                                        <Pulse className="h-3 w-1/3" />
                                    </div>
                                    <Pulse className="h-3 w-10 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="rounded-xl border border-gray-800/40 p-5 space-y-4">
                            <Pulse className="h-4 w-32" />
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <Pulse className="h-4 w-24" />
                                    <Pulse className="h-5 w-10 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}