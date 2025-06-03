export interface IGuest {
    id: number;
    full_name: string;
    image: string;
    email: string;
    identity_verification_status: string;
    status: string;
    bio: string;
    date_joined: string;
    languages: string[];
    address: string;
    is_host: boolean;
    phone_number: string;
}

export interface IPriceInfo {
    [key: string]: {
        id: number;
        price: number;
        is_booked: boolean;
        is_blocked: boolean;
    };
}

export interface ICalendarInfo {
    price: number;
    end_date: string;
    is_booked: boolean;
    base_price: number;
    is_blocked: boolean;
    listing_id: number;
    start_date: string;
}

export interface IListing {
    id: number;
    title: string;
    cover_photo: string;
    address: string;
    cancellation_policy: {
        id: number;
        description: string;
        policy_name: string;
        refund_percentage: number;
    };
    avg_rating: number;
    total_rating_count: number;
}

export interface IReservationDetails {
    id: number;
    created_at: string;
    updated_at: string;
    invoice_no: string;
    pgw_transaction_number: string;
    reservation_code: string;
    check_in: string;
    check_out: string;
    chat_room_id: string;
    night_count: number;
    children_count: number;
    infant_count: number;
    adult_count: number;
    guest_count: number;
    price: number;
    guest_service_charge: number;
    total_price: number;
    paid_amount: number;
    host_service_charge: number;
    host_pay_out: number;
    price_info: IPriceInfo;
    payment_status: string;
    status: string;
    calendar_info: ICalendarInfo[];
    guest: IGuest | number;
    host: IGuest | number;
    listing: IListing;
}
