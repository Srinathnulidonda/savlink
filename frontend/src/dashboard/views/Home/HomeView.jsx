// src/dashboard/views/Home/HomeView.jsx
import useHomeData from './useHomeData';
import QuickAccess from './QuickAccess';
import RecentActivity from './RecentActivity';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import Divider from '../../components/common/Divider';

export default function HomeView() {
  const { links, recent, loading, error, refetch } = useHomeData();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <QuickAccess links={links} />
      <Divider />
      <RecentActivity activity={recent} />
    </div>
  );
}