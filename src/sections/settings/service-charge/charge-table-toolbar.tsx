import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import { IServiceChargeFilter, IServiceChargeFilterValue } from 'src/types/service-charge';

// ----------------------------------------------------------------------

type Props = {
  filters: IServiceChargeFilter;
  onFilters: (name: string, value: IServiceChargeFilterValue) => void;
};

export default function ChargeTableToolbar({ filters, onFilters }: Props) {
  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('start_date', newValue);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      if (newValue?.toString() !== 'Invalid Date') {
        onFilters('end_date', newValue);
      }
    },
    [onFilters]
  );

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
      <DatePicker
        label="Start date"
        value={filters.start_date}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label="End date"
        value={filters.end_date}
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
    </Stack>
  );
}
