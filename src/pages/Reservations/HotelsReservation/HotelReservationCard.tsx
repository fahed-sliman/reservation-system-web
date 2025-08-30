import React, { useCallback, useEffect, useState } from 'react';
import { 
  FaCalendarAlt, FaMoon, FaBuilding, FaCreditCard, FaDollarSign, FaMapMarkerAlt 
} from 'react-icons/fa';
import type { HotelReservation, Hotel } from '../../../types';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز فندق",
    hotelName: "اسم الفندق",
    arrivalDate: "تاريخ الوصول",
    nightsCount: "عدد الليالي",
    nights: "ليالي",
    paymentMethod: "طريقة الدفع",
    price: "السعر",
    finalPrice: "السعر النهائي",
    cancelBooking: "إلغاء الحجز",
  },
  en: {
    title: "Hotel Reservation",
    hotelName: "Hotel Name",
    arrivalDate: "Arrival Date",
    nightsCount: "Number of Nights",
    nights: "Nights",
    paymentMethod: "Payment Method",
    price: "Price",
    finalPrice: "Final Price",
    cancelBooking: "Cancel Booking",
  },
};

interface Props {
  reservation: HotelReservation;
  onCancel: (id: number) => void;
}

const HotelReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  // 🔹 جلب بيانات الفندق إذا الاسم غير موجود
  useEffect(() => {
    async function fetchHotel() {
      try {
        const data = await apiService.getItem('hotel', reservation.hotel_id); // أو reservation.id للفندق حسب API
        setHotel(data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
      }
    }
    if (!reservation.hotel_name) {
      fetchHotel();
    }
  }, [reservation.hotel_id, reservation.hotel_name]);

  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50 text-white'
          : 'bg-white border-gray-200 hover:border-orange-300 text-black'
      }`}
    >
      {/* العنوان والحالة */}
      <div className={`flex justify-between items-start mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          <FaBuilding /> {hotel?.[language === 'ar' ? 'ar_title' : 'en_title'] ?? reservation.hotel_name ?? t('title')}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      {/* التفاصيل */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
        <InfoRow icon={<FaCalendarAlt />} label={t('arrivalDate')} value={reservation.start_date} />
        <InfoRow icon={<FaMoon />} label={t('nightsCount')} value={`${reservation.nights} ${t('nights')}`} />
        {reservation.payment_method && <InfoRow icon={<FaCreditCard />} label={t('paymentMethod')} value={reservation.payment_method} />}
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${reservation.price}$`} />
        {reservation.final_price && <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${reservation.final_price}$`} />}
        {hotel && <InfoRow icon={<FaMapMarkerAlt />} label={t('hotelName')} value={hotel?.[language === 'ar' ? 'ar_location' : 'en_location'] ?? '–'} />}
      </div>

      {/* زر الإلغاء */}
      <div className={`mt-5 pt-5 border-t text-right ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => onCancel(reservation.reservation_id)}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default HotelReservationCard;
