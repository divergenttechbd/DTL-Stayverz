// @mui
import Box from '@mui/material/Box';
// types
import { IChatMessage } from 'src/types/chat';
// components
import Scrollbar from 'src/components/scrollbar';
//
import { UseBooleanReturnType } from 'src/hooks/use-boolean';
import { LoadingScreen } from 'src/components/loading-screen';
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';

// ----------------------------------------------------------------------

type Props = {
  messages: IChatMessage[];
  loading: boolean;
  setChatDetails: Function;
  showDetails: UseBooleanReturnType;
};

export default function ChatMessageList({
  messages = [],
  loading,
  setChatDetails,
  showDetails,
}: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
      <Box>
        {loading ? (
          <LoadingScreen />
        ) : (
          messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              setChatDetails={setChatDetails}
              showDetails={showDetails}
            />
          ))
        )}
      </Box>
    </Scrollbar>
  );
}
