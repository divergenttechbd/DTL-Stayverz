// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// hooks
// types
// components
import Label from 'src/components/label';
import _ from 'lodash';
import { format } from 'date-fns';
import { IPayoutItem } from 'src/types/payout';
import { Link } from '@mui/material';
import { paths } from 'src/routes/paths';
//

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IPayoutItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { host, payment_date, total_amount, status, pay_method, invoice_no } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Link href={status === 'unpaid' ? `/transactions/${invoice_no}` : `/payouts/${invoice_no}`}>
          {invoice_no}
        </Link>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {format(new Date(payment_date), 'yyyy-MM-dd')}
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={host?.full_name} src={host?.image} sx={{ mr: 2 }} />

        <Link href={`${paths.dashboard.user.root}/${host.id}/edit`}>
          <ListItemText
            primary={host?.full_name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </Link>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={_.startCase(pay_method?.m_type)}
          secondary={pay_method?.account_no}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>৳ {total_amount}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'unpaid' && 'warning') || (status === 'paid' && 'success') || 'default'
          }
        >
          {status.split('_').join(' ')}
        </Label>
      </TableCell>
    </TableRow>
  );
}
