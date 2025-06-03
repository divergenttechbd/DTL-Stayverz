//
import { IChatMessage } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
};

export default function useGetMessage({ message }: Props) {
  return {
    hasImage: false,
    me: false,
    senderDetails: message.user,
  };
}
