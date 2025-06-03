import { useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// types
import { IInvoice } from 'src/types/invoice';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { updatePayment } from 'src/utils/queries/invoice';
// components
import FormProvider from 'src/components/hook-form';
import { format } from 'date-fns';
//
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
};

export default function InvoiceNewEditForm({ currentInvoice }: Props) {
  const router = useRouter();
  const loadingSend = useBoolean();

  const NewInvoiceSchema = Yup.object().shape({
    pay_method: Yup.mixed<any>().nullable().required('Invoice to is required'),
    payment_date: Yup.mixed<any>().nullable().required('Payment date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      payment_date: new Date(),
      pay_method: currentInvoice?.payment_data.pay_method || null,
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      const res = await updatePayment({
        ...data,
        payment_date: format(data.payment_date, 'yyyy-MM-dd'),
        id: currentInvoice?.payment_data.invoice_no,
      });
      if (!res.success) throw res.data;
      router.push(paths.dashboard.payouts.root);
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress currentInvoice={currentInvoice} />

        <InvoiceNewEditStatusDate currentInvoice={currentInvoice} />

        <InvoiceNewEditDetails currentInvoice={currentInvoice} />
      </Card>

      {currentInvoice?.payment_data.status === 'unpaid' && (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend.value && isSubmitting}
            onClick={handleCreateAndSend}
          >
            Done
          </LoadingButton>
        </Stack>
      )}
    </FormProvider>
  );
}
