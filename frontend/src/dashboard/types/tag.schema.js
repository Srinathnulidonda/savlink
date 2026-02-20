// src/dashboard/types/tag.schema.js
/**
 * Tag data shape and validation
 */

export const createTagSchema = (data = {}) => ({
    id: data.id || null,
    name: data.name || '',
    color: data.color || null,
    
    // Timestamps
    created_at: data.created_at || null,
    
    // Relations
    user_id: data.user_id || null,
    
    // Computed
    usage_count: data.usage_count || 0
});

export const validateTagData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Tag name is required');
    }
    
    if (data.name && data.name.length > 100) {
        errors.push('Tag name is too long (max 100 characters)');
    }
    
    if (data.color && !isValidColor(data.color)) {
        errors.push('Invalid color format');
    }
    
    // Check for invalid characters
    if (data.name && /[<>'"&]/.test(data.name)) {
        errors.push('Tag name contains invalid characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const isValidColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
};

// Tag helpers
export const getTagColor = (tag) => {
    return tag.color || '#6B7280';
};

export const normalizeTagName = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export const formatTagName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

// Tag colors
export const TAG_COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#EAB308', // yellow
    '#84CC16', // lime
    '#22C55E', // green
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#A855F7', // purple
    '#D946EF', // fuchsia
    '#EC4899'  // pink
];

export const getRandomTagColor = () => {
    return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
};

export const groupTagsByColor = (tags) => {
    return tags.reduce((groups, tag) => {
        const color = getTagColor(tag);
        if (!groups[color]) {
            groups[color] = [];
        }
        groups[color].push(tag);
        return groups;
    }, {});
};

export const sortTagsByUsage = (tags) => {
    return [...tags].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
};

export const filterTagsByName = (tags, query) => {
    if (!query) return tags;
    
    const lowerQuery = query.toLowerCase();
    return tags.filter(tag =>
        tag.name.toLowerCase().includes(lowerQuery)
    );
};