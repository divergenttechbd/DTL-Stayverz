export interface IReservationData {
  id: string
  check_in: string
  check_out: string
  invoice_no: string
  guest_image: string
  guest_name: string
  listing_title: string
  listing_uid: string 
  chat_room_id: string
}
export interface IReservationStats {
  currently_hosting_count: number
  upcoming_count: number
  pending_review_count: number
  arriving_soon_count: number
  checking_out_count: number
}
export interface IReservationStatInfo {
  currently_hosting: { label: string, count: number };
  upcoming: { label: string, count: number };
  pending_review: { label: string, count: number };
  arriving_soon: { label: string, count: number };
  checking_out: { label: string, count: number };
}
