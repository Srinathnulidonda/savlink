// src/dashboard/pages/recent/RecentHeader.jsx
import { useMemo } from 'react';
import MobileFilesToolbar from '../../../components/mobile/MobileFilesToolbar';
import DesktopSortDropdown, { DEFAULT_SORT_FIELDS } from '../../../components/common/DesktopSortDropdown';

export default function RecentHeader({
  totalCount,
  sortBy, sortOrder, onSortChange,
  viewMode, onViewModeChange,
  onAddLink,
  isMobile,
}) {
  const subtitle = useMemo(() => {
    if (totalCount === 0) return 'No recent links';
    return `${totalCount} ${totalCount === 1 ? 'link' : 'links'} this week`;
  }, [totalCount]);

  if (isMobile) {
    return (
      <MobileFilesToolbar
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortFields={DEFAULT_SORT_FIELDS}
      />
    );
  }

  return (
    <div className="flex-shrink-0 border-b border-white/[0.05]">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/[0.08] border border-blue-500/10
                            flex items-center justify-center flex-shrink-0">
              <svg className="w-[18px] h-[18px] text-blue-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-white">Recent</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>

          <button onClick={onAddLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
                       text-white bg-primary hover:bg-primary-light rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add link
          </button>
        </div>

        <div className="flex items-center gap-2">
          <DesktopSortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            sortFields={DEFAULT_SORT_FIELDS}
          />
        </div>
      </div>
    </div>
  );
}