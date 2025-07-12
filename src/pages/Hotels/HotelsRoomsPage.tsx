

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/Footer';
import RoomCard from '../../components/HotelsRoom/RoomCard';
import RoomCardSkeleton from '../../components/HotelsRoom/RoomCardSkeleton';
import { mockHotels, mockHotelRooms } from '../../data/mockdata';
import type { Hotel, HotelRoom } from '../../types';

const HotelRoomsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // استخدام "id" الذي تم جلبه من الرابط
      const currentHotel = mockHotels.find(h => h.id === Number(id)); 
      
      if (currentHotel) {
        setHotel(currentHotel);
        const hotelRooms = mockHotelRooms.filter(r => r.hotel_id === currentHotel.id);
        setRooms(hotelRooms);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]); // يجب أن تكون الاعتمادية هنا على "id"

  if (loading) {
    return (
        <div className="bg-gray-900 min-h-screen">
            <Header/>
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="h-12 bg-gray-700 rounded w-1/2 mb-10 animate-pulse"></div>
                <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => <RoomCardSkeleton key={i} />)}
                </div>
            </div>
            <Footer/>
        </div>
    );
  }

  if (!hotel) {
    return (
        <div className="bg-gray-900 min-h-screen text-white text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-500">الفندق غير موجود</h1>
            <p className="text-gray-400 mt-2">لم يتم العثور على فندق بالمعرف: {id}</p>
            <Link to="/hotels" className="mt-4 text-orange-400 hover:underline">العودة إلى قائمة الفنادق</Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <div className="relative h-[50vh] w-full">
        <img src={hotel.image || ''} alt={hotel.en_title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-extrabold text-white">{hotel.en_title}</h1>
          <p className="text-xl mt-2 text-gray-300">{hotel.ar_location}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-orange-400 mb-8 text-center">الغرف المتاحة</h2>
        {rooms.length > 0 ? (
          <div className="space-y-4">
            {rooms.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-xl">لا توجد غرف متاحة في هذا الفندق حالياً.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HotelRoomsPage;