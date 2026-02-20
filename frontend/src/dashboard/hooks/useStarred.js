// src/dashboard/hooks/useStarred.js
import { useState, useCallback } from 'react';
import { LinksService } from '../../services/links.service';

export default function useStarred() {
    const [starredLinks, setStarredLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStarredLinks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await LinksService.getLinks({
                view: 'starred',
                limit: 50
            });

            if (result?.success) {
                setStarredLinks(result.data.links || []);
            }
        } catch (err) {
            console.error('Failed to fetch starred links:', err);
            setError('Failed to load starred links');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleStar = useCallback(async (linkId, currentStarStatus) => {
        try {
            const result = await LinksService.updateLink(linkId, {
                starred: !currentStarStatus
            });

            if (result?.success) {
                setStarredLinks(prev => {
                    if (!currentStarStatus) {
                        // Adding to starred
                        return [...prev, result.data.link];
                    } else {
                        // Removing from starred
                        return prev.filter(link => link.id !== linkId);
                    }
                });
                return result.data.link;
            }
        } catch (err) {
            console.error('Failed to toggle star:', err);
            throw err;
        }
    }, []);

    const getStarredByFolder = useCallback((folderId) => {
        return starredLinks.filter(link => 
            folderId ? link.folder_id === folderId : !link.folder_id
        );
    }, [starredLinks]);

    const getStarredByTag = useCallback((tagId) => {
        return starredLinks.filter(link => 
            link.tags?.some(tag => tag.id === tagId)
        );
    }, [starredLinks]);

    const bulkStar = useCallback(async (linkIds) => {
        try {
            setLoading(true);
            const results = await Promise.all(
                linkIds.map(id => LinksService.updateLink(id, { starred: true }))
            );

            const successfulLinks = results
                .filter(r => r?.success)
                .map(r => r.data.link);

            setStarredLinks(prev => [...prev, ...successfulLinks]);
            return successfulLinks;
        } catch (err) {
            console.error('Failed to bulk star:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        starredLinks,
        loading,
        error,
        fetchStarredLinks,
        toggleStar,
        getStarredByFolder,
        getStarredByTag,
        bulkStar,
        refetch: fetchStarredLinks
    };
}