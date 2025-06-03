import { useCallback, useEffect, useState } from 'react'
// @mui
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
// components
import { Autocomplete } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import Iconify from 'src/components/iconify'
import { IPayoutTableFilters, IPayoutTableFilterValue } from 'src/types/payout'
import { IUserItem } from 'src/types/user'
import { getUsers } from 'src/utils/queries/users'

// ----------------------------------------------------------------------

type Props = {
  filters: IPayoutTableFilters;
  onFilters: (name: string, value: IPayoutTableFilterValue) => void;
  showHostFilter?: boolean;
};

export default function UserTableToolbar({ filters, onFilters, showHostFilter }: Props) {
  const [hosts, setHosts] = useState<{ label: string; value: string }[]>([]);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('payment_date_after', newValue);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('payment_date_before', newValue);
      }
    },
    [onFilters]
  );

  const handleFilterHost = useCallback(
    (host: any) => {
      onFilters('host', host);
    },
    [onFilters]
  );

  const getHostsForDropdown = useCallback(async () => {
    try {
      const res = await getUsers({ u_type: 'host', page_size: 0 });

      if (!res.success) throw res.data;
      setHosts(
        res.data.map((user: IUserItem) => ({
          label: `${user.full_name} (${user.phone_number})`,
          value: user.id,
        }))
      );
    } catch (err) {
      setHosts([]);
    }
  }, []);

  useEffect(() => {
    getHostsForDropdown();
  }, [getHostsForDropdown]);

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

      {showHostFilter && (<FormControl fullWidth>
        <Autocomplete
          onChange={(event, newValue) => {
            handleFilterHost(newValue);
          }}
          value={filters.host ? filters.host : null}
          fullWidth
          options={hosts}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              value={filters.host?.label}
              label="Select Host"
              variant="outlined"
            />
          )}
          renderOption={(props, option, { inputValue }) => <li {...props}>{option.label}</li>}
        />
      </FormControl>)}

      <DatePicker
        label="Start date"
        value={filters.payment_date_after}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label="End date"
        value={filters.payment_date_before}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.search}
          onChange={handleFilterName}
          placeholder="Search by Invoice Number..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
