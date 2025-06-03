// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: Date;
  modifiedAt: Date;
};

export type IChatMessage = {
  id: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    user_id: number;
    email: string;
    image: string;
    phone_number: string;
  };
  content: string | string[];
  meta: {
    listing: string;
    booking: {
      id: number;
      invoice_no: string;
      reservation_code: string;
    };
    user: number;
  };
  created_at: string;
  updated_at: string;
  is_read: boolean;
  file: null;
  m_type: 'system' | 'normal' | 'date';
};

export interface IChatRecepient {
  id: string;
  username: string;
  full_name: string;
  user_id: number;
  email: string;
  image: string;
  phone_number: string;
}

export interface IChatConversation {
  id: string;
  name: string;
  from_user: IChatRecepient;
  to_user: IChatRecepient;
  status: string;
  latest_message: {
    content: string;
    user: {
      username: string;
      full_name: string;
      image: string;
      user_id: number;
    };
    is_read: boolean;
    m_type: string;
    created_at: string;
  };
  booking_data: {
    check_in: string;
    check_out: string;
    total_guest_count: number;
  };
  listing: {
    name: string;
    id: number;
  };
  created_at: string;
  updated_at: string;
}

export type IChatMessages = {
  byId: Record<string, IChatMessage>;
  allIds: string[];
};
