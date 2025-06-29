// Tour Types
export interface Tour {
  id: number;
  category_id: number;
  ar_title: string;
  en_title: string;
  ar_description: string;
  en_description: string;
  image: string | null;
  price: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface TourStop {
  id: number;
  tour_id: number;
  sequence: number;
  ar_title: string;
  en_title: string;
  image: string | null;
  ar_description: string;
  en_description: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface TourReservation {
  id: number;
  user_id: number;
  tour_id: number;
  coupons_id: number | null;
  guests: number;
  price: number;
  final_price: number | null;
  payment_method: 'cash' | 'paypal' | 'credit_card';
  status: 'confirmed' | 'rejected' | 'cancelled' | 'done';
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  discount_applied: boolean;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface ReserveTourRequest {
  tourId: number;
  guests: number;
  paymentMethod: 'cash' | 'paypal' | 'credit_card';
  couponCode?: string | null;
}

export interface SearchToursRequest {
  search?: string;
}