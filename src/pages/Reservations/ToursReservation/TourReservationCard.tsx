import React from 'react';
import { FaRoute, FaCalendarCheck, FaUsers, FaDollarSign } from 'react-icons/fa';
import InfoRow from '../../../components/Reservation/infoRow';
import StatusBadge from '../../../components/Reservation/StatusBadge';
import type { TourReservation } from '../../../types';


interface Props {
  reservation: TourReservation;
  onCancel: (id: number) => void;
}

const TourReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const canCancel = reservation.status === 'confirmed';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 transition-all hover:border-orange-500/50 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaRoute /> رحلة سياحية
        </h3>
        <StatusBadge status={reservation.status} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-700 pt-4">
        <InfoRow icon={<FaCalendarCheck />} label="فترة الرحلة" value={`من ${reservation.start_date} إلى ${reservation.end_date}`} />
        <InfoRow icon={<FaUsers />} label="عدد الضيوف" value={reservation.guests} />
        <InfoRow icon={<FaDollarSign />} label="السعر النهائي" value={`${reservation.final_price || reservation.price}$`} />
      </div>
       <div className="mt-5 text-right">
        <button onClick={() => onCancel(reservation.id)} disabled={!canCancel} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
          إلغاء الحجز
        </button>
      </div>
    </div>
  );
};

export default TourReservationCard;