// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// components
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { IInvoice } from 'src/types/invoice';

type Props = {
  currentInvoice?: IInvoice;
};

export default function PayoutListDetails({ currentInvoice }: Props) {
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>৳ {currentInvoice?.payment_data.total_amount}</Box>
      </Stack>
    </Stack>
  );
  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Reservation Code</TableCell>

              <TableCell>Guest Count</TableCell>

              <TableCell>Total Nights</TableCell>

              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentInvoice?.payment_data.items.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link href={`/booking/${row.id}/details`}>{row.reservation_code}</Link>
                </TableCell>
                <TableCell>{row.guest_count}</TableCell>
                <TableCell>{row.night_count}</TableCell>
                <TableCell align="right">৳ {row.amount}</TableCell>
              </TableRow>
            ))}

            {/* {renderTotal} */}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      {renderList}
      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      {renderTotal}
    </Box>
  );
}
