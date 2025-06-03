// @mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack, { StackProps } from '@mui/material/Stack'
// types
import { IListingFilters, ITourFilterValue } from 'src/types/listing'
// components
import startCase from 'lodash/startCase'
import { shortDateLabel } from 'src/components/custom-date-range-picker'
import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IListingFilters;
  onFilters: (name: string, value: ITourFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  results: number;
};

export default function TourFiltersResult({
  filters,
  onFilters,
  canReset,
  onResetFilters,
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.created_at_after, filters.created_at_before);

  // handle filter result single remove button
  const handleRemoveAvailable = () => {
    onFilters('created_at_after', null);
    onFilters('created_at_before', null);
  };
  const handleRemoveStatus = () => {
    onFilters('status', '');
  };
  const handleRemoveVerificationStatus = () => {
    onFilters('verification_status', '');
  };
  const handleRemoveType = () => {
    onFilters('category', '');
  };
  const handleRemoveHost = () => {
    onFilters('host', '')
  }

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.created_at_after && filters.created_at_before && (
          <Block label="Available:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveAvailable} />
          </Block>
        )}

        {filters.status !== '' && (
          <Block label="Status:">
            <Chip
              label={startCase(filters.status)}
              size="small"
              onDelete={() => handleRemoveStatus()}
            />
          </Block>
        )}
        {filters.verification_status !== '' && (
          <Block label="Verification Status:">
            <Chip
              label={startCase(filters.verification_status)}
              size="small"
              onDelete={() => handleRemoveVerificationStatus()}
            />
          </Block>
        )}
        {!!filters.category && (
          <Block label="Listing Type:">
            <Chip 
              label={filters.category} 
              size="small" 
              onDelete={() => handleRemoveType()} 
            />
          </Block>
        )}
        {!!filters.host && (
          <Block label="Host Name:">
            <Chip 
              label={startCase(filters.host?.label)} 
              size="small" 
              onDelete={() => handleRemoveHost()} 
            />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
