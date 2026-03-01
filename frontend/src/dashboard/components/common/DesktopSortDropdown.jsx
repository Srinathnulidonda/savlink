// src/dashboard/components/common/DesktopSortDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const DEFAULT_SORT_FIELDS = [
  { id: 'title',       label: 'Name',          defaultOrder: 'asc' },
  { id: 'updated_at',  label: 'Date modified', defaultOrder: 'desc' },
  { id: 'created_at',  label: 'Date created',  defaultOrder: 'desc' },
  { id: 'click_count', label: 'Most clicked',  defaultOrder: 'desc' },
];

const DEFAULT_DIRECTIONS = {
  title:       { asc: 'A → Z',         desc: 'Z → A' },
  name:        { asc: 'A → Z',         desc: 'Z → A' },
  updated_at:  { asc: 'Oldest first',  desc: 'Newest first' },
  created_at:  { asc: 'Oldest first',  desc: 'Newest first' },
  opened_at:   { asc: 'Oldest first',  desc: 'Newest first' },
  click_count: { asc: 'Fewest clicks', desc: 'Most clicks' },
  expiry:      { asc: 'Soonest first', desc: 'Latest first' },
};

export default function DesktopSortDropdown({
  sortBy,
  sortOrder,
  onSortChange,
  sortFields = DEFAULT_SORT_FIELDS,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const currentField = sortFields.find(f => f.id === sortBy) || sortFields[0];
  const sortLabel = currentField.label;

  const handleFieldClick = (field) => {
    if (sortBy === field.id) {
      onSortChange(field.id, sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      onSortChange(field.id, field.defaultOrder);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-8 px-2.5 text-[12px] text-gray-400
                   border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]
                   rounded-lg transition-colors whitespace-nowrap"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12
               16.5m4.5 4.5V7.5" />
        </svg>
        <span className="hidden sm:inline">{sortLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full mt-1 left-0 w-44 bg-[#111]
                       border border-gray-800/60 rounded-lg shadow-2xl z-[70] py-1"
          >
            {sortFields.map(field => {
              const isActive = sortBy === field.id;
              return (
                <button
                  key={field.id}
                  onClick={() => handleFieldClick(field)}
                  className={`w-full flex items-center justify-between px-3 py-2.5
                              text-[13px] transition-colors
                    ${isActive
                      ? 'text-white bg-white/[0.04]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}
                >
                  {field.label}
                  {isActive && (
                    <svg
                      className={`w-3 h-3 transition-transform
                        ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { DEFAULT_SORT_FIELDS, DEFAULT_DIRECTIONS };