import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { IUserItem } from 'src/types/user';
import Label from 'src/components/label';
import { Avatar, Dialog, DialogContent, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { updateUser } from 'src/utils/queries/users';
import startCase from 'lodash/startCase';

type Props = {
  currentUser?: IUserItem;
  getUserDetails?: Function;
};

export default function UserNewEditForm({ currentUser, getUserDetails }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [verificationAction, setVerificationAction] = useState<'' | 'verified' | 'rejected'>('');
  const [reason, setReason] = useState<string>('');

  const handleVerificationAction = useCallback(
    (action: '' | 'verified' | 'rejected') => () => {
      setVerificationAction(action);
    },
    []
  );

  const confirmVerification = useCallback(async () => {
    try {
      const res = await updateUser({
        id: currentUser?.id,
        identity_status: verificationAction,
        reject_reason: verificationAction === 'rejected' ? reason : '',
      });
      if (!res.success) throw res.data;
      getUserDetails?.();
      setVerificationAction('');
    } catch (err) {
      console.log(err);
    }
  }, [currentUser?.id, getUserDetails, reason, verificationAction]);

  const toggleUserStatus = useCallback(async () => {
    try {
      const res = await updateUser({
        id: currentUser?.id,
        user_status: currentUser?.status === 'active' ? 'restricted' : 'active',
      });
      if (!res.success) throw res.data;
      getUserDetails?.();
      setVerificationAction('');
    } catch (err) {
      console.log(err);
    }
  }, [currentUser?.id, currentUser?.status, getUserDetails]);

  const handleClickOpen = useCallback(
    (imageUrl: string) => () => {
      setSelectedImage(imageUrl);
      setOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          {currentUser && (
            <Label
              color={
                (currentUser.identity_verification_status === 'pending' && 'warning') ||
                (currentUser.identity_verification_status === 'verified' && 'success') ||
                (currentUser.identity_verification_status === 'rejected' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {currentUser.identity_verification_status}
            </Label>
          )}

          <Stack sx={{ width: '100%' }}>
            <Avatar
              src={currentUser?.image}
              sx={{
                bgcolor: 'background.neutral',
                width: 150,
                height: 150,
                margin: 'auto',
                marginBottom: '2rem',
              }}
            />
          </Stack>
          {currentUser && (
            <Stack sx={{ textAlign: 'center' }}>
              <Typography variant="body1">
                {currentUser.full_name} ({startCase(currentUser.u_type)})
              </Typography>
              <Typography variant="body1" sx={{ my: 1 }}>
                +88 {currentUser.phone_number}
              </Typography>
              {currentUser.profile?.languages?.length && (
                <Typography variant="subtitle2">
                  Speaks: {currentUser.profile.languages.join(', ')}
                </Typography>
              )}
              <Typography variant="subtitle2" sx={{ my: 1 }}>
                {currentUser.profile?.bio}
              </Typography>
            </Stack>
          )}

          {currentUser && (
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Switch checked={currentUser?.status === 'restricted'} onChange={toggleUserStatus} />
              <Typography variant="subtitle1">Ban This User</Typography>
            </Stack>
          )}
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <TextField
              name="full_name"
              label="Full Name"
              value={currentUser?.full_name || ''}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              name="email"
              label="Email Address"
              value={currentUser?.email || ''}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              name="phone_number"
              label="Phone Number"
              value={currentUser?.phone_number || ''}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              name="u_type"
              label="Role"
              value={currentUser?.u_type || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          {currentUser?.identity_verification_images?.front_image && (
            <Typography variant="body1" sx={{ marginTop: '1rem' }}>
              Verification &nbsp;
              <b>({startCase(currentUser?.identity_verification_method?.split('_').join(' '))})</b>
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
            {currentUser?.identity_verification_images?.front_image && (
              <Button
                onClick={handleClickOpen(currentUser?.identity_verification_images?.front_image)}
              >
                <img
                  src={currentUser?.identity_verification_images?.front_image}
                  alt="Front"
                  style={{ cursor: 'pointer', width: '100%' }}
                />
              </Button>
            )}
            {currentUser?.identity_verification_images?.back_image && (
              <Button
                onClick={handleClickOpen(currentUser?.identity_verification_images?.back_image)}
              >
                <img
                  src={currentUser?.identity_verification_images?.back_image}
                  alt="Back"
                  style={{ cursor: 'pointer', width: '100%' }}
                />
              </Button>
            )}
          </Box>

          {currentUser?.identity_verification_status === 'pending' && (
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
          )}
        </Card>
      </Grid>

      <ConfirmDialog
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
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ padding: 0 }}>
          <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
