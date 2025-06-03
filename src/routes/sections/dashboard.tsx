import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import BookingListPage from 'src/pages/dashboard/bookings/list';
import BookingDetailsPage from 'src/pages/dashboard/bookings/details';
import AdminUserListPage from 'src/pages/dashboard/settings/user/list';
import AdminUserEditPage from 'src/pages/dashboard/settings/user/edit';
import AdminUserCreatePage from 'src/pages/dashboard/settings/user/new';
import HostServiceChargePage from 'src/pages/dashboard/settings/host-service-charge/list';
import GuestServiceChargePage from 'src/pages/dashboard/settings/guest-service-charge/list';
import InvoiceCreatePage from 'src/pages/dashboard/invoice/new';
import PayoutListPage from 'src/pages/dashboard/payouts/list';
import PayoutDetailsPage from 'src/pages/dashboard/payouts/details';
import SalesReportListPage from 'src/pages/dashboard/sales-report/list';
import SalesReportDetailsPage from 'src/pages/dashboard/sales-report/details';
import ReviewListPage from 'src/pages/dashboard/reviews/list';
import PostListHomePage from 'src/pages/post/list';
import BlogCreatePage from 'src/pages/post/new';
import BlogEditPage from 'src/pages/post/edit';
import BlogDetailsPage from 'src/pages/post/details';
import NotificationPage from 'src/pages/dashboard/notification/list';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
// USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));

const TourDetailsPage = lazy(() => import('src/pages/dashboard/listing/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/listing/list'));
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: '',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'notifications',
        element: <NotificationPage />,
      },
      {
        path: 'user',
        children: [
          { path: 'list', element: <UserListPage /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'booking',
        children: [
          { path: 'list', element: <BookingListPage /> },
          { path: ':id/details', element: <BookingDetailsPage /> },
        ],
      },
      {
        path: 'transactions',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'payouts',
        children: [
          { element: <PayoutListPage />, index: true },
          { path: 'list', element: <PayoutListPage /> },
          { path: ':id', element: <PayoutDetailsPage /> },
        ],
      },
      {
        path: 'listing',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
        ],
      },
      {
        path: 'sales-report',
        children: [
          { element: <SalesReportListPage />, index: true },
          { path: ':id/details', element: <SalesReportDetailsPage /> },
        ],
      },
      { path: 'chat', element: <ChatPage /> },
      { path: 'reviews', element: <ReviewListPage /> },
      {
        path: 'blog',
        children: [
          { element: <PostListHomePage />, index: true },
          { path: 'new', element: <BlogCreatePage /> },
          { path: ':id/edit', element: <BlogEditPage /> },
          { path: ':id/details', element: <BlogDetailsPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: 'user',
            children: [
              { path: 'list', element: <AdminUserListPage /> },
              { path: 'create', element: <AdminUserCreatePage /> },
              { path: ':id/edit', element: <AdminUserEditPage /> },
            ],
          },
          {
            path: 'host-service-charge',
            element: <HostServiceChargePage />,
          },
          {
            path: 'guest-service-charge',
            element: <GuestServiceChargePage />,
          },
        ],
      },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
