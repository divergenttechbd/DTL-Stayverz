// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useCallback, useEffect, useState } from 'react';
import { getStaffUser } from 'src/utils/queries/users';
import { IUserItem } from 'src/types/user';
import { LoadingScreen } from 'src/components/loading-screen';
import UserNewForm from '../user-new-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState<IUserItem>();

  const getUserDetails = useCallback(async () => {
    try {
      const res = await getStaffUser(id);
      if (!res.success) throw res.data;
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getUserDetails();
    }
  }, [getUserDetails, id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.settings.root,
          },
          {
            name: 'User List',
            href: paths.dashboard.settings.user.list,
          },
          { name: 'User Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentUser ? <UserNewForm currentUser={currentUser} /> : <LoadingScreen />}
    </Container>
  );
}
