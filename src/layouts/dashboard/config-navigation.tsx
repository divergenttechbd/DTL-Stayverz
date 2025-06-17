import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  service_charge: icon('ic_service_charge'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [{ title: t('list'), path: paths.dashboard.user.list }],
          },
          {
            title: 'Listing',
            path: paths.dashboard.listing.root,
            icon: ICONS.tour,
            children: [{ title: t('list'), path: paths.dashboard.listing.root }],
          },
          {
            title: 'Bookings',
            path: paths.dashboard.booking.list,
            icon: ICONS.invoice,
            children: [{ title: t('list'), path: paths.dashboard.booking.list }],
          },
          // CHAT
          {
            title: t('chat'),
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          {
            title: 'Sales Report',
            path: paths.dashboard.salesReport.root,
            icon: ICONS.mail,
          },
          {
            title: 'Reviews',
            path: paths.dashboard.reviews.root,
            icon: ICONS.job,
          },
          {
            title: 'Blogs',
            path: paths.dashboard.blog.root,
            icon: ICONS.job,
          },
          {
            title: 'Coupon',
            path: paths.dashboard.blog.root,
            icon: ICONS.invoice,
          },
        ],
      },
      {
        subheader: 'PAYMENTS',
        items: [
          // INVOICE
          {
            title: 'Transactions',
            path: paths.dashboard.transactions.root,
            icon: ICONS.invoice,
            // children: [{ title: t('list'), path: paths.dashboard.transactions.root }],
          },
          {
            title: 'Payouts',
            path: paths.dashboard.payouts.root,
            icon: ICONS.invoice,
            // children: [{ title: t('list'), path: paths.dashboard.payouts.root }],
          },
        ],
      },
      {
        subheader: 'SETTINGS',
        items: [
          {
            title: 'Admin Users',
            path: paths.dashboard.settings.user.list,
            icon: ICONS.user,
            children: [
              { title: t('list'), path: paths.dashboard.settings.user.list },
              { title: t('create'), path: paths.dashboard.settings.user.new },
            ],
          },
          {
            title: 'Host Service Charge',
            path: paths.dashboard.settings.host_service_charge.root,
            icon: ICONS.service_charge,
          },
          {
            title: 'Guest Service Charge',
            path: paths.dashboard.settings.guest_service_charge.root,
            icon: ICONS.service_charge,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
