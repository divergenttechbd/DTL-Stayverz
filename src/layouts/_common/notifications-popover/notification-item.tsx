// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fTime, fToNow } from 'src/utils/format-time';
import { setAsRead } from 'src/utils/queries/notifications';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: any;
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const handleRead = async (id: string) => {
    try {
      const res = await setAsRead(id);
      if (!res.success) throw res.data;
    } catch (err) {
      // setNotifications([]);
    }
  };

  const renderAvatar = (
    <ListItemAvatar>
      <Avatar src="../favicon.ico" sx={{ bgcolor: 'background.neutral' }} />
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="column"
          alignItems="start"
          sx={{
            typography: 'caption',
            color: 'text.disabled',
            marginRight: 2,
          }}
          divider={
            <Box
              sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }}
            />
          }
        >
          {notification.data.message}
          {fTime(notification.created_at)}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.is_read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      onClick={async () => {
        await handleRead(notification.id);
        window.location.href = notification.data.link;
      }}
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'center',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        bgcolor: !notification?.is_read ? '#eee' : 'background.paper',
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>{renderText}</Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
