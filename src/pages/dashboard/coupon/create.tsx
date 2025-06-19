import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import { CouponCreateView } from 'src/sections/coupon/view';

// ----------------------------------------------------------------------

export default function CouponCreatePage() {


  return (
    <>
      <Helmet>
        <title> Dashboard: Create New Coupon</title>
      </Helmet>

      <CouponCreateView/>
    </>
  );
}