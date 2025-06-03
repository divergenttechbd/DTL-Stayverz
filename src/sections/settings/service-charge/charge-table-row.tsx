import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { format } from 'date-fns';
import { IServiceChargeItem } from 'src/types/service-charge';
import { Checkbox } from '@mui/material';
//

type Props = {
  selected: boolean;
  row: IServiceChargeItem;
  onSelectRow: VoidFunction;
};

export default function ChargeTableRow({ row, selected, onSelectRow }: Props) {
  const { end_date, start_date, value } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={format(new Date(start_date), 'yyyy-MM-dd')}
          secondary={format(new Date(start_date), 'h:mm a')}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {end_date ? (
          <ListItemText
            primary={format(new Date(end_date), 'yyyy-MM-dd')}
            secondary={format(new Date(end_date), 'h:mm a')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        ) : (
          <span>&mdash;</span>
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{value}%</TableCell>
    </TableRow>
  );
}
