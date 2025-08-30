import React, { useCallback, useEffect, useState } from 'react';
import { FaBuilding, FaCalendarCheck, FaUsers, FaGlassCheers, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { EventHallReservation, EventHall } from '../../../types';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../services/apiService';
import toast from 'react-hot-toast';

const translations = {
  ar: {
    title: "حجز صالة مناسبات",
    hallName: "اسم الصالة",
    date: "التاريخ",
    eventType: "نوع المناسبة",
    guests: "عدد الضيوف",
    wedding: "زفاف",
    funeral: "عزاء",
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
    title: "Event Hall Reservation",
    hallName: "Hall Name",
    date: "Date",
    eventType: "Event Type",
    guests: "Guests",
    wedding: "Wedding",
    funeral: "Funeral",
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

  // جلب بيانات الصالة عند التحميل
  useEffect(() => {
    async function fetchHall() {
      try {
        const data = await apiService.getItem('event_hall', reservation.event_hall_id);
        setHall(data);
        console.log('Fetched hall:', data);
      } catch (err) {
        console.error('Failed to fetch hall:', err);
      }
    }
    fetchHall();
  }, [reservation.event_hall_id]);

  const handleCancel = () => {
    if (!canCancel) return;
    if (window.confirm(t('confirmCancel'))) {
      onCancel(reservation.id);
      toast.success(t('cancelBooking') + ' ✅');
    }
  };

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
          <FaBuilding /> {hall?.[language === 'ar' ? 'ar_title' : 'en_title'] ?? t('title')}
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
          value={`${reservation.price}$`}
        />
        <InfoRow
          icon={<FaDollarSign />}
          label={t('finalPrice')}
          value={`${reservation.final_price}$`}
        />
        <InfoRow
          icon={<FaMapMarkerAlt />}
          label={t('location')}
          value={hall?.[language === 'ar' ? 'ar_location' : 'en_location'] ?? '–'}
        />
        <InfoRow
          icon={<FaDollarSign />}
          label={t('coupon')}
          value={reservation.coupons_id ?? t('noCoupon')}
        />
      </div>

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

export default EventHallReservationCard;
