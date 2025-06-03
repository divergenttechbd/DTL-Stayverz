import {
  Badge,
  Box,
  Card,
  Container,
  IconButton,
  Link,
  List,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import NotificationItem from 'src/layouts/_common/notifications-popover/notification-item';
import { paths } from 'src/routes/paths';
import Button from 'src/theme/overrides/components/button';
import { fDate } from 'src/utils/format-time';
import { getNotifications, setAllAsRead } from 'src/utils/queries/notifications';

function groupNotificationsByDate(notifications: any[]) {
  const groupedNotifications: Record<string, any[]> = {};

  notifications?.forEach((notification) => {
    const createdDate = fDate(notification.created_at, 'dd-MM-yyyy');

    if (!groupedNotifications[createdDate]) {
      groupedNotifications[createdDate] = [];
    }

    groupedNotifications[createdDate].push(notification);
  });

  return groupedNotifications;
}

const RenderList = ({ notifications, date }: { date: string; notifications: any[] }) => (
  <>
    <Box sx={{ paddingLeft: 3, paddingY: 1, border: '1px solid #eee' }}>
      <Typography variant="subtitle2" sx={{ bgcolor: 'background.default' }}>
        {date}
      </Typography>
    </Box>
    <List disablePadding>
      {notifications?.map((notification: any) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
  </>
);

export default function NotificationList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [notifications, setNotifications] = useState<any>();
  const [filters, setFilters] = useState<Record<string, any>>({});

  const fetchNotifications = useCallback(
    async (page = 1) => {
      try {
        const res = await getNotifications({
          page,
          page_size: 20,
          created_at_after: filters.created_at_after
            ? format(filters.created_at_after, 'yyyy-MM-dd')
            : null,
          created_at_before: filters.created_at_before
            ? format(filters.created_at_before, 'yyyy-MM-dd')
            : null,
        });
        if (!res.success) throw res.data;
        setNotifications(res.data);
        setTotalPages(Math.ceil(res.meta_data.total / res.meta_data.page_size));
        setCurrentPage(page);
      } catch (err) {
        setNotifications([]);
      }
    },
    [filters]
  );

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await setAllAsRead();
      if (!res.success) throw res.data;
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(notifications || []),
    [notifications]
  );

  const sortedKeys = Object.keys(groupedNotifications).sort((a, b) => b.localeCompare(a));
  console.log(notifications);

  const handleFilterStartDate = (newValue: Date | null | string) => {
    if (newValue?.toString() !== 'Invalid Date') {
      if (newValue?.toString() !== 'Invalid Date') {
        setFilters((prev) => ({ ...prev, created_at_after: newValue }));
      }
    }
  };

  const handleFilterEndDate = (newValue: Date | null | string) => {
    if (newValue?.toString() !== 'Invalid Date') {
      if (newValue?.toString() !== 'Invalid Date') {
        setFilters((prev) => ({ ...prev, created_at_before: newValue }));
      }
    }
  };

  return (
    <Container>
      <Card sx={{ p: 4, m: 4 }}>
        <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
          <Typography variant="h5">All Notifications</Typography>
          <Link
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              handleMarkAllAsRead();
            }}
          >
            Mark all as read
          </Link>
        </Box>

        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          direction={{
            xs: 'column',
            md: 'row',
          }}
          sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
          }}
        >
          <DatePicker
            label="Start date"
            value={filters.created_at_after}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 250 },
            }}
          />

          <DatePicker
            label="End date"
            value={filters.created_at_before}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
            sx={{
              maxWidth: { md: 250 },
            }}
          />
        </Stack>

        <Scrollbar>
          {sortedKeys.map((item) => (
            <RenderList date={item} notifications={groupedNotifications[item]} />
          ))}
        </Scrollbar>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Card>
    </Container>
  );
}
