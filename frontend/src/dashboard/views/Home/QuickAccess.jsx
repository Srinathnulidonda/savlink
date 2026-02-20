// src/dashboard/views/Home/QuickAccess.jsx
import LinkCard from '../../components/links/LinkCard';
import EmptyState from '../../components/common/EmptyState';

export default function QuickAccess({ links }) {
  if (!links.length) {
    return (
      <EmptyState
        title="No pinned links"
        description="Pin links to see them here for quick access."
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">
        ⚡ Quick Access
      </h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <LinkCard key={link.id} link={link} index={index} />
        ))}
      </div>
    </div>
  );
}