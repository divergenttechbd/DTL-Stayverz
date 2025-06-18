// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useRouter } from 'src/routes/hook';
import _ from 'lodash';
import { format } from 'date-fns';
import { ICouponItem } from '../../types/coupon';

//

type Props = {
  selected: boolean;
  row: ICouponItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CouponTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const {
    code,
    description,
    discount_type,
    discount_value,
    id,
    is_active,
    max_use,
    threshold_amount,
    updated_at,
    uses_count,
    valid_from,
    valid_to,
  } = row;

  const confirm = useBoolean();

  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{code}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{description}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{discount_type}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{discount_value}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{is_active ? 'Active' : 'Inactive'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{uses_count}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {format(new Date(valid_from), 'yyyy/MM/dd')} - {format(new Date(valid_to), 'yyyy/MM/dd')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color="default"
              onClick={() => {
                router.push(`/coupon/${id}/edit`);
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
