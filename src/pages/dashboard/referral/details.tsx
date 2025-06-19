import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import { ReferralDetailsView } from 'src/sections/referral/view';

// ----------------------------------------------------------------------

export default function ReferralDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Referral Details</title>
      </Helmet>

      <ReferralDetailsView id={`${id}`} />
    </>
  );
}
