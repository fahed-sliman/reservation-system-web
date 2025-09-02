import React, { useCallback, useEffect, useState } from 'react';
import {
  FaRoute, FaCalendarCheck, FaUsers, FaDollarSign, FaCreditCard, FaMapMarkerAlt, FaTicketAlt,
  FaExclamationTriangle // ✅ أيقونة التحذير
} from 'react-icons/fa';
import type { TourReservation, Tour } from '../../../types';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز رحلة", period: "فترة الرحلة", from: "من", to: "إلى", guests: "عدد الضيوف",
    price: "السعر", finalPrice: "السعر النهائي", payment: "طريقة الدفع", location: "الموقع",
    coupon: "كوبون مستخدم", cancelBooking: "إلغاء الحجز", noCoupon: "لا يوجد",
    errorFetchingTour: "فشل تحميل تفاصيل الرحلة.",
    confirmCancelTitle: "تأكيد الإلغاء", confirmCancelMessage: "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    yesCancel: "نعم، إلغاء", noCancel: "لا، احتفاظ",
    // bookingCancelledSuccess: "تم إلغاء الحجز بنجاح!", // سيتم عرضها من MyReservationsPage
  },
  en: {
    title: "Tour Reservation", period: "Tour Period", from: "From", to: "To", guests: "Guests",
    price: "Price", finalPrice: "Final Price", payment: "Payment", location: "Location",
    coupon: "Coupon Used", cancelBooking: "Cancel Booking", noCoupon: "None",
    errorFetchingTour: "Failed to load tour details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
    // bookingCancelledSuccess: "Booking cancelled successfully!", // Will be shown from MyReservationsPage
  },
};

interface Props {
  reservation: TourReservation;
  onCancel: (id: number) => void;
}

const TourReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [tour, setTour] = useState<Tour | null>(null);

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  useEffect(() => {
    let mounted = true;
    async function fetchTour() {
      try {
        const data = await apiService.getItem('tour', reservation.tour_id);
        if (mounted) setTour(data ?? null);
      } catch (err) {
        console.error('Failed to fetch tour:', err);
        toast.error(t('errorFetchingTour'));
      }
    }

    if (!reservation.tour_title_ar && !reservation.tour_title_en) {
      fetchTour();
    }

    return () => { mounted = false; };
  }, [reservation.tour_id, reservation.tour_title_ar, reservation.tour_title_en, t]);

  const getTourName = () => {
    if (language === 'ar') {
      return reservation.tour_title_ar || tour?.ar_title || t('title');
    }
    return reservation.tour_title_en || tour?.en_title || t('title');
  };

  const getTourLocation = () => {
    if (!tour) return '–';
    return language === 'ar' ? tour.ar_location : tour.en_location;
  };

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

  const price = reservation.price || '–';
  const finalPrice = reservation.final_price || price;
  const coupon = reservation.coupons_id ?? null;

  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3
          className={`text-lg md:text-xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          <FaRoute /> {getTourName()}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <InfoRow
          icon={<FaCalendarCheck />}
          label={t('period')}
          value={`${t('from')} ${reservation.start_date} ${t('to')} ${reservation.end_date}`}
        />
        <InfoRow
          icon={<FaUsers />}
          label={t('guests')}
          value={reservation.guests}
        />
        <InfoRow
          icon={<FaDollarSign />}
          label={t('price')}
          value={`${price}$`}
        />
        <InfoRow
          icon={<FaDollarSign />}
          label={t('finalPrice')}
          value={`${finalPrice}$`}
        />
        {reservation.payment_method && (
          <InfoRow
            icon={<FaCreditCard />}
            label={t('payment')}
            value={reservation.payment_method}
          />
        )}
        <InfoRow
          icon={<FaMapMarkerAlt />}
          label={t('location')}
          value={getTourLocation()}
        />
        <InfoRow
          icon={<FaTicketAlt />}
          label={t('coupon')}
          value={coupon ?? t('noCoupon')}
        />
      </div>

      <div className="mt-5 text-right">
        <button
          onClick={canCancel ? handleCancelClick : undefined} // استدعاء وظيفة التوست عند الإلغاء
          disabled={!canCancel}
          className="cursor-pointer px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default TourReservationCard;