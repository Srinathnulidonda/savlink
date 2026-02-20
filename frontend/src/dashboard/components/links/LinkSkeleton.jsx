// src/dashboard/components/links/LinkSkeleton.jsx
import { motion } from 'framer-motion';

export default function LinkSkeleton({ viewMode = 'grid', index = 0 }) {
    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-900/50 border border-gray-800"
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-800 rounded-lg animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-800 rounded animate-pulse w-1/3" />
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg sm:rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800"
        >
            <div className="aspect-[16/10] bg-gray-800 animate-pulse" />
            <div className="p-3 sm:p-4 space-y-3">
                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                </div>
            </div>
        </motion.div>
    );
}