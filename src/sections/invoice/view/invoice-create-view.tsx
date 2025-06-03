// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useCallback, useEffect, useState } from 'react';
import { IInvoice } from 'src/types/invoice';
import { getPayment } from 'src/utils/queries/invoice';
import InvoiceNewEditForm from '../invoice-new-edit-form';

type Props = {
  id: string;
};

export default function InvoiceCreateView({ id }: Props) {
  const settings = useSettingsContext();

  const [currentInvoice, setCurrentInvoice] = useState<IInvoice>();

  const getPaymentDetails = useCallback(async () => {
    try {
      const res = await getPayment(id);
      if (!res.success) throw res.data;
      setCurrentInvoice(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getPaymentDetails();
    }
  }, [getPaymentDetails, id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new payout"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Transactions',
            href: paths.dashboard.transactions.root,
          },
          {
            name: 'New Payout',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentInvoice && <InvoiceNewEditForm currentInvoice={currentInvoice} />}
    </Container>
  );
}
