// src/dashboard/hooks/usePinned.js
import { useState, useCallback } from 'react';
import { LinksService } from '../../services/links.service';

export default function usePinned() {
    const [pinnedLinks, setPinnedLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPinnedLinks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await LinksService.getLinks({
                view: 'pinned',
                limit: 50
            });

            if (result?.success) {
                setPinnedLinks(result.data.links || []);
            }
        } catch (err) {
            console.error('Failed to fetch pinned links:', err);
            setError('Failed to load pinned links');
        } finally {
            setLoading(false);
        }
    }, []);

    const togglePin = useCallback(async (linkId, currentPinStatus) => {
        try {
            const result = await LinksService.updateLink(linkId, {
                pinned: !currentPinStatus
            });

            if (result?.success) {
                setPinnedLinks(prev => {
                    if (!currentPinStatus) {
                        // Adding to pinned
                        return [...prev, result.data.link];
                    } else {
                        // Removing from pinned
                        return prev.filter(link => link.id !== linkId);
                    }
                });
                return result.data.link;
            }
        } catch (err) {
            console.error('Failed to toggle pin:', err);
            throw err;
        }
    }, []);

    const bulkPin = useCallback(async (linkIds) => {
        try {
            setLoading(true);
            const results = await Promise.all(
                linkIds.map(id => LinksService.updateLink(id, { pinned: true }))
            );

            const successfulLinks = results
                .filter(r => r?.success)
                .map(r => r.data.link);

            setPinnedLinks(prev => [...prev, ...successfulLinks]);
            return successfulLinks;
        } catch (err) {
            console.error('Failed to bulk pin:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkUnpin = useCallback(async (linkIds) => {
        try {
            setLoading(true);
            await Promise.all(
                linkIds.map(id => LinksService.updateLink(id, { pinned: false }))
            );

            setPinnedLinks(prev => prev.filter(link => !linkIds.includes(link.id)));
        } catch (err) {
            console.error('Failed to bulk unpin:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        pinnedLinks,
        loading,
        error,
        fetchPinnedLinks,
        togglePin,
        bulkPin,
        bulkUnpin,
        refetch: fetchPinnedLinks
    };
}