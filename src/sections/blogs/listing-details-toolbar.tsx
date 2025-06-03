// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack, { StackProps } from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { FormControl, Select, SelectChangeEvent } from '@mui/material';
import startCase from 'lodash/startCase';
import { IListingItem } from 'src/types/listing';

const verificationOptions = [
  { label: 'Verified', value: 'verified' },
  { label: 'Unerified', value: 'unverified' },
];

type Props = StackProps & {
  backLink: string;
  listing: IListingItem;
  onChangeVerification: (newValue: SelectChangeEvent<any>) => void;
};

export default function TourDetailsToolbar({
  backLink,
  onChangeVerification,
  sx,
  listing,
  ...other
}: Props) {
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
    </Stack>
  );
}
