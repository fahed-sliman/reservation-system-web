
import React, { useState, useEffect, useCallback } from "react";
import { FaTimes } from 'react-icons/fa';

import type { RateableType, TourStop } from "../../types";
import ItemDetailsCardSkeleton from "./ItemDetailsCardSkeleton";
import ReserveEventHallForm from "../../pages/Reservations/EventsHallReservation/ReserveEventHallForm";
import ReservePlaygroundForm from "../../pages/Reservations/PlayGroundsReservation/ReservePlaygroundForm";
import ReserveRestaurantForm from "../../pages/Reservations/RestaurantsReservation/ReservationRestaurantsForm";
import ReserveTourForm from "../../pages/Reservations/ToursReservation/ReservationTourForm";
import StarRating from "../Rattings/StarRating";
import { apiService } from "../../services/apiService";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const translations = {
  ar: {
    capacity: "السعة", people: "شخص", price: "السعر", sport: "الرياضة", location: "الموقع",
    status: "الحالة", closed: "مغلق", open: "مفتوح", from: "من", to: "إلى",
    startsOn: "يبدأ في", endsOn: "ينتهي في", description: "الوصف", tourStops: "أماكن التوقف",
    bookNow: "احجز الآن", bookingFormTitle: "نموذج حجز", reserveTableTitle: "حجز طاولة في",
    joinTourTitle: "الانضمام إلى رحلة",
  },
  en: {
    capacity: "Capacity", people: "People", price: "Price", sport: "Sport", location: "Location",
    status: "Status", closed: "Closed", open: "Open", from: "From", to: "To",
    startsOn: "Starts on", endsOn: "Ends on", description: "Description", tourStops: "Tour Stops",
    bookNow: "Book Now", bookingFormTitle: "Booking Form", reserveTableTitle: "Reserve a Table at",
    joinTourTitle: "Join Tour",
  },
};

interface ItemDetailsCardProps {
  item?: any;
  type: RateableType;
  loading: boolean;
  tourStops?: TourStop[];
  averageRating?: number;
  onBookHotelClick?: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.Node; theme: 'light' | 'dark' }> = ({ icon, label, value, theme }) => (
  <div className="flex items-start gap-3 text-lg">
    <span className="text-orange-400 text-2xl mt-1">{icon}</span>
    <div>
      <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  </div>
);

