import { useChatSessionPeerStatus } from '~/app/chat/store/chatSessionStore'
import { formatDate } from '~/lib/utils/formatter/dateFormatter'
import { Peer } from '~/queries/models/conversation'

interface UseOnlineStatusArgs {
  peer?: Peer
}

export const useOnlineStatus = ({peer}: UseOnlineStatusArgs) => {
  const peerStatus = useChatSessionPeerStatus(peer?.id)
  const isOnline = peerStatus?.online_status ?? peer?.online_status
  const lastSeen = peerStatus?.last_online ?? peer?.last_online

  return {
    peerStatus,
    isOnline,
    lastSeen: lastSeen ? formatDate(lastSeen, 'HH:mm A on MMM DD, YYYY') : undefined,
  }
}
