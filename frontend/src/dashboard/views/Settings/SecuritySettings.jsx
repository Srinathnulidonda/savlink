// src/dashboard/views/Settings/SecuritySettings.jsx
import { useState } from 'react';

export default function SecuritySettings() {
    const [sessions, setSessions] = useState([
        { id: 1, device: 'Chrome on MacOS', location: 'New York, US', lastActive: '2 minutes ago', current: true },
        { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '1 hour ago', current: false }
    ]);

    const revokeSession = (sessionId) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    return (
        <div className="p-6 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                <p className="text-gray-400 mt-1">Manage your account security</p>
            </div>

            <div className="space-y-8">
                {/* Change Password */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Authenticator App</p>
                            <p className="text-sm text-gray-400">Use an authenticator app to generate codes</p>
                        </div>
                        <button className="btn-secondary">
                            Enable 2FA
                        </button>
                    </div>
                </div>

                {/* Active Sessions */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-medium">{session.device}</p>
                                        {session.current && (
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">{session.location} • {session.lastActive}</p>
                                </div>
                                {!session.current && (
                                    <button
                                        onClick={() => revokeSession(session.id)}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}