
import React, { useCallback, useEffect, useState } from 'react';
import {
  FaCalendarAlt, FaMoon, FaBuilding, FaCreditCard, FaDollarSign, FaMapMarkerAlt,
  FaExclamationTriangle // ✅ أيقونة جديدة
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
    title: "حجز فندق", hotelName: "اسم الفندق", arrivalDate: "تاريخ الوصول",
    nightsCount: "عدد الليالي", nights: "ليالي", paymentMethod: "طريقة الدفع",
    price: "السعر", finalPrice: "السعر النهائي", cancelBooking: "إلغاء الحجز",
    errorFetchingHotel: "فشل تحميل تفاصيل الفندق.",
    confirmCancelTitle: "تأكيد الإلغاء", confirmCancelMessage: "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    yesCancel: "نعم، إلغاء", noCancel: "لا، احتفاظ",
    // bookingCancelledSuccess: "تم إلغاء الحجز بنجاح!", // سيتم عرضها من MyReservationsPage
  },
  en: {
    title: "Hotel Reservation", hotelName: "Hotel Name", arrivalDate: "Arrival Date",
    nightsCount: "Number of Nights", nights: "Nights", paymentMethod: "Payment Method",
    price: "Price", finalPrice: "Final Price", cancelBooking: "Cancel Booking",
    errorFetchingHotel: "Failed to load hotel details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
    // bookingCancelledSuccess: "Booking cancelled successfully!", // Will be shown from MyReservationsPage
  },
};

interface Props {
  reservation: HotelReservation;
  onCancel: (id: number) => void; // وظيفة الإلغاء تأتي من الصفحة الرئيسية
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

  useEffect(() => {
    async function fetchHotel() {
      try {
        const data = await apiService.getItem('hotel', reservation.hotel_id);
        setHotel(data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
        toast.error(t('errorFetchingHotel'));
      }
    }
    if (!reservation.hotel_name) {
      fetchHotel();
    }
  }, [reservation.hotel_id, reservation.hotel_name, t]);

const handleCancelClick = useCallback(() => {
    toast((toastInstance) => (
      <div
        className={`relative flex w-full max-w-sm flex-col items-center rounded-lg border p-6 shadow-xl
          ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'}
        `}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
          <FaExclamationTriangle className="text-3xl text-yellow-500" />
        </div>
        <h3 className={`mb-2 text-center text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('confirmCancelTitle')}
        </h3>
        <p className={`mb-6 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('confirmCancelMessage')}
        </p>
        <div className="flex w-full justify-center gap-4">
          <button
            onClick={() => toast.dismiss(toastInstance.id)}
            className={`w-full cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors
              ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
            `}
          >
            {t('noCancel')}
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastInstance.id);
              onCancel(reservation.id); // ✨ الاختلاف الوحيد هنا
            }}
            className="w-full cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 shadow-md"
          >
            {t('yesCancel')}
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity,
      style: {
        background: 'transparent',
        border: 'none',
        padding: 0,
        boxShadow: 'none',
      }
    });
  }, [reservation.id, onCancel, t, theme]); // ✨ وهنا أيضاً```
  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50 text-white' : 'bg-white border-gray-200 hover:border-orange-300 text-black'
      }`}
    >
      <div className={`flex justify-between items-start mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          <FaBuilding /> {hotel?.[language === 'ar' ? 'ar_title' : 'en_title'] ?? reservation.hotel_name ?? t('title')}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
        <InfoRow icon={<FaCalendarAlt />} label={t('arrivalDate')} value={reservation.start_date} />
        <InfoRow icon={<FaMoon />} label={t('nightsCount')} value={`${reservation.nights} ${t('nights')}`} />
        {reservation.payment_method && <InfoRow icon={<FaCreditCard />} label={t('paymentMethod')} value={reservation.payment_method} />}
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${reservation.price}$`} />
        {reservation.final_price && <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${reservation.final_price}$`} />}
        {hotel && <InfoRow icon={<FaMapMarkerAlt />} label={t('hotelName')} value={hotel?.[language === 'ar' ? 'ar_location' : 'en_location'] ?? '–'} />}
      </div>

      <div className={`mt-5 pt-5 border-t text-right ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={canCancel ? handleCancelClick : undefined}
          disabled={!canCancel}
          className=" cursor-pointer px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default HotelReservationCard;