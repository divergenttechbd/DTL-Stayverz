// @mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack, { StackProps } from '@mui/material/Stack'
// components
import { FormControl, Select, SelectChangeEvent } from '@mui/material'
import startCase from 'lodash/startCase'
import Iconify from 'src/components/iconify'
import { RouterLink } from 'src/routes/components'
import { IListingItem } from 'src/types/listing'

const verificationOptions = [
  { label: 'Verified', value: 'verified' },
  { label: 'Unerified', value: 'unverified' },
];
const statusOptions = [
  { label: 'Publish', value: 'published'},
  { label: 'Unpublish', value: 'unpublished' }
]

type Props = StackProps & {
  backLink: string;
  listing: IListingItem;
  onChangeVerification: (newValue: SelectChangeEvent<any>) => void;
  onChangeStatus: (newValue: SelectChangeEvent<any>) => void;
};

export default function TourDetailsToolbar({
  backLink,
  onChangeVerification,
  onChangeStatus,
  sx,
  listing,
  ...other
}: Props) {
  console.log('listing status', listing.status)
  const statusValue: string = listing.status === 'published' ? 'Published': 'Unpublished'

  const renderVerification = (
    <FormControl sx={{ padding: 0 }}>
      <Select
        value={listing.verification_status}
        onChange={onChangeVerification}
        sx={{ padding: 0, background: 'black', color: 'white' }}
        style={{ padding: 0 }}
        renderValue={(selected) => startCase(selected)}
      >
        {verificationOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  const renderStatus = (
    <FormControl sx={{ padding: 0 }}>
      <Select
        value={statusValue}
        onChange={onChangeStatus}
        sx={{ padding: 0, background: 'black', color: 'white' }}
        style={{ padding: 0 }}
        renderValue={(selected) => startCase(selected)}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return (
    <Stack
      spacing={1.5}
      direction="row"
      sx={{
        mb: { xs: 3, md: 5 },
        ...sx,
      }}
      {...other}
    >
      <Button
        component={RouterLink}
        href={backLink}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
      >
        Back
      </Button>

      <Box sx={{ flexGrow: 1 }} />
      {renderVerification}
      {renderStatus}
    </Stack>
  );
}
