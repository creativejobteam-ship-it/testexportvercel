
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, Users, Eye, Search, FileText, Filter, MoreHorizontal, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useAuth } from '../src/contexts/AuthProvider';
import { getAllProjects as getLocalProjects } from '../services/strategyService';
import { getAllProjects as getLiveProjects } from '../src/services/dbService';
import { Project } from '../types';

interface AnalyticsProps {
  viewMode?: 'overview' | 'reports';
  onNavigate?: (view: string, id: string | null) => void;
  isEmbedded?: boolean;
}

const engagementData = [
  { name: 'Mon', twitter: 4000, discord: 2400 },
  { name: 'Tue', twitter: 3000, discord: 1398 },
  { name: 'Wed', twitter: 2000, discord: 9800 },
  { name: 'Thu', twitter: 2780, discord: 3908 },
  { name: 'Fri', twitter: 1890, discord: 4800 },
  { name: 'Sat', twitter: 2390, discord: 3800 },
  { name: 'Sun', twitter: 3490, discord: 4300 },
];

const demographicsData = [
    { name: 'USA', value: 35 },
    { name: 'UK', value: 20 },
    { name: 'Germany', value: 15 },
    { name: 'Canada', value: 10 },
    { name: 'Other', value: 20 },
];

const Analytics: React.FC<AnalyticsProps> = ({ viewMode = 'overview', onNavigate, isEmbedded = false }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (viewMode === 'reports') {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                if (user && user.uid !== 'demo-user-123') {
                    const liveProjects = await getLiveProjects(user.uid);
                    setProjects(liveProjects);
                } else {
                    setProjects(getLocalProjects());
                }
            } catch (e) {
                console.error("Failed to load projects for reports", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }
  }, [viewMode, user]);

  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  if (viewMode === 'reports') {
      const filteredReports = projects
        .map(p => ({
            ...p,
            // Create the standardized Report Name for searching/display
            reportName: `Rpt / ${p.clientName || 'Client'} / ${p.name}`
        }))
        .filter(p => p.reportName.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
            {!isEmbedded && (
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
                <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Project Reports</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-2">Download performance reports and analytics summaries.</p>
            </div>
            )}

            {/* Toolbar */}
            <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isEmbedded ? 'mb-4' : 'mb-6'}`}>
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input 
                        className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                        placeholder="Search reports (e.g. 'Rpt/BioCorp...')" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] shadow-sm">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            {/* Reports List */}
            <div className={`bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-visible ${isEmbedded ? 'flex-1 overflow-y-auto custom-scrollbar' : ''}`}>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-500" />
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-[#8b9092]">
                        No reports found matching your criteria.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Report Reference</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Generated Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Format</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {filteredReports.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-900 dark:text-[#ededed]">{project.reportName}</span>
                                                <span className="text-xs text-gray-500 dark:text-[#888]">{project.activitySector || 'General'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-[#ccc] border border-gray-200 dark:border-[#444]">
                                            PDF
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            Available
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="flex justify-end items-center gap-2">
                                            <button 
                                                onClick={() => alert("Downloading report...")}
                                                className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-[#333] rounded-md transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download size={18} />
                                            </button>
                                            
                                            <div className="relative inline-block text-left">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionMenuOpenId(actionMenuOpenId === project.id ? null : project.id);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>

                                                {actionMenuOpenId === project.id && (
                                                    <div 
                                                        className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-slide-up"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <button 
                                                            onClick={() => alert("Viewing report details...")}
                                                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                        >
                                                            <Eye size={14} /> View Details
                                                        </button>
                                                        <button 
                                                            onClick={() => onNavigate && onNavigate('project-details', project.id)}
                                                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                        >
                                                            <ArrowRight size={14} /> Go to Project
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
      {!isEmbedded && (
      <div className="flex justify-between items-end pb-6 border-b border-gray-200 dark:border-[#282828]">
        <div>
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Analytics</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Deep dive into community performance metrics.</p>
        </div>
        <button className="bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-200 dark:border-[#383838] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} /> Export PDF
        </button>
      </div>
      )}

      {/* Embedded Controls */}
      {isEmbedded && (
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">Performance Analytics</h3>
              <button className="bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-200 dark:border-[#383838] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm flex items-center gap-2">
                  <Download size={14} /> Report
              </button>
          </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard title="Total Impressions" value="1.2M" change="14%" isPositive={true} icon={<Eye size={20} />} />
        <MetricCard title="Active Members" value="15,420" change="3.2%" isPositive={true} icon={<Users size={20} />} />
        <MetricCard title="Avg Engagement" value="4.8%" change="0.5%" isPositive={false} icon={<TrendingUp size={20} />} />
      </div>

      <div className={`space-y-6 ${isEmbedded ? 'flex-1 overflow-y-auto custom-scrollbar pr-2' : ''}`}>
        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] mb-6">Cross-Channel Engagement</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="stroke-gray-200 dark:stroke-[#333]" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }} />
                            <Legend />
                            <Area type="monotone" dataKey="twitter" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" name="Twitter" />
                            <Area type="monotone" dataKey="discord" stroke="#10b981" fillOpacity={0.1} fill="#10b981" name="Discord" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] mb-6">Member Demographics</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demographicsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" className="stroke-gray-200 dark:stroke-[#333]" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={70} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Top Posts Table */}
        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#282828]">
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed]">Top Performing Posts</h3>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                    <tr>
                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Content</th>
                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Platform</th>
                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Likes</th>
                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Comments</th>
                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Reach</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                        <td className="px-6 py-4 text-gray-900 dark:text-[#ededed] font-medium truncate max-w-xs">Announcing our Series B funding round!</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">Twitter</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">1,240</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">342</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">45k</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                        <td className="px-6 py-4 text-gray-900 dark:text-[#ededed] font-medium truncate max-w-xs">How we scaled our database to 10M users.</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">LinkedIn</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">890</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">120</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">22k</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                        <td className="px-6 py-4 text-gray-900 dark:text-[#ededed] font-medium truncate max-w-xs">Join our Discord for live support.</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">Discord</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">560</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">890</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">12k</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
