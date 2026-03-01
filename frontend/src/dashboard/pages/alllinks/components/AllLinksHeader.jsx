// src/dashboard/pages/alllinks/AllLinksHeader.jsx
import MobileFilesToolbar from '../../../components/mobile/MobileFilesToolbar';
import DesktopSortDropdown, { DEFAULT_SORT_FIELDS } from '../../../components/common/DesktopSortDropdown';

export default function AllLinksHeader({
  totalCount,
  sortBy, sortOrder, onSortChange,
  viewMode, onViewModeChange,
  onAddLink,
  isMobile,
}) {
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
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white">All Links</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {totalCount} {totalCount === 1 ? 'link' : 'links'}
            </p>
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