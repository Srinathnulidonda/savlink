// src/dashboard/components/folders/FolderIcon.jsx
export default function FolderIcon({ icon, color, size = 'md' }) {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    if (icon && icon !== '📁') {
        return (
            <span className={textSizes[size]}>
                {icon}
            </span>
        );
    }

    return (
        <svg
            className={`${sizeClasses[size]} ${color || 'text-gray-500'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
    );
}