// src/dashboard/components/common/LoadingState.jsx

import { motion } from 'framer-motion';

export default function LoadingState({ 
    message = "Loading...", 
    size = "default",
    className = "" 
}) {
    const sizeClasses = {
        small: "h-4 w-4",
        default: "h-8 w-8",
        large: "h-12 w-12"
    };

    const textSizes = {
        small: "text-xs",
        default: "text-sm",
        large: "text-base"
    };

    return (
        <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Spinner */}
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className={`${sizeClasses[size]} border-4 border-gray-800 border-t-primary rounded-full`}
                    />
                    
                    {/* Pulse effect */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 ${sizeClasses[size]} border-4 border-primary/30 rounded-full`}
                    />
                </div>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${textSizes[size]} text-gray-400 font-medium`}
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
}