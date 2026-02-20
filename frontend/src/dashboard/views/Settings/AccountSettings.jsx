// src/dashboard/views/Settings/AccountSettings.jsx
import { useState } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';

export default function AccountSettings() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await updateProfile(formData);
        } catch (err) {
            console.error('Failed to update account:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                <p className="text-gray-400 mt-1">Manage your account information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white opacity-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Email changes require verification. Contact support for assistance.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 p-6 border border-red-800 rounded-lg bg-red-500/5">
                <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="btn-danger">
                    Delete Account
                </button>
            </div>
        </div>
    );
}