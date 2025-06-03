import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/settings/user/view';

// ----------------------------------------------------------------------

export default function AdminUserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new user</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
