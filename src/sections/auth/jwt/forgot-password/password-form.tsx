import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { useRouter } from 'src/routes/hook';
// hooks
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { Button, IconButton, InputAdornment, Link } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { resetPassword } from 'src/utils/queries/auth';
import { ForgotPasswordFormData } from './otp-form';

export default function PasswordForm({ formData }: { formData: ForgotPasswordFormData }) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();
  const confirm_password = useBoolean();

  const LoginSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const defaultValues = {
    password: '',
    confirm_password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword({ ...formData, password: data.password });
      router.push(paths.auth.jwt.login);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
      <Typography variant="h4">Forgot your password?</Typography>
      <Typography variant="body1">
        Please enter the email address associated with your account, and we&apos;ll email you a link
        to reset your password.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
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
      <RHFTextField
        name="confirm_password"
        label="Confirm Password"
        type={confirm_password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirm_password.onToggle} edge="end">
                <Iconify
                  icon={confirm_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>
      <Link href={paths.auth.jwt.login}>
        <Button fullWidth color="inherit" size="large" type="button" variant="soft">
          <ArrowLeftIcon /> Return to sign in
        </Button>
      </Link>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
