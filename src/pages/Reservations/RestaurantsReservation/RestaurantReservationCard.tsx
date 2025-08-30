import React, { useCallback } from 'react';
import { FaUtensils, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import type { RestaurantReservation } from '../../../types/restaurants';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

// ==== الترجمات ====
const translations = {
  ar: {
    title: "حجز مطعم",
    dateTime: "التاريخ والوقت",
    guests: "عدد الضيوف",
    seatingArea: "منطقة الجلوس",
    indoorHall: "صالة داخلية",
    outdoorTerrace: "تراس خارجي",
    notSpecified: "غير محدد",
    cancelBooking: "إلغاء الحجز",
  },
  en: {
    title: "Restaurant Reservation",
    dateTime: "Date & Time",
    guests: "Guests",
    seatingArea: "Seating Area",
    indoorHall: "Indoor Hall",
    outdoorTerrace: "Outdoor Terrace",
    notSpecified: "Not Specified",
    cancelBooking: "Cancel Booking",
  },
};

interface Props {
  reservation: RestaurantReservation;
  onCancel: (id: number) => void;
}

const RestaurantReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  const t = useCallback(
    (key: keyof typeof translations['en']) => translations[language][key] || key,
    [language]
  );

  const canCancel = reservation.status === 'confirmed';

  // ====== معالجة التاريخ والوقت ======
  const reservationDateTime = new Date(reservation.reservation_time.replace(' ', 'T'));
  const date = reservationDateTime.toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const time = reservationDateTime.toLocaleTimeString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  );

  const getAreaText = (area: 'indoor_hall' | 'outdoor_terrace' | null): string => {
    if (area === 'indoor_hall') return t('indoorHall');
    if (area === 'outdoor_terrace') return t('outdoorTerrace');
    return t('notSpecified');
  };

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
          className={`text-lg md:text-xl font-bold flex items-center gap-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          <FaUtensils />
          {language === 'ar'
            ? reservation.restaurant_ar_title
            : reservation.restaurant_en_title || t('title')}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      {/* ====== التفاصيل ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
        <InfoRow
          icon={<FaClock />}
          label={t('dateTime')}
          value={`${date} - ${time}`}
        />
        <InfoRow
          icon={<FaUsers />}
          label={t('guests')}
          value={reservation.guests}
        />
        {reservation.area_type && (
          <InfoRow
            icon={<FaMapMarkerAlt />}
            label={t('seatingArea')}
            value={getAreaText(reservation.area_type)}
          />
        )}
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

export default RestaurantReservationCard;
