// src/dashboard/modals/AddLink/useAddLink.js

import { useState } from 'react';
import LinksService from '../../../services/links.service'; // ✅ Changed to default import
import toast from 'react-hot-toast';

export function useAddLink() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addLink = async (linkData) => {
        setLoading(true);
        setError('');

        try {
            // Validate URL
            if (!linkData.original_url) {
                throw new Error('URL is required');
            }

            // Basic URL validation
            try {
                new URL(linkData.original_url);
            } catch {
                throw new Error('Please enter a valid URL');
            }

            const result = await LinksService.createLink(linkData);
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to save link');
            }

            toast.success('Link saved successfully!');
            return { success: true, data: result.data };

        } catch (err) {
            const errorMessage = err.message || 'Failed to save link';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const validateUrl = (url) => {
        if (!url) return { valid: false, error: 'URL is required' };

        try {
            const urlObj = new URL(url);
            
            // Check for valid protocols
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return { valid: false, error: 'URL must start with http:// or https://' };
            }

            return { valid: true, error: null };
        } catch {
            return { valid: false, error: 'Please enter a valid URL' };
        }
    };

    const extractMetadata = async (url) => {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.replace('www.', '');
            
            // Basic metadata extraction
            return {
                domain,
                title: domain,
                description: '',
                favicon: null
            };
        } catch {
            return {
                domain: '',
                title: '',
                description: '',
                favicon: null
            };
        }
    };

    const clearError = () => setError('');

    return {
        addLink,
        loading,
        error,
        clearError,
        validateUrl,
        extractMetadata
    };
}