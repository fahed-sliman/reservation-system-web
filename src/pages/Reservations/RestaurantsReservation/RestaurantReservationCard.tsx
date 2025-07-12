import React from 'react';
import { FaUtensils, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import type { RestaurantReservation } from '../../../types/restaurants';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';


interface Props {
  reservation: RestaurantReservation;
  onCancel: (id: number) => void;
}

const RestaurantReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  // تفعيل زر الإلغاء فقط إذا كان الحجز "مؤكد"
  const canCancel = reservation.status === 'confirmed';

  // معالجة التاريخ والوقت لعرضهما بشكل منفصل وواضح
  // الـ API يرسل الوقت بصيغة 'Y-m-d H:i', نقوم بتحويلها لكائن تاريخ
  const reservationDateTime = new Date(reservation.reservation_time.replace(' ', 'T'));
  const date = reservationDateTime.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = reservationDateTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

  // تحديد نص لمنطقة الجلوس
  const getAreaText = (area: 'indoor_hall' | 'outdoor_terrace' | null): string => {
    if (area === 'indoor_hall') return 'صالة داخلية';
    if (area === 'outdoor_terrace') return 'تراس خارجي';
    return 'غير محدد';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 transition-all hover:border-orange-500/50 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <FaUtensils />
          {reservation.restaurant_ar_title}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
        <InfoRow icon={<FaClock />} label="التاريخ والوقت" value={`${date} - ${time}`} />
        <InfoRow icon={<FaUsers />} label="عدد الضيوف" value={reservation.guests} />

        {reservation.area_type && (
          <InfoRow icon={<FaMapMarkerAlt />} label="منطقة الجلوس" value={getAreaText(reservation.area_type)} />
        )}
      </div>

      {/* زر إلغاء الحجز */}
      <div className="mt-5 pt-5 border-t border-gray-700 text-right">
        <button
          onClick={() => onCancel(reservation.id)}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إلغاء الحجز
        </button>
      </div>
    </div>
  );
};

export default RestaurantReservationCard;