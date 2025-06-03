// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import _, { startCase } from 'lodash';
import { format } from 'date-fns';
import { Box } from '@mui/system';

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: any;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ReviewTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { rating, created_at, review_by, review_for, review } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
            <Avatar alt={review_by?.image} src={review_by?.image} sx={{ mr: 2 }} />

            <ListItemText
              primary={review_by?.full_name}
              secondary={startCase(review_by?.u_type)}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
            <Avatar alt={review_for?.image} src={review_for?.image} sx={{ mr: 2 }} />

            <ListItemText
              primary={review_for?.full_name}
              secondary={startCase(review_for?.u_type)}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
            />
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{rating}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(created_at), 'yyyy-MM-dd')}
            secondary={format(new Date(created_at), 'h:mm a')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'wrap' }}>{review}</TableCell>
      </TableRow>
    </>
  );
}
