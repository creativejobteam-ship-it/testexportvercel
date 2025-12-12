
import React from 'react';
import AuditProcessRunner from '../../components/Audit/AuditProcessRunner';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

const EReputation: React.FC = () => {
  const tasks = [
    "Scanning review platforms (Google, Trustpilot)...",
    "Monitoring brand mentions on Social Media...",
    "Running Sentiment Analysis (NLP)...",
    "Detecting potential crisis triggers...",
    "Compiling reputation score..."
  ];

  return (
    <AuditProcessRunner title="E-Reputation Monitor" steps={tasks}>
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-gray-200 dark:border-[#282828] pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">E-Reputation Audit</h2>
                <p className="text-gray-500 dark:text-[#8b9092]">Sentiment analysis and brand health check.</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-[#ccc]">Global Score:</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">4.2/5</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-4">Sentiment Breakdown</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2 text-emerald-600"><ThumbsUp size={14}/> Positive</span>
                            <span className="font-medium text-gray-900 dark:text-[#ededed]">65%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-[#333] h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[65%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2 text-gray-500"><MessageSquare size={14}/> Neutral</span>
                            <span className="font-medium text-gray-900 dark:text-[#ededed]">25%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-[#333] h-2 rounded-full overflow-hidden">
                            <div className="bg-gray-400 h-full w-[25%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2 text-red-500"><ThumbsDown size={14}/> Negative</span>
                            <span className="font-medium text-gray-900 dark:text-[#ededed]">10%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-[#333] h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full w-[10%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-4">Alerts & Mentions</h3>
                <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg flex gap-3">
                        <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">High Negative Sentiment Spike</p>
                            <p className="text-xs text-red-600 dark:text-red-300 mt-1">Detected on Twitter regarding "Login Issues" (2 hours ago).</p>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-[#ededed]">"@AutoCM your latest update is amazing! Loving the new UI."</p>
                        <p className="text-xs text-gray-400 mt-1">Twitter • 15 mins ago</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AuditProcessRunner>
  );
};

export default EReputation;
