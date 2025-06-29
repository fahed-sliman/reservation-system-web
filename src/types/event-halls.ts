// Event Hall Types
export interface EventHall {
  id: number;
  category_id: number;
  ar_title: string;
  en_title: string;
  image: string | null;
  en_location: string;
  ar_location: string;
  capicity: number;
  price: number;
  is_closed: boolean;
  closed_from: string | null; // ISO date
  closed_until: string | null; // ISO date
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface EventHallReservation {
  id: number;
  user_id: number;
  event_hall_id: number;
  coupons_id: number | null;
  event_type: 'wedding' | 'funeral';
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:mm-HH:mm
  guests: number;
  price: number;
  final_price: number | null;
  discount_applied: boolean;
  payment_method: 'cash' | 'credit_card' | 'MTN_CASH';
  status: 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface ReserveEventHallRequest {
  eventHallId: number;
  eventType: 'wedding' | 'funeral';
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm-HH:mm
  guests: number;
  paymentMethod: 'cash' | 'credit_card' | 'MTN_CASH';
  couponCode?: string | null;
}

export interface SearchEventHallsRequest {
  search?: string;
}