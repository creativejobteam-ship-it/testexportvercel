
import React from 'react';
import { Database, HardDrive, Zap, MessageSquare, Activity, ArrowUpCircle, Info } from 'lucide-react';

const Usage: React.FC = () => {
  const metrics = [
    {
      id: 'db',
      label: 'Database Size',
      icon: <Database size={20} className="text-emerald-600" />,
      value: '54.2 MB',
      limit: '500 MB',
      percentage: 10.8,
      status: 'healthy',
      subtext: 'Includes all database content and indexes'
    },
    {
      id: 'egress',
      label: 'Egress',
      icon: <ArrowUpCircle size={20} className="text-emerald-600" />,
      value: '1.2 GB',
      limit: '2 GB',
      percentage: 60,
      status: 'warning',
      subtext: 'Outgoing data transfer'
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: <HardDrive size={20} className="text-emerald-600" />,
      value: '0.8 GB',
      limit: '1 GB',
      percentage: 80,
      status: 'warning',
      subtext: 'Asset storage (images, videos)'
    },
    {
      id: 'realtime',
      label: 'Realtime Messages',
      icon: <MessageSquare size={20} className="text-emerald-600" />,
      value: '450K',
      limit: '2M',
      percentage: 22.5,
      status: 'healthy',
      subtext: 'Messages sent/received via Realtime'
    },
    {
      id: 'edge',
      label: 'Edge Function Invocations',
      icon: <Zap size={20} className="text-emerald-600" />,
      value: '125K',
      limit: '500K',
      percentage: 25,
      status: 'healthy',
      subtext: 'Total function executions'
    },
    {
      id: 'mau',
      label: 'Monthly Active Users',
      icon: <Activity size={20} className="text-emerald-600" />,
      value: '1,240',
      limit: '50,000',
      percentage: 2.4,
      status: 'healthy',
      subtext: 'Unique users authenticated'
    }
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col gap-1 border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Usage</h2>
        <p className="text-gray-500 dark:text-[#8b9092]">
          Your organization's resource consumption for the current billing cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-[#333] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                  {metric.icon}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-[#ededed]">{metric.label}</h3>
              </div>
              {metric.percentage >= 80 && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium border border-amber-200">
                  Approaching Limit
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">{metric.value}</span>
                <span className="text-sm text-gray-500 dark:text-[#888] mb-1">/ {metric.limit}</span>
              </div>
              
              <div className="w-full h-2 bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.percentage > 90 ? 'bg-red-500' : 
                    metric.percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${metric.percentage}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-gray-400 dark:text-[#666] pt-1">
                {metric.subtext}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2e2e2e]">
               {metric.percentage > 75 ? (
                   <button className="w-full text-center text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 py-2 rounded-md transition-colors shadow-sm">
                       Upgrade Plan
                   </button>
               ) : (
                   <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#888]">
                       <Info size={14} /> Usage resets on Nov 1st
                   </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#282828] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1">Need more power?</h3>
              <p className="text-gray-500 dark:text-[#8b9092] text-sm max-w-xl">
                  Scale your project with the Pro plan. Get higher limits for database size, storage, and transfer, plus advanced security features.
              </p>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg">
              Upgrade to Pro
          </button>
      </div>
    </div>
  );
};

export default Usage;
