

import React from 'react';
import { FaBuilding, FaCalendarCheck, FaUsers, FaGlassCheers } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { EventHallReservation } from '../../../types';

interface Props {
  reservation: EventHallReservation;
  onCancel: (id: number) => void;
}

const EventHallReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const canCancel = reservation.status === 'confirmed';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 transition-all hover:border-orange-500/50 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
         <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaBuilding /> حجز صالة مناسبات
        </h3>
        <StatusBadge status={reservation.status} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-700 pt-4">
        <InfoRow icon={<FaCalendarCheck />} label="التاريخ" value={reservation.reservation_date} />
        <InfoRow icon={<FaGlassCheers />} label="نوع المناسبة" value={reservation.event_type === 'wedding' ? 'زفاف' : 'عزاء'} />
        <InfoRow icon={<FaUsers />} label="عدد الضيوف" value={reservation.guests} />
      </div>
       <div className="mt-5 text-right">
        <button onClick={() => onCancel(reservation.id)} disabled={!canCancel} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
          إلغاء الحجز
        </button>
      </div>
    </div>
  );
};

export default EventHallReservationCard;