// src/dashboard/views/Settings/Preferences.jsx
import { useState } from 'react';

export default function Preferences() {
    const [preferences, setPreferences] = useState({
        theme: 'dark',
        defaultView: 'grid',
        autoSave: true,
        notifications: true,
        emailDigest: 'weekly'
    });

    const handleToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSelectChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="p-6 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Preferences</h2>
                <p className="text-gray-400 mt-1">Customize your experience</p>
            </div>

            <div className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white">Theme</h3>
                        <p className="text-sm text-gray-400">Choose your preferred theme</p>
                    </div>
                    <select
                        value={preferences.theme}
                        onChange={(e) => handleSelectChange('theme', e.target.value)}
                        className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                    </select>
                </div>

                {/* Default View */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white">Default View</h3>
                        <p className="text-sm text-gray-400">How links are displayed by default</p>
                    </div>
                    <select
                        value={preferences.defaultView}
                        onChange={(e) => handleSelectChange('defaultView', e.target.value)}
                        className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
                    >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                    </select>
                </div>

                {/* Auto Save */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white">Auto Save</h3>
                        <p className="text-sm text-gray-400">Automatically save changes</p>
                    </div>
                    <button
                        onClick={() => handleToggle('autoSave')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.autoSave ? 'bg-primary' : 'bg-gray-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                        <p className="text-sm text-gray-400">Receive browser notifications</p>
                    </div>
                    <button
                        onClick={() => handleToggle('notifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.notifications ? 'bg-primary' : 'bg-gray-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Email Digest */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white">Email Digest</h3>
                        <p className="text-sm text-gray-400">How often to receive email updates</p>
                    </div>
                    <select
                        value={preferences.emailDigest}
                        onChange={(e) => handleSelectChange('emailDigest', e.target.value)}
                        className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
                    >
                        <option value="never">Never</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button className="btn-primary">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}