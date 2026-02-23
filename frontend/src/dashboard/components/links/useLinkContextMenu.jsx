// src/dashboard/components/links/useLinkContextMenu.jsx
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useLinkContextMenu({ onPin, onArchive, onDelete, onSelect }) {
    const getMenuItems = useCallback((link) => {
        if (!link) return [];

        return [
            {
                id: 'open',
                label: 'Open in new tab',
                shortcut: '↵',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                ),
                action: () => window.open(link.original_url, '_blank', 'noopener,noreferrer'),
            },
            { type: 'divider' },
            {
                id: 'copy-url',
                label: 'Copy link',
                shortcut: '⌘C',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                ),
                action: async () => {
                    try {
                        await navigator.clipboard.writeText(link.original_url);
                        toast.success('Link copied');
                    } catch {
                        toast.error('Copy failed');
                    }
                },
            },
            ...(link.short_url
                ? [{
                    id: 'copy-short',
                    label: 'Copy short URL',
                    icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                    ),
                    action: async () => {
                        try {
                            await navigator.clipboard.writeText(link.short_url);
                            toast.success('Short URL copied');
                        } catch {
                            toast.error('Copy failed');
                        }
                    },
                }]
                : []),
            {
                id: 'copy-md',
                label: 'Copy as Markdown',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                ),
                action: async () => {
                    const md = `[${link.title || link.original_url}](${link.original_url})`;
                    try {
                        await navigator.clipboard.writeText(md);
                        toast.success('Markdown copied');
                    } catch {
                        toast.error('Copy failed');
                    }
                },
            },
            { type: 'divider' },
            {
                id: 'star',
                label: link.pinned ? 'Remove star' : 'Add to starred',
                shortcut: 'S',
                active: !!link.pinned,
                icon: (
                    <svg className="w-4 h-4" fill={link.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                ),
                action: () => onPin?.(),
            },
            {
                id: 'archive',
                label: link.archived ? 'Restore' : 'Move to archive',
                shortcut: 'E',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                ),
                action: () => onArchive?.(),
            },
            {
                id: 'select',
                label: 'Select',
                shortcut: 'X',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                action: () => onSelect?.(),
            },
            { type: 'divider' },
            {
                id: 'delete',
                label: 'Delete',
                shortcut: '⌫',
                danger: true,
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                ),
                action: () => {
                    if (window.confirm(`Delete "${link.title || 'this link'}"?`)) {
                        onDelete?.();
                    }
                },
            },
        ];
    }, [onPin, onArchive, onDelete, onSelect]);

    return { getMenuItems };
}