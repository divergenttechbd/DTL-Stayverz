export type IReferalTableFilters = {
  username: string;
  email: string;
  referral_type: string;
  u_type: string;
};

export type IReferralItem = {
  email: string
  full_name: string
  id: number
  image_url: null
  total_guest_referral_points: string
  total_guest_referrals_made: number
  total_guest_referrals_successful: number
  total_host_referral_earnings: string
  total_host_referrals_made: number
  total_host_referrals_successful: number
  u_type: string
  username: string
};