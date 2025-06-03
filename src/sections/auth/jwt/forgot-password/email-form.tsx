import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { resetPasswordOtp } from 'src/utils/queries/auth';
import { Button, Link } from '@mui/material';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
type EmailFormProps = {
  setCurrentForm: Function;
  setFormData: Function;
};
export default function EmailForm({ setCurrentForm, setFormData }: EmailFormProps) {
  const [errorMsg, setErrorMsg] = useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
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
      setFormData((prev: any) => ({ ...prev, email: data.email }));
      await resetPasswordOtp({ ...data, otp_verify: false });
      setCurrentForm('otp');
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
      <RHFTextField name="email" label="Email address" />
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
