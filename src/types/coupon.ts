import { ReactElement } from 'react'
import { CustomFile } from 'src/components/upload'

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[] | Date | null;

export type IUserTableFilters = {
  search: string;
  u_type: string;
  status: string;
  identity_verification_status: string;
  date_joined_after: Date | null;
  date_joined_before: Date | null;
};

type TabValue = 'profile' | 'listings' | 'bookings' | 'reviews' | 'payouts' | 'payment-methods';
interface ITab {
  value: TabValue;
  label: string;
  icon: ReactElement;
}
export type ITabs = ITab[];
// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type ICouponItem = {
  code: string;
  created_at: string;
  description: string
  discount_type: string
  discount_value: string
  id: number
  is_active: boolean;
  max_use: number;
  threshold_amount: string;
  updated_at: string;
  uses_count: number
  valid_from: string;
  valid_to: string;
};

export type IUserAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
