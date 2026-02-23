// src/dashboard/pages/home/hooks/useHomeData.js

import { useState, useEffect, useRef, useCallback } from 'react';
import DashboardService from '../../../../services/dashboard.service';

export function useHomeData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);
    const fetchedRef = useRef(false);

    const fetchData = useCallback(async (isRefetch = false) => {
        if (fetchedRef.current && !isRefetch) return;
        fetchedRef.current = true;

        try {
            if (!isRefetch) setLoading(true);
            setError(null);

            const result = await DashboardService.getHomeData();

            if (!mountedRef.current) return;

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || 'Failed to load data');
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();

        return () => {
            mountedRef.current = false;
            fetchedRef.current = false;
        };
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchedRef.current = false;
        fetchData(true);
    }, [fetchData]);

    return { data, loading, error, refetch };
}