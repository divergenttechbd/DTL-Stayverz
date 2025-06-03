import { Helmet } from 'react-helmet-async';
// sections
import { TourListView } from 'src/sections/listing/view';

// ----------------------------------------------------------------------

export default function TourListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tour List</title>
      </Helmet>

      <TourListView />
    </>
  );
}
