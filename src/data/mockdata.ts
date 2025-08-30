// src/data/mockdata.ts

// استيراد الأنواع المطلوبة
import type {
  Category,
  Hotel,
  EventHall,
  PlayGround,
  Restaurant,
  Tour,
  RatingInfo,
  TourStop,
} from "../types";

// 1. البيانات الوهمية للفئات (mockCategories) - تم الإبقاء عليها مع التأكد من جودة الصور
export const mockCategories: Category[] = [
  {
    id: 1,
    ar_title: "فنادق فاخرة",
    en_title: "Luxury Hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1350&q=80",
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
  {
    id: 2,
    ar_title: "قاعات مناسبات",
    en_title: "Event Halls",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1350&q=80https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1350&q=80",
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
  {
    id: 3,
    ar_title: "مطاعم مميزة",
    en_title: "Top Restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1350&q=80",
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
  {
    id: 4,
    ar_title: "ملاعب رياضية",
    en_title: "Sports Playgrounds",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1350&q=80",
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
  {
    id: 5,
    ar_title: "رحلات سياحية",
    en_title: "Adventure Tours",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1350&q=80",
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
];

// --- بيانات مُحدثة ومتنوعة ---

const hotelsData: Hotel[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "FlagShip",
    ar_title: "فندق غراند بلازا",
    en_title: "The Grand Plaza Hotel",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?auto=format&fit=crop&w=1350&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    created_at: "2024-05-10",
    updated_at: "2025-06-20",
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Resort",
    ar_title: "منتجع أزور باي",
    en_title: "Azure Bay Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1350&q=80",
    ar_location: "اللاذقية",
    en_location: "Latakia",
    created_at: "2023-11-22",
    updated_at: "2025-05-15",
  },
  {
    id: 3,
    category_id: 1,
    category_name: "Boutique",
    ar_title: "نزل ماونتن فيو",
    en_title: "Mountain View Lodge",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1350&q=80",
    ar_location: "بلودان",
    en_location: "Bloudan",
    created_at: "2022-08-19",
    updated_at: "2025-04-30",
  },
];

const eventHallsData: EventHall[] = [
  {
    id: 201,
    category_id: 2,
    ar_title: "قاعة الكريستال للمناسبات",
    en_title: "The Crystal Ballroom",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1350&q=80",
    ar_location: "حلب",
    en_location: "Aleppo",
    capacity: 500,
    price: 4500,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2023-01-15",
    updated_at: "2025-06-01",
  },
  {
    id: 202,
    category_id: 2,
    ar_title: "جناح الحديقة",
    en_title: "The Garden Pavilion",
    image: "https://images.unsplash.com/photo-1604632889243-71a7a0279a4a?auto=format&fit=crop&w=1350&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    capacity: 250,
    price: 3000,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2024-03-01",
    updated_at: "2025-07-01",
  },
  {
    id: 203,
    category_id: 2,
    ar_title: "قاعة إيمار",
    en_title: "Emar Events Hall",
    image: "https://images.unsplash.com/photo-1532558623129-8752f2678546?auto=format&fit=crop&w=1350&q=80",
    ar_location: "حمص",
    en_location: "Homs",
    capacity: 350,
    price: 2800,
    is_closed: true,
    closed_from: "2025-08-01",
    closed_until: "2025-08-31",
    created_at: "2022-10-10",
    updated_at: "2025-02-10",
  },
];

const restaurantsData: Restaurant[] = [
  {
    id: 301,
    category_id: 3,
    ar_title: "مطعم نارنج دمشق",
    en_title: "Naranj Dimashq",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1350&q=80",
    location: "دمشق القديمة",
    capacity: 90,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2020-07-20",
    updated_at: "2025-06-25",
  },
  {
    id: 302,
    category_id: 3,
    ar_title: "كيوتو سوشي بار",
    en_title: "Kyoto Sushi Bar",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1350&q=80",
    location: "المالكي، دمشق",
    capacity: 40,
    is_closed: true,
    closed_from: "2025-01-20",
    closed_until: "2025-02-05",
    created_at: "2023-09-01",
    updated_at: "2025-05-01",
  },
  {
    id: 303, // أبقيت على 304 للحفاظ على التوافقية إذا كان هناك رابط قديم
    category_id: 3,
    ar_title: "لا بياتزا",
    en_title: "La Piazza",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1350&q=80",
    location: "حلب",
    capacity: 150,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2021-03-15",
    updated_at: "2025-07-10",
  },
];

const playgroundsData: PlayGround[] = [
  {
    id: 400,
    category_id: 4,
    ar_title: "مدينة الفيحاء الرياضية",
    en_title: "Al-Fayhaa Sports City",
    image: "https://images.unsplash.com/photo-1526233527920-5342833f2828?auto=format&fit=crop&w=1350&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    price: 150,
    capacity: 1000,

    is_closed: true,
    closed_from: '2025-2-2',
    closed_until: '2026-1-1',
    created_at: "2018-01-01",
    updated_at: "2025-01-01",
    sport: "Football"
  },
  {
    id: 401,
    category_id: 4,
    ar_title: "ذا هوبس فاكتوري",
    en_title: "The Hoops Factory",
    image: "https://images.unsplash.com/photo-1561494225-54cafd8042a4?auto=format&fit=crop&w=1350&q=80",
    ar_location: "حلب",
    en_location: "Aleppo",
    price: 200,
    capacity: 50,

    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2022-06-01",
    updated_at: "2025-03-01",
    sport: "Football"
  },
  {
    id: 402,
    category_id: 4,
    ar_title: "نادي دمشق للتنس",
    en_title: "Damascus Tennis Club",
    image: "https://images.unsplash.com/photo-1559319243-c0d381543313?auto=format&fit=crop&w=1350&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    price: 100,
    capacity: 20,

    is_closed: true,
    closed_from: "2024-12-15",
    closed_until: "2025-01-15",
    created_at: "2020-09-10",
    updated_at: "2024-11-01",
    sport: "Football"
  },
];

const toursData: Tour[] = [
  {
    id: 10,
    category_id: 5,
    ar_title: "جولة تاريخية في دمشق القديمة",
    en_title: "Historical Tour of Old Damascus",
    ar_description: "استكشف أزقة وأسواق دمشق القديمة، وزُر الجامع الأموي وقصر العظم.",
    en_description: "Explore the alleys and markets of Old Damascus, visit the Umayyad Mosque and Azm Palace.",
    image: "https://images.unsplash.com/photo-1569429452839-3804a6547e70?auto=format&fit=crop&w=1350&q=80",
    price: 75.0,
    start_date: "2025-09-01",
    end_date: "2025-09-07",
    created_at: "2025-02-01",
    updated_at: "2025-06-15",
  },
  {
    id: 11,
    category_id: 5,
    ar_title: "مغامرة في صحراء تدمر",
    en_title: "Palmyra Desert Adventure",
    ar_description: "رحلة تخييم لمشاهدة النجوم واستكشاف آثار مدينة تدمر العريقة.",
    en_description: "A camping trip to watch the stars and explore the ruins of the ancient city of Palmyra.",
    image: "https://images.unsplash.com/photo-1588435833243-a675d045231c?auto=format&fit=crop&w=1350&q=80",
    price: 250.5,
    start_date: "2025-10-15",
    end_date: "2025-10-20",
    created_at: "2025-03-10",
    updated_at: "2025-07-05",
  },
  {
    id: 12,
    category_id: 5,
    ar_title: "استجمام على الساحل السوري",
    en_title: "Syrian Coast Relaxation",
    ar_description: "استمتع بشواطئ اللاذقية الرملية وتذوق المأكولات البحرية الطازجة.",
    en_description: "Enjoy the sandy beaches of Latakia and taste fresh seafood.",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1350&q=80",
    price: 180.0,
    start_date: "2025-08-05",
    end_date: "2025-08-12",
    created_at: "2025-01-20",
    updated_at: "2025-05-20",
  },
];

// 2. البيانات الوهمية للعناصر المميزة (mockFeaturedItems)
// يتم الآن استخدام البيانات المنفصلة لضمان التناسق
export const mockFeaturedItems = {
  1: hotelsData,
  2: eventHallsData,
  3: restaurantsData,
  4: playgroundsData,
  5: toursData,
};

// 3. البيانات الوهمية للتقييمات (mockRatings) - مع IDs فريدة
export const mockRatings: RatingInfo[] = [
  // Ratings for Hotels
  { id: 1, rateable_type: "hotel", rateable_id: 1, rating: 4.8, comment: "خدمة رائعة وموقع ممتاز.", user_id: 1, created_at: "2025-06-29T12:00:00Z", updated_at: "2025-06-29T12:00:00Z" },
  { id: 102, rateable_type: "hotel", rateable_id: 2, rating: 4.5, comment: "المنتجع جميل جداً ولكن الأسعار مرتفعة قليلاً.", user_id: 102, created_at: "2025-06-28T10:00:00Z", updated_at: "2025-06-28T10:00:00Z" },
  { id: 103, rateable_type: "hotel", rateable_id: 3, rating: 5, comment: "هدوء وإطلالة ساحرة، تجربة لا تنسى.", user_id: 103, created_at: "2025-07-01T15:30:00Z", updated_at: "2025-07-01T15:30:00Z" },
  
  // Ratings for Event Halls
  { id: 201, rateable_type: "event_hall", rateable_id: 201, rating: 5, comment: "قاعة فخمة جداً وتنظيم مثالي.", user_id: 104, created_at: "2025-05-20T18:00:00Z", updated_at: "2025-05-20T18:00:00Z" },
  { id: 202, rateable_type: "event_hall", rateable_id: 202, rating: 4.2, comment: "المكان جميل ومناسب لحفل في الهواء الطلق.", user_id: 105, created_at: "2025-07-02T11:00:00Z", updated_at: "2025-07-02T11:00:00Z" },
  
  // Ratings for Restaurants
  { id: 301, rateable_type: "restaurant", rateable_id: 301, rating: 4.9, comment: "أكل شرقي أصيل وأجواء رائعة.", user_id: 101, created_at: "2025-06-15T20:00:00Z", updated_at: "2025-06-15T20:00:00Z" },
  { id: 302, rateable_type: "restaurant", rateable_id: 302, rating: 4.6, comment: "أفضل سوشي في المدينة!", user_id: 102, created_at: "2025-06-10T21:00:00Z", updated_at: "2025-06-10T21:00:00Z" },
  { id: 303, rateable_type: "restaurant", rateable_id: 304, rating: 4.4, comment: "البيتزا كانت لذيذة والخدمة سريعة.", user_id: 103, created_at: "2025-07-05T13:00:00Z", updated_at: "2025-07-05T13:00:00Z" },
  
  // Ratings for Playgrounds
  { id: 401, rateable_type: "playground", rateable_id: 401, rating: 4.0, comment: "ملعب ممتاز ولكن يحتاج لمزيد من الاهتمام بالإنارة.", user_id: 104, created_at: "2025-06-01T19:00:00Z", updated_at: "2025-06-01T19:00:00Z" },
  
  // Ratings for Tours
  { id: 501, rateable_type: "tour", rateable_id: 10, rating: 5, comment: "المرشد السياحي كان مذهلاً والجولة غنية بالمعلومات.", user_id: 105, created_at: "2025-09-08T16:00:00Z", updated_at: "2025-09-08T16:00:00Z" },
  { id: 502, rateable_type: "tour", rateable_id: 12, rating: 4.7, comment: "", user_id: 101, created_at: "2025-08-13T09:00:00Z", updated_at: "2025-08-13T09:00:00Z" },
];

// --- تصدير البيانات المنفصلة لصفحات التفاصيل ---
export const mockRestaurants: Restaurant[] = restaurantsData;
export const mockEventHalls: EventHall[] = eventHallsData;
export const mockPlaygrounds: PlayGround[] = playgroundsData;
export const mockTours: Tour[] = toursData;
export const mockHotels: Hotel[] = hotelsData; // تم إضافة تصدير للفنادق
// (في نهاية ملف src/data/mockdata.ts)

import type { HotelRoom } from '../types'; // تأكد من استيراد النوع الجديد

export const mockHotelRooms: HotelRoom[] = [
  // Rooms for The Grand Plaza Hotel (hotel_id: 1)
  { id: 1001, hotel_id: 1, floor: 3, room_number: 301, type: "Standard Double", capacity: 2, price_per_night: 150, description: "غرفة مريحة مع إطلالة على المدينة.", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 1002, hotel_id: 1, floor: 3, room_number: 302, type: "Standard Double", capacity: 2, price_per_night: 150, description: "غرفة مريحة مع إطلالة على المدينة.", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 1003, hotel_id: 1, floor: 5, room_number: 505, type: "Deluxe Suite", capacity: 3, price_per_night: 280, description: "جناح فاخر مع منطقة جلوس منفصلة وخدمات مميزة.", created_at: "2024-01-01", updated_at: "2024-01-01" },
  
  // Rooms for Azure Bay Resort (hotel_id: 2)
  { id: 2001, hotel_id: 2, floor: 1, room_number: 110, type: "Sea View Chalet", capacity: 4, price_per_night: 450, description: "شاليه واسع مع تراس خاص يطل مباشرة على البحر.", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2002, hotel_id: 2, floor: 2, room_number: 220, type: "Family Room", capacity: 5, price_per_night: 350, description: "غرفة عائلية مع سريرين كبيرين.", created_at: "2024-01-01", updated_at: "2024-01-01" },

  // Rooms for Mountain View Lodge (hotel_id: 3)
  { id: 3001, hotel_id: 3, floor: 1, room_number: 1, type: "Cozy Cabin", capacity: 2, price_per_night: 220, description: "كوخ خشبي دافئ مع مدفأة وإطلالة جبلية خلابة.", created_at: "2024-01-01", updated_at: "2024-01-01" },
];
export const mockTourStops: TourStop[] = [
  // محطات للرحلة رقم 10 (Historical Tour of Old Damascus)
  {
    id: 1,
    tour_id: 10,
    sequence: 1,
    ar_title: "الجامع الأموي الكبير",
    en_title: "The Great Umayyad Mosque",
    image: "https://images.unsplash.com/photo-1627894522646-f03a25396532?auto=format&fit=crop&w=1200&q=80",
    ar_description: "زيارة أحد أقدم وأقدس المساجد في العالم، والتمتع بروعة العمارة الإسلامية والتاريخ العريق الذي يرويه كل ركن فيه.",
    en_description: "Visit one of the oldest and holiest mosques in the world, and enjoy the splendor of Islamic architecture and the ancient history that every corner tells.",
    created_at: "2025-02-01",
    updated_at: "2025-06-15",
  },
  {
    id: 2,
    tour_id: 10,
    sequence: 2,
    ar_title: "قصر العظم",
    en_title: "Azm Palace",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Azm_Palace_courtyard_Damascus.jpg",
    ar_description: "استكشاف نموذج رائع للعمارة الدمشقية التقليدية في القرن الثامن عشر. يضم القصر حاليًا متحف الفنون والتقاليد الشعبية.",
    en_description: "Explore a magnificent example of 18th-century traditional Damascene architecture. The palace now houses the Museum of Arts and Popular Traditions.",
    created_at: "2025-02-01",
    updated_at: "2025-06-15",
  },
  {
    id: 3,
    tour_id: 10,
    sequence: 3,
    ar_title: "سوق الحميدية",
    en_title: "Al-Hamidiyah Souq",
    image: "https://images.unsplash.com/photo-1596701957297-c1a7b416e3d8?auto=format&fit=crop&w=1200&q=80",
    ar_description: "جولة حرة في أكبر وأشهر أسواق دمشق المسقوفة، وشراء الهدايا التذكارية وتذوق البوظة الدمشقية الشهيرة.",
    en_description: "A free tour in the largest and most famous covered market in Damascus, shopping for souvenirs and tasting the famous Damascene ice cream.",
    created_at: "2025-02-01",
    updated_at: "2025-06-15",
  },

  // محطات للرحلة رقم 11 (Palmyra Desert Adventure)
  {
    id: 4,
    tour_id: 11,
    sequence: 1,
    ar_title: "استكشاف الآثار الرئيسية",
    en_title: "Exploring the Main Ruins",
    image: "https://images.unsplash.com/photo-1593976378129-453621118987?auto=format&fit=crop&w=1200&q=80",
    ar_description: "جولة مع مرشد متخصص لاستكشاف أهم معالم تدمر الأثرية مثل قوس النصر ومعبد بل.",
    en_description: "A guided tour to explore the most important archaeological sites of Palmyra, such as the Arch of Triumph and the Temple of Bel.",
    created_at: "2025-03-10",
    updated_at: "2025-07-05",
  },
];