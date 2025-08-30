import React, { useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

type Status = 'confirmed' | 'cancelled' | 'done' | 'rejected' | 'missed';

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, { ar: string; en: string; classes: string }> = {
  confirmed: { ar: 'مؤكد', en: 'Confirmed', classes: 'bg-green-500/10 text-green-400' },
  cancelled: { ar: 'ملغي', en: 'Cancelled', classes: 'bg-gray-500/10 text-gray-400' },
  done: { ar: 'مكتمل', en: 'Done', classes: 'bg-blue-500/10 text-blue-400' },
  rejected: { ar: 'مرفوض', en: 'Rejected', classes: 'bg-red-500/10 text-red-400' },
  missed: { ar: 'لم يتم الحضور', en: 'Missed', classes: 'bg-yellow-500/10 text-yellow-400' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { language } = useLanguage();

  const getText = useCallback(() => {
    const s = statusStyles[status] || statusStyles.cancelled;
    return language === 'ar' ? s.ar : s.en;
  }, [language, status]);

  const style = statusStyles[status] || statusStyles.cancelled;

  return (
    <div className={`px-3 py-1 text-sm font-bold rounded-full text-center ${style.classes}`}>
      {getText()}
    </div>
  );
};

export default StatusBadge;
