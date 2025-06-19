import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createCoupon } from 'src/utils/queries/coupon';
import { ConfirmDialog } from '../../components/custom-dialog';
import { useBoolean } from '../../hooks/use-boolean';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hook';

export default function CouponCreateForm() {
  const router = useRouter();
  const confirm = useBoolean();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { handleSubmit, register, reset, control, watch } = useForm({
    defaultValues: {
      code: '',
      description: '',
      discount_type: '',
      discount_value: '',
      threshold_amount: '',
      valid_from: '',
      valid_to: '',
      max_use: '',
      is_active: true,
    },
  });

  const allValues = watch();

  console.log('-----', allValues);

  const onSubmit = async (data: any) => {
    try {
      const res = await createCoupon({
        code: data?.code,
        description: data?.description,
        discount_type: data?.discount_type,
        discount_value: data?.discount_value,
        threshold_amount: data?.threshold_amount,
        valid_from: data?.valid_from,
        valid_to: data?.valid_to,
        max_use: Number(data?.max_use),
        is_active: data?.is_active,
      });
      console.log('response', res);
      if (!res.success) throw res.data;
      setSnackbarOpen(true);
      router.push(paths.dashboard.coupon.root)
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   if (currentCoupon) {
  //     reset({
  //       code: currentCoupon.code,
  //       description: currentCoupon.description,
  //       discount_type: currentCoupon.discount_type,
  //       discount_value: currentCoupon.discount_value,
  //       threshold_amount: currentCoupon.threshold_amount,
  //       valid_from: currentCoupon.valid_from
  //         ? format(new Date(currentCoupon.valid_from), 'yyyy/MM/dd')
  //         : '',
  //       valid_to: currentCoupon.valid_to,
  //       max_use: currentCoupon.max_use,
  //       is_active: currentCoupon.is_active ?? true,
  //     });
  //   }
  // }, [currentCoupon, reset]);

  // useEffect(() => {
  //   reset(currentCoupon);
  // }, [reset, currentCoupon]);

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

              <FormControl fullWidth>
                <InputLabel id="discount_type">Discount Type</InputLabel>
                <Controller
                  name="discount_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="discount_type"
                      label="Discount Type"
                      value={field.value}
                      onChange={(event: SelectChangeEvent) => field.onChange(event.target.value)} // ✅ Fix
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      name={field.name}
                    >
                      <MenuItem value="PERCENT">PERCENT</MenuItem>
                      <MenuItem value="FIXED">FIXED</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="valid_from"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Valid From"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="valid_to"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Valid To"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField
                label="Max Use"
                {...register('max_use')}
                InputLabelProps={{ shrink: true }}
              />
              <Tooltip title="Toggle Coupon Activation" placement="top" arrow>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Typography variant="subtitle1">Coupon Active</Typography>
                </Stack>
              </Tooltip>
            </Box>

            <LoadingButton type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Create
            </LoadingButton>
          </form>
        </Card>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        message=""
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Coupon created!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
