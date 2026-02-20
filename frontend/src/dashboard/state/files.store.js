// src/dashboard/state/files.store.js
import { create } from 'zustand';

const useFilesStore = create((set, get) => ({
    // Files data
    links: [],
    folders: [],
    tags: [],
    
    // Loading states
    linksLoading: false,
    foldersLoading: false,
    tagsLoading: false,
    
    // Error states
    linksError: null,
    foldersError: null,
    tagsError: null,
    
    // Pagination
    hasMore: false,
    cursor: null,
    
    // Filters and search
    activeFilters: {
        folder_id: null,
        tag_ids: [],
        starred: false,
        pinned: false,
        link_type: null
    },
    searchQuery: '',
    sortBy: 'updated_at',
    viewMode: 'grid',
    
    // Selected items
    selectedItems: [],
    
    // Actions
    setLinks: (links) => set({ links }),
    appendLinks: (newLinks) => set(state => ({ 
        links: [...state.links, ...newLinks] 
    })),
    setLinksLoading: (loading) => set({ linksLoading: loading }),
    setLinksError: (error) => set({ linksError: error }),
    
    setFolders: (folders) => set({ folders }),
    setFoldersLoading: (loading) => set({ foldersLoading: loading }),
    setFoldersError: (error) => set({ foldersError: error }),
    
    setTags: (tags) => set({ tags }),
    setTagsLoading: (loading) => set({ tagsLoading: loading }),
    setTagsError: (error) => set({ tagsError: error }),
    
    setHasMore: (hasMore) => set({ hasMore }),
    setCursor: (cursor) => set({ cursor }),
    
    setActiveFilters: (filters) => set({ activeFilters: filters }),
    updateFilter: (key, value) => set(state => ({
        activeFilters: { ...state.activeFilters, [key]: value }
    })),
    clearFilters: () => set({
        activeFilters: {
            folder_id: null,
            tag_ids: [],
            starred: false,
            pinned: false,
            link_type: null
        }
    }),
    
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSortBy: (sortBy) => set({ sortBy }),
    setViewMode: (mode) => set({ viewMode: mode }),
    
    setSelectedItems: (items) => set({ selectedItems: items }),
    clearSelection: () => set({ selectedItems: [] }),
    
    // Link operations
    addLink: (link) => set(state => ({ 
        links: [link, ...state.links] 
    })),
    
    updateLink: (linkId, updates) => set(state => ({
        links: state.links.map(link =>
            link.id === linkId ? { ...link, ...updates } : link
        )
    })),
    
    removeLink: (linkId) => set(state => ({
        links: state.links.filter(link => link.id !== linkId),
        selectedItems: state.selectedItems.filter(id => id !== linkId)
    })),
    
    // Folder operations
    addFolder: (folder) => set(state => ({
        folders: [...state.folders, folder]
    })),
    
    updateFolder: (folderId, updates) => set(state => ({
        folders: state.folders.map(folder =>
            folder.id === folderId ? { ...folder, ...updates } : folder
        )
    })),
    
    removeFolder: (folderId) => set(state => ({
        folders: state.folders.filter(folder => folder.id !== folderId)
    })),
    
    // Tag operations
    addTag: (tag) => set(state => ({
        tags: [...state.tags, tag]
    })),
    
    updateTag: (tagId, updates) => set(state => ({
        tags: state.tags.map(tag =>
            tag.id === tagId ? { ...tag, ...updates } : tag
        )
    })),
    
    removeTag: (tagId) => set(state => ({
        tags: state.tags.filter(tag => tag.id !== tagId)
    })),
    
    // Computed values
    getFilteredLinks: () => {
        const state = get();
        let filtered = [...state.links];
        
        // Apply search
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(link =>
                (link.title?.toLowerCase().includes(query)) ||
                (link.original_url?.toLowerCase().includes(query)) ||
                (link.notes?.toLowerCase().includes(query))
            );
        }
        
        // Apply filters
        const filters = state.activeFilters;
        
        if (filters.folder_id) {
            filtered = filtered.filter(link => link.folder_id === filters.folder_id);
        }
        
        if (filters.tag_ids.length > 0) {
            filtered = filtered.filter(link =>
                link.tags?.some(tag => filters.tag_ids.includes(tag.id))
            );
        }
        
        if (filters.starred) {
            filtered = filtered.filter(link => link.starred);
        }
        
        if (filters.pinned) {
            filtered = filtered.filter(link => link.pinned);
        }
        
        if (filters.link_type) {
            filtered = filtered.filter(link => link.link_type === filters.link_type);
        }
        
        return filtered;
    },
    
    hasActiveFilters: () => {
        const filters = get().activeFilters;
        return (
            filters.folder_id !== null ||
            filters.tag_ids.length > 0 ||
            filters.starred ||
            filters.pinned ||
            filters.link_type !== null ||
            get().searchQuery.length > 0
        );
    },
    
    // Reset store
    reset: () => set({
        links: [],
        folders: [],
        tags: [],
        linksLoading: false,
        foldersLoading: false,
        tagsLoading: false,
        linksError: null,
        foldersError: null,
        tagsError: null,
        hasMore: false,
        cursor: null,
        activeFilters: {
            folder_id: null,
            tag_ids: [],
            starred: false,
            pinned: false,
            link_type: null
        },
        searchQuery: '',
        sortBy: 'updated_at',
        viewMode: 'grid',
        selectedItems: []
    })
}));

export default useFilesStore;

// Selectors
export const useLinks = () => useFilesStore(state => ({
    links: state.getFilteredLinks(),
    allLinks: state.links,
    loading: state.linksLoading,
    error: state.linksError,
    hasMore: state.hasMore,
    cursor: state.cursor
}));

export const useFilters = () => useFilesStore(state => ({
    activeFilters: state.activeFilters,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    viewMode: state.viewMode,
    hasActiveFilters: state.hasActiveFilters(),
    setActiveFilters: state.setActiveFilters,
    updateFilter: state.updateFilter,
    clearFilters: state.clearFilters,
    setSearchQuery: state.setSearchQuery,
    setSortBy: state.setSortBy,
    setViewMode: state.setViewMode
}));