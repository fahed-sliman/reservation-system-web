// Reservation Types

import { EventHallReservation } from "./event-halls";
import { HotelReservation } from "./hotels";
import { PlayGroundReservation } from "./playgrounds";
import { RestaurantReservation } from "./restaurants";
import { TourReservation } from "./tours";

export type ReservationType =
  | 'restaurants'
  | 'hotels'
  | 'tours'
  | 'playgrounds'
  | 'event_halls';

export interface CancelReservationRequest {
  type: 'hotel' | 'restaurant' | 'tour' | 'event_hall' | 'playground';
  id: number;
}

export interface UserReservationsResponse {
  status: string;
  data: {
    restaurant_reservations?: RestaurantReservation[];
    hotel_reservations?: HotelReservation[];
    tour_reservations?: TourReservation[];
    play_ground_reservations?: PlayGroundReservation[];
    event_hall_reservations?: EventHallReservation[];
  };
}

export interface CancelReservationResponse {
  message: string;
  user_blocked: boolean;
  blocked_until: string | null;
}