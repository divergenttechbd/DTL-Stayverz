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
import { IReferalTableFilters } from '../../types/referral';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IReferalTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  onResetFilters: VoidFunction;
  results: number;
};

export default function ReferralTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveUserName = () => {
    onFilters('username', '');
  };
  const handleRemoveEmail = () => {
    onFilters('email', '');
  };
  const handleRemoveReferral = () => {
    onFilters('referral_type', '');
  };
  const handleRemoveUserType = () => {
    onFilters('u_type', '');
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
        {!!filters.username && (
          <Block label="User Name:">
            <Chip
              label={_.startCase(filters.username)}
              size="small"
              onDelete={() => handleRemoveUserName()}
            />
          </Block>
        )}

        {!!filters.email && (
          <Block label="Email:">
            <Chip
              label={_.startCase(filters.email)}
              size="small"
              onDelete={() => handleRemoveEmail()}
            />
          </Block>
        )}

        {!!filters.referral_type && (
          <Block label="Referral Type: ">
            <Chip
              label={_.startCase(filters.referral_type)}
              size="small"
              onDelete={() => handleRemoveReferral()}
            />
          </Block>
        )}

        {!!filters.u_type && (
          <Block label="User Type:">
            <Chip
              label={_.startCase(filters.u_type)}
              size="small"
              onDelete={() => handleRemoveUserType()}
            />
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
