import React, { useCallback, useEffect, useState } from 'react';
import { FaFutbol, FaCalendarAlt, FaClock, FaDollarSign, FaCreditCard, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { PlayGroundReservation, PlayGround } from '../../../types';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز ملعب",
    date: "التاريخ",
    time: "الوقت",
    price: "السعر",
    finalPrice: "السعر النهائي",
    payment: "طريقة الدفع",
    location: "الموقع",
    coupon: "كوبون مستخدم",
    cancelBooking: "إلغاء الحجز",
    confirmCancel: "هل أنت متأكد من إلغاء الحجز؟",
    noCoupon: "لا يوجد",
  },
  en: {
    title: "Playground Reservation",
    date: "Date",
    time: "Time",
    price: "Price",
    finalPrice: "Final Price",
    payment: "Payment",
    location: "Location",
    coupon: "Coupon Used",
    cancelBooking: "Cancel Booking",
    confirmCancel: "Are you sure you want to cancel this reservation?",
    noCoupon: "None",
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

  // جلب معلومات الملعب من الـ API
  useEffect(() => {
    let mounted = true;
    apiService.getItem('playground', reservation.play_ground_id).then((data) => {
      if (mounted) setPlayground(data[0] ?? null); // API بيرجع array
    });
    return () => { mounted = false; };
  }, [reservation.play_ground_id]);

  const playgroundName = playground ? (language === 'ar' ? playground.ar_title : playground.en_title) : '–';
  const playgroundLocation = playground ? (language === 'ar' ? playground.ar_location : playground.en_location) : '–';

  const handleCancel = () => {
    if (!canCancel) return;
    if (window.confirm(t('confirmCancel'))) {
      onCancel(reservation.id);
      toast.success(t('cancelBooking') + ' ✅');
    }
  };

  return (
    <div
      className={`border rounded-2xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      {/* العنوان + الحالة */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${theme==='dark'?'text-white':'text-gray-900'}`}>
          <FaFutbol /> {playgroundName}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      {/* تفاصيل الحجز */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 ${theme==='dark'?'border-gray-700':'border-gray-200'}`}>
        <InfoRow icon={<FaCalendarAlt />} label={t('date')} value={reservation.reservation_date} />
        <InfoRow icon={<FaClock />} label={t('time')} value={reservation.reservation_time} />
        <InfoRow icon={<FaDollarSign />} label={t('price')} value={`${price}$`} />
        <InfoRow icon={<FaDollarSign />} label={t('finalPrice')} value={`${finalPrice}$`} />
        <InfoRow icon={<FaCreditCard />} label={t('payment')} value={reservation.payment_method} />
        <InfoRow icon={<FaMapMarkerAlt />} label={t('location')} value={playgroundLocation} />
        <InfoRow icon={<FaTicketAlt />} label={t('coupon')} value={coupon ?? t('noCoupon')} />
      </div>

      {/* زر الإلغاء */}
      <div className="mt-5 text-right">
        <button
          onClick={handleCancel}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default PlaygroundReservationCard;
