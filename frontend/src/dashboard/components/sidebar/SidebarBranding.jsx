// src/dashboard/components/sidebar/SidebarBranding.jsx

import { motion } from 'framer-motion';
import logoImage from '/src/assets/logo.png';

export default function SidebarBranding() {
    return (
        <div className="px-4 py-4 border-b border-gray-800/40">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
            >
                {/* Logo */}
                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 
                                bg-gray-900 ring-1 ring-gray-800/60">
                    <img
                        src={logoImage}
                        alt="Savlink"
                        className="h-full w-full object-contain"
                        loading="eager"
                    />
                </div>

                {/* Brand */}
                <div className="min-w-0">
                    <h1 className="text-[15px] font-semibold text-white tracking-tight leading-none">
                        Savlink
                    </h1>
                    <p className="text-[10px] text-gray-600 mt-0.5 leading-none">
                        Save once. Use forever.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}