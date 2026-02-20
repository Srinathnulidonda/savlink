// src/dashboard/views/Home/RecentActivity.jsx
import { formatRelativeDate } from '../../../utils/dates';
import EmptyState from '../../components/common/EmptyState';

export default function RecentActivity({ activity }) {
  if (!activity.length) {
    return (
      <EmptyState
        title="No recent activity"
        description="Your recent actions will appear here."
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">
        🕒 Recent Activity
      </h2>

      <div className="space-y-3">
        {activity.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3"
          >
            <div className="text-sm text-gray-300">
              {item.label}
            </div>
            <div className="text-xs text-gray-500">
              {formatRelativeDate(item.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}