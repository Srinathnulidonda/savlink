// src/dashboard/components/common/LoadingState.jsx
import { motion } from 'framer-motion';
import LinkSkeleton from '../links/LinkSkeleton';

export default function LoadingState({ 
    variant = 'default',
    viewMode = 'grid',
    count = 6
}) {
    if (variant === 'skeleton') {
        return (
            <div className="p-3 sm:p-4 lg:p-6">
                <div className={
                    viewMode === 'grid'
                        ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "space-y-2 sm:space-y-3"
                }>
                    {[...Array(count)].map((_, i) => (
                        <LinkSkeleton 
                            key={i} 
                            viewMode={viewMode} 
                            index={i} 
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-800 border-t-primary animate-spin" />
                    <span className="text-sm text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 rounded-full border-2 border-gray-800 border-t-primary animate-spin" />
            </div>
        );
    }

    // Default full-screen loading
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-800 border-t-primary animate-spin" />
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Loading your links...</p>
                    <p className="text-xs text-gray-600 mt-1">This won't take long</p>
                </div>
            </motion.div>
        </div>
    );
}