import React, { useState } from 'react';
import { FaTimes, FaUsers, FaBuilding, FaDoorOpen } from 'react-icons/fa';
import ReserveHotelForm from '../../pages/Reservations/HotelsReservation/ReserveHotelForm';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface ApiRoom {
    id: number;
    floor: number;
    room_number: number;
    image: string;
    type: string;
    capacity: number;
    price_per_night: string;
    description: string;
}

interface RoomCardProps {
  room: ApiRoom;
  hotelId: number; 
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hotelId }) => {
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const { language } = useLanguage();
  const { theme } = useTheme();

  const handleBookClick = () => setIsBookingModalVisible(true);
  
  const imageUrl = `http://127.0.0.1:8000/storage/${room.image}`;

  const translations = {
    guests: language === 'ar' ? 'أفراد' : 'Guests',
    floor: language === 'ar' ? 'الطابق' : 'Floor',
    roomNo: language === 'ar' ? 'غرفة رقم' : 'Room No',
    night: language === 'ar' ? 'الليلة' : 'night',
    bookNow: language === 'ar' ? 'احجز الآن' : 'Book Now',
    bookingRoom: language === 'ar' ? 'حجز غرفة:' : 'Booking Room:',
    no: language === 'ar' ? 'رقم' : 'No.',
  };

  return (
    <>
      <div 
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className={`group rounded-xl border overflow-hidden flex flex-col md:flex-row shadow-lg transition-all duration-300 hover:shadow-orange-500/10 ${
            theme === 'dark'
            ? 'bg-gray-800/60 border-gray-700 hover:border-orange-500/40'
            : 'bg-white border-gray-200 hover:border-orange-300'
        }`}
      >
        <div className="w-full md:w-2/5 h-60 md:h-auto flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={room.type} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        <div className="flex-grow flex flex-col p-6">
          <div className="flex-grow">
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{room.type}</h3>
            <p className={`mb-5 leading-relaxed text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{room.description}</p>
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3"><FaUsers className="text-orange-400 text-lg" /><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}><strong>{room.capacity}</strong> {translations.guests}</span></div>
              <div className="flex items-center gap-3"><FaBuilding className="text-orange-400 text-lg" /><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{translations.floor}: <strong>{room.floor}</strong></span></div>
              <div className="flex items-center gap-3"><FaDoorOpen className="text-orange-400 text-lg" /><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{translations.roomNo}: <strong>{room.room_number}</strong></span></div>
            </div>
          </div>
          <div className={`mt-auto pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-orange-500">${parseFloat(room.price_per_night).toFixed(2)}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/ {translations.night}</span>
            </div>
            <button onClick={handleBookClick} className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/40 transform hover:scale-105">{translations.bookNow}</button>
          </div>
        </div>
      </div>

      {isBookingModalVisible && (
        <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`flex justify-between items-center p-5 border-b flex-shrink-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{translations.bookingRoom} {room.type} ({translations.no} {room.room_number})</h3>
              <button onClick={() => setIsBookingModalVisible(false)} className={`transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}><FaTimes size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6 md:p-8"><ReserveHotelForm hotelId={hotelId} roomNumber={room.room_number} onClose={() => setIsBookingModalVisible(false)} /></div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;