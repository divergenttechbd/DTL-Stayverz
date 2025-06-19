import { Helmet } from 'react-helmet-async';
// sections
import { ReferralListView } from 'src/sections/referral/view';

// ----------------------------------------------------------------------

export default function CouponListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Referral List</title>
      </Helmet>

      <ReferralListView />
    </>
  );
}
