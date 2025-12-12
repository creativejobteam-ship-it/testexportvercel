import React, { useState, useEffect } from 'react';
import { Strategy } from '../types';
import { getStrategies, deleteStrategy, addNewStrategy } from '../services/strategyService';
import { 
  Calendar, 
  Trash2, 
  Sparkles, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  ArrowRight, 
  X,
  Target,
  ListChecks,
  AlertCircle,
  Loader2,
  Layers,
  Edit,
  Copy,
  RefreshCw,
  Mail,
  ChevronRight
} from 'lucide-react';

interface StrategyManagerProps {
  onNavigate: (view: string) => void;
}

const StrategyManager: React.FC<StrategyManagerProps> = ({ onNavigate }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newStrategyClient, setNewStrategyClient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    setStrategies(getStrategies());
  }, []);

  // Filter Logic
  const filteredStrategies = strategies.filter(s => {
      const matchesSearch = 
        s.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.theme.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesClient = clientFilter === 'all' || s.clientId === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
  });

  const uniqueClients = Array.from(new Set(strategies.map(s => JSON.stringify({id: s.clientId, name: s.clientName}))))
    .map((str) => JSON.parse(str as string));

  // Helper Functions
  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'active': return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>;
          case 'completed': return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Completed</span>;
          case 'draft': return <span className="bg-gray-100 text-gray-700 dark:bg-[#333] dark:text-[#8b9092] text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Draft</span>;
          case 'archived': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Archived</span>;
          default: return null;
      }
  };

  const getPerformanceColor = (score: number) => {
      if (score >= 80) return 'bg-emerald-500';
      if (score >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  const handleDeleteStrategy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this strategy?')) {
        deleteStrategy(id);
        setStrategies(getStrategies());
        setActionMenuOpenId(null);
        if (selectedStrategy?.id === id) setSelectedStrategy(null);
    }
  };

  const handleDuplicate = (strategy: Strategy, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStrategy: Strategy = {
        ...strategy,
        id: `str_${Date.now()}`,
        status: 'draft',
        theme: `${strategy.theme} (Copy)`,
        performanceScore: 0
    };
    addNewStrategy(newStrategy);
    setStrategies(getStrategies());
    setActionMenuOpenId(null);
  };

  const handleUpdateStatus = (strategy: Strategy, newStatus: Strategy['status'], e: React.MouseEvent) => {
    e.stopPropagation();
    strategy.status = newStatus;
    setStrategies([...strategies]);
    setActionMenuOpenId(null);
  };

  const handleGenerateSimulation = () => {
      if (!newStrategyClient) return;
      setIsGenerating(true);
      
      // Simulate API delay
      setTimeout(() => {
          const newStrat: Strategy = {
              id: `str_${Date.now()}`,
              clientId: newStrategyClient,
              clientName: newStrategyClient === 'new' ? 'New Client Inc.' : 'Existing Client Ltd.',
              clientAvatar: `https://picsum.photos/seed/${Date.now()}/40/40`,
              domain: 'Technology',
              periodStart: new Date().toISOString().split('T')[0],
              periodEnd: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
              performanceScore: 0,
              month: 'Next Month',
              year: new Date().getFullYear(),
              theme: 'Generated Strategy Theme',
              goals: ['Generated Goal 1', 'Generated Goal 2'],
              contentPillars: ['Pillar A', 'Pillar B', 'Pillar C'],
              status: 'draft',
              actionPlan: []
          };
          addNewStrategy(newStrat);
          setStrategies(getStrategies());
          setIsGenerating(false);
          setIsGenerateModalOpen(false);
          setSelectedStrategy(newStrat);
      }, 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in h-[calc(100vh-6rem)] flex flex-col relative">
        {/* Header & Filters */}
        <div className="bg-white dark:bg-[#232323] p-4 rounded-lg border border-gray-200 dark:border-[#282828] shadow-sm shrink-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Strategy Library</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] text-sm mt-0.5">Manage all AI-generated strategies across your client portfolio.</p>
                </div>
                <button 
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Sparkles size={16} /> Generate New Strategy
                </button>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by client or theme..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed]"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select 
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700 dark:text-[#ededed]"
                    >
                        <option value="all">All Clients</option>
                        {uniqueClients.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700 dark:text-[#ededed]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm flex flex-col">
            <div className="overflow-auto custom-scrollbar flex-1">
                {filteredStrategies.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4 text-gray-400">
                             <Layers size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-[#ededed]">No strategies found</h3>
                        <p className="text-gray-500 dark:text-[#8b9092] mt-1 max-w-sm mx-auto">Try adjusting your filters or generate a new strategy for a client to get started.</p>
                        <button 
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="mt-6 text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-2"
                        >
                            Create First Strategy <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Theme / Period</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Domain</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Performance</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {filteredStrategies.map((strategy) => (
                                <tr 
                                    key={strategy.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                                    onClick={() => setSelectedStrategy(strategy)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={strategy.clientAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                                            <span className="font-medium text-gray-900 dark:text-[#ededed]">{strategy.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-[#ededed]">{strategy.theme}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-[#8b9092] mt-0.5">
                                                <Calendar size={12} /> {strategy.month} {strategy.year}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-[#8b9092] px-2 py-1 rounded text-xs font-medium border border-gray-200 dark:border-[#383838]">
                                            {strategy.domain || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(strategy.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-gray-100 dark:bg-[#1c1c1c] rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${getPerformanceColor(strategy.performanceScore || 0)}`} 
                                                    style={{width: `${strategy.performanceScore || 0}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 dark:text-[#8b9092]">{strategy.performanceScore || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                         <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActionMenuOpenId(actionMenuOpenId === strategy.id ? null : strategy.id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                         >
                                            <MoreVertical size={18} />
                                         </button>

                                         {actionMenuOpenId === strategy.id && (
                                             <>
                                             <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(null); }}></div>
                                             <div className="absolute right-8 top-8 w-56 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 animate-fade-in flex flex-col">
                                                 <button
                                                    onClick={(e) => { e.stopPropagation(); alert('Edit feature coming soon'); setActionMenuOpenId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed] rounded-t-md"
                                                 >
                                                     <Edit size={14} /> Edit Strategy
                                                 </button>
                                                 <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedStrategy(strategy); setActionMenuOpenId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                 >
                                                     <Eye size={14} /> View Details
                                                 </button>
                                                 <button
                                                    onClick={(e) => handleDuplicate(strategy, e)}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                 >
                                                     <Copy size={14} /> Duplicate
                                                 </button>
                                                 
                                                 {/* Change Status Group */}
                                                 <div className="relative group">
                                                    <button
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between text-gray-700 dark:text-[#ededed]"
                                                    >
                                                         <div className="flex items-center gap-2">
                                                             <RefreshCw size={14} /> Change Status
                                                         </div>
                                                         <ChevronRight size={14} className="text-gray-400" />
                                                    </button>
                                                    {/* Submenu */}
                                                    <div className="hidden group-hover:block absolute right-full top-0 w-32 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg mr-1 z-50">
                                                         {(['draft', 'active', 'completed', 'archived'] as const).map((status) => (
                                                             <button
                                                                key={status}
                                                                onClick={(e) => handleUpdateStatus(strategy, status, e)}
                                                                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] capitalize block first:rounded-t-md last:rounded-b-md ${strategy.status === status ? 'font-semibold text-emerald-600' : 'text-gray-700 dark:text-[#ededed]'}`}
                                                             >
                                                                 {status}
                                                             </button>
                                                         ))}
                                                    </div>
                                                 </div>

                                                 <button
                                                    onClick={(e) => { e.stopPropagation(); alert(`Report sent to ${strategy.clientName}`); setActionMenuOpenId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                 >
                                                     <Mail size={14} /> Email Report
                                                 </button>
                                                 <div className="border-t border-gray-100 dark:border-[#383838] my-1"></div>
                                                 <button
                                                    onClick={(e) => handleDeleteStrategy(strategy.id, e)}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2 rounded-b-md"
                                                 >
                                                     <Trash2 size={14} /> Delete
                                                 </button>
                                             </div>
                                             </>
                                         )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Quick Preview Drawer */}
        {selectedStrategy && (
            <>
                <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-20" onClick={() => setSelectedStrategy(null)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-[450px] bg-white dark:bg-[#1c1c1c] border-l border-gray-200 dark:border-[#282828] shadow-2xl z-30 flex flex-col animate-slide-up">
                    <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-start">
                        <div>
                             <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 block">Strategy Preview</span>
                             <h3 className="text-xl font-bold text-gray-900 dark:text-[#ededed]">{selectedStrategy.theme}</h3>
                             <div className="flex items-center gap-2 mt-2">
                                 <img src={selectedStrategy.clientAvatar} className="w-5 h-5 rounded-full" />
                                 <span className="text-sm text-gray-600 dark:text-[#8b9092]">{selectedStrategy.clientName}</span>
                                 <span className="text-gray-300">•</span>
                                 <span className="text-sm text-gray-500">{selectedStrategy.month} {selectedStrategy.year}</span>
                             </div>
                        </div>
                        <button onClick={() => setSelectedStrategy(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-[#ededed] mb-3 flex items-center gap-2">
                                <Target size={18} className="text-emerald-500"/> Main Goals
                            </h4>
                            <ul className="space-y-2">
                                {selectedStrategy.goals.map((g, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-[#b4b4b4]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-[#ededed] mb-3 flex items-center gap-2">
                                <Layers size={18} className="text-blue-500"/> Content Pillars
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedStrategy.contentPillars.map((p, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                         <div className="bg-gray-50 dark:bg-[#232323] p-4 rounded-lg border border-gray-100 dark:border-[#333]">
                            <h4 className="font-semibold text-gray-900 dark:text-[#ededed] mb-3 flex items-center gap-2">
                                <ListChecks size={18} className="text-gray-500"/> Tasks Overview
                            </h4>
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-600 dark:text-[#8b9092]">Completion</span>
                                <span className="font-medium text-gray-900 dark:text-[#ededed]">{selectedStrategy.actionPlan.filter(t => t.status === 'completed').length}/{selectedStrategy.actionPlan.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-[#111] rounded-full h-2 mb-4">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(selectedStrategy.actionPlan.filter(t => t.status === 'completed').length / selectedStrategy.actionPlan.length) * 100}%` }}></div>
                            </div>
                            <button 
                                onClick={() => onNavigate('action-plan')}
                                className="w-full py-2 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded text-sm font-medium text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                            >
                                View Detailed Action Plan
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-[#282828] bg-gray-50 dark:bg-[#232323]">
                        <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                            Open Full Strategy <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </>
        )}

        {/* Generate New Strategy Modal */}
        {isGenerateModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                    <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-[#ededed]">New Strategy Generation</h3>
                        <button onClick={() => setIsGenerateModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-2">Select Client</label>
                            <select 
                                value={newStrategyClient}
                                onChange={(e) => setNewStrategyClient(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] rounded-md text-gray-900 dark:text-[#ededed] outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Choose a Client --</option>
                                <option value="1">TechCorp</option>
                                <option value="2">DesignStudio</option>
                                <option value="3">Bistro 55</option>
                            </select>
                        </div>

                        {newStrategyClient && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 flex gap-3">
                                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400">Briefing Status: Completed</h4>
                                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                        We have all the necessary data to generate a strategy for this client.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleGenerateSimulation}
                            disabled={!newStrategyClient || isGenerating}
                            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-md hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {isGenerating ? 'AI is Generating...' : 'Launch AI Generation'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default StrategyManager;