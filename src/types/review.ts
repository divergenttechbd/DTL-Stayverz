
// ----------------------------------------------------------------------

export type IReviewTableFilterValue = string | string[] | Date | null;

export type IReviewTableFilters = {
  search: string;
  u_type: string;
  status: string;
  identity_verification_status: string;
  created_at_after: Date | null;
  created_at_before: Date | null;
  user: number | null;
};

export type IReview = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
};
