/* eslint-disable no-nested-ternary */
import { format } from 'date-fns';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// types
import { IChatMessage } from 'src/types/chat';
import { useCallback } from 'react';
//
import { getBooking } from 'src/utils/queries/bookings';
import { UseBooleanReturnType } from 'src/hooks/use-boolean';
import { useGetMessage } from './hooks';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  setChatDetails: Function;
  showDetails: UseBooleanReturnType;
};

export default function ChatMessageItem({ message, setChatDetails, showDetails }: Props) {
  const { me, senderDetails } = useGetMessage({
    message,
  });

  const { full_name, image } = senderDetails;

  const { content, created_at, m_type, meta } = message;

  const handleDetailsClick = useCallback(async () => {
    try {
      showDetails.onTrue();
      if (meta?.booking?.invoice_no) {
        const res = await getBooking(meta?.booking?.id);
        if (!res.success) throw res.data;
        setChatDetails(res.data);
      } else {
        setChatDetails(meta?.booking);
      }
    } catch (err) {
      console.log(err);
    }
  }, [meta, setChatDetails, showDetails]);

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${full_name},`} &nbsp;
      {format(new Date(created_at), 'hh:mm aa')}
    </Typography>
  );

  const renderBody = (content as string[]).map((msg, idx) => (
    <Stack
      key={idx}
      sx={{
        p: 1.5,
        minWidth: 48,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: m_type === 'normal' ? 320 : '100%',
        borderRadius: 1,
        typography: 'body2',
        bgcolor: m_type === 'date' ? '' : 'background.neutral',
        ...(me && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {msg}{' '}
      {m_type === 'system' && (
        <Typography
          variant="button"
          sx={{ marginLeft: 1, cursor: 'pointer' }}
          onClick={handleDetailsClick}
        >
          Show Details
        </Typography>
      )}
    </Stack>
  ));

  return (
    <Stack
      direction="row"
      justifyContent={
        m_type === 'system' || m_type === 'date' ? 'center' : me ? 'flex-end' : 'unset'
      }
      sx={{ mb: 5 }}
    >
      {!me && m_type === 'normal' && (
        <Avatar alt={full_name} src={image} sx={{ width: 32, height: 32, mr: 2 }} />
      )}

      <Stack alignItems="flex-start">
        {m_type === 'normal' ? renderInfo : null}

        <Stack
          direction="column"
          sx={{
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
            gap: 1,
          }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
}
