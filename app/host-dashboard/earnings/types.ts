interface IEarning {
  id: number
  created_at: string
  updated_at: string
  invoice_no: string
  total_amount: number
  status: string
  payment_date: string
  host: {
      id: number
      full_name: string
      image: string
      phone_number: string
  }
  pay_method: {
      id: number
      m_type: string
      account_no: string
      account_name: string
      bank_name: string
      branch_name: string
  }
}

interface IEarningDetailsItem {
  amount: number
  booking: number
  created_at: string
  guest_count: number
  host_payment: number
  id: number
  night_count: number
  reservation_code: string
  updated_at: string
}
