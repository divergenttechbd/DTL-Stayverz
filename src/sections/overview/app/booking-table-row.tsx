// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useRouter } from 'src/routes/hook';
import { format } from 'date-fns';
import { IBookingItem } from 'src/types/booking';
import { Link } from '@mui/material';
import { paths } from 'src/routes/paths';
import { getDecimalValue } from 'src/utils/format-number';
import { upperFirst } from 'lodash';
import Label from 'src/components/label';
//

type Props = {
  row: IBookingItem;
};

export default function BookingTableRow({ row }: Props) {
  const { id, check_in, check_out, status, guest, host, listing, created_at } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ whiteSpace: 'wrap' }}>
        <Link href={`${paths.dashboard.listing.root}/${listing.id}`}>{listing.title}</Link>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={
            <Link href={`${paths.dashboard.user.root}/${guest.id}/edit`}>{guest.full_name}</Link>
          }
          secondary={guest.phone_number}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={
            <Link href={`${paths.dashboard.user.root}/${host.id}/edit`}>{host.full_name}</Link>
          }
          secondary={host.phone_number}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {format(new Date(check_in), 'yyyy-MM-dd')}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {format(new Date(check_out), 'yyyy-MM-dd')}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={format(new Date(created_at), 'yyyy-MM-dd')}
          secondary={format(new Date(created_at), 'h:mm a')}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            (status === 'confirmed' && 'success') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {upperFirst(status)}
        </Label>
      </TableCell>
    </TableRow>
  );
}
