// src/dashboard/components/links/LinkSkeleton.jsx

import { motion } from 'framer-motion';

export default function LinkSkeleton({ viewMode = 'grid', count = 6 }) {
    const skeletonItems = Array.from({ length: count }, (_, i) => i);

    if (viewMode === 'list') {
        return (
            <div className="space-y-3">
                {skeletonItems.map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-lg border border-gray-900 bg-gray-950/50 p-4"
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="h-12 w-12 rounded-lg bg-gray-800 animate-pulse flex-shrink-0" />
                            
                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                            </div>

                            {/* Actions */}
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                                <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Grid View
    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {skeletonItems.map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-900 bg-gray-950/50"
                >
                    {/* Preview Area */}
                    <div className="aspect-[16/10] bg-gray-800 animate-pulse" />
                    
                    {/* Content */}
                    <div className="p-3 sm:p-4 space-y-3">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                            <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-900">
                            <div className="h-3 bg-gray-800 rounded animate-pulse w-16" />
                            <div className="h-3 bg-gray-800 rounded animate-pulse w-8" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}