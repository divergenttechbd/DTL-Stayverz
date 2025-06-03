export type IPayoutTableFilterValue = string | string[] | Date | null;

export type IPayoutTableFilters = {
  search: string;
  host: { label: string; value: string } | null;
  status: string;
  payment_date_after: Date | null;
  payment_date_before: Date | null;
};

export type IPayoutItem = {
  id: number;
  created_at: string;
  updated_at: string;
  invoice_no: string;
  total_amount: number;
  status: string;
  payment_date: string;
  host: {
    id: number;
    full_name: string;
    image: string;
  };
  pay_method: {
    account_name: string;
    account_no: string;
    bank_name: string;
    branch_name: string;
    m_type: string;
  };
};
