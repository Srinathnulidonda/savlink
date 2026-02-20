// src/dashboard/views/Profile/ProfileView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../auth/context/AuthContext';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function ProfileView() {
    const { user, updateProfile, loading, error } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar_url: user?.avatar_url || ''
    });
    const [updating, setUpdating] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setUpdating(true);
        
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 max-w-2xl mx-auto"
        >
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-white">Profile</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn-secondary"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {formData.avatar_url ? (
                                <img
                                    src={formData.avatar_url}
                                    alt="Profile"
                                    className="h-16 w-16 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-semibold">
                                    {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            {isEditing && (
                                <button
                                    type="button"
                                    className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">
                                {user?.name || 'User'}
                            </h3>
                            <p className="text-sm text-gray-400">
                                Member since {new Date(user?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled={true} // Email changes require verification
                                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white opacity-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Contact support to change your email address
                            </p>
                        </div>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{user?.stats?.total_links || 0}</div>
                            <div className="text-sm text-gray-400">Total Links</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{user?.stats?.total_folders || 0}</div>
                            <div className="text-sm text-gray-400">Collections</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{user?.stats?.total_clicks || 0}</div>
                            <div className="text-sm text-gray-400">Total Clicks</div>
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className="btn-primary"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </motion.div>
    );
}