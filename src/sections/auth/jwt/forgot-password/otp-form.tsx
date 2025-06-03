import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { Button, Link } from '@mui/material';
import { resetPasswordOtp } from 'src/utils/queries/auth';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { LoadingScreen } from 'src/components/loading-screen';

export type ForgotPasswordFormData = {
  email: string;
  otp: string;
};

type OtpFormProps = {
  setCurrentForm: Function;
  setFormData: Function;
  formData: ForgotPasswordFormData;
};
export default function OtpForm({ setCurrentForm, setFormData, formData }: OtpFormProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const loading = useBoolean(false);
  const LoginSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
  });

  const defaultValues = {
    otp: '',
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
      setFormData((prev: any) => ({ ...prev, otp: data.otp }));
      await resetPasswordOtp({ ...data, otp_verify: true, email: formData.email });
      setCurrentForm('password');
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleOtpResend = useCallback(async () => {
    try {
      loading.onTrue();
      await resetPasswordOtp({ otp_verify: false, email: formData.email });
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    } finally {
      loading.onFalse();
    }
  }, [formData.email, loading]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
      <Typography variant="h4">Please check your email!</Typography>
      <Typography variant="body1">
        We&apos;ve emailed a 6-digit confirmation code to acb@domain, please enter the code in below
        box to reset your password.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <RHFCode name="otp" />
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>
      <Typography variant="body2" sx={{ alignSelf: 'center' }}>
        Don’t have a code?{' '}
        <Button onClick={handleOtpResend}>
          <u>Resend Code</u>
        </Button>
      </Typography>
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

      {loading.value ? <LoadingScreen /> : renderForm}
    </FormProvider>
  );
}
