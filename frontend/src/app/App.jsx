// src/app/App.jsx

import { Suspense } from 'react';
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-gray-800 border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}