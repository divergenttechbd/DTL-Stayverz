import { IReview } from '~/app/review/types'

export interface IProfile {
  school: string;
  work: string;
  address: string;
  latitude: number;
  longitude: number;
  bio: string;
  languages: string[];  
}
export interface IProfileListing {
  unique_id: string;
  title: string;
  cover_photo: string;
  address: string;
  avg_rating: number;
}

export interface ProfileDataType {
  first_name: string;
  last_name: string;
  avg_rating: number;
  total_rating_count: number;
  username: string;
  phone_number: string;
  latest_reviews: IReview[]; 
  email: string;
  is_active: boolean;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  country_code: string;
  image: string;
  u_type: string;
  profile: IProfile;
  listings: IProfileListing[]
  full_name?: string;
  identity_verification_status?: string;
}

export interface IModalFormProps {
  data: Partial<ProfileDataType>
  setData?: React.Dispatch<React.SetStateAction<Partial<ProfileDataType>>>;
  closeModal: () => void;
  onSubmit?: Function
}

export enum ModalType {
  SCHOOL = 'school',
  WORK = 'work',
  LOCATION = 'location',
  LANGUAGE = 'languages',
  BIO = 'bio',
  EMAIL = 'email',
  OTP = 'otp',
  NONE = 'none',
}
