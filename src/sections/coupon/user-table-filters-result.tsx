// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';
import _ from 'lodash';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IUserTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  onResetFilters: VoidFunction;
  results: number;
};

export default function RTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.date_joined_after, filters.date_joined_before);
  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveRole = () => {
    onFilters('u_type', '');
  };

  const handleRemoveVerification = () => {
    onFilters('identity_verification_status', '');
  };

  const handleRemoveDate = () => {
    onFilters('date_joined_before', null);
    onFilters('date_joined_after', null);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={_.startCase(filters.status)} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {!!filters.u_type && (
          <Block label="Role:">
            <Chip
              label={_.startCase(filters.u_type)}
              size="small"
              onDelete={() => handleRemoveRole()}
            />
          </Block>
        )}

        {!!filters.identity_verification_status && (
          <Block label="Verification: ">
            <Chip
              label={_.startCase(filters.identity_verification_status)}
              size="small"
              onDelete={() => handleRemoveVerification()}
            />
          </Block>
        )}

        {filters.date_joined_after && filters.date_joined_before && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
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
