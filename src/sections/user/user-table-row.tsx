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
import { IUserItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useRouter } from 'src/routes/hook';
import _ from 'lodash';
import { format } from 'date-fns';
//

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUserItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onVerify: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onVerify,
}: Props) {
  const {
    id,
    full_name,
    image,
    date_joined,
    u_type,
    identity_verification_status,
    email,
    phone_number,
  } = row;

  const confirm = useBoolean();

  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={full_name} src={image} sx={{ mr: 2 }} />

          <ListItemText
            primary={full_name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone_number}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(date_joined), 'yyyy-MM-dd')}
            secondary={format(new Date(date_joined), 'h:mm a')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{_.startCase(u_type)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (identity_verification_status === 'verified' && 'success') ||
              (identity_verification_status === 'pending' && 'warning') ||
              (identity_verification_status === 'rejected' && 'error') ||
              'default'
            }
          >
            {identity_verification_status.split('_').join(' ')}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            onClick={onVerify}
            sx={{ cursor: 'pointer' }}
            color={
              (identity_verification_status === 'verified' && 'error') ||
              (identity_verification_status === 'not_verified' && 'success') ||
              'default'
            }
          >
            {identity_verification_status === 'verified' && 'Unverify'}
            {identity_verification_status === 'not_verified' && 'Verify'}
          </Label>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color="default"
              onClick={() => {
                router.push(`/user/${id}/edit`);
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
