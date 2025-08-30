// src/components/Reservations/GenericReservationCard.tsx
import React, { useCallback } from 'react';
import {
  FaBuilding,
  FaUtensils,
  FaRoute,
  FaFutbol,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaCreditCard,
  FaBed,
  FaGlassCheers,
  FaMapMarkerAlt,
} from 'react-icons/fa';

import type { HotelReservation, RestaurantReservation, TourReservation, PlayGroundReservation, EventHallReservation, ReservationType } from '../../types';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import StatusBadge from '../../components/Reservation/StatusBadge';

const translations = {
  ar: {
    // المشتركة
    date: 'التاريخ',
    time: 'الوقت',
    guests: 'الضيوف',
    price: 'السعر',
    finalPrice: 'السعر النهائي',
    paymentMethod: 'طريقة الدفع',
    cancelBooking: 'إلغاء الحجز',
    // الفنادق
    hotelReservation: 'حجز فندق',
    arrivalDate: 'تاريخ الوصول',
    nights: 'ليالي',
    nightsCount: 'عدد الليالي',
    roomFloor: 'غرفة / طابق',
    // المطاعم
    restaurantReservation: 'حجز مطعم',
    dateTime: 'التاريخ والوقت',
    seatingArea: 'منطقة الجلوس',
    indoorHall: 'صالة داخلية',
    outdoorTerrace: 'تراس خارجي',
    notSpecified: 'غير محدد',
    // الرحلات
    tourReservation: 'رحلة سياحية',
    period: 'فترة الرحلة',
    from: 'من',
    to: 'إلى',
    // الملاعب
    playgroundReservation: 'حجز ملعب',
    // القاعات
    eventHallReservation: 'حجز قاعة',
    eventType: 'نوع المناسبة',
    wedding: 'زفاف',
    funeral: 'عزاء',
  },
  en: {
    // المشتركة
    date: 'Date',
    time: 'Time',
    guests: 'Guests',
    price: 'Price',
    finalPrice: 'Final Price',
    paymentMethod: 'Payment Method',
    cancelBooking: 'Cancel Booking',
    // الفنادق
    hotelReservation: 'Hotel Reservation',
    arrivalDate: 'Arrival Date',
    nights: 'Nights',
    nightsCount: 'Number of Nights',
    roomFloor: 'Room / Floor',
    // المطاعم
    restaurantReservation: 'Restaurant Reservation',
    dateTime: 'Date & Time',
    seatingArea: 'Seating Area',
    indoorHall: 'Indoor Hall',
    outdoorTerrace: 'Outdoor Terrace',
    notSpecified: 'Not Specified',
    // الرحلات
    tourReservation: 'Tour Trip',
    period: 'Tour Period',
    from: 'From',
    to: 'To',
    // الملاعب
    playgroundReservation: 'Playground Reservation',
    // القاعات
    eventHallReservation: 'Event Hall Reservation',
    eventType: 'Event Type',
    wedding: 'Wedding',
    funeral: 'Funeral',
  },
};

interface Props {
  type: ReservationType;
  reservation:
    | HotelReservation
    | RestaurantReservation
    | TourReservation
    | PlayGroundReservation
    | EventHallReservation;
  onCancel: (id: number) => void;
}

const GenericReservationCard: React.FC<Props> = ({ type, reservation, onCancel }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

  const canCancel = reservation.status === 'confirmed';

  const getIcon = () => {
    switch (type) {
      case 'hotels': return <FaBuilding />;
      case 'restaurants': return <FaUtensils />;
      case 'tours': return <FaRoute />;
      case 'playgrounds': return <FaFutbol />;
      case 'event_halls': return <FaGlassCheers />;
      default: return <FaCalendarAlt />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'hotels': return t('hotelReservation');
      case 'restaurants': return t('restaurantReservation');
      case 'tours': return t('tourReservation');
      case 'playgrounds': return t('playgroundReservation');
      case 'event_halls': return t('eventHallReservation');
      default: return 'Reservation';
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-300'
      }`}
    >
      {/* العنوان والحالة */}
      <div
        className={`flex justify-between items-start mb-4 pb-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h3
          className={`text-lg md:text-xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {getIcon()} {getTitle()}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      {/* التفاصيل حسب النوع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
        {type === 'hotels' && (
          <>
            <InfoRow
              icon={<FaCalendarAlt />}
              label={t('arrivalDate')}
              value={reservation.start_date}
            />
            <InfoRow
              icon={<FaMoon />}
              label={t('nightsCount')}
              value={`${reservation.nights} ${t('nights')}`}
            />
            {reservation.room_number && reservation.floor && (
              <InfoRow
                icon={<FaBed />}
                label={t('roomFloor')}
                value={`${reservation.room_number} / ${reservation.floor}`}
              />
            )}
          </>
        )}

        {type === 'restaurants' && (
          <>
            <InfoRow
              icon={<FaClock />}
              label={t('dateTime')}
              value={new Date(reservation.reservation_time).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
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
                value={
                  reservation.area_type === 'indoor_hall'
                    ? t('indoorHall')
                    : reservation.area_type === 'outdoor_terrace'
                    ? t('outdoorTerrace')
                    : t('notSpecified')
                }
              />
            )}
          </>
        )}

        {type === 'tours' && (
          <>
            <InfoRow
              icon={<FaCalendarAlt />}
              label={t('period')}
              value={`${t('from')} ${reservation.start_date} ${t('to')} ${reservation.end_date}`}
            />
            <InfoRow
              icon={<FaUsers />}
              label={t('guests')}
              value={reservation.guests}
            />
          </>
        )}

        {(type === 'playgrounds' || type === 'event_halls') && (
          <InfoRow
            icon={<FaCalendarAlt />}
            label={t('date')}
            value={reservation.reservation_date}
          />
        )}

        {type === 'playgrounds' && (
          <>
            <InfoRow
              icon={<FaClock />}
              label={t('time')}
              value={reservation.reservation_time}
            />
          </>
        )}

        {type === 'event_halls' && (
          <>
            <InfoRow
              icon={<FaClock />}
              label={t('time')}
              value={reservation.reservation_time}
            />
            <InfoRow
              icon={<FaUsers />}
              label={t('guests')}
              value={reservation.guests}
            />
            <InfoRow
              icon={<FaGlassCheers />}
              label={t('eventType')}
              value={reservation.event_type === 'wedding' ? t('wedding') : t('funeral')}
            />
          </>
        )}

        {/* الحقول المشتركة */}
        <InfoRow
          icon={<FaDollarSign />}
          label={t('finalPrice')}
          value={`${reservation.final_price || reservation.price}$`}
        />
        {reservation.payment_method && (
          <InfoRow
            icon={<FaCreditCard />}
            label={t('paymentMethod')}
            value={reservation.payment_method}
          />
        )}
      </div>

      {/* زر الإلغاء */}
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

export default GenericReservationCard;