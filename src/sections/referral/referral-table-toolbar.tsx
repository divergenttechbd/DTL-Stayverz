import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
import { IUserTableFilterValue } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';
import _ from 'lodash';

import { IReferalTableFilters } from '../../types/referral';
// ----------------------------------------------------------------------

type Props = {
  filters: IReferalTableFilters;
  // filters: any;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
};

export default function ReferralTableToolbar({ filters, onFilters }: Props) {
  const handleFilterUserName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('username', event.target.value);
    },
    [onFilters]
  );
  const handleFilterEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('email', event.target.value);
    },
    [onFilters]
  );

  const handleFilterReferralType = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('referral_type', event.target.value);
    },
    [onFilters]
  );

  const handleFilterUserType = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('u_type', event.target.value);
    },
    [onFilters]
  );

  const referralOptions = [
    { label: 'Host to Host', value: 'host_to_host' },
    { label: 'Guest t Host', value: 'guest_to_guest' },
  ];

  const uTypeOptions = [
    { label: 'Host', value: 'host' },
    { label: 'Guest', value: 'guest' },
    { label: 'System', value: 'system' },
  ];

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.username}
          onChange={handleFilterUserName}
          placeholder="Search username..."
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.email}
          onChange={handleFilterEmail}
          placeholder="Search email..."
        />
      </Stack>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Referral Type</InputLabel>

        <Select
          value={filters.referral_type}
          onChange={handleFilterReferralType}
          input={<OutlinedInput label="Referral Type" />}
          renderValue={(selected) => _.startCase(selected)}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {referralOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Radio disableRipple size="small" checked={filters.referral_type === option.value} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>User Type</InputLabel>

        <Select
          value={filters.u_type}
          onChange={handleFilterUserType}
          input={<OutlinedInput label="User Type" />}
          renderValue={(selected) => _.startCase(selected)}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {uTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Radio
                disableRipple
                size="small"
                checked={filters.u_type === option.value}
              />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
