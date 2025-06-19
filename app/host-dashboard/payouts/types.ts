export interface IPaymentMethod {
  id: number;
  created_at: string;
  updated_at: string;
  m_type: 'bank' | 'bkash' | 'nagad' | 'rocket';
  account_no: string;
  account_name: string;
  bank_name?: string;
  branch_name?: string;
  routing_number?: string;
  is_default: boolean;
  host: number;
}


export enum EditModalType {
  FORM = 'form',
  OTP = 'otp',
  NONE = 'none',
}
