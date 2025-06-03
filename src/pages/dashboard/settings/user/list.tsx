import { Helmet } from 'react-helmet-async';
// sections
import { UserListView } from 'src/sections/settings/user/view';

// ----------------------------------------------------------------------

export default function AdminUserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Admin User List</title>
      </Helmet>

      <UserListView />
    </>
  );
}
