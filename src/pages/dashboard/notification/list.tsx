import { Helmet } from 'react-helmet-async';
import NotificationList from 'src/sections/notification/notification_list_view';

export default function NotificationPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <NotificationList />
    </>
  );
}
