import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hook';
import SalesReportDetailsView from 'src/sections/sales-report/view/booking-details-view';
// sections
// ----------------------------------------------------------------------

export default function SalesReportDetailsPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Sales Report Details</title>
      </Helmet>

      <SalesReportDetailsView id={`${id}`} />
    </>
  );
}
