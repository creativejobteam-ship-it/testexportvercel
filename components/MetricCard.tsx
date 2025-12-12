import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-normal text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <div className={`flex items-center mt-2 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          <span>{isPositive ? '↑' : '↓'} {change}</span>
          <span className="text-gray-400 ml-1 font-normal">vs last month</span>
        </div>
      </div>
      <div className="p-2 bg-gray-50 text-gray-400 rounded-md border border-gray-100">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;