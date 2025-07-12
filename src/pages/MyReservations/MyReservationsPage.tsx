import React, { useState, useEffect, useMemo } from 'react';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/header';
import type { UserReservationsResponse, ReservationType } from '../../types';
import EventHallReservationCard from '../Reservations/EventsHallReservation/EventHallReservationCard';
import HotelReservationCard from '../Reservations/HotelsReservation/HotelReservationCard';
import PlaygroundReservationCard from '../Reservations/PlayGroundsReservation/PlaygroundReservationCard';
import TourReservationCard from '../Reservations/ToursReservation/TourReservationCard';
import RestaurantReservationCard from '../Reservations/RestaurantsReservation/RestaurantReservationCard';

const mockUserReservations: UserReservationsResponse['data'] = {
  hotel_reservations: [
    { reservation_id: 1, hotel_name: "فندق غراند بلازا", room_number: 301, floor: 3, start_date: "2025-08-15", nights: 3, payment_method: 'credit_card', status: 'confirmed' },
    { reservation_id: 2, hotel_name: "منتجع أزور باي", room_number: 110, floor: 1, start_date: "2025-07-20", nights: 5, payment_method: 'cash', status: 'done' },
  ],
  restaurant_reservations: [
    { id: 101, restaurant_id: 301, restaurant_en_title: 'Naranj Dimashq', restaurant_ar_title: 'نارنج دمشق', reservation_time: '2025-08-10 20:00', guests: 4, area_type: 'indoor_hall', status: 'confirmed' },
    { id: 102, restaurant_id: 302, restaurant_en_title: 'La Piazza', restaurant_ar_title: 'لا بياتزا', reservation_time: '2025-06-30 19:30', guests: 2, area_type: null, status: 'cancelled' },
  ],
  tour_reservations: [
    { id: 201, user_id: 1, tour_id: 10, coupons_id: null, guests: 2, price: 150, final_price: 150, payment_method: 'paypal', status: 'confirmed', start_date: '2025-09-01', end_date: '2025-09-07', discount_applied: false, created_at: '2025-08-01T10:00:00Z', updated_at: '2025-08-01T10:00:00Z' }
  ],
  play_ground_reservations: [
    { id: 301, user_id: 1, play_ground_id: 401, coupons_id: null, reservation_date: '2025-08-22', reservation_time: '18:00-20:00', payment_method: 'cash', price: 200, final_price: 200, status: 'confirmed', discount_applied: false, created_at: '2025-08-05T14:00:00Z', updated_at: '2025-08-05T14:00:00Z' }
  ],
  event_hall_reservations: [
     { id: 401, user_id: 1, event_hall_id: 201, coupons_id: null, event_type: 'wedding', reservation_date: '2025-10-05', reservation_time: '20:00-02:00', guests: 250, price: 4500, final_price: 4500, discount_applied: false, payment_method: 'credit_card', status: 'rejected', created_at: '2025-07-15T11:00:00Z', updated_at: '2025-07-16T11:00:00Z' }
  ]
};


const TABS: { id: ReservationType | 'all'; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'hotels', label: 'الفنادق' },
  { id: 'restaurants', label: 'المطاعم' },
  { id: 'tours', label: 'الرحلات' },
  { id: 'playgrounds', label: 'الملاعب' },
  { id: 'event_halls', label: 'القاعات' },
];

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<UserReservationsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReservationType | 'all'>('all');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setReservations(mockUserReservations);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancelReservation = (type: string, id: number) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟")) return;
    
    alert("تم إلغاء بنجاح.");
    
    setReservations(prev => {
        if (!prev) return null;
        
        let key: keyof UserReservationsResponse['data'] | null = null;
        switch(type) {
            case 'hotel': key = 'hotel_reservations'; break;
            case 'restaurant': key = 'restaurant_reservations'; break;
            case 'tour': key = 'tour_reservations'; break;
            case 'playground': key = 'play_ground_reservations'; break;
            case 'event_hall': key = 'event_hall_reservations'; break;
        }

        if (!key) return prev;
        
        const updatedList = prev[key]?.filter(r => (r.id ?? r.reservation_id) !== id);
        
        return { ...prev, [key]: updatedList };
    });
  };

  const displayedReservations = useMemo(() => {
    if (!reservations) return [];
    
    const all = [
        ...(reservations.hotel_reservations?.map(r => ({ ...r, type: 'hotel' as const, sort_date: r.start_date })) || []),
        ...(reservations.restaurant_reservations?.map(r => ({ ...r, type: 'restaurant' as const, sort_date: r.reservation_time })) || []),
        ...(reservations.tour_reservations?.map(r => ({ ...r, type: 'tour' as const, sort_date: r.start_date })) || []),
        ...(reservations.play_ground_reservations?.map(r => ({ ...r, type: 'playground' as const, sort_date: r.reservation_date })) || []),
        ...(reservations.event_hall_reservations?.map(r => ({ ...r, type: 'event_hall' as const, sort_date: r.reservation_date })) || []),
    ];
    
    if (activeTab === 'all') {
      return all.sort((a, b) => new Date(b.sort_date).getTime() - new Date(a.sort_date).getTime());
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
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => ( <div key={i} className="bg-gray-800/50 p-5 rounded-lg h-36 animate-pulse"></div> ))}
        </div>
      );
    }
    if (error) return <p className="text-center text-red-400 text-lg">{error}</p>;
    if (displayedReservations.length === 0) return <p className="text-center text-gray-400 text-lg">لا توجد حجوزات لعرضها في هذا القسم.</p>;

    return (
      <div className="space-y-5">
        {displayedReservations.map((res: any) => {
          switch (res.type) {
            case 'hotel': return <HotelReservationCard key={`hotel-${res.reservation_id}`} reservation={res} onCancel={() => handleCancelReservation('hotel', res.reservation_id)} />;
            case 'restaurant': return <RestaurantReservationCard key={`restaurant-${res.id}`} reservation={res} onCancel={() => handleCancelReservation('restaurant', res.id)} />;
            case 'tour': return <TourReservationCard key={`tour-${res.id}`} reservation={res} onCancel={() => handleCancelReservation('tour', res.id)} />;
            case 'playground': return <PlaygroundReservationCard key={`playground-${res.id}`} reservation={res} onCancel={() => handleCancelReservation('playground', res.id)} />;
            case 'event_hall': return <EventHallReservationCard key={`event_hall-${res.id}`} reservation={res} onCancel={() => handleCancelReservation('event_hall', res.id)} />;
            default: return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <main className="max-w-5xl mx-auto py-28 px-4">
        <h1 className="text-4xl font-extrabold text-center mb-4">حجوزاتي</h1>
        <p className="text-center text-gray-400 mb-12">إدارة وتتبع جميع حجوزاتك في مكان واحد.</p>
        
        <div className="mb-8 flex justify-center flex-wrap gap-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`cursor-pointer px-5 py-2 font-semibold rounded-full transition-colors duration-300 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`} >
              {tab.label}
            </button>
          ))}
        </div>
        
        {renderContent()}

      </main>
      <Footer />
    </div>
  );
};

export default MyReservationsPage;