// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
//
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { ITabs, IUserItem } from 'src/types/user';
import CouponEditForm from '../coupon-edit-form';
import { getCoupon } from '../../../utils/queries/coupon';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CouponEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [currentCoupon, setCurrentCoupon] = useState<IUserItem>();

  // profile details
  const getCouponDetails = useCallback(async () => {
    try {
      const res = await getCoupon(id);
      if (!res.success) throw res.data;
      setCurrentCoupon(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getCouponDetails();
    }
  }, [getCouponDetails, id]);

  // Tabs
  const tabs = useTabs('profile');
  const TABS: ITabs = [
    {
      value: 'profile',
      label: 'Profile',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'listings',
      label: 'Listings',
      icon: <Iconify icon="solar:bill-list-bold" width={24} />,
    },
    {
      value: 'bookings',
      label: 'Bookings',
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
    {
      value: 'reviews',
      label: 'Reviews',
      icon: <Iconify icon="material-symbols-light:rate-review-sharp" width={24} />,
    },
    {
      value: 'payouts',
      label: 'Payouts',
      icon: <Iconify icon="tdesign:undertake-transaction" width={24} />,
    },
    {
      value: 'payment-methods',
      label: 'Payment Methods',
      icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User List',
            href: paths.dashboard.user.list,
          },
          { name: 'User Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />


      <CouponEditForm currentCoupon={currentCoupon} getCouponDetails={getCouponDetails} />
    </Container>
  );
}
