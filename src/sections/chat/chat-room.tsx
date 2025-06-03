/* eslint-disable no-nested-ternary */
import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IChatConversation, IChatRecepient } from 'src/types/chat';
// components
//
import { Link, Typography } from '@mui/material';
import { format } from 'date-fns';
import { getDecimalValue } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';
import { IBookingItem } from 'src/types/booking';
import { paths } from 'src/routes/paths';
import { useCollapseNav } from './hooks';
// ----------------------------------------------------------------------

interface InquiryBooking {
  booking_date: {
    check_in: string;
    check_out: string;
    total_guest_count: number;
    adult: number;
    children: number;
    infant: number;
  };
  checkout_data: {
    nights: number;
    booking_price: number;
    guest_service_charge: number;
    total_price: number;
    host_service_charge: number;
    host_pay_out: number;
    price_info: {
      [date: string]: {
        id: number;
        price: number;
        is_blocked: boolean;
        is_booked: boolean;
        booking_data: Record<string, any>;
      };
    };
  };
}

type Props = {
  booking: IBookingItem | InquiryBooking | null | undefined;
  user: IChatRecepient | null | undefined;
  listing: IChatConversation['listing'] | null | undefined;
};

export default function ChatRoom({ booking, user, listing }: Props) {
  const showPriceBreakdown = useBoolean();
  const showPriceBreakdownForHost = useBoolean();

  const lgUp = useResponsive('up', 'lg');

  const priceBreakdown = Object.keys((booking as IBookingItem)?.price_info || {})
    .sort()
    .map((key) => (
      <Stack direction="row" key={key} justifyContent="space-between">
        <Typography>{key}</Typography>
        <Typography>৳ {(booking as IBookingItem)?.price_info?.[key]?.price}</Typography>
      </Stack>
    ));

  const { onCloseDesktop } = useCollapseNav();

  const bookingData = booking as any;

  const guestCounts = [
    {
      type: bookingData?.adult_count > 1 ? 'adults' : 'adult',
      count: bookingData?.adult_count,
    },
    {
      type: bookingData?.children_count > 1 ? 'children' : 'child',
      count: bookingData?.children_count,
    },
    {
      type: bookingData?.infant_count > 1 ? 'infants' : 'infant',
      count: bookingData?.infant_count,
    },
  ].filter((data) => data.count);

  useEffect(() => {
    if (!lgUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, lgUp]);

  function formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });

    const startDateFormatted = `${startMonth} ${start.getDate()}`;
    const endDateFormatted =
      endMonth !== startMonth ? `${endMonth} ${end.getDate()}` : `${end.getDate()}`;

    return `${startDateFormatted}-${endDateFormatted}`;
  }

  const renderBookingDetails = (bookingItem: IBookingItem) => (
    <Stack overflow="auto">
      <Typography paddingLeft={1} variant="h4" borderBottom={1} paddingY={2}>
        Reservation Details
      </Typography>
      <Stack paddingLeft={1} borderBottom={2} paddingY={2}>
        <Stack>
          <Typography variant="subtitle1">
            <Link target="_blank" href={`${paths.dashboard.user.root}/${user?.user_id}/edit`}>
              {user?.full_name}
            </Link>
          </Typography>
          <Typography variant="body1">
            <Link target="_blank" href={`${paths.dashboard.listing.root}/${listing?.id}/`}>
              {listing?.name}
            </Link>
          </Typography>
          <Typography variant="body1">
            {formatDateRange(bookingItem?.check_in, bookingItem.check_out)} (
            {bookingItem.night_count} Nights)
          </Typography>
          <Typography variant="body1">
            {bookingItem.guest_count} guests - ৳{bookingItem.total_price}
          </Typography>
        </Stack>
      </Stack>

      <Stack paddingLeft={1} borderBottom={2} paddingY={2}>
        <Typography variant="h4" paddingY={2}>
          Booking Details
        </Typography>
        <Stack paddingY={2} borderBottom={1}>
          <Typography variant="subtitle1">Guests</Typography>
          <Typography variant="body1">
            {guestCounts.map((d) => `${d.count} ${d.type}`).join(', ')}
          </Typography>
        </Stack>
        <Stack paddingY={2} borderBottom={1}>
          <Typography variant="subtitle1">Check-in</Typography>
          <Typography variant="body1">
            {format(new Date(bookingItem.check_in), 'iii, MMM dd, yyyy')}
          </Typography>
        </Stack>
        <Stack paddingY={2} borderBottom={1}>
          <Typography variant="subtitle1">Check-out</Typography>
          <Typography variant="body1">
            {format(new Date(bookingItem.check_out), 'iii, MMM dd, yyyy')}
          </Typography>
        </Stack>
        <Stack paddingY={2} borderBottom={1}>
          <Typography variant="subtitle1">Booking date</Typography>
          <Typography variant="body1">
            {format(new Date(bookingItem.created_at), 'iii, MMM dd, yyyy')}
          </Typography>
        </Stack>
        <Stack paddingY={2}>
          <Typography variant="subtitle1">Confirmation Code</Typography>
          <Typography variant="body1">{bookingItem.reservation_code}</Typography>
        </Stack>
      </Stack>

      <Stack paddingLeft={1} borderBottom={2} paddingY={2}>
        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          Guest Paid
        </Typography>
        <Stack key="Guest Paid" spacing={1} direction="column">
          <Stack direction="row" justifyContent="space-between">
            <Typography>
              ৳{bookingItem.price_info[Object.keys(bookingItem.price_info)[0]].price} ×{' '}
              {bookingItem.night_count} nights
            </Typography>
            <Typography>৳{getDecimalValue(bookingItem.price)}</Typography>
          </Stack>
          {showPriceBreakdown.value && priceBreakdown}
          <Stack direction="row" justifyContent="space-between">
            <Typography
              sx={{ fontWeight: 'medium', textDecoration: 'underline', cursor: 'pointer' }}
              display="inline"
              onClick={showPriceBreakdown.onToggle}
            >
              {showPriceBreakdown.value ? 'Hide Breakdown' : 'Show Breakdown'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ borderBottom: 1, paddingBottom: 2 }}
          >
            <Typography>Guest Service Charge</Typography>
            <Typography>৳{getDecimalValue(bookingItem.guest_service_charge)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Guest Paid</Typography>
            <Typography>৳{getDecimalValue(bookingItem.paid_amount)}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack paddingLeft={1} paddingY={2}>
        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          Host Payout
        </Typography>
        <Stack key="Host Paid" spacing={1} direction="column">
          <Stack direction="row" justifyContent="space-between">
            <Typography>
              ৳{bookingItem.price_info[Object.keys(bookingItem.price_info)[0]].price} ×{' '}
              {bookingItem.night_count} nights
            </Typography>
            <Typography>৳{getDecimalValue(bookingItem.price)}</Typography>
          </Stack>
          {showPriceBreakdownForHost.value && priceBreakdown}
          <Stack direction="row" justifyContent="space-between">
            <Typography
              sx={{ fontWeight: 'medium', textDecoration: 'underline', cursor: 'pointer' }}
              display="inline"
              onClick={showPriceBreakdownForHost.onToggle}
            >
              {showPriceBreakdownForHost.value ? 'Hide Breakdown' : 'Show Breakdown'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ borderBottom: 1, paddingBottom: 2 }}
          >
            <Typography>Host Service Charge</Typography>
            <Typography>৳{getDecimalValue(bookingItem.host_service_charge)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Host Payout</Typography>
            <Typography>৳{getDecimalValue(bookingItem.host_pay_out)}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderInquiryDetails = (bookingItem: InquiryBooking) => {
    const guests = [
      {
        type: bookingItem?.booking_date?.adult > 1 ? 'adults' : 'adult',
        count: bookingItem?.booking_date?.adult,
      },
      {
        type: bookingItem?.booking_date?.children > 1 ? 'children' : 'child',
        count: bookingItem?.booking_date?.children,
      },
      {
        type: bookingItem?.booking_date?.infant > 1 ? 'infants' : 'infant',
        count: bookingItem?.booking_date?.infant,
      },
    ].filter((data) => data.count);

    return (
      <Stack overflow="auto">
        <Typography paddingLeft={1} variant="h4" borderBottom={1} paddingY={2}>
          Reservation Details
        </Typography>
        <Stack paddingLeft={1} borderBottom={2} paddingY={2}>
          <Stack>
            <Typography variant="subtitle1">
              <Link target="_blank" href={`${paths.dashboard.user.root}/${user?.user_id}/edit`}>
                {user?.full_name}
              </Link>
            </Typography>
            <Typography variant="body1">
              <Link target="_blank" href={`${paths.dashboard.listing.root}/${listing?.id}/`}>
                {listing?.name}
              </Link>
            </Typography>
            <Typography variant="body1">
              {formatDateRange(
                bookingItem?.booking_date.check_in,
                bookingItem?.booking_date?.check_out
              )}{' '}
              ({bookingItem?.checkout_data?.nights} Nights)
            </Typography>
            <Typography variant="body1">
              {bookingItem?.booking_date?.total_guest_count} guests - ৳
              {bookingItem?.checkout_data?.total_price}
            </Typography>
          </Stack>
        </Stack>

        <Stack paddingLeft={1} borderBottom={2} paddingY={2}>
          <Typography variant="h4" paddingY={2}>
            Booking Details
          </Typography>
          <Stack paddingY={2} borderBottom={1}>
            <Typography variant="subtitle1">Guests</Typography>
            <Typography variant="body1">
              {guests.map((d) => `${d.count} ${d.type}`).join(', ')}
            </Typography>
          </Stack>
          <Stack paddingY={2} borderBottom={1}>
            <Typography variant="subtitle1">Check-in</Typography>
            <Typography variant="body1">
              {format(new Date(bookingItem?.booking_date?.check_in), 'iii, MMM dd, yyyy')}
            </Typography>
          </Stack>
          <Stack paddingY={2}>
            <Typography variant="subtitle1">Check-out</Typography>
            <Typography variant="body1">
              {format(new Date(bookingItem?.booking_date?.check_out), 'iii, MMM dd, yyyy')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {booking
        ? (booking as IBookingItem)?.listing
          ? renderBookingDetails(booking as IBookingItem)
          : renderInquiryDetails(booking as InquiryBooking)
        : null}
    </Box>
  );
}
