// src/dashboard/modals/EditLink/useEditLink.js
import { useState } from 'react';
import { linksService } from '../../../services/links.service';

export default function useEditLink(linkId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateLink = async (updates) => {
        setLoading(true);
        setError('');

        try {
            const result = await linksService.updateLink(linkId, updates);
            
            if (!result?.success) {
                throw new Error(result?.message || 'Failed to update link');
            }

            return result.data.link;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteLink = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await linksService.deleteLink(linkId);
            
            if (!result?.success) {
                throw new Error(result?.message || 'Failed to delete link');
            }

            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const togglePin = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await linksService.togglePin(linkId);
            
            if (!result?.success) {
                throw new Error(result?.message || 'Failed to toggle pin');
            }

            return result.data.link;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleArchive = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await linksService.toggleArchive(linkId);
            
            if (!result?.success) {
                throw new Error(result?.message || 'Failed to toggle archive');
            }

            return result.data.link;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError('');

    return {
        loading,
        error,
        updateLink,
        deleteLink,
        togglePin,
        toggleArchive,
        clearError
    };
}