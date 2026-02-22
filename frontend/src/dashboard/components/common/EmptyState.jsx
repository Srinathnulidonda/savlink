// src/dashboard/components/common/EmptyState.jsx

import { motion } from 'framer-motion';

export default function EmptyState({
    icon,
    title,
    description,
    action,
    actionLabel,
    className = ""
}) {
    const defaultIcon = (
        <svg className="h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    return (
        <div className={`flex flex-col items-center justify-center py-12 sm:py-20 px-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-md"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto text-gray-600 mb-6"
                >
                    {icon || defaultIcon}
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

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed"
                >
                    {description}
                </motion.p>

                {/* Action Button */}
                {action && actionLabel && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            onClick={action}
                            className="btn-primary"
                        >
                            {actionLabel}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}