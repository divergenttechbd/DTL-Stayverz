import { Helmet } from 'react-helmet-async';
import { ChargeListView } from 'src/sections/settings/service-charge/view';

// ----------------------------------------------------------------------

export default function GuestServiceChargePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Guest Service Charge</title>
      </Helmet>

      <ChargeListView sc_type="guest_charge" />
    </>
  );
}
