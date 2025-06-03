// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { format } from 'date-fns';
import { IBookingItem } from 'src/types/booking';
import { Link } from '@mui/material';
import { paths } from 'src/routes/paths';
import { getDecimalValue } from 'src/utils/format-number';
import { startCase } from 'lodash';
import Label from 'src/components/label';
//

type Props = {
  selected: boolean;
  row: IBookingItem;
  onSelectRow: VoidFunction;
};

export default function BookingTableRow({ row, selected, onSelectRow }: Props) {
  const {
    id,
    check_in,
    check_out,
    created_at,
    listing,
    reservation_code,
    host_pay_out,
    host,
    host_payment_status,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
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
            (host_payment_status === 'paid' && 'success') ||
            (host_payment_status === 'unpaid' && 'warning') ||
            'default'
          }
        >
          {startCase(host_payment_status)}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'wrap' }}>
        <Link href={`${paths.dashboard.listing.root}/${listing.id}`}>{listing.title}</Link>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Link href={`/booking/${id}/details`}>{reservation_code}</Link>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>৳ {getDecimalValue(host_pay_out)}</TableCell>
    </TableRow>
  );
}
