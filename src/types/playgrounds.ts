// Playground Types
export interface PlayGround {
  id: number;
  category_id: number;
  sport: 'Football' | 'Basketball' | 'Tennis';
  ar_title: string;
  en_title: string;
  image: string | null;
  en_location: string;
  ar_location: string;
  price: number;
  capicity: number;
  is_closed: boolean;
  closed_from: string | null; // ISO date
  closed_until: string | null; // ISO date
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface PlayGroundReservation {
  id: number;
  user_id: number;
  play_ground_id: number;
  coupons_id: number | null;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:mm-HH:mm
  payment_method: 'cash' | 'credit_card' | 'MTN_CASH';
  price: number;
  final_price: number | null;
  status: 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';
  discount_applied: boolean;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface ReservePlayGroundRequest {
  playGroundId: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm-HH:mm
  paymentMethod: 'cash' | 'credit_card' | 'MTN_CASH';
  couponCode?: string | null;
}

export interface SearchPlaygroundsRequest {
  search?: string;
  sport?: 'Football' | 'Basketball' | 'Tennis';
}