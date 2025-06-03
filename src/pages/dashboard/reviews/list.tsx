import { Helmet } from 'react-helmet-async';
import ReviewListView from 'src/sections/review/view/review-list-view';

export default function ReviewListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <ReviewListView />
    </>
  );
}
