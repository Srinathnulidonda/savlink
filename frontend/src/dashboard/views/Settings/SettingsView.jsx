// src/dashboard/views/Settings/SettingsView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import AccountSettings from './AccountSettings';
import Preferences from './Preferences';
import SecuritySettings from './SecuritySettings';

export default function SettingsView() {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'security', label: 'Security', icon: '🔒' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row h-full"
        >
            {/* Sidebar */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-950/50">
                <div className="p-4">
                    <h1 className="text-lg font-semibold text-white mb-4">Settings</h1>
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'account' && <AccountSettings />}
                {activeTab === 'preferences' && <Preferences />}
                {activeTab === 'security' && <SecuritySettings />}
            </div>
        </motion.div>
    );
}