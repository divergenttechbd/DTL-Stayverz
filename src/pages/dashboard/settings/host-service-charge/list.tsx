import { Helmet } from 'react-helmet-async';
import { ChargeListView } from 'src/sections/settings/service-charge/view';

// ----------------------------------------------------------------------

export default function HostServiceChargePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Host Service Charge</title>
      </Helmet>

      <ChargeListView sc_type="host_charge" />
    </>
  );
}
