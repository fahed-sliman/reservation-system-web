import React from 'react';

type Status = 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, { text: string; classes: string }> = {
  confirmed: { text: 'مؤكد', classes: 'bg-green-500/10 text-green-400' },
  cancelled: { text: 'ملغي', classes: 'bg-gray-500/10 text-gray-400' },
  done: { text: 'مكتمل', classes: 'bg-blue-500/10 text-blue-400' },
  rejected: { text: 'مرفوض', classes: 'bg-red-500/10 text-red-400' },
  missed: { text: 'لم يتم الحضور', classes: 'bg-yellow-500/10 text-yellow-400' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || statusStyles.cancelled;
  return (
    <div className={`px-3 py-1 text-sm font-bold rounded-full text-center ${style.classes}`}>
      {style.text}
    </div>
  );
};

export default StatusBadge;