const ItemDetailsCard: React.FC<ItemDetailsCardProps> = ({ item, type, loading, tourStops = [], averageRating = 0, onBookHotelClick }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

  const [stops, setStops] = useState<TourStop[]>(tourStops);
  const [isEventHallModalVisible, setIsEventHallModalVisible] = useState(false);
  const [isPlaygroundModalVisible, setIsPlaygroundModalVisible] = useState(false);
  const [isRestaurantModalVisible, setIsRestaurantModalVisible] = useState(false);
  const [isTourModalVisible, setIsTourModalVisible] = useState(false);

  useEffect(() => {
    if (type === "tour" && item?.id) {
      apiService.getTourStops(item.id).then(setStops).catch(err => console.error("Failed to fetch tour stops:", err));
    }
  }, [type, item?.id]);

  if (loading || !item) return <ItemDetailsCardSkeleton />;

  const title = language === "ar" ? item.ar_title : item.en_title;
  const description = language === "ar" ? item.ar_description : item.en_description;

  const handleBookingClick = () => {
    if (type === "hotel" && onBookHotelClick) onBookHotelClick();
    else if (type === "event_hall") setIsEventHallModalVisible(true);
    else if (type === "playground") setIsPlaygroundModalVisible(true);
    else if (type === "restaurant") setIsRestaurantModalVisible(true);
    else if (type === "tour") setIsTourModalVisible(true);
  };

  return (
    <>
      <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2">
            <img src={item.image ?? "/default-image.png"} alt={title} className="w-full h-64 md:h-full object-cover" />
          </div>
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
            <div className="mb-6">
              <h1 className={`text-4xl lg:text-5xl font-extrabold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{language === "ar" ? item.en_title : item.ar_title}</h2>
              <div className="flex items-center gap-2 mt-2"><StarRating rating={averageRating} size={24} /><span className="text-yellow-400 font-semibold">{averageRating.toFixed(1)}/5</span></div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-6 border-y ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              {item?.capacity && <InfoRow theme={theme} icon="👥" label={t("capacity")} value={`${item.capacity} ${t("people")}`} />}
              {item?.price && <InfoRow theme={theme} icon="💵" label={t("price")} value={`${item.price}`} />}
              {item?.sport && <InfoRow theme={theme} icon="🏅" label={t("sport")} value={item.sport} />}
              {item?.ar_location && <InfoRow theme={theme} icon="📍" label={t("location")} value={item.ar_location} />}
              {("is_closed" in item) ? (
                <><InfoRow theme={theme} icon="⏳" label={t("status")} value={item.is_closed === 1 ? t("closed") : t("open")} />
                  {item.is_closed === 1 && item.closed_from && <InfoRow theme={theme} icon="🗓️" label={t("from")} value={item.closed_from} />}
                  {item.is_closed === 1 && item.closed_until && <InfoRow theme={theme} icon="🗓️" label={t("to")} value={item.closed_until} />}
                </>
              ) : (
                <>{item.start_date && <InfoRow theme={theme} icon="🗓️" label={t("startsOn")} value={item.start_date} />}
                  {item.end_date && <InfoRow theme={theme} icon="🗓️" label={t("endsOn")} value={item.end_date} />}
                </>
              )}
            </div>
            {description && (
              <div className={`text-lg leading-relaxed mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <h3 className="text-xl font-bold text-orange-400 mb-2">{t("description")}</h3>
                <p>{description}</p>
              </div>
            )}
            {stops.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-orange-400 mb-2">{t("tourStops")}</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stops.map((stop) => (<li key={stop.id}><span className="font-semibold">{language === "ar" ? stop.ar_title : stop.en_title}</span> - {language === "ar" ? stop.ar_description : stop.en_description}</li>))}
                </ul>
              </div>
            )}
            <div className="mt-auto pt-8"><button onClick={handleBookingClick} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-full text-xl shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105">{t("bookNow")}</button></div>
          </div>
        </div>
      </div>

      {/* Modals with Theme and Cursor Pointer on Close Button */}
      {isEventHallModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> <div className={`flex justify-between items-center p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{`${t('bookingFormTitle')}: ${title}`}</h3><button onClick={() => setIsEventHallModalVisible(false)} className={`cursor-pointer ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveEventHallForm eventHallId={item.id} onClose={() => setIsEventHallModalVisible(false)} /></div> </div> </div> )}
      {isPlaygroundModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className={`rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> <div className={`flex justify-between items-center p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{`${t('bookingFormTitle')}: ${title}`}</h3><button onClick={() => setIsPlaygroundModalVisible(false)} className={`cursor-pointer ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReservePlaygroundForm playGroundId={item.id} onClose={() => setIsPlaygroundModalVisible(false)} /></div> </div> </div> )}
      {isRestaurantModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className={`rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> <div className={`flex justify-between items-center p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{`${t('reserveTableTitle')}: ${title}`}</h3><button onClick={() => setIsRestaurantModalVisible(false)} className={`cursor-pointer ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveRestaurantForm restaurantId={item.id} onClose={() => setIsRestaurantModalVisible(false)} /></div> </div> </div> )}
      {isTourModalVisible && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> <div className={`rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> <div className={`flex justify-between items-center p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{`${t('joinTourTitle')}: ${title}`}</h3><button onClick={() => setIsTourModalVisible(false)} className={`cursor-pointer ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}><FaTimes size={20} /></button></div> <div className="overflow-y-auto p-6 md:p-8"><ReserveTourForm tourId={item.id} onClose={() => setIsTourModalVisible(false)} /></div> </div> </div> )}
    </>
  );
};

export default ItemDetailsCard;