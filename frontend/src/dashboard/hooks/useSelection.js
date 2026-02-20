// src/dashboard/hooks/useSelection.js
import { useState, useCallback } from 'react';

export default function useSelection(items = []) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

    const isSelected = useCallback((id) => {
        return selectedIds.has(id);
    }, [selectedIds]);

    const isAllSelected = useCallback(() => {
        return items.length > 0 && selectedIds.size === items.length;
    }, [selectedIds.size, items.length]);

    const isSomeSelected = useCallback(() => {
        return selectedIds.size > 0 && selectedIds.size < items.length;
    }, [selectedIds.size, items.length]);

    const toggleSelection = useCallback((id) => {
        setSelectedIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            return newSelection;
        });
    }, []);

    const selectItem = useCallback((id) => {
        setSelectedIds(prev => new Set(prev).add(id));
    }, []);

    const deselectItem = useCallback((id) => {
        setSelectedIds(prev => {
            const newSelection = new Set(prev);
            newSelection.delete(id);
            return newSelection;
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds(new Set(items.map(item => item.id)));
    }, [items]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
        setLastSelectedIndex(null);
    }, []);

    const selectRange = useCallback((startIndex, endIndex) => {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const rangeIds = items.slice(start, end + 1).map(item => item.id);
        
        setSelectedIds(prev => {
            const newSelection = new Set(prev);
            rangeIds.forEach(id => newSelection.add(id));
            return newSelection;
        });
    }, [items]);

    const handleItemClick = useCallback((id, index, event) => {
        if (event.shiftKey && lastSelectedIndex !== null) {
            // Range selection
            selectRange(lastSelectedIndex, index);
        } else if (event.ctrlKey || event.metaKey) {
            // Toggle selection
            toggleSelection(id);
        } else {
            // Single selection
            setSelectedIds(new Set([id]));
        }
        setLastSelectedIndex(index);
    }, [lastSelectedIndex, selectRange, toggleSelection]);

    const getSelectedItems = useCallback(() => {
        return items.filter(item => selectedIds.has(item.id));
    }, [items, selectedIds]);

    const getSelectedIds = useCallback(() => {
        return Array.from(selectedIds);
    }, [selectedIds]);

    return {
        selectedIds: Array.from(selectedIds),
        selectedCount: selectedIds.size,
        isSelected,
        isAllSelected,
        isSomeSelected,
        toggleSelection,
        selectItem,
        deselectItem,
        selectAll,
        clearSelection,
        selectRange,
        handleItemClick,
        getSelectedItems,
        getSelectedIds
    };
}