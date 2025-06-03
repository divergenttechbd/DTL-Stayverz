import { useCallback, useEffect, useState } from 'react'
// @mui
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
// routes
import { paths } from 'src/routes/paths'
// _mock
// components
import { Button, SelectChangeEvent } from '@mui/material'
import { ConfirmDialog } from 'src/components/custom-dialog'
import { LoadingScreen } from 'src/components/loading-screen'
import { useSettingsContext } from 'src/components/settings'
import { useBoolean } from 'src/hooks/use-boolean'
import { IListingItem } from 'src/types/listing'
import { getListing, updateListing } from 'src/utils/queries/listing'
//
import TourDetailsContent from '../listing-details-content'
import TourDetailsToolbar from '../listing-details-toolbar'

// ----------------------------------------------------------------------

const tabs = [{ value: 'content', label: 'Listing Content' }];

type Props = {
  id: string;
};

export default function TourDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const [currentListing, setCurrentListing] = useState<IListingItem | null>(null);

  const getListingDetails = useCallback(async () => {
    try {
      const res = await getListing(id);
      if (!res.success) throw res.data;
      setCurrentListing(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getListingDetails();
    }
  }, [getListingDetails, id]);

  const [currentTab, setCurrentTab] = useState('content');
  const [verification, setVerification] = useState('');
  const [status, setStatus] = useState('')

  const confirmation = useBoolean();
  const confirmStatus = useBoolean();

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  // handle verification and status change
  const handleChangeVerification = useCallback(async (event: SelectChangeEvent) => {
      confirmation.onTrue();
      setVerification(event.target.value);
    },[confirmation]);
  const handleChangeStatus = useCallback(async (event: SelectChangeEvent) => {
      confirmStatus.onTrue();
      setStatus(event.target.value)
      console.log('value', event.target.value)
    },[confirmStatus])


  // handle confirmation popup close
  const handleClose = useCallback(() => {
    setVerification('');
    confirmation.onFalse();
  }, [confirmation]);
  const handleStatusUpdateClose = useCallback(() => {
    setStatus('')
    confirmStatus.onFalse();
  },[confirmStatus])

  // handle confirm verification and status
  const handleConfirmVerification = useCallback(async () => {
    try {
      confirmation.onFalse();
      const res = await updateListing({
        id: currentListing?.id,
        verification_status: verification,
      });
      if (!res.success) throw res.data;
      getListingDetails();
    } catch (err) {
      console.log(err);
    }
  }, [confirmation, currentListing?.id, getListingDetails, verification]);
  const handleConfirmStatus = useCallback(async () => {
    try {
      confirmStatus.onFalse();
      const res = await updateListing({
        id: currentListing?.id,
        listing_status: status,
      });
      if (!res.success) throw res.data;
      getListingDetails();
    } catch(err) {
      console.error(err)
    }
  },[confirmStatus, currentListing?.id, getListingDetails, status])

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );

  return currentListing ? (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TourDetailsToolbar
        backLink={paths.dashboard.listing.root}
        onChangeVerification={handleChangeVerification}
        onChangeStatus={handleChangeStatus}
        listing={currentListing}
      />
      {renderTabs}

      {currentTab === 'content' && <TourDetailsContent listing={currentListing} />}

      {/* Dialog for both verification & Listing Status */}
      <ConfirmDialog
        open={confirmation.value}
        onClose={handleClose}
        title="Verification Action"
        content={<>Are you sure?</>}
        action={
          <Button variant="contained" color="primary" onClick={handleConfirmVerification}>
            Confirm
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmStatus.value}
        onClose={handleStatusUpdateClose}
        title="Listing Status Action"
        content={<>Are you sure?</>}
        action={
          <Button variant="contained" color="primary" onClick={handleConfirmStatus}>
            Confirm
          </Button>
        }
      />
    </Container>
  ) : (
    <LoadingScreen />
  );
}
