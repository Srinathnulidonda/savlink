// src/dashboard/modals/AddLink/useAddLink.js
import { useState, useCallback } from 'react';
import { LinksService } from '../../../services/links.service';

export default function useAddLink() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    const createLink = useCallback(async (linkData) => {
        setLoading(true);
        setError('');
        setDuplicateWarning(null);

        try {
            // Validate URL
            if (!linkData.original_url) {
                throw new Error('URL is required');
            }

            // Normalize URL
            let url = linkData.original_url.trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            // Validate URL format
            try {
                new URL(url);
            } catch {
                throw new Error('Please enter a valid URL');
            }

            // Check for duplicates first
            try {
                const duplicateCheck = await LinksService.checkDuplicate(url);
                if (duplicateCheck?.success && duplicateCheck?.data?.duplicate?.exists) {
                    setDuplicateWarning({
                        existing_title: duplicateCheck.data.duplicate.existing_title || 'Existing link',
                        existing_link_id: duplicateCheck.data.duplicate.existing_link_id
                    });
                    // Don't block creation - let user decide
                }
            } catch (err) {
                // Don't fail on duplicate check error
                console.warn('Duplicate check failed:', err);
            }

            // Create the link
            const result = await LinksService.createLink({
                ...linkData,
                original_url: url
            });
            
            if (!result?.success) {
                throw new Error(result?.error || 'Failed to create link');
            }

            return result.data.link;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to create link';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTitleFromUrl = useCallback(async (url) => {
        try {
            // Normalize URL for metadata fetch
            let normalizedUrl = url.trim();
            if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
                normalizedUrl = 'https://' + normalizedUrl;
            }

            const metadata = await LinksService.fetchMetadata(normalizedUrl);
            return {
                title: metadata?.title || '',
                description: metadata?.description || '',
                favicon: metadata?.favicon || ''
            };
        } catch (err) {
            console.error('Failed to fetch metadata:', err);
            // Fallback to domain extraction
            try {
                const urlObj = new URL(normalizedUrl);
                return {
                    title: urlObj.hostname.replace('www.', ''),
                    description: '',
                    favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
                };
            } catch {
                return { title: '', description: '', favicon: '' };
            }
        }
    }, []);

    // Make clearError stable with useCallback
    const clearError = useCallback(() => {
        setError('');
        setDuplicateWarning(null);
    }, []);

    return {
        loading,
        error,
        duplicateWarning,
        createLink,
        fetchTitleFromUrl,
        clearError
    };
}