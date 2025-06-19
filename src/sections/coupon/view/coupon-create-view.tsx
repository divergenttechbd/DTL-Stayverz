// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
//
import CouponCreateForm from '../coupon-create-form';

// ----------------------------------------------------------------------

export default function CouponCreateView() {
  const settings = useSettingsContext();
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
            name: 'Coupon List',
            href: paths.dashboard.coupon.root,
          },
          { name: 'Coupon Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CouponCreateForm />
    </Container>
  );
}
