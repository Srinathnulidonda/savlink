// src/dashboard/pages/starred/useStarredLinks.js
import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardService from '../../../services/dashboard.service';
import LinksService from '../../../services/links.service';
import { cache, KEYS, STALE_TIMES } from '../../../cache';
import { invalidateHome, invalidateStarred } from '../../../cache';
import toast from 'react-hot-toast';

function cacheKey(sort, order, search) {
  return `starred:${sort}:${order}:${search || ''}`;
}

export function useStarredLinks() {
  const [links, setLinks] = useState([]);
  const [meta, setMeta] = useState({ has_more: false, next_cursor: null, total: 0 });
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const mountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const key = cacheKey(sortBy, sortOrder, searchQuery);
    const cached = cache.get(key);

    if (cached && !initializedRef.current) {
      applyData(cached);
      setLoading(false);
      initializedRef.current = true;
      if (cache.isStale(key, STALE_TIMES.ROOT_ITEMS)) {
        fetchLinks(true, false);
      }
    } else if (cached) {
      applyData(cached);
      if (cache.isStale(key, STALE_TIMES.ROOT_ITEMS)) {
        fetchLinks(true, false);
      }
    } else {
      fetchLinks(true, !initializedRef.current);
      initializedRef.current = true;
    }
  }, [searchQuery, sortBy, sortOrder]);

  function applyData(d) {
    setLinks(d.links || []);
    setMeta({
      has_more: d.meta?.has_more || d.hasMore || false,
      next_cursor: d.meta?.next_cursor || d.cursor || null,
      total: d.meta?.total ?? 0,
    });
  }

  const fetchLinks = useCallback(async (reset = true, showLoading = true) => {
    const id = ++fetchIdRef.current;
    if (showLoading) setLoading(true);
    if (!reset) setLinksLoading(true);

    try {
      const params = {
        view: 'starred',
        sort: sortBy,
        order: sortOrder,
        limit: 30,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (!reset && meta.next_cursor) params.cursor = meta.next_cursor;

      const result = await DashboardService.getLinks(params);
      if (!mountedRef.current || id !== fetchIdRef.current) return;

      if (result.success) {
        const d = result.data;
        if (reset) {
          applyData(d);
          cache.set(cacheKey(sortBy, sortOrder, searchQuery), d);
        } else {
          setLinks(prev => {
            const existing = new Set(prev.map(l => l.id));
            const deduped = (d.links || []).filter(l => !existing.has(l.id));
            return [...prev, ...deduped];
          });
          setMeta({
            has_more: d.meta?.has_more || d.hasMore || false,
            next_cursor: d.meta?.next_cursor || d.cursor || null,
            total: d.meta?.total ?? 0,
          });
        }
      }
    } finally {
      if (mountedRef.current && id === fetchIdRef.current) {
        setLoading(false);
        setLinksLoading(false);
      }
    }
  }, [searchQuery, sortBy, sortOrder, meta.next_cursor]);

  const loadMore = useCallback(() => {
    if (!meta.has_more || linksLoading) return;
    fetchLinks(false, false);
  }, [fetchLinks, meta.has_more, linksLoading]);

  const refresh = useCallback(() => {
    invalidateHome();
    invalidateStarred();
    cache.dropByPrefix('starred:');
    fetchLinks(true, false);
  }, [fetchLinks]);

  const updateLink = useCallback(async (linkId, updates) => {
    const result = await LinksService.updateLink(linkId, updates);
    if (result?.success && result?.data) {
      setLinks(prev => prev.map(l => l.id === linkId ? result.data : l));
      cache.dropByPrefix('starred:');
      toast.success('Updated');
    }
  }, []);

  const deleteLink = useCallback(async (linkId) => {
    const prev = links;
    setLinks(p => p.filter(l => l.id !== linkId));
    const result = await LinksService.deleteLink(linkId);
    if (result.success) {
      toast.success('Deleted');
      cache.dropByPrefix('starred:');
    } else {
      setLinks(prev);
      toast.error(result.error);
    }
  }, [links]);

  const pinLink = useCallback(async (linkId) => {
    const link = links.find(l => l.id === linkId);
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, pinned: !l.pinned } : l));
    const result = link?.pinned
      ? await LinksService.unpinLink(linkId)
      : await LinksService.pinLink(linkId);
    if (result.success) {
      cache.dropByPrefix('starred:');
      toast.success(link?.pinned ? 'Unpinned' : 'Pinned');
    } else {
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, pinned: link.pinned } : l));
    }
  }, [links]);

  const starLink = useCallback(async (linkId) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    if (link.starred) {
      setLinks(prev => prev.filter(l => l.id !== linkId));
      setMeta(prev => ({ ...prev, total: Math.max(0, (prev.total || 0) - 1) }));
    } else {
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, starred: true } : l));
    }

    const result = link.starred
      ? await LinksService.unstarLink(linkId)
      : await LinksService.starLink(linkId);

    if (result.success) {
      cache.dropByPrefix('starred:');
      toast.success(link.starred ? 'Removed from starred' : 'Starred');
    } else {
      if (link.starred) {
        refresh();
      } else {
        setLinks(prev => prev.map(l => l.id === linkId ? { ...l, starred: false } : l));
      }
    }
  }, [links, refresh]);

  const archiveLink = useCallback(async (linkId) => {
    const prev = links;
    setLinks(p => p.filter(l => l.id !== linkId));
    setMeta(m => ({ ...m, total: Math.max(0, (m.total || 0) - 1) }));
    const link = prev.find(l => l.id === linkId);
    const result = link?.archived
      ? await LinksService.restoreLink(linkId)
      : await LinksService.archiveLink(linkId);
    if (result.success) {
      toast.success(link?.archived ? 'Restored' : 'Archived');
      cache.dropByPrefix('starred:');
    } else {
      setLinks(prev);
      toast.error(result.error);
    }
  }, [links]);

  const bulkDelete = useCallback(async (ids) => {
    if (!window.confirm(`Delete ${ids.length} links?`)) return false;
    const result = await LinksService.bulkDelete(ids);
    if (result.success) { toast.success('Deleted'); refresh(); return true; }
    toast.error(result.error); return false;
  }, [refresh]);

  const bulkArchive = useCallback(async (ids) => {
    const result = await LinksService.bulkArchive(ids);
    if (result.success) { toast.success('Archived'); refresh(); return true; }
    toast.error(result.error); return false;
  }, [refresh]);

  return {
    links, meta, loading, linksLoading,
    searchQuery, setSearchQuery,
    sortBy, setSortBy, sortOrder, setSortOrder,
    loadMore, refresh, updateLink, deleteLink,
    pinLink, starLink, archiveLink,
    bulkDelete, bulkArchive,
  };
}