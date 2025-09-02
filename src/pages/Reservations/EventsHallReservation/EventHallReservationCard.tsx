import React, { useCallback, useEffect, useState } from 'react';
import { FaBuilding, FaCalendarCheck, FaUsers, FaGlassCheers, FaDollarSign, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { EventHallReservation, EventHall } from '../../../types';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز صالة مناسبات", hallName: "اسم الصالة", date: "التاريخ", eventType: "نوع المناسبة",
    guests: "عدد الضيوف", wedding: "زفاف", funeral: "عزاء", price: "السعر",
    finalPrice: "السعر النهائي", payment: "طريقة الدفع", location: "الموقع", coupon: "كوبون مستخدم",
    cancelBooking: "إلغاء الحجز", noCoupon: "لا يوجد", errorFetchingHall: "فشل تحميل تفاصيل الصالة.",
    confirmCancelTitle: "تأكيد الإلغاء", confirmCancelMessage: "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    yesCancel: "نعم، إلغاء", noCancel: "لا، احتفاظ",
    // bookingCancelledSuccess: "تم إلغاء الحجز بنجاح!", // سيتم عرضها من MyReservationsPage
  },
  en: {
    title: "Event Hall Reservation", hallName: "Hall Name", date: "Date", eventType: "Event Type",
    guests: "Guests", wedding: "Wedding", funeral: "Funeral", price: "Price",
    finalPrice: "Final Price", payment: "Payment", location: "Location", coupon: "Coupon Used",
    cancelBooking: "Cancel Booking", noCoupon: "None", errorFetchingHall: "Failed to load hall details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
    // bookingCancelledSuccess: "Booking cancelled successfully!", // Will be shown from MyReservationsPage
  },
};

interface Props {
  reservation: EventHallReservation;
  onCancel: (id: number) => void;
}

const EventHallReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [hall, setHall] = useState<EventHall | null>(null);

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  useEffect(() => {
    async function fetchHall() {
      try {
        const data = await apiService.getItem('event_hall', reservation.event_hall_id);
        setHall(data);
      } catch (err) {
        console.error('Failed to fetch hall:', err);
        toast.error(t('errorFetchingHall'));
      }
    }
    fetchHall();
  }, [reservation.event_hall_id, t]);

  const handleCancelClick = useCallback(() => {
    toast((toastInstance) => (
      <div
        className={`relative flex flex-col items-center p-6 shadow-xl rounded-lg border max-w-sm w-full
          ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}
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
            className={`cursor-pointer px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-md
              ${theme === 'dark' ? 'bg-gray-600 border border-gray-500 hover:bg-gray-500' : 'bg-gray-200 border border-gray-300 hover:bg-gray-300 text-gray-800'} `}
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
      className={`border rounded-lg p-5 transition-all hover:shadow-xl ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50' : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <FaBuilding /> {hall?.[language === 'ar' ? 'ar_title' : 'en_title'] ?? t('title')}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <InfoRow icon={<FaCalendarCheck />} label={t('date')} value={reservation.reservation_date} />
        <InfoRow icon={<FaGlassCheers />} label={t('eventType')} value={reservation.event_type === 'wedding' ? t('wedding') : t('funeral')} />
        <InfoRow icon={<FaUsers />} label={t('guests')} value={reservation.guests} />
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${reservation.price}$`} />
        <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${reservation.final_price}$`} />
        <InfoRow icon={<FaMapMarkerAlt />} label={t('location')} value={hall?.[language === 'ar' ? 'ar_location' : 'en_location'] ?? '–'} />
        <InfoRow icon={<FaDollarSign />} label={t('coupon')} value={reservation.coupons_id ?? t('noCoupon')} />
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

export default EventHallReservationCard;