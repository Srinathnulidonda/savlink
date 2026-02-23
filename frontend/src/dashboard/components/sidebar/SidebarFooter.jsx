// src/dashboard/components/sidebar/SidebarFooter.jsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SidebarFooter({ onAddLink }) {
    return (
        <div className="flex-shrink-0 border-t border-gray-800/40 p-3 space-y-3">
            {/* New Link Button */}
            <motion.button
                onClick={onAddLink}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 
                           text-[13px] font-medium text-white bg-primary hover:bg-primary-light 
                           rounded-lg transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Link
            </motion.button>

            {/* Legal */}
            <div className="flex items-center justify-center gap-2">
                <Link to="/terms" className="text-[10px] text-gray-700 hover:text-gray-500 transition-colors">
                    Terms
                </Link>
                <span className="text-gray-800 text-[10px]">·</span>
                <Link to="/privacy" className="text-[10px] text-gray-700 hover:text-gray-500 transition-colors">
                    Privacy
                </Link>
                <span className="text-gray-800 text-[10px]">·</span>
                <span className="text-[10px] text-gray-700">
                    © {new Date().getFullYear()}
                </span>
            </div>
        </div>
    );
}