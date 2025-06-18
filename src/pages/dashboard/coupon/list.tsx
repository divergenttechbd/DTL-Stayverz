import { Helmet } from 'react-helmet-async';
// sections
import { CouponListView } from 'src/sections/coupon/view';

// ----------------------------------------------------------------------

export default function CouponListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Coupon List</title>
      </Helmet>

      <CouponListView />
    </>
  );
}
