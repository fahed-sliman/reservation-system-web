import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/Footer';
import RoomCard from '../../components/HotelsRoom/RoomCard';
import RoomCardSkeleton from '../../components/HotelsRoom/RoomCardSkeleton';

// ✅ 1. استيراد السياقات
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface ApiHotel {
    id: number;
    ar_title: string;
    en_title: string;
}

interface ApiRoom {
    id: number;
    hotel_id: number;
    floor: number;
    room_number: number;
    image: string;
    type: string;
    capacity: number;
    price_per_night: string;
    description: string;
}

// ✅ 2. تعريف كائن الترجمات
const translations = {
  ar: {
    availableRoomsAt: "الغرف المتوفرة في",
    noRoomsAvailable: "لا توجد غرف متاحة في هذا الفندق حالياً.",
    errorTitle: "حدث خطأ",
    backToHotels: "العودة إلى قائمة الفنادق",
    hotelNotFound: (id: string) => `الفندق بالمعرف ${id} غير موجود`,
    failedToFetch: "فشل في جلب بيانات الفندق",
  },
  en: {
    availableRoomsAt: "Available Rooms at",
    noRoomsAvailable: "There are currently no available rooms in this hotel.",
    errorTitle: "An Error Occurred",
    backToHotels: "Back to Hotels List",
    hotelNotFound: (id: string) => `Hotel with ID ${id} not found`,
    failedToFetch: "Failed to fetch hotel data",
  },
};

const HotelRoomsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { theme } = useTheme();

  // تعريف دالة الترجمة
  const t = useCallback((key: keyof typeof translations['en'], options?: { id?: string }) => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return (translation as (id: string) => string)(options!.id!);
    }
    return translation;
  }, [language]);

  const [hotel, setHotel] = useState<ApiHotel | null>(null);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/hotels/rooms?hotel_id=${id}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || t('hotelNotFound', { id }));
        }
        const data = await res.json();

        if (data.success) {
          setHotel(data.hotel);
          setRooms(data.rooms);
        } else {
          throw new Error(t('failedToFetch'));
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelRooms();
  }, [id, t]);

  if (loading) {
    return (
        <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Header/>
            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className={`h-10 rounded w-3/4 mb-10 animate-pulse mx-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="space-y-8">
                    {Array(3).fill(0).map((_, i) => <RoomCardSkeleton key={i} />)}
                </div>
            </main>
            <Footer/>
        </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen text-center flex flex-col items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-500">{t('errorTitle')}</h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
            <Link to="/hotels" className="mt-6 text-orange-400 hover:underline">{t('backToHotels')}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('availableRoomsAt')}
            </h1>
            <h2 className="text-orange-400 text-3xl md:text-4xl font-bold mt-2">
                {language === 'ar' ? hotel?.ar_title : hotel?.en_title}
            </h2>
        </div>

        {rooms.length > 0 ? (
          <div className="space-y-8">
            {rooms.map(room => <RoomCard key={room.id} room={room} hotelId={hotel!.id} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('noRoomsAvailable')}</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HotelRoomsPage;