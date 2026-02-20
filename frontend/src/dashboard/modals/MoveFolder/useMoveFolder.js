// src/dashboard/modals/MoveFolder/useMoveFolder.js
import { useState, useCallback } from 'react';
import { FoldersService } from '../../../services/folders.service';
import { LinksService } from '../../../services/links.service';

export default function useMoveFolder() {
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

    const moveItems = useCallback(async (itemIds, targetFolderId) => {
        try {
            setLoading(true);
            setError(null);

            // Move each item
            await Promise.all(
                itemIds.map(itemId =>
                    LinksService.updateLink(itemId, { 
                        folder_id: targetFolderId 
                    })
                )
            );

        } catch (err) {
            console.error('Failed to move items:', err);
            setError('Failed to move items');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        folders,
        loading,
        error,
        fetchFolders,
        moveItems
    };
}