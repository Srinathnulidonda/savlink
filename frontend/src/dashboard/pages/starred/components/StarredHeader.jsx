// src/dashboard/pages/starred/StarredHeader.jsx
import MobileFilesToolbar from '../../../components/mobile/MobileFilesToolbar';
import DesktopSortDropdown, { DEFAULT_SORT_FIELDS } from '../../../components/common/DesktopSortDropdown';

export default function StarredHeader({
  totalCount,
  sortBy, sortOrder, onSortChange,
  viewMode, onViewModeChange,
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/[0.08] border border-amber-500/10
                          flex items-center justify-center flex-shrink-0">
            <svg className="w-[18px] h-[18px] text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082
                   5.007 5.404.433c1.164.093 1.636 1.545.749
                   2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964
                   2.033-1.96 1.425L12 18.354 7.373
                   21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433
                   2.082-5.006z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white">Starred</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {totalCount} {totalCount === 1 ? 'link' : 'links'}
            </p>
          </div>
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