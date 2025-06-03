import { Navigate, useRoutes } from 'react-router-dom';
// config
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    // {
    //   path: '/',
    //   element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    // },

    // ----------------------------------------------------------------------

    // SET INDEX PAGE WITH HOME PAGE

    // Auth routes
    ...authRoutes,
    // Dashboard routes
    ...dashboardRoutes,
    // Main routes

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
