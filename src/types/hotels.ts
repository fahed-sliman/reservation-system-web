// Hotel Types
export interface Hotel {
  id: number;
  category_id: number;
  category_name: string | null;
  ar_title: string;
  en_title: string;
  image: string | null;
  ar_location: string;
  en_location: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface HotelRoom {
  id: number;
  hotel_id: number;
  floor: number;
  room_number: number;
  type: string;
  capacity: number;
  price_per_night: number;
  description: string | null;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface HotelReservation {
  reservation_id: number;
  hotel_name: string | null;
  room_number: number | null;
  floor: number | null;
  start_date: string; // YYYY-MM-DD
  nights: number;
  payment_method: 'cash' | 'credit_card' | 'paypal' | null;
  status: 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';
}

export interface ReserveHotelRequest {
  hotelId: number;
  roomNumber: number;
  startDate: string; // YYYY-MM-DD
  nights: number;
  paymentMethod?: 'cash' | 'credit_card' | 'paypal' | null;
  couponCode?: string | null;
}

export interface FetchRoomsRequest {
  hotelId: number;
}

export interface SearchHotelsRequest {
  search?: string;
}