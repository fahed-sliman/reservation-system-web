import React, { useCallback, useEffect, useState } from 'react';
import { FaUtensils, FaCalendarAlt, FaClock, FaDollarSign, FaCreditCard, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa'; // ✅ FaExclamationTriangle
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { RestaurantReservation, Restaurant } from '../../../types'; // تأكد من وجود هذه الأنواع

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز مطعم", date: "التاريخ", time: "الوقت", price: "السعر",
    finalPrice: "السعر النهائي", payment: "طريقة الدفع", location: "الموقع",
    cancelBooking: "إلغاء الحجز", errorFetchingRestaurant: "فشل تحميل تفاصيل المطعم.",
    confirmCancelTitle: "تأكيد الإلغاء", confirmCancelMessage: "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    yesCancel: "نعم، إلغاء", noCancel: "لا، احتفاظ",
  },
  en: {
    title: "Restaurant Reservation", date: "Date", time: "Time", price: "Price",
    finalPrice: "Final Price", payment: "Payment", location: "Location",
    cancelBooking: "Cancel Booking", errorFetchingRestaurant: "Failed to load restaurant details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
  },
};

interface Props {
  reservation: RestaurantReservation;
  onCancel: (id: number) => void;
}

const RestaurantReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  const price = reservation.price || '–';
  const finalPrice = reservation.final_price || price;

  useEffect(() => {
    let mounted = true;
    async function fetchRestaurant() {
      try {
        const data = await apiService.getItem('restaurant', reservation.restaurant_id);
        if (mounted) setRestaurant(data ?? null);
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
        toast.error(t('errorFetchingRestaurant')); // عرض رسالة الخطأ
      }
    }
    fetchRestaurant();
    return () => { mounted = false; };
  }, [reservation.restaurant_id, t]); // أضفنا 't' كاعتمادية

  const restaurantName = restaurant ? (language === 'ar' ? restaurant.ar_title : restaurant.en_title) : '–';
  const restaurantLocation = restaurant ? (language === 'ar' ? restaurant.ar_location : restaurant.en_location) : '–';

  // وظيفة مخصصة لمعالجة نقرة الإلغاء لعرض توست التأكيد
  const handleCancelClick = useCallback(() => {
    toast((toastInstance) => (
      <div
        className={`relative flex flex-col items-center p-6 shadow-xl rounded-lg border max-w-sm w-full
          ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-200 text-gray-900'}
          ${toastInstance.visible ? 'animate-enter' : 'animate-out'} `}
      >
        <div className="flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-4xl" /> {/* أيقونة التحذير */}
        </div>
        <h3 className={`text-xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('confirmCancelTitle')}
        </h3>
        <p className={`text-sm mb-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('confirmCancelMessage')}
        </p>
        <div className="flex justify-center w-full gap-4"> {/* أزرار في المنتصف */}
          <button
            onClick={() => toast.dismiss(toastInstance.id)}
            className={`cursor-pointer  px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-md
              ${theme === 'dark'
                ? 'bg-gray-600 border border-gray-500 hover:bg-gray-500'
                : 'bg-gray-200 border border-gray-300 hover:bg-gray-300 text-gray-800'} `}
          >
            {t('noCancel')}
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastInstance.id);
              onCancel(reservation.id); // استدعاء الوظيفة من الصفحة الرئيسية
              // لا نعرض toast.success هنا
            }}
            className="cursor-pointer px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
          >
            {t('yesCancel')}
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  }, [reservation.id, onCancel, t, theme]);

  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <FaUtensils /> {restaurantName}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <InfoRow icon={<FaCalendarAlt />} label={t('date')} value={reservation.reservation_date} />
        <InfoRow icon={<FaClock />} label={t('time')} value={reservation.reservation_time} />
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${price}$`} />
        <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${finalPrice}$`} />
        {reservation.payment_method && <InfoRow icon={<FaCreditCard />} label={t('payment')} value={reservation.payment_method} />}
        <InfoRow icon={<FaMapMarkerAlt />} label={t('location')} value={restaurantLocation} />
      </div>

      <div className="mt-5 text-right">
        <button
          onClick={canCancel ? handleCancelClick : undefined}
          disabled={!canCancel}
          className="cursor-pointer px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default RestaurantReservationCard;