import { Helmet } from 'react-helmet-async';
// sections
import { PayoutListView } from 'src/sections/payout/view';

// ----------------------------------------------------------------------

export default function PayoutListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Payout List</title>
      </Helmet>

      <PayoutListView />
    </>
  );
}
