import React, { useCallback } from 'react';
import { FaRoute, FaCalendarCheck, FaUsers, FaDollarSign } from 'react-icons/fa';
import type { TourReservation } from '../../../types';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

// الترجمات الثابتة فقط للنصوص الأخرى
const translations = {
  ar: {
    period: "فترة الرحلة",
    from: "من",
    to: "إلى",
    guests: "عدد الضيوف",
    price: "السعر النهائي",
    cancelBooking: "إلغاء الحجز",
  },
  en: {
    period: "Tour Period",
    from: "From",
    to: "To",
    guests: "Guests",
    price: "Final Price",
    cancelBooking: "Cancel Booking",
  },
};

interface Props {
  reservation: TourReservation;
  onCancel: (id: number) => void;
}

const TourReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      {/* ====== العنوان والحالة ====== */}
      <div
        className={`flex justify-between items-start mb-4 pb-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h3
          className={`text-lg md:text-xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}
        >
          <FaRoute /> {language === 'ar' ? reservation.tour_title_ar : reservation.tour_title_en}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      {/* ====== التفاصيل ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-t pt-4">
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
          value={`${reservation.final_price || reservation.price}$`}
        />
      </div>

      {/* ====== زر الإلغاء ====== */}
      <div
        className={`mt-5 pt-5 border-t text-right ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <button
          onClick={() => onCancel(reservation.id)}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default TourReservationCard;