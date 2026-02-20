// src/dashboard/views/Archived/useArchivedData.js
import { useState, useEffect, useCallback } from 'react';
import { LinksService } from '../../../services/links.service';
import { FoldersService } from '../../../services/folders.service';

export default function useArchivedData({ searchQuery, sortBy, filters }) {
    const [links, setLinks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [stats, setStats] = useState({ total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [cursor, setCursor] = useState(null);

    const fetchData = useCallback(async (reset = false) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                view: 'archive',
                archived: true,
                limit: 20,
                cursor: reset ? null : cursor,
                sort_by: sortBy
            };

            if (searchQuery) params.search = searchQuery;
            if (filters.folder_id) params.folder_id = filters.folder_id;
            if (filters.tag_ids?.length) params.tag_ids = filters.tag_ids.join(',');
            if (filters.starred) params.starred = true;
            if (filters.pinned) params.pinned = true;
            if (filters.link_type) params.link_type = filters.link_type;

            const linksResult = await LinksService.getLinks(params);

            if (linksResult?.success) {
                const newLinks = linksResult.data.links || [];
                
                if (reset) {
                    setLinks(newLinks);
                } else {
                    setLinks(prev => [...prev, ...newLinks]);
                }

                setHasMore(!!linksResult.data.meta?.next_cursor);
                setCursor(linksResult.data.meta?.next_cursor);
                setStats({ total: newLinks.length });
            }

            if (reset || folders.length === 0) {
                const foldersResult = await FoldersService.getFolders();
                if (foldersResult?.success) {
                    setFolders(foldersResult.data.folders || []);
                }
            }

        } catch (err) {
            console.error('Failed to fetch archived links:', err);
            setError('Failed to load archived links');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, sortBy, filters, cursor]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchData(false);
        }
    }, [fetchData, loading, hasMore]);

    const refreshData = useCallback(() => {
        setCursor(null);
        fetchData(true);
    }, [fetchData]);

    const updateLink = useCallback(async (linkId, updates) => {
        try {
            const result = await LinksService.updateLink(linkId, updates);
            if (result?.success) {
                // If restoring, remove from archive list
                if (updates.archived === false) {
                    setLinks(prev => prev.filter(link => link.id !== linkId));
                } else {
                    setLinks(prev => prev.map(link => 
                        link.id === linkId ? { ...link, ...updates } : link
                    ));
                }
                return result.data.link;
            }
        } catch (err) {
            console.error('Failed to update link:', err);
            throw err;
        }
    }, []);

    const deleteLink = useCallback(async (linkId) => {
        try {
            const result = await LinksService.deleteLink(linkId);
            if (result?.success) {
                setLinks(prev => prev.filter(link => link.id !== linkId));
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            }
        } catch (err) {
            console.error('Failed to delete link:', err);
            throw err;
        }
    }, []);

    useEffect(() => {
        setCursor(null);
        fetchData(true);
    }, [searchQuery, sortBy, filters]);

    useEffect(() => {
        fetchData(true);
    }, []);

    return {
        links,
        folders,
        stats,
        loading,
        error,
        hasMore,
        loadMore,
        refreshData,
        updateLink,
        deleteLink
    };
}