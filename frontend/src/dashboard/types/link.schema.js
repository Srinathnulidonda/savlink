// src/dashboard/types/link.schema.js
/**
 * Link data shape and validation
 */

export const LinkType = {
    SAVED: 'saved',
    SHORTENED: 'shortened'
};

export const LinkStatus = {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    DELETED: 'deleted'
};

export const createLinkSchema = (data = {}) => ({
    id: data.id || null,
    title: data.title || '',
    original_url: data.original_url || '',
    display_url: data.display_url || '',
    short_url: data.short_url || null,
    slug: data.slug || null,
    link_type: data.link_type || LinkType.SAVED,
    notes: data.notes || '',
    
    // Status
    is_active: data.is_active ?? true,
    pinned: data.pinned || false,
    starred: data.starred || false,
    frequently_used: data.frequently_used || false,
    archived: data.archived || false,
    
    // Timestamps
    created_at: data.created_at || null,
    updated_at: data.updated_at || null,
    pinned_at: data.pinned_at || null,
    archived_at: data.archived_at || null,
    expires_at: data.expires_at || null,
    
    // Relations
    folder_id: data.folder_id || null,
    folder: data.folder || null,
    tags: data.tags || [],
    user_id: data.user_id || null,
    
    // Metadata
    click_count: data.click_count || 0,
    metadata_: data.metadata_ || {},
    preview: data.preview || {},
    
    // Computed
    relative_time: data.relative_time || '',
    performance: data.performance || {},
    
    // Short link specific
    password_hash: data.password_hash || null,
    utm_params: data.utm_params || null,
    click_limit: data.click_limit || null,
    
    // Preview data
    favicon: data.favicon || null,
    domain: data.domain || null,
    has_preview_image: data.has_preview_image || false
});

export const validateLinkData = (data) => {
    const errors = [];
    
    if (!data.original_url) {
        errors.push('URL is required');
    }
    
    if (data.original_url && !isValidUrl(data.original_url)) {
        errors.push('URL format is invalid');
    }
    
    if (data.link_type && !Object.values(LinkType).includes(data.link_type)) {
        errors.push('Invalid link type');
    }
    
    if (data.title && data.title.length > 500) {
        errors.push('Title is too long (max 500 characters)');
    }
    
    if (data.notes && data.notes.length > 2000) {
        errors.push('Notes are too long (max 2000 characters)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Link creation helpers
export const createSavedLink = (url, title = '', notes = '') => 
    createLinkSchema({
        original_url: url,
        title,
        notes,
        link_type: LinkType.SAVED
    });

export const createShortLink = (url, slug = null, options = {}) =>
    createLinkSchema({
        original_url: url,
        slug,
        link_type: LinkType.SHORTENED,
        ...options
    });

// Status helpers
export const isExpired = (link) =>
    link.expires_at && new Date(link.expires_at) < new Date();

export const isActive = (link) =>
    link.is_active && !link.archived && !isExpired(link);

export const canEdit = (link) =>
    !link.archived && !isExpired(link);

export const getStatusColor = (link) => {
    if (link.pinned) return 'text-yellow-500';
    if (link.starred) return 'text-blue-500';
    if (link.archived) return 'text-gray-500';
    if (isExpired(link)) return 'text-red-500';
    return 'text-gray-400';
};

export const getLinkTypeLabel = (type) => {
    switch (type) {
        case LinkType.SAVED: return 'Saved Link';
        case LinkType.SHORTENED: return 'Short Link';
        default: return 'Unknown';
    }
};