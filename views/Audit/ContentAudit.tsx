
import React from 'react';
import AuditProcessRunner from '../../components/Audit/AuditProcessRunner';
import { PieChart, List, RefreshCw } from 'lucide-react';

const ContentAudit: React.FC = () => {
  const tasks = [
    "Indexing all published content assets...",
    "Categorizing by topic and format...",
    "Calculating performance metrics (CTR, Engagement)...",
    "Identifying content gaps vs audience interest...",
    "Generating optimization recommendations..."
  ];

  return (
    <AuditProcessRunner title="Content Strategy Auditor" steps={tasks}>
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Content Audit</h2>
            <p className="text-gray-500 dark:text-[#8b9092]">Inventory and performance analysis of your assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="text-gray-500 dark:text-[#888] text-xs font-bold uppercase tracking-wider mb-2">Top Format</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Video / Reels</p>
                <p className="text-xs text-emerald-500 mt-1">4.5x higher engagement than static</p>
            </div>
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="text-gray-500 dark:text-[#888] text-xs font-bold uppercase tracking-wider mb-2">Content Health</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Healthy</p>
                <p className="text-xs text-gray-400 mt-1">Consistency score: 92/100</p>
            </div>
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="text-gray-500 dark:text-[#888] text-xs font-bold uppercase tracking-wider mb-2">Recycle Potential</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">12 Assets</p>
                <p className="text-xs text-blue-500 mt-1">Ready for re-purposing</p>
            </div>
        </div>

        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                <RefreshCw size={18} className="text-emerald-500"/> Optimization Recommendations
            </h3>
            <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-700 dark:text-[#ccc]">
                        <span className="font-bold">Update SEO Meta:</span> 5 high-traffic blog posts have missing meta-descriptions.
                    </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-700 dark:text-[#ccc]">
                        <span className="font-bold">Repurpose Webinar:</span> The "Q4 Strategy" webinar had high retention. Create 5 short clips for LinkedIn/TikTok.
                    </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-700 dark:text-[#ccc]">
                        <span className="font-bold">Archive Outdated:</span> 3 product pages reference 2022 pricing.
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </AuditProcessRunner>
  );
};

export default ContentAudit;
