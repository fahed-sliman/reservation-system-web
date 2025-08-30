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
  is_closed  : boolean; 
   closed_from: string | null; // ISO date
  closed_until: string | null; // ISO date
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface HotelRoom {
  id: number;
  hotel_id: number;
  floor: number;
  room_number: number;
  image : string | null;
  type: string;
  capacity: number;
  price_per_night: number;
  description: string | null;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}


export interface HotelReservation {
  id: number; // ✅ من الـ API
  user_id: number;
  hotel_id: number;
  hotel_room_id: number;
  start_date: string; // ISO format
  nights: number;
  payment_method: 'cash' | 'credit_card' | 'paypal' | null;
  price: string; // "200.00"
  final_price: string;
  status: 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';
  created_at: string;
  updated_at: string;
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