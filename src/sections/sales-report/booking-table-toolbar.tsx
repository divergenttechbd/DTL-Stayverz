import { useCallback, useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// types
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';
import { IBookingTableFilterValue, IBookingTableFilters } from 'src/types/booking';
import { getUsers } from 'src/utils/queries/users';
import { IUserItem } from 'src/types/user';
import { Autocomplete, FormControl, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: IBookingTableFilters;
  onFilters: (name: string, value: IBookingTableFilterValue) => void;
};

export default function SalesReportTableToolbar({ filters, onFilters }: Props) {
  const [hosts, setHosts] = useState<{ label: string; value: string }[]>([]);
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('search', event.target.value);
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

  const handleFilterService = useCallback(
    (val: any) => {
      onFilters('host', val);
    },
    [onFilters]
  );

  return (
    <>
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
            placeholder="Search by Name, Number, Reservation code..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {/* <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
