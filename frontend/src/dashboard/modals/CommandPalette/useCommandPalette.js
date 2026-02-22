// src/dashboard/modals/CommandPalette/useCommandPalette.js

import { useState, useEffect, useMemo } from 'react';

export function useCommandPalette(commands, isOpen) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
        if (!query) return commands;

        const lowerQuery = query.toLowerCase();
        return commands.filter(command =>
            command.label.toLowerCase().includes(lowerQuery) ||
            command.category?.toLowerCase().includes(lowerQuery) ||
            command.keywords?.some(keyword => 
                keyword.toLowerCase().includes(lowerQuery)
            )
        );
    }, [commands, query]);

    // Group commands by category
    const groupedCommands = useMemo(() => {
        return filteredCommands.reduce((acc, command) => {
            const category = command.category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(command);
            return acc;
        }, {});
    }, [filteredCommands]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Reset state when palette closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = (event) => {
        if (!isOpen) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
                break;

            case 'Enter':
                event.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex]);
                }
                break;

            case 'Escape':
                event.preventDefault();
                // This should be handled by parent component
                break;

            default:
                // Handle shortcut keys
                const shortcutCommand = commands.find(cmd => 
                    cmd.shortcut && 
                    cmd.shortcut.toLowerCase() === event.key.toLowerCase() &&
                    !event.metaKey && !event.ctrlKey
                );

                if (shortcutCommand) {
                    event.preventDefault();
                    executeCommand(shortcutCommand);
                }
                break;
        }
    };

    const executeCommand = (command) => {
        if (command.action) {
            command.action();
        }
    };

    const selectCommand = (index) => {
        setSelectedIndex(index);
    };

    const clearQuery = () => {
        setQuery('');
    };

    return {
        query,
        setQuery,
        selectedIndex,
        selectCommand,
        filteredCommands,
        groupedCommands,
        handleKeyDown,
        executeCommand,
        clearQuery
    };
}