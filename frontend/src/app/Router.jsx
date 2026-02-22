// frontend/src/app/Router.jsx - Updated
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, lazy } from 'react';

// Auth components
import { RequireAuth } from '../auth/guards/RequireAuth';

// Eager load critical pages
import Home from '../public-site/pages/Home';
import VerifyEmail from '../auth/pages/VerifyEmail';

// Lazy load other pages
const Login = lazy(() => import('../auth/pages/Login'));
const Register = lazy(() => import('../auth/pages/Register'));
const Dashboard = lazy(() => import('../dashboard/DashboardApp'));
const NotFound = lazy(() => import('../public-site/pages/NotFound'));

// Enhanced redirect handler for SPA routing
function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle redirect from 404.html with query parameter
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('redirect');

    if (redirectPath && redirectPath !== location.pathname) {
      console.log('Redirecting from 404 to:', redirectPath);
      navigate(redirectPath, { replace: true });
      return;
    }

    // Handle hash routing fallback for Vercel 404s
    if (window.location.hash && window.location.hash.length > 1) {
      const hashPath = window.location.hash.substring(1);
      if (hashPath !== location.pathname && hashPath.startsWith('/')) {
        console.log('Redirecting from hash to:', hashPath);
        window.history.replaceState(null, '', hashPath);
        navigate(hashPath, { replace: true });
        return;
      }
    }
  }, [location, navigate]);

  return null;
}

// Router enhancements and scroll restoration
function RouterEnhancements() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      setTimeout(() => window.scrollTo(0, 0), 0);
    } else {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Route changed to:', location.pathname + location.search + location.hash);
    }
  }, [location]);

  return null;
}

export default function Router() {
  return (
    <>
      <RedirectHandler />
      <RouterEnhancements />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Auth callback route for OAuth flows */}
        <Route path="/auth/callback" element={<Login />} />

        {/* Protected Routes - All dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Common Redirects for better UX */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/sign-in" element={<Navigate to="/login" replace />} />
        <Route path="/sign-up" element={<Navigate to="/register" replace />} />
        <Route path="/log-in" element={<Navigate to="/login" replace />} />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Catch all 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}