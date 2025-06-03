import { m } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _notifications } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import { getNotifications, setAllAsRead, setAsRead } from 'src/utils/queries/notifications';
import { fDate } from 'src/utils/format-time';
import { useRouter } from 'src/routes/hook';

//
import NotificationItem from './notification-item';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function groupNotificationsByDate(notifications: any[]) {
  const groupedNotifications: Record<string, any[]> = {};

  notifications.forEach((notification) => {
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
    <Box sx={{ marginLeft: 3, paddingY: 1 }}>
      <Typography variant="subtitle2">{date}</Typography>
    </Box>
    <List disablePadding>
      {notifications?.map((notification: any) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
  </>
);

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const router = useRouter();

  const [unread, setUnread] = useState<any>(0);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_API_WS}/ws/notifications/`);

    ws.onmessage = (ev: MessageEvent<any>) => {
      fetchNotifications();
    };

    fetchNotifications();
  }, []);

  const [notifications, setNotifications] = useState<any>();

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(notifications || []),
    [notifications]
  );

  const totalUnRead = notifications?.filter((item: any) => item.is_read === false).length;

  const handleMarkAllAsRead = async () => {
    try {
      const res = await setAllAsRead();
      if (!res.success) throw res.data;
      fetchNotifications();
    } catch (err) {
      // setNotifications([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications({ page_size: 10 });
      if (!res.success) throw res.data;
      setNotifications(res.data);
      setUnread(res.stats);
    } catch (err) {
      setNotifications([]);
    }
  };

  const sortedKeys = Object.keys(groupedNotifications).sort((a, b) => b.localeCompare(a));

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!unread && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={unread} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}
        <Divider />

        <Scrollbar>
          {sortedKeys.map((item) => (
            <RenderList date={item} notifications={groupedNotifications[item]} />
          ))}
        </Scrollbar>
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="large"
            onClick={() => {
              router.push('/notifications');
            }}
          >
            View All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
