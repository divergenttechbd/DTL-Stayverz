import { useCallback, useEffect, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { IInvoiceTableFilters, IInvoiceTableFilterValue } from 'src/types/invoice';
// components
import Iconify from 'src/components/iconify';
import { Autocomplete, FormControl } from '@mui/material';
import { getUsers } from 'src/utils/queries/users';
import { IUserItem } from 'src/types/user';

type Props = {
  filters: IInvoiceTableFilters;
  onFilters: (name: string, value: IInvoiceTableFilterValue) => void;
  //
};

export default function InvoiceTableToolbar({
  filters,
  onFilters,
}: //
Props) {
  const [hosts, setHosts] = useState<{ label: string; value: string }[]>([]);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterService = useCallback(
    (val: any) => {
      onFilters('host', val);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('created_at_after', newValue);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('created_at_before', newValue);
      }
    },
    [onFilters]
  );

  const getHostsForDropdown = useCallback(async () => {
    try {
      const res = await getUsers({ u_type: 'host', page_size: 0 });

      if (!res.success) throw res.data;
      setHosts(
        res.data.map((user: IUserItem) => ({
          label: `${user.full_name} ${user.phone_number}`,
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
      <FormControl fullWidth>
        <Autocomplete
          onChange={(event, newValue) => {
            handleFilterService(newValue);
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
      </FormControl>

      <DatePicker
        label="Start date"
        value={filters.created_at_after}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label="End date"
        value={filters.created_at_before}
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
          placeholder="Search customer or invoice number..."
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
