// src/dashboard/state/dashboard.store.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useDashboardStore = create(
    subscribeWithSelector((set, get) => ({
        // Global dashboard state
        stats: {
            all: 0,
            recent: 0,
            starred: 0,
            pinned: 0,
            archive: 0,
            unassigned: 0
        },
        
        // UI state
        sidebarCollapsed: false,
        viewMode: 'grid', // 'grid' | 'list'
        currentView: 'home',
        
        // Search state
        globalSearch: '',
        searchResults: [],
        searchLoading: false,
        
        // Selection state
        selectedItems: [],
        bulkActionMode: false,
        
        // Modal states
        activeModal: null, // 'add-link' | 'edit-link' | 'move-folder' | null
        modalProps: {},
        
        // Cache
        cache: new Map(),
        cacheTimestamps: new Map(),
        
        // Actions
        setStats: (stats) => set({ stats }),
        
        updateStat: (key, value) => set(state => ({
            stats: { ...state.stats, [key]: value }
        })),
        
        incrementStat: (key, amount = 1) => set(state => ({
            stats: { ...state.stats, [key]: (state.stats[key] || 0) + amount }
        })),
        
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        
        setViewMode: (mode) => set({ viewMode: mode }),
        
        setCurrentView: (view) => set({ currentView: view }),
        
        setGlobalSearch: (query) => set({ globalSearch: query }),
        
        setSearchResults: (results) => set({ searchResults: results }),
        
        setSearchLoading: (loading) => set({ searchLoading: loading }),
        
        setSelectedItems: (items) => set({ selectedItems: items }),
        
        clearSelection: () => set({ selectedItems: [], bulkActionMode: false }),
        
        toggleSelection: (itemId) => set(state => {
            const isSelected = state.selectedItems.includes(itemId);
            const newSelection = isSelected
                ? state.selectedItems.filter(id => id !== itemId)
                : [...state.selectedItems, itemId];
            
            return {
                selectedItems: newSelection,
                bulkActionMode: newSelection.length > 0
            };
        }),
        
        setBulkActionMode: (enabled) => set({ bulkActionMode: enabled }),
        
        openModal: (modalType, props = {}) => set({
            activeModal: modalType,
            modalProps: props
        }),
        
        closeModal: () => set({
            activeModal: null,
            modalProps: {}
        }),
        
        // Cache management
        setCache: (key, data, ttl = 300000) => { // 5 minutes default TTL
            const state = get();
            const now = Date.now();
            
            state.cache.set(key, data);
            state.cacheTimestamps.set(key, now + ttl);
            
            set({ cache: state.cache, cacheTimestamps: state.cacheTimestamps });
        },
        
        getCache: (key) => {
            const state = get();
            const now = Date.now();
            const timestamp = state.cacheTimestamps.get(key);
            
            if (!timestamp || now > timestamp) {
                state.cache.delete(key);
                state.cacheTimestamps.delete(key);
                return null;
            }
            
            return state.cache.get(key);
        },
        
        clearCache: (pattern = null) => {
            const state = get();
            
            if (pattern) {
                for (const key of state.cache.keys()) {
                    if (key.includes(pattern)) {
                        state.cache.delete(key);
                        state.cacheTimestamps.delete(key);
                    }
                }
            } else {
                state.cache.clear();
                state.cacheTimestamps.clear();
            }
            
            set({ cache: state.cache, cacheTimestamps: state.cacheTimestamps });
        },
        
        // Computed values
        hasSelection: () => get().selectedItems.length > 0,
        selectionCount: () => get().selectedItems.length,
        isItemSelected: (itemId) => get().selectedItems.includes(itemId),
        
        // Reset store
        reset: () => set({
            stats: { all: 0, recent: 0, starred: 0, pinned: 0, archive: 0, unassigned: 0 },
            sidebarCollapsed: false,
            viewMode: 'grid',
            currentView: 'home',
            globalSearch: '',
            searchResults: [],
            searchLoading: false,
            selectedItems: [],
            bulkActionMode: false,
            activeModal: null,
            modalProps: {},
            cache: new Map(),
            cacheTimestamps: new Map()
        })
    }))
);

export default useDashboardStore;

// Selectors for performance
export const useStats = () => useDashboardStore(state => state.stats);
export const useSelection = () => useDashboardStore(state => ({
    selectedItems: state.selectedItems,
    bulkActionMode: state.bulkActionMode,
    hasSelection: state.hasSelection(),
    selectionCount: state.selectionCount(),
    setSelectedItems: state.setSelectedItems,
    clearSelection: state.clearSelection,
    toggleSelection: state.toggleSelection
}));
export const useModal = () => useDashboardStore(state => ({
    activeModal: state.activeModal,
    modalProps: state.modalProps,
    openModal: state.openModal,
    closeModal: state.closeModal
}));
export const useSearch = () => useDashboardStore(state => ({
    globalSearch: state.globalSearch,
    searchResults: state.searchResults,
    searchLoading: state.searchLoading,
    setGlobalSearch: state.setGlobalSearch,
    setSearchResults: state.setSearchResults,
    setSearchLoading: state.setSearchLoading
}));