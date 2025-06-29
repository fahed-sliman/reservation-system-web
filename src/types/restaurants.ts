// Restaurant types
export interface Restaurant {
  id: number;
  category_id: number;
  ar_title: string;
  en_title: string;
  image: string; // URL from asset()
  location: string;
  capacity: number;
  is_closed: boolean;
  closed_from: string | null; // ISO date
  closed_until: string | null; // ISO date
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

// Reservation types
export interface RestaurantReservation {
  id: number;
  restaurant_id: number;
  restaurant_en_title: string;
  restaurant_ar_title: string;
  reservation_time: string; // formatted as 'Y-m-d H:i'
  guests: number;
  area_type: 'indoor_hall' | 'outdoor_terrace' | null;
  status: 'confirmed' | 'cancelled' | 'missed' | 'rejected';
}

export interface ReserveRestaurantRequest {
  restaurantId: number;
  reservationTime: string; // ISO date-time format 'YYYY-MM-DD HH:mm:ss'
  guests: number;
  areaType?: 'indoor_hall' | 'outdoor_terrace' | null;
}

export interface SearchRestaurantsRequest {
  search?: string;
}