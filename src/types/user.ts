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

type TabValue = 'profile' | 'listings' | 'bookings' | 'reviews' | 'payouts' |'payment-methods';
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

export type IUserItem = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  status: string;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  u_type: string;
  country_code: string;
  image: string;
  date_joined: string;
  full_name: string;
  identity_verification_method: string;
  identity_verification_status: string;
  identity_verification_images: {
    front_image: string;
    back_image: string;
    live: string;
  };
  profile: {
    id: string;
    bio: string;
    languages: string[];
  };
  role?: string;
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
