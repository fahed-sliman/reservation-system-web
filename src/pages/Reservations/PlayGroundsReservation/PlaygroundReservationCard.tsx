import React, { useCallback, useEffect, useState } from 'react';
import { FaFutbol, FaCalendarAlt, FaClock, FaDollarSign, FaCreditCard, FaMapMarkerAlt, FaTicketAlt, FaExclamationTriangle } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { PlayGroundReservation, PlayGround } from '../../../types';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز ملعب", date: "التاريخ", time: "الوقت", price: "السعر",
    finalPrice: "السعر النهائي", payment: "طريقة الدفع", location: "الموقع", coupon: "كوبون مستخدم",
    cancelBooking: "إلغاء الحجز", noCoupon: "لا يوجد", errorFetchingPlayground: "فشل تحميل تفاصيل الملعب.",
    confirmCancelTitle: "تأكيد الإلغاء", confirmCancelMessage: "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    yesCancel: "نعم، إلغاء", noCancel: "لا، احتفاظ",
  },
  en: {
    title: "Playground Reservation", date: "Date", time: "Time", price: "Price",
    finalPrice: "Final Price", payment: "Payment", location: "Location", coupon: "Coupon Used",
    cancelBooking: "Cancel Booking", noCoupon: "None", errorFetchingPlayground: "Failed to load playground details.",
    confirmCancelTitle: "Confirm Cancellation", confirmCancelMessage: "Are you sure you want to cancel this reservation?",
    yesCancel: "Yes, Cancel", noCancel: "No, Keep",
  },
};

interface Props {
  reservation: PlayGroundReservation;
  onCancel: (id: number) => void;
}

const PlaygroundReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [playground, setPlayground] = useState<PlayGround | null>(null);

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  const price = reservation.price || '–';
  const finalPrice = reservation.final_price || price;
  const coupon = reservation.coupons_id ?? null;

  useEffect(() => {
    let mounted = true;
    async function fetchPlayground() {
      try {
        const data = await apiService.getItem('playground', reservation.play_ground_id);
        if (mounted) setPlayground(data ?? null);
      } catch (err) {
        console.error('Failed to fetch playground:', err);
        toast.error(t('errorFetchingPlayground'));
      }
    }
    fetchPlayground();
    return () => { mounted = false; };
  }, [reservation.play_ground_id, t]);

  const playgroundName = playground ? (language === 'ar' ? playground.ar_title : playground.en_title) : '–';
  const playgroundLocation = playground ? (language === 'ar' ? playground.ar_location : playground.en_location) : '–';

  // ✅ =================== هنا تم التعديل =================== ✅
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
  }, [reservation.id, onCancel, t, theme]);

  return (
    <div
      className={`border rounded-2xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark' ? 'bg-gray-800/60 border-gray-700 hover:border-orange-500/50' : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${theme==='dark'?'text-white':'text-gray-900'}`}>
          <FaFutbol /> {playgroundName}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 ${theme==='dark'?'border-gray-700':'border-gray-200'}`}>
        <InfoRow icon={<FaCalendarAlt />} label={t('date')} value={reservation.reservation_date} />
        <InfoRow icon={<FaClock />} label={t('time')} value={reservation.reservation_time} />
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${price}$`} />
        <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${finalPrice}$`} />
        <InfoRow icon={<FaCreditCard />} label={t('payment')} value={reservation.payment_method} />
        <InfoRow icon={<FaMapMarkerAlt />} label={t('location')} value={playgroundLocation} />
        <InfoRow icon={<FaTicketAlt />} label={t('coupon')} value={coupon ?? t('noCoupon')} />
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

export default PlaygroundReservationCard;