import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import type { HotelRoom } from '../../types';
import ReserveHotelForm from '../../pages/Reservations/HotelsReservation/ReserveHotelForm';



interface RoomCardProps {
  room: HotelRoom;
  hotelId: number; 
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hotelId }) => {
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  const handleBookClick = () => {
    setIsBookingModalVisible(true);
  };

  return (
    <>
      <div className="bg-gray-800/80 p-5 rounded-lg border border-gray-700 flex flex-col sm:flex-row items-center gap-5 transition-all hover:border-orange-500/50 hover:bg-gray-800">
        <div className="flex-shrink-0 text-orange-400 text-5xl">🛌</div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">{room.type}</h3>
          <p className="text-gray-400">
            الطابق: {room.floor} | رقم الغرفة: {room.room_number} | تتسع لـِ {room.capacity} أفراد
          </p>
          <p className="text-gray-500 text-sm mt-1">{room.description}</p>
        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0 text-center sm:text-right">
          <p className="text-2xl font-bold text-orange-500">${room.price_per_night}<span className="text-sm text-gray-400">/الليلة</span></p>
          <button
            onClick={handleBookClick}
            className="cursor-pointer mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
          >
            احجز الآن
          </button>
        </div>
      </div>

      {/* *** إضافة: النافذة المنبثقة (Modal) لنموذج الحجز *** */}
      {isBookingModalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-700 flex-shrink-0">
                <h3 className="text-xl font-bold text-white">حجز غرفة: {room.type} (رقم {room.room_number})</h3>
                <button onClick={() => setIsBookingModalVisible(false)} className="text-gray-500 hover:text-white transition-colors">
                    <FaTimes size={20} />
                </button>
            </div>
            {/* حاوية قابلة للتمرير للنموذج نفسه */}
            <div className="overflow-y-auto p-6 md:p-8">
              <ReserveHotelForm
                hotelId={hotelId} 
                roomNumber={room.room_number}
                onClose={() => setIsBookingModalVisible(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;