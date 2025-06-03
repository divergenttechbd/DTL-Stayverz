import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import { UserEditView } from 'src/sections/settings/user/view';

// ----------------------------------------------------------------------

export default function AdminUserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Admin User Edit</title>
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
