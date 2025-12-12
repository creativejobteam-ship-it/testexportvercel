
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, TrendingUp, Zap, FileText, Bell, Plus, AlertTriangle, LifeBuoy, Info } from 'lucide-react';
import AutopilotWidget from '../components/AutopilotWidget';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const data = [
  { name: 'Mon', engagement: 4000 },
  { name: 'Tue', engagement: 3000 },
  { name: 'Wed', engagement: 5000 },
  { name: 'Thu', engagement: 2780 },
  { name: 'Fri', engagement: 6890 },
  { name: 'Sat', engagement: 4390 },
  { name: 'Sun', engagement: 7490 },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-fade-in w-full pb-12">
      <div className="flex justify-between items-end pb-4 border-b border-gray-200 dark:border-[#282828]">
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Dashboard</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1">Overview of your community health and automation status.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-200 dark:border-[#383838] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm">
                Download Report
            </button>
        </div>
      </div>

      {/* Autopilot Control Center */}
      <AutopilotWidget />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] flex items-start justify-between">
           <div>
               <p className="text-sm font-normal text-gray-500 dark:text-[#8b9092] mb-1">Scheduled Posts</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">24</h3>
               <div className="flex items-center mt-2 text-sm font-medium text-emerald-600 dark:text-[#3ecf8e]">
                   <span>↑ 12%</span>
                   <span className="text-gray-400 dark:text-[#6e6e6e] ml-1 font-normal">vs last month</span>
               </div>
           </div>
           <div className="p-2 bg-gray-50 dark:bg-[#2c2c2c] text-gray-400 dark:text-[#8b9092] rounded-md border border-gray-100 dark:border-[#383838]">
               <FileText size={20} />
           </div>
        </div>

        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] flex items-start justify-between relative group">
           <div>
               <div className="flex items-center gap-1.5 mb-1">
                   <p className="text-sm font-normal text-gray-500 dark:text-[#8b9092]">Flagged Content</p>
                   <Info size={12} className="text-gray-400 cursor-help" />
                   {/* Tooltip */}
                   <div className="absolute top-2 left-32 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                       Content requiring manual moderation review.
                   </div>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">5</h3>
               <div className="flex items-center mt-2 text-sm font-medium text-emerald-600 dark:text-[#3ecf8e]">
                   <span>↓ 2%</span>
                   <span className="text-gray-400 dark:text-[#6e6e6e] ml-1 font-normal">vs last month</span>
               </div>
           </div>
           <div className="p-2 bg-gray-50 dark:bg-[#2c2c2c] text-gray-400 dark:text-[#8b9092] rounded-md border border-gray-100 dark:border-[#383838]">
               <AlertTriangle size={20} />
           </div>
        </div>

        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] flex items-start justify-between">
           <div>
               <p className="text-sm font-normal text-gray-500 dark:text-[#8b9092] mb-1">Support Tickets</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">12</h3>
               <div className="flex items-center mt-2 text-sm font-medium text-emerald-600 dark:text-[#3ecf8e]">
                   <span>↑ 8%</span>
                   <span className="text-gray-400 dark:text-[#6e6e6e] ml-1 font-normal">vs last month</span>
               </div>
           </div>
           <div className="p-2 bg-gray-50 dark:bg-[#2c2c2c] text-gray-400 dark:text-[#8b9092] rounded-md border border-gray-100 dark:border-[#383838]">
               <LifeBuoy size={20} />
           </div>
        </div>

        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] flex items-start justify-between">
           <div>
               <p className="text-sm font-normal text-gray-500 dark:text-[#8b9092] mb-1">Engagement Rate</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">8.4%</h3>
               <div className="flex items-center mt-2 text-sm font-medium text-emerald-600 dark:text-[#3ecf8e]">
                   <span>↑ 2.1%</span>
                   <span className="text-gray-400 dark:text-[#6e6e6e] ml-1 font-normal">vs last month</span>
               </div>
           </div>
           <div className="p-2 bg-gray-50 dark:bg-[#2c2c2c] text-gray-400 dark:text-[#8b9092] rounded-md border border-gray-100 dark:border-[#383838]">
               <TrendingUp size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed]">Engagement Overview</h3>
             <select className="text-sm border-gray-300 dark:border-[#383838] rounded-md text-gray-600 dark:text-[#8b9092] bg-white dark:bg-[#1c1c1c] border p-1 outline-none focus:border-emerald-500 dark:focus:border-[#3ecf8e]">
                 <option>Last 7 days</option>
                 <option>Last 30 days</option>
             </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-[#2e2e2e]" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                    tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }}
                    itemStyle={{ color: '#3ecf8e' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#3ecf8e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorEngagement)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notifications */}
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-emerald-600 dark:text-[#3ecf8e]"/> Quick Actions
                </h3>
                <div className="space-y-3">
                    <button onClick={() => onNavigate('publisher')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#1c1c1c] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:border-emerald-500/50 dark:hover:border-[#3ecf8e]/50 rounded-md border border-gray-200 dark:border-[#2e2e2e] transition-all text-sm font-medium text-gray-700 dark:text-[#ededed] flex items-center gap-3 group">
                        <Plus size={16} className="text-gray-400 dark:text-[#6e6e6e] group-hover:text-emerald-600 dark:group-hover:text-[#3ecf8e]"/> Create New Post
                    </button>
                    <button onClick={() => onNavigate('communities')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#1c1c1c] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:border-emerald-500/50 dark:hover:border-[#3ecf8e]/50 rounded-md border border-gray-200 dark:border-[#2e2e2e] transition-all text-sm font-medium text-gray-700 dark:text-[#ededed] flex items-center gap-3 group">
                        <Users size={16} className="text-gray-400 dark:text-[#6e6e6e] group-hover:text-emerald-600 dark:group-hover:text-[#3ecf8e]"/> Invite Member
                    </button>
                    <button onClick={() => onNavigate('analytics')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#1c1c1c] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:border-emerald-500/50 dark:hover:border-[#3ecf8e]/50 rounded-md border border-gray-200 dark:border-[#2e2e2e] transition-all text-sm font-medium text-gray-700 dark:text-[#ededed] flex items-center gap-3 group">
                        <FileText size={16} className="text-gray-400 dark:text-[#6e6e6e] group-hover:text-emerald-600 dark:group-hover:text-[#3ecf8e]"/> Generate Report
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                        <Bell size={16} className="text-gray-400 dark:text-[#6e6e6e]"/> Notifications
                    </h3>
                    <span className="bg-gray-100 dark:bg-[#1c1c1c] text-red-600 dark:text-red-400 text-xs px-1.5 py-0.5 rounded-full font-medium border border-red-200 dark:border-red-900/30">3</span>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#3ecf8e] mt-1.5 shrink-0"></div>
                        <div>
                            <p className="text-sm text-gray-900 dark:text-[#ededed]">Post scheduled for Twitter successfully.</p>
                            <p className="text-xs text-gray-500 dark:text-[#6e6e6e] mt-0.5">2 mins ago</p>
                        </div>
                    </div>
                     <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                        <div>
                            <p className="text-sm text-gray-900 dark:text-[#ededed]">High negative sentiment detected in Discord.</p>
                            <p className="text-xs text-gray-500 dark:text-[#6e6e6e] mt-0.5">15 mins ago</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        <div>
                            <p className="text-sm text-gray-900 dark:text-[#ededed]">New feature request from VIP user.</p>
                            <p className="text-xs text-gray-500 dark:text-[#6e6e6e] mt-0.5">1 hour ago</p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-4 text-center text-xs text-gray-500 dark:text-[#8b9092] hover:text-emerald-600 dark:hover:text-[#3ecf8e] font-medium transition-colors">
                    View All Notifications
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
