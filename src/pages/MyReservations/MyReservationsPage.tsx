import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '../../layout/Layout';
import type { UserReservationsResponse, ReservationType } from '../../types';
import EventHallReservationCard from '../Reservations/EventsHallReservation/EventHallReservationCard';
import HotelReservationCard from '../Reservations/HotelsReservation/HotelReservationCard';
import PlaygroundReservationCard from '../Reservations/PlayGroundsReservation/PlaygroundReservationCard';
import TourReservationCard from '../Reservations/ToursReservation/TourReservationCard';
import RestaurantReservationCard from '../Reservations/RestaurantsReservation/RestaurantReservationCard';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// API Endpoints
const API_ENDPOINTS = {
  reservations: 'http://127.0.0.1:8000/api/reservations',
};

// الترجمة
const translations = {
  ar: {
    pageTitle: "حجوزاتي",
    pageDescription: "إدارة وتتبع جميع حجوزاتك في مكان واحد.",
    tabAll: "الكل",
    tabHotels: "الفنادق",
    tabRestaurants: "المطاعم",
    tabTours: "الرحلات",
    tabPlaygrounds: "الملاعب",
    tabEventHalls: "القاعات",
    noReservations: "لا توجد حجوزات لعرضها في هذا القسم.",
    cancelConfirm: "تم إرسال طلب الإلغاء.",
    cancelSuccess: "تم إلغاء الحجز بنجاح.",
    cancelError: "حدث خطأ أثناء إلغاء الحجز.",
    fetchError: "حدث خطأ أثناء جلب حجوزاتك.",
    unauthorized: "الرجاء تسجيل الدخول لعرض حجوزاتك.",
  },
  en: {
    pageTitle: "My Reservations",
    pageDescription: "Manage and track all your bookings in one place.",
    tabAll: "All",
    tabHotels: "Hotels",
    tabRestaurants: "Restaurants",
    tabTours: "Tours",
    tabPlaygrounds: "Playgrounds",
    tabEventHalls: "Event Halls",
    noReservations: "No reservations to display in this section.",
    cancelConfirm: "Cancel request sent.",
    cancelSuccess: "Reservation cancelled successfully.",
    cancelError: "An error occurred during cancellation.",
    fetchError: "An error occurred while fetching your reservations.",
    unauthorized: "Please log in to view your reservations.",
  },
};

const MyReservationsPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token, isAuthenticated } = useAuth();

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const TABS: { id: ReservationType | 'all'; label: string }[] = useMemo(
    () => [
      { id: 'all', label: t('tabAll') },
      { id: 'hotels', label: t('tabHotels') },
      { id: 'restaurants', label: t('tabRestaurants') },
      { id: 'tours', label: t('tabTours') },
      { id: 'playgrounds', label: t('tabPlaygrounds') },
      { id: 'event_halls', label: t('tabEventHalls') },
    ],
    [t]
  );

  const [reservations, setReservations] = useState<UserReservationsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReservationType | 'all'>('all');

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError(t('unauthorized'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
      const url = activeTab === 'all' ? `${API_ENDPOINTS.reservations}` : `${API_ENDPOINTS.reservations}?type=${activeTab}`;
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (res.ok) {
        setReservations(data.data);
      } else {
        setError(t('fetchError'));
        toast.error(t('fetchError'));
      }
    } catch (err) {
      console.error(err);
      setError(t('fetchError'));
      toast.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, t, activeTab]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

    const handleCancelReservation = async (type: string, id: number) => {
  if (!id || id === undefined) {
    toast.error('⚠️ خطأ: معرف الحجز غير موجود');
    return;
  }

  if (!isAuthenticated || !token) {
    toast.error(t('unauthorized'));
    return;
  }

  toast.promise(
    (async () => {
      const headers = { 
        Accept: 'application/json', 
        Authorization: `Bearer ${token}` 
      };

      const res = await fetch(
        `${API_ENDPOINTS.reservations}/cancel?type=${type}&id=${id}`, 
        { headers }
      );
      const data = await res.json();

      if (res.ok) {
        // ✅ نجاح: حدث قائمة الحجوزات
        setReservations(prev => {
          if (!prev) return null;
          const keyMap: Record<string, keyof UserReservationsResponse['data']> = {
            hotel: 'hotel_reservations',
            restaurant: 'restaurant_reservations',
            tour: 'tour_reservations',
            playground: 'play_ground_reservations',
            event_hall: 'event_hall_reservations',
          };
          const reservationKey = keyMap[type];
          const updatedList = prev[reservationKey]
            ?.filter(r => (r.id ?? r.reservation_id) !== id);
          return { ...prev, [reservationKey]: updatedList };
        });
        return data.message || t('cancelSuccess'); // 👈 نعرض رسالة السيرفر أو النص المترجم
      } else {
        // ❌ خطأ: نرمي رسالة السيرفر ليعرضها toast
        throw new Error(data.message || t('cancelError'));
      }
    })(),
    {
      loading: t('cancelConfirm'),
      success: (msg) => msg,     // 👈 يعرض النص اللي رجع من promise
      error:   (err) => err.message, // 👈 يعرض رسالة الخطأ الحقيقية من API
    }
  );
};


  const displayedReservations = useMemo(() => {
    if (!reservations) return [];
    
    const all = [
      ...(reservations.hotel_reservations?.map(r => ({ ...r, type: 'hotel' as const, display_id: r.reservation_id || r.id })).filter(r => r.display_id !== undefined) || []),
      ...(reservations.restaurant_reservations?.map(r => ({ ...r, type: 'restaurant' as const, display_id: r.id })).filter(r => r.display_id !== undefined) || []),
      ...(reservations.tour_reservations?.map(r => ({ ...r, type: 'tour' as const, display_id: r.id })).filter(r => r.display_id !== undefined) || []),
      ...(reservations.play_ground_reservations?.map(r => ({ ...r, type: 'playground' as const, display_id: r.id })).filter(r => r.display_id !== undefined) || []),
      ...(reservations.event_hall_reservations?.map(r => ({ ...r, type: 'event_hall' as const, display_id: r.id })).filter(r => r.display_id !== undefined) || []),
    ];

    if (activeTab === 'all') {
      return all.sort((a, b) => new Date(b.sort_date || b.start_date || b.reservation_date).getTime() - new Date(a.sort_date || a.start_date || a.reservation_date).getTime());
    }

    const typeMap: Record<ReservationType, string> = {
      hotels: 'hotel',
      restaurants: 'restaurant',
      tours: 'tour',
      playgrounds: 'playground',
      event_halls: 'event_hall'
    };
    return all.filter(r => r.type === typeMap[activeTab as ReservationType]);
  }, [reservations, activeTab]);

  const renderContent = () => {
    if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className={`p-5 rounded-lg h-36 animate-pulse ${theme==='dark'?'bg-gray-800/50':'bg-gray-200'}`}></div>)}</div>;
    if (error) return <p className="text-center text-red-400 text-lg">{error}</p>;
    if (displayedReservations.length === 0) return <p className={`text-center text-lg ${theme==='dark'?'text-gray-400':'text-gray-600'}`}>{t('noReservations')}</p>;

    return (
      <div className="space-y-5">
        {displayedReservations.map((res: any, index) => {
          const key = `${res.type}-${res.display_id}-${index}`;
          switch(res.type){
            case 'hotel': return <HotelReservationCard key={key} reservation={res} onCancel={() => handleCancelReservation('hotel', res.display_id)} />;
            case 'restaurant': return <RestaurantReservationCard key={key} reservation={res} onCancel={() => handleCancelReservation('restaurant', res.display_id)} />;
            case 'tour': return <TourReservationCard key={key} reservation={res} onCancel={() => handleCancelReservation('tour', res.display_id)} />;
            case 'playground': return <PlaygroundReservationCard key={key} reservation={res} onCancel={() => handleCancelReservation('playground', res.display_id)} />;
            case 'event_hall': return <EventHallReservationCard key={key} reservation={res} onCancel={() => handleCancelReservation('event_hall', res.display_id)} />;
            default: return null;
          }
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-500 ${theme==='dark'?'bg-gray-900 text-white':'bg-gray-50 text-gray-900'}`}>
        <main className="max-w-5xl mx-auto py-28 px-4">
          <h1 className={`text-4xl font-extrabold text-center mb-4 ${theme==='dark'?'text-white':'text-gray-900'}`}>{t('pageTitle')}</h1>
          <p className={`text-center mb-12 ${theme==='dark'?'text-gray-400':'text-gray-600'}`}>{t('pageDescription')}</p>
          
          <div className="mb-8 flex justify-center flex-wrap gap-2">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`cursor-pointer px-5 py-2 font-semibold rounded-full transition-colors duration-300 ${activeTab===tab.id?'bg-orange-600 text-white shadow-lg':(theme==='dark'?'bg-gray-800 text-gray-300 hover:bg-gray-700':'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200')}`}>{tab.label}</button>
            ))}
          </div>

          {renderContent()}
        </main>
      </div>
    </Layout>
  );
};

export default MyReservationsPage;
