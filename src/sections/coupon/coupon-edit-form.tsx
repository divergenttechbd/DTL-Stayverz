import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateUser } from 'src/utils/queries/users';
import { format } from 'date-fns';

type Props = {
  currentCoupon?: any;
  getCouponDetails?: Function;
};

export default function CouponEditForm({ currentCoupon, getCouponDetails }: Props) {
  console.log('currentCoupon', currentCoupon);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      first_name: currentCoupon?.first_name,
      last_name: currentCoupon?.last_name,
      email: currentCoupon?.email,

      code: currentCoupon?.code,
      description: currentCoupon?.description,
      discount_type: currentCoupon?.discount_type,
      discount_value: currentCoupon?.discount_value,
      threshold_amount: currentCoupon?.threshold_amount,
      valid_from: currentCoupon?.valid_from
        ? format(new Date(currentCoupon.valid_from), 'yyyy/MM/dd')
        : '',
      valid_to: currentCoupon?.valid_to,
      max_use: currentCoupon?.max_use,
      is_active: currentCoupon?.is_active,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await updateUser({
        id: currentCoupon?.id,
        code: data?.code,
        description: data?.description,
        discount_type: data?.discount_type,
        discount_value: data?.discount_value,
        threshold_amount: data?.threshold_amount,
        valid_from: data?.valid_from,
        valid_to: data?.valid_to,
        max_use: data?.max_use,
        is_active: data?.is_active,
      });
      console.log('response', res);
      if (!res.success) throw res.data;
      getCouponDetails?.();
      setSnackbarOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    reset(currentCoupon);
  }, [reset, currentCoupon]);

  // const handleVerificationAction = useCallback(
  //   (action: '' | 'verified' | 'rejected') => () => {
  //     setVerificationAction(action);
  //   },
  //   []
  // );

  // const confirmVerification = useCallback(async () => {
  //   try {
  //     const res = await updateUser({
  //       id: currentCoupon?.id,
  //       identity_status: verificationAction,
  //       reject_reason: verificationAction === 'rejected' ? reason : '',
  //     });
  //     if (!res.success) throw res.data;
  //     getCouponDetails?.();
  //     setVerificationAction('');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [currentCoupon?.id, getCouponDetails, reason, verificationAction]);

  // const toggleUserStatus = useCallback(async () => {
  //   try {
  //     const res = await updateUser({
  //       id: currentCoupon?.id,
  //       user_status: currentCoupon?.status === 'active' ? 'restricted' : 'active',
  //     });
  //     if (!res.success) throw res.data;
  //     getCouponDetails?.();
  //     setVerificationAction('');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [currentCoupon?.id, currentCoupon?.status, getCouponDetails]);

  // const handleClickOpen = useCallback(
  //   (imageUrl: string) => () => {
  //     setSelectedImage(imageUrl);
  //     setOpen(true);
  //   },
  //   []
  // );

  // const handleClose = useCallback(() => {
  //   setOpen(false);
  // }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <TextField label="Code" {...register('code')} InputLabelProps={{ shrink: true }} />
              <TextField
                label="Description"
                {...register('description')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Discount Type"
                {...register('discount_type')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Discount Value"
                {...register('discount_value')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Threshold Amount"
                {...register('threshold_amount')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Valid From"
                {...register('valid_from')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <LoadingButton type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Update Details
            </LoadingButton>
          </form>

          {/* {currentCoupon?.identity_verification_images?.front_image && (
            <Typography variant="body1" sx={{ marginTop: '1rem' }}>
              Verification &nbsp;
              <b>
                ({startCase(currentCoupon?.identity_verification_method?.split('_').join(' '))})
              </b>
            </Typography>
          )}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {currentCoupon?.identity_verification_images?.front_image && (
              <Button
                onClick={handleClickOpen(currentCoupon?.identity_verification_images?.front_image)}
              >
                <img
                  src={currentCoupon?.identity_verification_images?.front_image}
                  alt="Front"
                  style={{ cursor: 'pointer', width: '100%' }}
                />
              </Button>
            )}
            {currentCoupon?.identity_verification_images?.back_image && (
              <Button
                onClick={handleClickOpen(currentCoupon?.identity_verification_images?.back_image)}
              >
                <img
                  src={currentCoupon?.identity_verification_images?.back_image}
                  alt="Back"
                  style={{ cursor: 'pointer', width: '100%' }}
                />
              </Button>
            )}
          </Box> */}

          {/* Live Verification Photo */}
          {/* {currentCoupon?.identity_verification_images?.live && (
            <Typography variant="body1" sx={{ marginTop: '1rem' }}>
              Verification &nbsp;
              <b>
                ({startCase(currentCoupon?.identity_verification_method?.split('_').join(' '))})
              </b>
            </Typography>
          )}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {currentCoupon?.identity_verification_images?.live && (
              <Button onClick={handleClickOpen(currentCoupon?.identity_verification_images?.live)}>
                <img
                  src={currentCoupon?.identity_verification_images?.live}
                  alt="Front"
                  style={{ cursor: 'pointer', width: '100%', borderRadius: '8px' }}
                />
              </Button>
            )}
          </Box> */}
          {/* Live Verification Photo */}

          {/* {currentCoupon?.identity_verification_status === 'pending' && (
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                mt: 3,
                justifyContent: 'flex-end',
                gap: 1,
              }}
              alignItems="flex-end"
            >
              <LoadingButton
                type="submit"
                variant="contained"
                color="error"
                onClick={handleVerificationAction('rejected')}
              >
                Reject
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                color="inherit"
                onClick={handleVerificationAction('verified')}
              >
                Accept
              </LoadingButton>
            </Stack>
          )} */}
        </Card>
      </Grid>

      {/* <ConfirmDialog
        open={verificationAction !== ''}
        onClose={handleVerificationAction('')}
        title="Verification Action"
        content={
          <>
            Are you sure want to{' '}
            {verificationAction === 'rejected' ? 'reject this verification?' : 'verify this user?'}
            {verificationAction === 'rejected' && (
              <TextField
                sx={{ width: '100%', mt: 2 }}
                label="Rejection reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            )}
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={confirmVerification}>
            Confirm
          </Button>
        }
      /> */}

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ padding: 0 }}>
          <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog> */}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        message=""
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          User info updated!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
