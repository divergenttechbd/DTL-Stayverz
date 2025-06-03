import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
// components
import { IInvoice } from 'src/types/invoice';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
};

export default function InvoiceNewEditStatusDate({ currentInvoice }: Props) {
  const { control } = useFormContext();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <TextField
        disabled
        label="Invoice number"
        value={currentInvoice?.payment_data.invoice_no}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <Controller
        name="payment_date"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Payment Date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </Stack>
  );
}
