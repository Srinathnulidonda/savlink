// src/dashboard/hooks/useFolderTree.js
import { useState, useCallback, useMemo } from 'react';
import { FoldersService } from '../../services/folders.service';

export default function useFolderTree() {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFolders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await FoldersService.getFolders();
            if (result?.success) {
                setFolders(result.data.folders || []);
            }
        } catch (err) {
            console.error('Failed to fetch folders:', err);
            setError('Failed to load folders');
        } finally {
            setLoading(false);
        }
    }, []);

    // Build hierarchical tree structure
    const folderTree = useMemo(() => {
        const buildTree = (parentId = null) => {
            return folders
                .filter(folder => folder.parent_id === parentId)
                .map(folder => ({
                    ...folder,
                    children: buildTree(folder.id)
                }))
                .sort((a, b) => (a.position || 0) - (b.position || 0));
        };

        return buildTree();
    }, [folders]);

    // Flatten tree for certain operations
    const flatFolders = useMemo(() => {
        return folders.sort((a, b) => (a.position || 0) - (b.position || 0));
    }, [folders]);

    // Get folder breadcrumbs
    const getFolderPath = useCallback((folderId) => {
        const path = [];
        let currentId = folderId;

        while (currentId) {
            const folder = folders.find(f => f.id === currentId);
            if (folder) {
                path.unshift(folder);
                currentId = folder.parent_id;
            } else {
                break;
            }
        }

        return path;
    }, [folders]);

    // Check if folder has children
    const hasChildren = useCallback((folderId) => {
        return folders.some(folder => folder.parent_id === folderId);
    }, [folders]);

    // Get folder by ID
    const getFolderById = useCallback((folderId) => {
        return folders.find(folder => folder.id === folderId);
    }, [folders]);

    // Get root folders (no parent)
    const rootFolders = useMemo(() => {
        return folders
            .filter(folder => !folder.parent_id)
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    }, [folders]);

    // Get children of specific folder
    const getChildren = useCallback((parentId) => {
        return folders
            .filter(folder => folder.parent_id === parentId)
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    }, [folders]);

    // Create new folder
    const createFolder = useCallback(async (folderData) => {
        try {
            const result = await FoldersService.createFolder(folderData);
            if (result?.success) {
                setFolders(prev => [...prev, result.data.folder]);
                return result.data.folder;
            }
        } catch (err) {
            console.error('Failed to create folder:', err);
            throw err;
        }
    }, []);

    // Update folder
    const updateFolder = useCallback(async (folderId, updates) => {
        try {
            const result = await FoldersService.updateFolder(folderId, updates);
            if (result?.success) {
                setFolders(prev => 
                    prev.map(folder => 
                        folder.id === folderId 
                            ? { ...folder, ...updates }
                            : folder
                    )
                );
                return result.data.folder;
            }
        } catch (err) {
            console.error('Failed to update folder:', err);
            throw err;
        }
    }, []);

    // Delete folder
    const deleteFolder = useCallback(async (folderId) => {
        try {
            const result = await FoldersService.deleteFolder(folderId);
            if (result?.success) {
                setFolders(prev => prev.filter(folder => folder.id !== folderId));
                return true;
            }
        } catch (err) {
            console.error('Failed to delete folder:', err);
            throw err;
        }
    }, []);

    // Move folder to different parent
    const moveFolder = useCallback(async (folderId, newParentId) => {
        try {
            const result = await FoldersService.moveFolder(folderId, newParentId);
            if (result?.success) {
                setFolders(prev =>
                    prev.map(folder =>
                        folder.id === folderId
                            ? { ...folder, parent_id: newParentId }
                            : folder
                    )
                );
                return result.data.folder;
            }
        } catch (err) {
            console.error('Failed to move folder:', err);
            throw err;
        }
    }, []);

    return {
        folders: flatFolders,
        folderTree,
        rootFolders,
        loading,
        error,
        fetchFolders,
        getFolderPath,
        getFolderById,
        getChildren,
        hasChildren,
        createFolder,
        updateFolder,
        deleteFolder,
        moveFolder,
        refetch: fetchFolders
    };
}