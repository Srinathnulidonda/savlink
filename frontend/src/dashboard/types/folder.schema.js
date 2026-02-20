// src/dashboard/types/folder.schema.js
/**
 * Folder data shape and validation
 */

export const createFolderSchema = (data = {}) => ({
    id: data.id || null,
    name: data.name || '',
    color: data.color || null,
    icon: data.icon || '📁',
    position: data.position || 0,
    parent_id: data.parent_id || null,
    
    // Status
    pinned: data.pinned || false,
    soft_deleted: data.soft_deleted || false,
    
    // Timestamps
    created_at: data.created_at || null,
    updated_at: data.updated_at || null,
    
    // Relations
    user_id: data.user_id || null,
    parent: data.parent || null,
    children: data.children || [],
    
    // Computed
    link_count: data.link_count || 0,
    total_link_count: data.total_link_count || 0,
    depth: data.depth || 0
});

export const validateFolderData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Folder name is required');
    }
    
    if (data.name && data.name.length > 255) {
        errors.push('Folder name is too long (max 255 characters)');
    }
    
    if (data.color && !isValidColor(data.color)) {
        errors.push('Invalid color format');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const isValidColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
};

// Folder helpers
export const getFolderIcon = (folder) => {
    return folder.icon || '📁';
};

export const getFolderColor = (folder) => {
    return folder.color || '#6B7280';
};

export const isRootFolder = (folder) => {
    return !folder.parent_id;
};

export const hasChildren = (folder) => {
    return folder.children && folder.children.length > 0;
};

export const getFolderPath = (folder, allFolders) => {
    const path = [];
    let current = folder;
    
    while (current) {
        path.unshift(current);
        current = allFolders.find(f => f.id === current.parent_id);
    }
    
    return path;
};

export const canMoveFolder = (source, target) => {
    // Can't move to self
    if (source.id === target.id) return false;
    
    // Can't move to own descendant
    if (isDescendant(source, target)) return false;
    
    return true;
};

const isDescendant = (ancestor, potential_descendant) => {
    let current = potential_descendant;
    
    while (current && current.parent_id) {
        if (current.parent_id === ancestor.id) {
            return true;
        }
        // This would need the full folder tree to work properly
        current = current.parent;
    }
    
    return false;
};

// Folder tree helpers
export const buildFolderTree = (folders) => {
    const folderMap = new Map();
    const roots = [];
    
    // Create folder map
    folders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [] });
    });
    
    // Build tree
    folders.forEach(folder => {
        const folderNode = folderMap.get(folder.id);
        
        if (folder.parent_id && folderMap.has(folder.parent_id)) {
            folderMap.get(folder.parent_id).children.push(folderNode);
        } else {
            roots.push(folderNode);
        }
    });
    
    return roots;
};

export const flattenFolderTree = (tree) => {
    const result = [];
    
    const traverse = (nodes, depth = 0) => {
        nodes.forEach(node => {
            result.push({ ...node, depth });
            if (node.children && node.children.length > 0) {
                traverse(node.children, depth + 1);
            }
        });
    };
    
    traverse(tree);
    return result;
};