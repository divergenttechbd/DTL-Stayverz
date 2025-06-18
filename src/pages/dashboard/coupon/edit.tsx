import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import { CouponEditView } from 'src/sections/coupon/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Coupon Edit</title>
      </Helmet>

      <CouponEditView id={`${id}`} />
    </>
  );
}
