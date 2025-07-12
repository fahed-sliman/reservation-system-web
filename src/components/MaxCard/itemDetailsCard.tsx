
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

import type { RateableType, Hotel, Restaurant, EventHall, PlayGround, Tour } from '../../types';
import ItemDetailsCardSkeleton from './ItemDetailsCardSkeleton';
import ReserveEventHallForm from '../../pages/Reservations/EventsHallReservation/ReserveEventHallForm';
import ReservePlaygroundForm from '../../pages/Reservations/PlayGroundsReservation/ReservePlaygroundForm';
import ReserveRestaurantForm from '../../pages/Reservations/RestaurantsReservation/ReservationRestaurantsForm';
import ReserveTourForm from '../../pages/Reservations/ToursReservation/ReservationTourForm';


type CardItem = Hotel | Restaurant | EventHall | PlayGround | Tour;

interface ItemDetailsCardProps {
  item?: CardItem;
  type: RateableType;
  loading: boolean;
  onBookHotelClick?: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => ( <div className="flex items-start gap-3 text-lg"> <span className="text-orange-400 text-2xl mt-1">{icon}</span> <div> <span className="text-gray-400 block text-sm">{label}</span> <span className="text-white font-semibold">{value}</span> </div> </div> );

const ItemDetailsCard: React.FC<ItemDetailsCardProps> = ({ item, type, loading, onBookHotelClick }) => {
  const [isEventHallModalVisible, setIsEventHallModalVisible] = useState(false);
  const [isPlaygroundModalVisible, setIsPlaygroundModalVisible] = useState(false);
  const [isRestaurantModalVisible, setIsRestaurantModalVisible] = useState(false);
  const [isTourModalVisible, setIsTourModalVisible] = useState(false);

  if (loading || !item) {
    return <ItemDetailsCardSkeleton />;
  }
  
  // ✅ تحديث دالة الحجز لتفريق المعاملة بناءً على النوع
  const handleBookingClick = () => {
    // إذا كان النوع فندقاً والدالة موجودة، قم بتنفيذها
    if (type === 'hotel' && onBookHotelClick) {
      onBookHotelClick();
      return; // إنهاء الدالة هنا لمنع فتح النوافذ الأخرى
    }
    
    // المنطق القديم لبقية الأنواع
    if (type === 'event_hall') {
      setIsEventHallModalVisible(true);
    } else if (type === 'playground') {
      setIsPlaygroundModalVisible(true);
    } else if (type === 'restaurant') {
      setIsRestaurantModalVisible(true);
    } else if (type === 'tour') {
      setIsTourModalVisible(true);
    }
  };

  const renderStatus = () => { if (!('is_closed' in item)) return null; const today = new Date(); today.setHours(0, 0, 0, 0); const from = item.closed_from ? new Date(item.closed_from) : null; const until = item.closed_until ? new Date(item.closed_until) : null; from?.setHours(0, 0, 0, 0); until?.setHours(0, 0, 0, 0); const isCurrentlyClosed = from && until ? (today >= from && today <= until) : item.is_closed; if (isCurrentlyClosed) { return ( <div className="bg-red-500/10 text-red-400 font-bold px-4 py-3 rounded-lg flex items-center gap-3 text-lg"> <span>❌</span> مغلق حالياً {item.closed_from && item.closed_until && ` (من ${item.closed_from} إلى ${item.closed_until})`} </div> ); } return ( <div className="bg-green-500/10 text-green-400 font-bold px-4 py-3 rounded-lg flex items-center gap-3 text-lg"> <span>✅</span> مفتوح الآن </div> ); };

  return (
    <>
      <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2">
            <img src={item.image ?? '/default-image.png'} alt={item.en_title} className="w-full h-64 md:h-full object-cover" />
          </div>
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">{item.en_title}</h1>
              <h2 className="text-2xl font-semibold text-gray-300">{item.ar_title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-6 border-y border-gray-700">
                {'ar_location' in item && <InfoRow icon="📍" label="الموقع" value={item.ar_location} />}
                {'location' in item && <InfoRow icon="📍" label="الموقع" value={item.location} />}
                {'capacity' in item && <InfoRow icon="👥" label="السعة" value={`${item.capacity} شخص`} />}
                {'price' in item && <InfoRow icon="💵" label="السعر" value={`$${item.price.toFixed(2)}`} />}
                {'sport' in item && <InfoRow icon="🏅" label="الرياضة" value={item.sport} />}
                {'start_date' in item && <InfoRow icon="🗓️" label="يبدأ في" value={item.start_date} />}
                {'end_date' in item && <InfoRow icon="🗓️"label="ينتهي في" value={item.end_date} />}
            </div>
            <div className="my-6">{renderStatus()}</div>
            {'ar_description' in item && (
              <div className="text-gray-300 text-lg leading-relaxed mt-2">
                <h3 className="text-xl font-bold text-orange-400 mb-2">الوصف</h3>
                <p>{item.ar_description}</p>
              </div>
            )}
            <div className=" mt-auto pt-8">
              <button onClick={handleBookingClick} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-full text-xl shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105">
                احجز الآن
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* النوافذ المنبثقة للحجوزات (Modals) */}
      {isEventHallModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"> <div className="flex justify-between items-center p-5 border-b border-gray-700"><h3 className="text-xl font-bold text-white">نموذج حجز: {item.en_title}</h3><button onClick={() => setIsEventHallModalVisible(false)} className="text-gray-500 hover:text-white"><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveEventHallForm eventHallId={item.id} onClose={() => setIsEventHallModalVisible(false)} /></div> </div> </div> )}
      {isPlaygroundModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"> <div className="flex justify-between items-center p-5 border-b border-gray-700"><h3 className="text-xl font-bold text-white">نموذج حجز: {item.en_title}</h3><button onClick={() => setIsPlaygroundModalVisible(false)} className="text-gray-500 hover:text-white"><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReservePlaygroundForm playGroundId={item.id} onClose={() => setIsPlaygroundModalVisible(false)} /></div> </div> </div> )}
      {isRestaurantModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"> <div className="flex justify-between items-center p-5 border-b border-gray-700"><h3 className="text-xl font-bold text-white">حجز طاولة في: {item.en_title}</h3><button onClick={() => setIsRestaurantModalVisible(false)} className="text-gray-500 hover:text-white"><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveRestaurantForm restaurantId={item.id} onClose={() => setIsRestaurantModalVisible(false)} /></div> </div> </div> )}
      {isTourModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"> <div className="flex justify-between items-center p-5 border-b border-gray-700"><h3 className="text-xl font-bold text-white">الانضمام إلى رحلة: {item.en_title}</h3><button onClick={() => setIsTourModalVisible(false)} className="text-gray-500 hover:text-white"><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveTourForm tourId={item.id} onClose={() => setIsTourModalVisible(false)} /></div> </div> </div> )}
    </>
  );
};

export default ItemDetailsCard;