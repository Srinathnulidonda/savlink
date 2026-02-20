// src/dashboard/components/common/EmptyState.jsx
import { motion } from 'framer-motion';

export default function EmptyState({ 
    icon,
    title, 
    description, 
    actionLabel,
    onAction,
    variant = 'default'
}) {
    const variants = {
        default: {
            container: 'text-center py-12 sm:py-20',
            icon: 'h-12 sm:h-16 w-12 sm:w-16 text-gray-600 mb-4 mx-auto',
            title: 'text-lg sm:text-xl font-medium text-white mb-2',
            description: 'text-sm sm:text-base text-gray-500 text-center max-w-md'
        },
        compact: {
            container: 'text-center py-6 sm:py-8',
            icon: 'h-8 w-8 text-gray-600 mb-2 mx-auto',
            title: 'text-base font-medium text-white mb-1',
            description: 'text-xs sm:text-sm text-gray-500 text-center max-w-xs'
        },
        inline: {
            container: 'text-center py-4',
            icon: 'h-6 w-6 text-gray-600 mb-1 mx-auto',
            title: 'text-sm font-medium text-white mb-1',
            description: 'text-xs text-gray-500'
        }
    };

    const styles = variants[variant];

    const defaultIcon = (
        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-13 0h3m-3 0v-3m3 3v3" />
        </svg>
    );

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {icon || defaultIcon}
                <h3 className={styles.title}>
                    {title}
                </h3>
                <p className={styles.description}>
                    {description}
                </p>
                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="mt-6 btn-primary"
                    >
                        {actionLabel}
                    </button>
                )}
            </motion.div>
        </div>
    );
}