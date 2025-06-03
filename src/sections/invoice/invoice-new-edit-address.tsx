import { useFormContext } from 'react-hook-form'
// @mui
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
// hooks
import { useBoolean } from 'src/hooks/use-boolean'
import { useResponsive } from 'src/hooks/use-responsive'
// _mock
// components
import { startCase } from 'lodash'
import { useMemo } from 'react'
import Iconify from 'src/components/iconify'
//
import { IInvoice } from 'src/types/invoice'
import PaymentMethodListDialog from './payment-method-list-dialog'

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
};

export default function InvoiceNewEditAddress({ currentInvoice }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');
  const values = watch();
  const { pay_method } = values;
  const to = useBoolean();

  const selectedPaymentMethod = useMemo(
    () => currentInvoice?.host_pay_method_data?.find((method) => method.id === pay_method),
    [currentInvoice, pay_method]
  );

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={upMd ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
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

            <IconButton onClick={to.onTrue}>
              <Iconify icon={selectedPaymentMethod ? 'solar:pen-bold' : 'mingcute:add-line'} />
            </IconButton>
          </Stack>

          {selectedPaymentMethod ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {currentInvoice?.payment_data?.host?.full_name},{' '}
                {currentInvoice?.payment_data?.host?.phone_number}
              </Typography>
              <Typography variant="body2">{startCase(selectedPaymentMethod.m_type)}</Typography>
              {selectedPaymentMethod.bank_name && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {selectedPaymentMethod.bank_name}, {selectedPaymentMethod.branch_name}
                </Typography>
              )}

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {selectedPaymentMethod.account_no}
              </Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              {(errors.invoiceTo as any)?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      {currentInvoice?.host_pay_method_data && (
        <PaymentMethodListDialog
          title="Payment Methods"
          open={to.value}
          onClose={to.onFalse}
          selected={(selectedId: string) => pay_method === selectedId}
          onSelect={(address) => setValue('pay_method', address)}
          list={currentInvoice?.host_pay_method_data}
        />
      )}
    </>
  );
}
