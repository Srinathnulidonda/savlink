// src/dashboard/state/home.store.js
import { create } from 'zustand';

const useHomeStore = create((set, get) => ({
    // Quick access data
    quickAccessLinks: [],
    quickAccessLoading: false,
    quickAccessError: null,
    
    // Recent activity
    recentActivity: [],
    recentActivityLoading: false,
    recentActivityError: null,
    
    // Home stats
    homeStats: {
        totalLinks: 0,
        totalFolders: 0,
        thisWeek: 0
    },
    
    // Actions
    setQuickAccessLinks: (links) => set({ quickAccessLinks: links }),
    setQuickAccessLoading: (loading) => set({ quickAccessLoading: loading }),
    setQuickAccessError: (error) => set({ quickAccessError: error }),
    
    setRecentActivity: (activity) => set({ recentActivity: activity }),
    setRecentActivityLoading: (loading) => set({ recentActivityLoading: loading }),
    setRecentActivityError: (error) => set({ recentActivityError: error }),
    
    setHomeStats: (stats) => set({ homeStats: stats }),
    
    // Add new activity item
    addActivity: (item) => set(state => ({
        recentActivity: [item, ...state.recentActivity.slice(0, 19)] // Keep only latest 20
    })),
    
    // Update link in quick access
    updateQuickAccessLink: (linkId, updates) => set(state => ({
        quickAccessLinks: state.quickAccessLinks.map(link =>
            link.id === linkId ? { ...link, ...updates } : link
        )
    })),
    
    // Remove link from quick access
    removeQuickAccessLink: (linkId) => set(state => ({
        quickAccessLinks: state.quickAccessLinks.filter(link => link.id !== linkId)
    })),
    
    // Reset store
    reset: () => set({
        quickAccessLinks: [],
        quickAccessLoading: false,
        quickAccessError: null,
        recentActivity: [],
        recentActivityLoading: false,
        recentActivityError: null,
        homeStats: { totalLinks: 0, totalFolders: 0, thisWeek: 0 }
    })
}));

export default useHomeStore;

// Selectors
export const useQuickAccess = () => useHomeStore(state => ({
    links: state.quickAccessLinks,
    loading: state.quickAccessLoading,
    error: state.quickAccessError,
    setLinks: state.setQuickAccessLinks,
    setLoading: state.setQuickAccessLoading,
    setError: state.setQuickAccessError,
    updateLink: state.updateQuickAccessLink,
    removeLink: state.removeQuickAccessLink
}));

export const useRecentActivity = () => useHomeStore(state => ({
    activity: state.recentActivity,
    loading: state.recentActivityLoading,
    error: state.recentActivityError,
    setActivity: state.setRecentActivity,
    setLoading: state.setRecentActivityLoading,
    setError: state.setRecentActivityError,
    addActivity: state.addActivity
}));