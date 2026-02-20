// src/dashboard/components/common/ErrorState.jsx
import { motion } from 'framer-motion';

export default function ErrorState({ 
    title = "Something went wrong",
    message = "We're having trouble loading your data. Please try again.",
    onRetry,
    variant = 'default'
}) {
    const variants = {
        default: {
            container: 'flex flex-col items-center justify-center py-12 sm:py-20',
            icon: 'h-12 w-12 text-red-500 mb-4',
            title: 'text-lg font-medium text-white mb-2',
            message: 'text-sm text-gray-400 text-center max-w-md mb-6'
        },
        compact: {
            container: 'flex flex-col items-center justify-center py-6 sm:py-8',
            icon: 'h-8 w-8 text-red-500 mb-2',
            title: 'text-base font-medium text-white mb-1',
            message: 'text-xs text-gray-400 text-center max-w-xs mb-4'
        },
        inline: {
            container: 'flex items-center justify-center py-4',
            icon: 'h-5 w-5 text-red-500 mr-2',
            title: 'text-sm font-medium text-white',
            message: 'text-xs text-gray-400 ml-2'
        }
    };

    const styles = variants[variant];

    if (variant === 'inline') {
        return (
            <div className={styles.container}>
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className={styles.title}>{title}</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="ml-2 text-xs text-primary hover:text-primary-light transition-colors"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className={styles.title}>
                    {title}
                </h3>
                <p className={styles.message}>
                    {message}
                </p>
                {onRetry && (
                    <div className="space-x-3">
                        <button
                            onClick={onRetry}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-secondary"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}