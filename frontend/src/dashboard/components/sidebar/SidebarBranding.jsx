// src/dashboard/components/sidebar/SidebarBranding.jsx
import { motion } from 'framer-motion';
import logoImage from '/src/assets/logo.png';

export default function SidebarBranding() {
    return (
        <div className="pl-[28px] pr-4 py-4 border-b border-gray-800/40">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
            >
                {/* <img
                    src={logoImage}
                    alt="Savlink"
                    className="h-9 w-9 object-contain flex-shrink-0"
                    loading="eager"
                /> */}
                <div className="min-w-0">
                    <h1 
                        className="text-[26px] text-white tracking-tight leading-none"
                        style={{ fontFamily: 'Savlink, sans-serif' }}
                    >
                        Savlink
                    </h1>
                    <p className="text-[10px] text-gray-600 mt-1 leading-none">
                        Save once. Use forever.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}