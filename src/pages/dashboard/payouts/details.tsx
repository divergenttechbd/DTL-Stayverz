import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import PayoutDetailsView from 'src/sections/payout/view/payout-details-view';

// ----------------------------------------------------------------------

export default function PayoutDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Payout Details</title>
      </Helmet>

      <PayoutDetailsView id={`${id}`} />
    </>
  );
}
