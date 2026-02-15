
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  colorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="glass p-5 rounded-2xl flex items-start gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass}`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold mt-1 text-white">{value}</p>
      </div>
    </div>
  );
};
