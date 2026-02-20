// src/dashboard/views/Search/useSearchData.js
import { useState, useEffect, useCallback } from 'react';
import { SearchService } from '../../../services/search.service';
import { LinksService } from '../../../services/links.service';

export default function useSearchData(query) {
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [cursor, setCursor] = useState(null);

    const search = useCallback(async (searchQuery, reset = true) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setSuggestions([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const params = {
                q: searchQuery,
                limit: 20,
                cursor: reset ? null : cursor
            };

            const result = await SearchService.search(params);

            if (result?.success) {
                const newResults = result.data.results || [];
                
                if (reset) {
                    setResults(newResults);
                } else {
                    setResults(prev => [...prev, ...newResults]);
                }

                setHasMore(!!result.data.meta?.next_cursor);
                setCursor(result.data.meta?.next_cursor);
                setSuggestions(result.data.suggestions || []);
                setStats(result.data.stats || {});
            }
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [cursor]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && query) {
            search(query, false);
        }
    }, [search, loading, hasMore, query]);

    const updateLink = useCallback(async (linkId, updates) => {
        try {
            const result = await LinksService.updateLink(linkId, updates);
            if (result?.success) {
                setResults(prev => prev.map(link => 
                    link.id === linkId ? { ...link, ...updates } : link
                ));
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
                setResults(prev => prev.filter(link => link.id !== linkId));
            }
        } catch (err) {
            console.error('Failed to delete link:', err);
            throw err;
        }
    }, []);

    // Search when query changes
    useEffect(() => {
        if (query) {
            setCursor(null);
            search(query, true);
        } else {
            setResults([]);
            setSuggestions([]);
            setStats({});
        }
    }, [query]);

    return {
        results,
        suggestions,
        stats,
        loading,
        error,
        hasMore,
        loadMore,
        updateLink,
        deleteLink
    };
}