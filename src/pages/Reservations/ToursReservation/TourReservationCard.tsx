import React, { useCallback, useEffect, useState } from 'react';
import {
  FaRoute, FaCalendarCheck, FaUsers, FaDollarSign, FaCreditCard, FaMapMarkerAlt, FaTicketAlt,
  FaExclamationTriangle
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
  },
  en: {
    title: "Tour Reservation", period: "Tour Period", from: "From", to: "To", guests: "Guests",
    price: "Price", finalPrice: "Final Price", payment: "Payment", location: "Location",
    coupon: "Coupon Used", cancelBooking: "Cancel Booking", noCoupon: "None",
    errorFetchingTour: "Failed to load tour details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
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
  
  // =================================================================
  // ✅  هنا التعديل الوحيد والمهم
  // =================================================================
  const handleCancelClick = useCallback(() => {
    toast((toastInstance) => (
      <div
        className={`relative flex w-full max-w-sm flex-col items-center rounded-lg border p-6 shadow-xl
          ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'}
        `}
      >
        {/* أيقونة التحذير */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
          <FaExclamationTriangle className="text-3xl text-yellow-500" />
        </div>

        {/* العنوان والرسالة */}
        <h3 className={`mb-2 text-center text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('confirmCancelTitle')}
        </h3>
        <p className={`mb-6 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('confirmCancelMessage')}
        </p>

        {/* الأزرار */}
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
              // ✨ تم التعديل هنا من reservation.reservation_id إلى reservation.id
              onCancel(reservation.id); 
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
    // ✨ وهنا أيضاً تم تحديث الاعتمادية (dependency)
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

export default TourReservationCard;