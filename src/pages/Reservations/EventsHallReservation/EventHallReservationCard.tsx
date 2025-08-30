import React, { useCallback } from 'react';
import { FaBuilding, FaCalendarCheck, FaUsers, FaGlassCheers, FaDollarSign } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { EventHallReservation } from '../../../types';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

const translations = {
  ar: {
    title: "حجز صالة مناسبات",
    date: "التاريخ",
    eventType: "نوع المناسبة",
    guests: "عدد الضيوف",
    wedding: "زفاف",
    funeral: "عزاء",
    cancelBooking: "إلغاء الحجز",
    price: "السعر",
  },
  en: {
    title: "Event Hall Reservation",
    date: "Date",
    eventType: "Event Type",
    guests: "Guests",
    wedding: "Wedding",
    funeral: "Funeral",
    cancelBooking: "Cancel Booking",
    price: "Price",
  },
};

interface Props {
  reservation: EventHallReservation;
  onCancel: (id: number) => void;
}

const EventHallReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  // ✅ معالجة السعر بشكل آمن (تحويل string لرقم)
  const price = reservation.price ? parseFloat(reservation.price as unknown as string) : 0;

  return (
    <div
      className={`border rounded-lg p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3
          className={`text-xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          <FaBuilding /> {t('title')}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <InfoRow icon={<FaCalendarCheck />} label={t('date')} value={reservation.reservation_date} />
        <InfoRow
          icon={<FaGlassCheers />}
          label={t('eventType')}
          value={reservation.event_type === 'wedding' ? t('wedding') : t('funeral')}
        />
        <InfoRow icon={<FaUsers />} label={t('guests')} value={reservation.guests} />
        <InfoRow
          icon={<FaDollarSign />}
          label={t('price')}
          value={`${price.toFixed(2)} $`}
          // ✅ نضيف class بحيث النص يرجع أسود بالـ light mode
          className={theme === 'light' ? 'text-black' : 'text-white'}
        />
      </div>

      <div className="mt-5 text-right">
        <button
          onClick={() => onCancel(reservation.id)}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('cancelBooking')}
        </button>
      </div>
    </div>
  );
};

export default EventHallReservationCard;
