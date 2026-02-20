// src/dashboard/views/Home/useHomeData.js
import { useEffect, useState } from 'react';
import { dashboardService } from '../../../services/dashboard.service';

export default function useHomeData() {
  const [links, setLinks] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [linksRes, recentRes] = await Promise.all([
        dashboardService.getPinnedLinks(),
        dashboardService.getRecentActivity(),
      ]);

      setLinks(linksRes?.data || []);
      setRecent(recentRes?.data || []);
    } catch (err) {
      console.error('Home data fetch failed:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    links,
    recent,
    loading,
    error,
    refetch: fetchHomeData,
  };
}