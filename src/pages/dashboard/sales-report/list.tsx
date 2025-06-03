import { Helmet } from 'react-helmet-async';
import { SalesReportListView } from 'src/sections/sales-report/view';
// sections
// ----------------------------------------------------------------------

export default function SalesReportListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Sales Report List</title>
      </Helmet>

      <SalesReportListView />
    </>
  );
}
