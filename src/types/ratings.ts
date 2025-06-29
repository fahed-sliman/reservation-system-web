// Rating Types.

export type RateableType =
  | 'hotel'
  | 'playground'
  | 'tour'
  | 'restaurant'
  | 'event_hall';

export interface RateRequest {
  type: RateableType;
  id: number;
  rating: number; // 1 to 5
  comment?: string | null;
}

export interface EditRatingRequest {
  type: RateableType;
  id: number;
  rating: number;
  comment?: string | null;
}

export interface DeleteRatingRequest {
  type: RateableType;
  id: number;
}

export interface RatingInfo {
  id: number;
  rateable_type: RateableType;
  rateable_id: number;
  rating: number;
  comment: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface RatingsResponse {
  average_rating: number;
  ratings_count: number;
  latest_comments: Array<{
    rating: number;
    comment: string | null;
    created_at: string;
  }>;
}

export interface AverageRatingResponse {
  type: RateableType;
  id: number;
  average_rating: number;
}