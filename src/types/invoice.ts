export type IInvoiceTableFilterValue = string | string[] | Date | null;

export type IInvoiceTableFilters = {
  search: string;
  created_at_after: Date | null;
  created_at_before: Date | null;
  status: string;
  host: { label: string; value: string } | null;
};

// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type HostPayMethod = {
  id: number;
  created_at: string;
  updated_at: string;
  m_type: string;
  account_no: string;
  account_name: string;
  bank_name: string;
  branch_name: string;
  routing_number: string;
  is_default: boolean;
  host: number;
};

type PaymentItem = {
  id: number;
  reservation_code: string;
  night_count: number;
  guest_count: number;
  amount: number;
};

type PaymentData = {
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
    phone_number: string;
  };
  pay_method: number;
  items: PaymentItem[];
};

export type IInvoice = {
  host_pay_method_data: HostPayMethod[];
  payment_data: PaymentData;
};
