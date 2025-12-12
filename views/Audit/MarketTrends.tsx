
import React from 'react';
import AuditProcessRunner from '../../components/Audit/AuditProcessRunner';
import { Zap, TrendingUp, Hash } from 'lucide-react';

const MarketTrends: React.FC = () => {
  const tasks = [
    "Scraping industry news sources...",
    "Analyzing trending hashtags & keywords...",
    "Detecting emerging patterns in consumer behavior...",
    "Cross-referencing with historical data...",
    "Forecasting next month's viral topics..."
  ];

  return (
    <AuditProcessRunner title="Market Trends Forecaster" steps={tasks}>
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Market Trends</h2>
            <p className="text-gray-500 dark:text-[#8b9092]">What's happening now and what's coming next.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Zap size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Rising Trend</span>
                </div>
                <h3 className="text-3xl font-bold mb-2">AI-Generated Authenticity</h3>
                <p className="text-purple-200 text-sm leading-relaxed mb-6">
                    Consumers are paradoxically seeking "human" verification labels on content while engaging heavily with AI-assisted creative visuals.
                </p>
                <div className="flex gap-2">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs">#AIArt</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs">#NoFilter</span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                    <Hash size={18} className="text-blue-500"/> Trending Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['Sustainability', 'Micro-learning', 'Digital Detox', 'Local Sourcing', 'Community-Led', 'Voice Search'].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-[#ccc] rounded-md text-sm border border-gray-200 dark:border-[#333]">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500"/> Strategic Opportunities
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Action: Pivot to Long-form Audio</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Podcasts in your niche are seeing a +40% engagement spike this month.</p>
                </div>
                <div className="p-4 border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm">Action: User Generated Content Campaign</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">Trust in brand-owned content is dipping (-5%); leverage community voices.</p>
                </div>
            </div>
        </div>
      </div>
    </AuditProcessRunner>
  );
};

export default MarketTrends;
