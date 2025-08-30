
import type {
  RateableType,
  AverageRatingResponse,
  TourStop,
 
  Hotel,
  Restaurant,
  PlayGround,
  Tour,
  EventHall,
} from "../types";


const BASE_URL = "http://127.0.0.1:8000/api";

export const apiService = {
  // 🔹 دالة عامة للـ fetch
  async fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
      });
      if (!response.ok) {
        console.warn(`⚠️ API error: ${endpoint}, status: ${response.status}`);
        return [] as unknown as T;
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      return [] as unknown as T;
    }
  },

  // 🔹 جلب عنصر حسب نوعه
  // apiService.ts
async getItem(type: RateableType, id: number): Promise<any> {
  const endpointMap: Record<RateableType, string> = {
    hotel: "hotels",
    restaurant: "restaurants",
    playground: "playgrounds",
    tour: "tours",
    event_hall: "event-halls",
  };
  const endpoint = endpointMap[type];
  return this.fetchData<any>(`/${endpoint}?id=${id}`);
},





  // 🔹 جلب رحلة مع أماكن التوقف
async getTourStops(tourId: number): Promise<TourStop[]> {
  try {
    const res = await fetch(`${BASE_URL}/tours/stops?tour_id=${tourId}`);
    if (!res.ok) return [];
    const data = await res.json();

    // ✅ جلب stops من الـ object مباشرة
    return Array.isArray(data.stops) ? data.stops : [];
  } catch (err) {
    console.error("❌ Failed to fetch tour stops:", err);
    return [];
  }
},



  // 🔹 جلب تقييم عنصر
  async getAverageRating(type: RateableType, id: number): Promise<number> {
    try {
      const response = await fetch(`${BASE_URL}/rating/average?type=${type}&id=${id}`);
      if (!response.ok) return 0;
      const data: AverageRatingResponse = await response.json();
      return Math.round(Number(data.average_rating) * 10) / 10 || 0;
    } catch {
      return 0;
    }
  },

  // 🔹 جلب تقييمات مجموعة عناصر
  async getBatchRatings(items: Array<{ type: RateableType; id: number }>): Promise<Record<string, number>> {
    const ratings: Record<string, number> = {};
    await Promise.all(
      items.map(async (item) => {
        try {
          const rating = await this.getAverageRating(item.type, item.id);
          ratings[`${item.type}_${item.id}`] = rating;
        } catch {
          ratings[`${item.type}_${item.id}`] = 0;
        }
      })
    );
    return ratings;
  },

  // 🔹 جلب التعليقات
  async getComments(type: RateableType, id: number): Promise<Comment[]> {
    return this.fetchData<Comment[]>(`/comments?type=${type}&id=${id}`);
  },

  // 🔹 جلب جميع العناصر (فنادق، مطاعم، ملاعب، رحلات، صالات)
  async getHotels(query = ""): Promise<Hotel[]> {
    return this.fetchData<Hotel[]>(query ? `/hotels?search=${query}` : "/hotels");
  },
  async getRestaurants(query = ""): Promise<Restaurant[]> {
    return this.fetchData<Restaurant[]>(query ? `/restaurants?search=${query}` : "/restaurants");
  },
  async getPlaygrounds(query = ""): Promise<PlayGround[]> {
    return this.fetchData<PlayGround[]>(query ? `/playgrounds?search=${query}` : "/playgrounds");
  },
  async getTours(query = ""): Promise<Tour[]> {
    return this.fetchData<Tour[]>(query ? `/tours?search=${query}` : "/tours");
  },
  async getEventHalls(query = ""): Promise<EventHall[]> {
    return this.fetchData<EventHall[]>(query ? `/event-halls?search=${query}` : "/event-halls");
  },
};

