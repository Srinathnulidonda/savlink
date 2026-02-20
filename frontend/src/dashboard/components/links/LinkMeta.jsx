// src/dashboard/components/links/LinkMeta.jsx
export default function LinkMeta({ link }) {
    return (
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-medium text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {link.title || link.display_url}
                    </h3>
                    {link.is_public && (
                        <svg className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {link.pinned && (
                        <span className="text-yellow-500">⭐</span>
                    )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono truncate">
                    {link.display_url}
                </p>
            </div>
        </div>
    );
}