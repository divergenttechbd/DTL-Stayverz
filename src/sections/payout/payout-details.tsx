import { Divider, TextField, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import { Stack } from '@mui/system'
import { DatePicker } from '@mui/x-date-pickers'
import { startCase } from 'lodash'
import { useMemo } from 'react'
import { IInvoice } from 'src/types/invoice'
import PayoutListDetails from './payout-list-details'

type Props = {
  currentInvoice?: IInvoice;
};

export default function PayoutDetails({ currentInvoice }: Props) {
  const selectedPaymentMethod = useMemo(
    () =>
      currentInvoice?.host_pay_method_data?.find(
        (method) => method.id === currentInvoice?.payment_data.pay_method
      ),
    [currentInvoice]
  );
  return (
    <Card>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              From:
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Stayverz</Typography>
            <Typography variant="body2">
              Alauddin Tower, Plot 17, Road 113/A Gulshan, Dhaka Bangladesh, Dhaka 1212
            </Typography>
            <Typography variant="body2"> +447592579887</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              To:
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">
              {currentInvoice?.payment_data?.host?.full_name},{' '}
              {currentInvoice?.payment_data?.host?.phone_number}
            </Typography>
            <Typography variant="body2">{startCase(selectedPaymentMethod?.m_type)}</Typography>

            {selectedPaymentMethod?.bank_name && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {selectedPaymentMethod?.bank_name}, {selectedPaymentMethod?.branch_name}
              </Typography>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {selectedPaymentMethod?.account_no}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

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

        <DatePicker
          disabled
          label="Payment Date"
          value={new Date(currentInvoice!.payment_data.payment_date)}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </Stack>

      <PayoutListDetails currentInvoice={currentInvoice} />
    </Card>
  );
}
