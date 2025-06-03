import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
// sections
import { InvoiceCreateView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export default function InvoiceCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new invoice</title>
      </Helmet>

      <InvoiceCreateView id={`${id}`} />
    </>
  );
}
