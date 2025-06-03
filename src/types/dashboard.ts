import { IBookingItem } from './booking';

export interface DashboardStat {
  count_stat?: {
    success_booking_count: number;
    cancelled_booking_count: number;
    total_profit: number;
    user_count: number;
  };
  booking_stat?: {
    [month: string]: {
      confirmed: number;
      cancelled: number;
      initiated: number;
    };
  };
  bookings: IBookingItem[];
  best_selling_hosts?: any[];
}
