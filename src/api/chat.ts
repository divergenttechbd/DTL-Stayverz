import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';
// utils
import axios, { endpoints, fetcher, fetcherWithMeta } from 'src/utils/axios';
// types
import { IChatMessage, IChatConversation, IChatMessages } from 'src/types/chat';
import { format } from 'date-fns';
import { IBookingItem } from 'src/types/booking';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetContacts() {
  const URL = [endpoints.chat, { params: {} }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      contacts: (data as IChatConversation[]) || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations(refresh = false) {
  const URL = [endpoints.chat, { params: {} }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    ...options,
    revalidateIfStale: refresh,
  });

  const memoizedValue = useMemo(() => {
    const byId = keyBy(data?.conversations, 'id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      } as IChatMessages,
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

function groupConversation(messages: IChatMessage[]) {
  if (!messages?.length) return [];
  const newMessage = [{ ...messages[0], content: [messages[0].content] }];
  let left = 0;

  for (let i = 1; i < messages.length; i += 1) {
    if (
      messages[i].user.id === newMessage[left].user.id &&
      messages[i].m_type === newMessage[left].m_type &&
      messages[i].created_at.slice(0, 16) === newMessage[left].created_at.slice(0, 16)
    ) {
      newMessage[left].content.push(messages[i].content);
    } else if (messages[i].created_at.slice(0, 10) !== newMessage[left].created_at.slice(0, 10)) {
      left += 2;
      newMessage.push({
        ...messages[i],
        id: `date_${messages[i].id}`,
        content: [format(new Date(messages[i].created_at), 'iii, MMM dd, yyyy')],
        created_at: messages[i].created_at,
        m_type: 'date',
      });
      newMessage.push({ ...messages[i], content: [messages[i].content] });
    } else {
      left += 1;
      newMessage.push({ ...messages[i], content: [messages[i].content] });
    }
  }
  return newMessage;
}

export function useGetConversation(conversationId: string) {
  const URL = conversationId
    ? [`${endpoints.chat}${conversationId}/`, { params: { limit: 0 } }]
    : null;

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: refetchConversation,
  } = useSWR(URL, fetcherWithMeta, {
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      conversation: groupConversation(data?.data) as IChatMessage[],
      conversationLoading: isLoading,
      chatroom: (data as any)?.extra_data?.chat_room as IChatConversation,
      conversationError: error,
      conversationValidating: isValidating,
      refetchConversation,
    }),
    [data, error, isLoading, isValidating, refetchConversation]
  );

  return memoizedValue;
}

export function useGetBookingDetails(bookingId: string) {
  const URL = bookingId ? [`/bookings/admin/bookings/${bookingId}/`, {}] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherWithMeta, {
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      booking: data?.data as IBookingItem,
      bookingLoading: isLoading,
      bookingError: error,
      bookingValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const conversations: IChatMessage[] = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}
