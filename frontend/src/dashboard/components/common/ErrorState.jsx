// src/dashboard/components/common/ErrorState.jsx

import { motion } from 'framer-motion';

export default function ErrorState({
    title = "Something went wrong",
    message = "Please try again or contact support if the problem persists.",
    onRetry,
    retryLabel = "Try Again",
    showRetry = true,
    className = ""
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 sm:py-20 px-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-md"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6"
                >
                    <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </motion.div>

                {/* Title */}
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg sm:text-xl font-medium text-white mb-2"
                >
                    {title}
                </motion.h3>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed"
                >
                    {message}
                </motion.p>

                {/* Retry Button */}
                {showRetry && onRetry && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            onClick={onRetry}
                            className="btn-primary"
                        >
                            {retryLabel}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}