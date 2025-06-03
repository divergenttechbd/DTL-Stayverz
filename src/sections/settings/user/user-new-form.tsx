import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { useRouter } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { createStaffUser, updateStaffUser } from 'src/utils/queries/users';
import { IUserItem } from 'src/types/user';
import { paths } from 'src/routes/paths';

const ROLE_OPTIONS = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Coordinator',
    value: 'coordinator',
  },
];

const STATUS_OPTION = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Restricted',
    value: 'restricted',
  },
];

type Props = {
  currentUser?: IUserItem;
};

export default function UserNewForm({ currentUser }: Props) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First name required'),
    last_name: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: currentUser ? Yup.string() : Yup.string().required('Password is required'),
    phone_number: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = {
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    password: currentUser ? undefined : '',
    role: currentUser?.role || 'admin',
    phone_number: currentUser?.phone_number || '',
    status: currentUser?.status || 'active',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await (currentUser
        ? updateStaffUser?.({ id: currentUser.id, ...data, password: undefined })
        : createStaffUser?.(data));
      router.push(paths.dashboard.settings.user.list);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="first_name" label="First name" />
          <RHFTextField name="last_name" label="Last name" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="email" label="Email address" />
          <RHFTextField name="phone_number" label="Phone Number" />
        </Stack>

        <RHFSelect name="role" label="Role">
          {ROLE_OPTIONS.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </RHFSelect>

        {!currentUser && (
          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {!!currentUser && (
          <RHFSelect name="status" label="Status">
            {STATUS_OPTION.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </RHFSelect>
        )}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {currentUser ? 'Update User' : 'Create account'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return <>{renderForm}</>;
}
