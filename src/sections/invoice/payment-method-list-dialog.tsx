import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
// types
import { IAddressItem } from 'src/types/address';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
import { HostPayMethod } from 'src/types/invoice';
import { startCase } from 'lodash';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  list: HostPayMethod[];
  action?: React.ReactNode;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  selected: (selectedId: string) => boolean;
  onSelect: (address: number) => void;
};

export default function PaymentMethodListDialog({
  title = 'Address Book',
  list,
  action,
  //
  open,
  onClose,
  //
  selected,
  onSelect,
}: Props) {
  const notFound = !list.length;
  const handleSelectMethod = useCallback(
    (method: HostPayMethod) => {
      onSelect(method.id);
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        overflowX: 'hidden',
      }}
    >
      {list.map((paymentMethod) => (
        <Stack
          key={paymentMethod.id}
          spacing={0.5}
          component={ListItemButton}
          selected={selected(`${paymentMethod.id}`)}
          onClick={() => handleSelectMethod(paymentMethod)}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            [`&.${listItemButtonClasses.selected}`]: {
              bgcolor: 'action.selected',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{startCase(paymentMethod.m_type)}</Typography>

            {paymentMethod.is_default && <Label color="info">Default</Label>}
          </Stack>

          {paymentMethod.bank_name && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>
              {paymentMethod.bank_name}, {paymentMethod.branch_name}
            </Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {paymentMethod.account_no}
          </Typography>

          {/* {paymentMethod.phoneNumber && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {paymentMethod.phoneNumber}
            </Typography>
          )} */}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>
      {notFound ? <SearchNotFound sx={{ px: 3, pt: 5, pb: 10 }} /> : renderList}
      <Stack marginBottom={3} />
    </Dialog>
  );
}
