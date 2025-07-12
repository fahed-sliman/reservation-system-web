import React from 'react';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-orange-400 mt-1">{icon}</span>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  </div>
);

export default InfoRow;