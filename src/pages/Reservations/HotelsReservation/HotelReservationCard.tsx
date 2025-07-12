
import React from 'react';
import { FaCalendarAlt, FaMoon, FaBuilding, FaCreditCard, FaBed } from 'react-icons/fa';
import type { HotelReservation } from '../../../types';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';


interface Props {
  reservation: HotelReservation;
  onCancel: (id: number) => void;
}

const HotelReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const canCancel = reservation.status === 'confirmed';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 transition-all hover:border-orange-500/50 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaBuilding />
          {reservation.hotel_name || 'حجز فندق'}
        </h3>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
        <InfoRow icon={<FaCalendarAlt />} label="تاريخ الوصول" value={reservation.start_date} />
        <InfoRow icon={<FaMoon />} label="عدد الليالي" value={`${reservation.nights} ليالي`} />
        
        {reservation.room_number && reservation.floor && (
          <InfoRow icon={<FaBed />} label="غرفة / طابق" value={`${reservation.room_number} / ${reservation.floor}`} />
        )}

        {reservation.payment_method && (
          <InfoRow icon={<FaCreditCard />} label="طريقة الدفع" value={reservation.payment_method} />
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-700 text-right">
        <button
          onClick={() => onCancel(reservation.reservation_id)}
          disabled={!canCancel}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إلغاء الحجز
        </button>
      </div>
    </div>
  );
};

export default HotelReservationCard;