// src/dashboard/pages/archive/components/ArchiveHeader.jsx
import MobileFilesToolbar from '../../../components/mobile/MobileFilesToolbar';
import DesktopSortDropdown from '../../../components/common/DesktopSortDropdown';

const ARCHIVE_SORT_FIELDS = [
  { id: 'updated_at',  label: 'Date archived', defaultOrder: 'desc' },
  { id: 'created_at',  label: 'Date added',    defaultOrder: 'desc' },
  { id: 'title',       label: 'Name',          defaultOrder: 'asc' },
  { id: 'click_count', label: 'Most clicked',  defaultOrder: 'desc' },
];

export default function ArchiveHeader({
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
        sortFields={ARCHIVE_SORT_FIELDS}
      />
    );
  }

  return (
    <div className="flex-shrink-0 border-b border-white/[0.05]">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gray-500/[0.08] border border-gray-500/10
                          flex items-center justify-center flex-shrink-0">
            <svg className="w-[18px] h-[18px] text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25
                   2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621
                   0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621
                   0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white">Archive</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {totalCount} archived {totalCount === 1 ? 'link' : 'links'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DesktopSortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            sortFields={ARCHIVE_SORT_FIELDS}
          />
        </div>
      </div>
    </div>
  );
}