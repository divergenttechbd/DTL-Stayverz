import { useCallback, useEffect, useState } from 'react'
// @mui
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// types
import { IListingFilters, ITourFilterValue } from 'src/types/listing'
// components
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import startCase from 'lodash/startCase'
import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'
import { IUserItem } from 'src/types/user'
import { getUsers } from 'src/utils/queries/users'

const verificationOptions = [
  { label: 'Verified', value: 'verified' },
  { label: 'Unerified', value: 'unverified' },
];

const statusOption = [
  { value: 'in_progress', label: 'In progress' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
];

type TourFilterProps = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: IListingFilters;
  onFilters: (name: string, value: ITourFilterValue) => void;
  //
  canReset: boolean;
  categoryOptions: { label: string; value: string | number }[];
  onResetFilters: VoidFunction;
  //
  dateError: boolean;
  //
  showHostDropDown?: boolean;
};

export default function TourFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  categoryOptions,
  canReset,
  onResetFilters,
  //
  dateError,
  //
  showHostDropDown=true
}: TourFilterProps) {
  const [hosts, setHosts] = useState<{ label: string; value: string }[]>([]);
  // host filter values
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

  // filters handler
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

  const handleVerificationChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('verification_status', event.target.value);
    },
    [onFilters]
  );

  const handleListingType = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('category', event.target.value);
    },
    [onFilters]
  );

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );

  const handleFilterService = useCallback(
    (val: any) => {
      onFilters('host', val);
    },
    [onFilters]
  );

  // filters component
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>
      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>
      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderDateRange = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Durations
      </Typography>
      <Stack spacing={2.5}>
        <DatePicker
          label="Start date"
          value={filters.created_at_after}
          onChange={handleFilterStartDate}
        />
        <DatePicker
          label="End date"
          value={filters.created_at_before}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
        />
      </Stack>
    </Stack>
  );

  const renderVerification = (
    <FormControl
      sx={{
        flexShrink: 1,
        width: { xs: 1 },
      }}
    >
      <InputLabel>Verification Status</InputLabel>
      <Select
        value={filters.verification_status}
        onChange={handleVerificationChange}
        input={<OutlinedInput label="Verification Status" />}
        renderValue={(selected) => startCase(selected)}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 240 },
          },
        }}
      >
        {verificationOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Radio
              disableRipple
              size="small"
              checked={filters.verification_status === option.value}
            />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderListingType = (
    <FormControl
      sx={{
        flexShrink: 1,
        width: { xs: 1 },
      }}
    >
      <InputLabel>Listing Type</InputLabel>
      <Select
        value={filters.category?.toString()}
        onChange={handleListingType}
        input={<OutlinedInput label="Listing Type" />}
        renderValue={(selected) =>
          categoryOptions.find((opt) => opt.value?.toString() === selected.toString())?.label
        }
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 240 },
          },
        }}
      >
        {categoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Radio disableRipple size="small" checked={filters.category === option.value} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderStatus = (
    <FormControl
      sx={{
        flexShrink: 0,
        width: { xs: 1 },
      }}
    >
      <InputLabel>Status</InputLabel>
      <Select
        value={filters.status}
        onChange={handleStatusChange}
        input={<OutlinedInput label="Status" />}
        renderValue={(selected) => startCase(selected)}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 240 },
          },
        }}
      >
        {statusOption.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Radio disableRipple size="small" checked={filters.status === option.value} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderHostFilter = (
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
  )

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderDateRange}
            {renderListingType}
            {renderStatus}
            {renderVerification}
            {/* value coming from 'user-edit-view.tsx' to decide whether to show host dropdown select */}
            {showHostDropDown && renderHostFilter}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
