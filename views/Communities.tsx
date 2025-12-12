import React, { useState, useEffect } from 'react';
import { Community, Platform } from '../types';
import { Users, Activity, Settings as SettingsIcon, MessageSquare, Shield, Bot, ChevronRight, Plus, ArrowLeft, BarChart3, MoreHorizontal, X, Check, Search } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getCommunities, addCommunity, removeCommunity } from '../services/strategyService';

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', platform: Platform.Discord, description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const refreshCommunities = () => {
      setCommunities([...getCommunities()]);
  };

  useEffect(() => {
      refreshCommunities();
      window.addEventListener('strategy-data-change', refreshCommunities);
      return () => window.removeEventListener('strategy-data-change', refreshCommunities);
  }, []);

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const community: Community = {
        id: Date.now().toString(),
        name: newCommunity.name,
        platform: newCommunity.platform,
        icon: `https://ui-avatars.com/api/?name=${newCommunity.name.replace(' ', '+')}&background=random&color=fff`,
        members: 0,
        activeMembers: 0,
        automationStatus: 'active',
        postsToday: 0,
        description: newCommunity.description
    };
    addCommunity(community);
    setIsAddModalOpen(false);
    setNewCommunity({ name: '', platform: Platform.Discord, description: '' });
  };

  const handleDisconnect = () => {
      if (selectedCommunity) {
          removeCommunity(selectedCommunity.id);
          setSelectedCommunity(null);
      }
  };

  const filteredCommunities = communities.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // List View
  if (!selectedCommunity) {
    return (
      <div className="w-full space-y-6 animate-fade-in relative pb-12">
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">Connect New Community</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddCommunity} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                            <input 
                                type="text" 
                                required
                                value={newCommunity.name}
                                onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-shadow shadow-sm"
                                placeholder="e.g. Official Discord"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                            <select 
                                value={newCommunity.platform}
                                onChange={(e) => setNewCommunity({...newCommunity, platform: e.target.value as Platform})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-shadow shadow-sm bg-white"
                            >
                                {Object.values(Platform).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea 
                                value={newCommunity.description}
                                onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-shadow shadow-sm resize-none h-24"
                                placeholder="What is this community about?"
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <Plus size={16} /> Connect Community
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Communities</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage your connected groups and channels.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input 
                        className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                        placeholder="Search communities..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus size={16} /> New Community
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
                <div 
                    key={community.id} 
                    onClick={() => setSelectedCommunity(community)}
                    className="group bg-white dark:bg-[#232323] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src={community.icon} alt={community.name} className="w-12 h-12 rounded-lg border border-gray-100 dark:border-[#333] object-cover" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] group-hover:text-emerald-600 transition-colors">{community.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#8b9092] mt-0.5">
                                        <span className="font-medium">{community.platform}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${community.automationStatus === 'active' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-[#444]'}`}></span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-[#8b9092] mb-6 line-clamp-2 h-10">
                            {community.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#ccc] bg-gray-50 dark:bg-[#1c1c1c] p-3 rounded-md border border-gray-100 dark:border-[#333]">
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-900 dark:text-[#ededed]">{community.members.toLocaleString()}</span>
                                <span className="text-xs text-gray-500 dark:text-[#777]">Members</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-[#333]"></div>
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-900 dark:text-[#ededed]">{community.activeMembers.toLocaleString()}</span>
                                <span className="text-xs text-gray-500 dark:text-[#777]">Active</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-[#333]"></div>
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-900 dark:text-[#ededed]">{community.postsToday}</span>
                                <span className="text-xs text-gray-500 dark:text-[#777]">Posts Today</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-3 border-t border-gray-100 dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#1c1c1c] flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#888] flex items-center gap-1.5">
                            {community.automationStatus === 'active' ? (
                                <><Bot size={14} className="text-emerald-600" /> Automation Active</>
                            ) : (
                                <><Bot size={14} className="text-gray-400" /> Automation Paused</>
                            )}
                        </span>
                        <ChevronRight size={16} className="text-gray-400 dark:text-[#666] group-hover:text-emerald-600 transition-colors" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  // Detail View (unchanged logic)
  return (
    <div className="w-full space-y-6 animate-slide-up pb-12">
        {/* Header */}
        <div className="flex flex-col gap-6">
            <button 
                onClick={() => setSelectedCommunity(null)}
                className="text-sm text-gray-500 dark:text-[#8b9092] hover:text-gray-900 dark:hover:text-[#ededed] flex items-center gap-1 transition-colors w-fit"
            >
                <ArrowLeft size={16} /> Back to Communities
            </button>
            
            <div className="flex justify-between items-start pb-6 border-b border-gray-200 dark:border-[#282828]">
                <div className="flex items-center gap-4">
                    <img src={selectedCommunity.icon} alt={selectedCommunity.name} className="w-16 h-16 rounded-lg border border-gray-200 dark:border-[#333] shadow-sm" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">{selectedCommunity.name}</h1>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="bg-gray-100 dark:bg-[#232323] text-gray-600 dark:text-[#ccc] border border-gray-200 dark:border-[#333] px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                                {selectedCommunity.platform}
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-500 dark:text-[#888] text-sm">{selectedCommunity.members.toLocaleString()} Members</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                     <button className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-[#ededed] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm">
                        Sync Now
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                        Open Community
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-[#282828]">
            <nav className="flex gap-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'overview' 
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'border-transparent text-gray-500 dark:text-[#8b9092] hover:text-gray-700 dark:hover:text-[#ededed] hover:border-gray-300'
                    }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'settings' 
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'border-transparent text-gray-500 dark:text-[#8b9092] hover:text-gray-700 dark:hover:text-[#ededed] hover:border-gray-300'
                    }`}
                >
                    Settings & Automation
                </button>
            </nav>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard 
                        title="Total Members" 
                        value={selectedCommunity.members.toLocaleString()} 
                        change="5.4%" 
                        isPositive={true} 
                        icon={<Users size={20} />} 
                    />
                    <MetricCard 
                        title="Engagement Rate" 
                        value="12.8%" 
                        change="1.2%" 
                        isPositive={true} 
                        icon={<Activity size={20} />} 
                    />
                    <MetricCard 
                        title="AI Actions Taken" 
                        value="142" 
                        change="8.5%" 
                        isPositive={true} 
                        icon={<Bot size={20} />} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-[#333] last:border-0 last:pb-0">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full">
                                        <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-[#ededed]"><span className="font-medium">New discussion</span> started by <span className="font-medium">@alex_dev</span></p>
                                        <p className="text-xs text-gray-500 dark:text-[#888] mt-0.5">2 hours ago • "Best practices for API design"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed] mb-4">Community Health</h3>
                         <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-[#ccc]">Sentiment Score</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">88/100</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-[#333] rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-[#ccc]">Response Rate</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">92%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-[#333] rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-[#ccc]">Spam Detected</span>
                                    <span className="font-medium text-gray-600 dark:text-[#ccc]">0.5%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-[#333] rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '0.5%' }}></div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-[#282828]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ededed]">Automation Rules</h3>
                        <p className="text-sm text-gray-500 dark:text-[#888] mt-1">Configure how AI interacts with this community.</p>
                    </div>
                    
                    <div className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg h-fit">
                                    <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-[#ededed]">AI Moderation</h4>
                                    <p className="text-sm text-gray-500 dark:text-[#888] mt-1 max-w-xl">Automatically flag and hide messages that contain spam, hate speech, or competitor links.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-[#444] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="p-6 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg h-fit">
                                    <MessageSquare size={20} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Auto-Welcome</h4>
                                    <p className="text-sm text-gray-500 dark:text-[#888] mt-1 max-w-xl">Send a personalized welcome message to new members when they join.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-[#444] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="p-6 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg h-fit">
                                    <Bot size={20} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Smart Replies (Draft Mode)</h4>
                                    <p className="text-sm text-gray-500 dark:text-[#888] mt-1 max-w-xl">AI will draft replies to common questions for your review.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-[#444] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                     <button 
                        onClick={handleDisconnect}
                        className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 transition-colors px-4 py-2"
                    >
                        Disconnect Community
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Communities;