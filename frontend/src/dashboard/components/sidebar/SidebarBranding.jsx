// src/dashboard/components/sidebar/SidebarBranding.jsx - New component
import { motion } from 'framer-motion';

export default function SidebarBranding() {
    return (
        <div className="border-b border-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
            >
                {/* Logo */}
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">S</span>
                </div>
                
                {/* Brand name and tagline */}
                <div>
                    <h1 className="text-lg font-bold text-white">Savlink</h1>
                    <p className="text-xs text-gray-500">Save once. Use forever.</p>
                </div>
            </motion.div>
        </div>
    );
}