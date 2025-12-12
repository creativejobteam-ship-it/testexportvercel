
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield, Settings, EyeOff, Flag, Filter, MoreHorizontal, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { Platform, ModerationItem } from '../types';
import { DEMO_DATA } from '../services/demoData';

const Moderation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'rules'>('queue');
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Filters
  const [minScore, setMinScore] = useState<number>(0); // 0 = all, 0.8 = high confidence
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
      setItems(DEMO_DATA.moderation);
  }, []);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
        setSelectedIds([]);
    } else {
        setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const handleAction = (action: 'approve' | 'remove' | 'hide', ids: number[]) => {
      // Simulate API call and removal from list
      setItems(items.filter(item => !ids.includes(item.id)));
      setSelectedIds([]);
      // In a real app, we would show a toast here
  };

  const filteredItems = items.filter(item => item.score >= minScore);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
        <div className="flex justify-between items-end pb-4 border-b border-gray-200 dark:border-[#282828]">
             <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Moderation Center</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Review flagged content and manage AI safety rules.</p>
            </div>
            <div className="flex bg-gray-100 dark:bg-[#232323] p-1 rounded-md border border-gray-200 dark:border-[#333]">
                <button 
                    onClick={() => setActiveTab('queue')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'queue' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-[#ededed]'}`}
                >
                    Review Queue
                </button>
                <button 
                    onClick={() => setActiveTab('rules')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-[#ededed]'}`}
                >
                    Automation Rules
                </button>
            </div>
        </div>

        {activeTab === 'queue' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-[#ededed] hover:text-gray-900 dark:hover:text-white"
                        >
                            {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? <CheckSquare size={16} className="text-emerald-600"/> : <Square size={16}/>}
                            Select All
                         </button>
                         <div className="h-4 w-px bg-gray-300 dark:bg-[#444]"></div>
                         
                         <div className="relative">
                             <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="text-xs bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-[#ededed] flex items-center gap-1 transition-colors"
                             >
                                 <Filter size={12}/> Filter: {minScore > 0 ? 'High Severity' : 'All'} <ChevronDown size={10} />
                             </button>
                             {isFilterOpen && (
                                 <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-lg shadow-xl z-20 p-2 animate-fade-in">
                                     <button 
                                        onClick={() => { setMinScore(0); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${minScore === 0 ? 'bg-gray-100 dark:bg-[#333] font-medium' : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]'}`}
                                     >
                                         All Flags
                                     </button>
                                     <button 
                                        onClick={() => { setMinScore(0.8); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${minScore === 0.8 ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]'}`}
                                     >
                                         High Confidence (>80%)
                                     </button>
                                 </div>
                             )}
                         </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#888]">{filteredItems.length} items pending review</span>
                </div>

                {selectedIds.length > 0 && (
                    <div className="sticky top-0 z-10 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded-lg flex justify-between items-center shadow-sm animate-slide-up">
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400 ml-2">{selectedIds.length} items selected</span>
                        <div className="flex gap-2">
                             <button onClick={() => handleAction('approve', selectedIds)} className="bg-white dark:bg-[#2a2a2a] border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                                Approve Selected
                            </button>
                            <button onClick={() => handleAction('remove', selectedIds)} className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                                Remove Selected
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-[#1c1c1c] border border-dashed border-gray-200 dark:border-[#333] rounded-lg">
                            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3"/>
                            <p className="text-gray-900 dark:text-[#ededed] font-medium">All caught up!</p>
                            <p className="text-gray-500 dark:text-[#888] text-sm">No flagged content matching criteria.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                        <div key={item.id} className={`bg-white dark:bg-[#232323] border transition-colors rounded-lg p-5 shadow-sm flex flex-col md:flex-row gap-6 ${selectedIds.includes(item.id) ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 dark:border-[#333]'}`}>
                            <div className="pt-1">
                                <button onClick={() => toggleSelect(item.id)} className="text-gray-400 dark:text-[#555] hover:text-emerald-600 dark:hover:text-emerald-400">
                                    {selectedIds.includes(item.id) ? <CheckSquare size={20} className="text-emerald-600 dark:text-emerald-400"/> : <Square size={20}/>}
                                </button>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-[#ededed] text-sm">{item.author}</span>
                                    <span className="text-xs text-gray-400 px-2 py-0.5 border border-gray-100 dark:border-[#333] rounded-full">{item.platform}</span>
                                    <span className="text-xs text-gray-400">• {item.time}</span>
                                </div>
                                <p className="text-gray-800 dark:text-[#ccc] text-sm mb-3 bg-red-50 dark:bg-red-900/10 p-3 rounded border border-red-100 dark:border-red-900/30">
                                    "{item.content}"
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                                        <Flag size={14} />
                                        Reason: {item.reason}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-[#888]">
                                        <Shield size={14} />
                                        AI Confidence: {(item.score * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 dark:border-[#333] pt-4 md:pt-0 md:pl-6">
                                <button onClick={() => handleAction('approve', [item.id])} className="flex-1 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-[#ededed] px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                                    <CheckCircle size={14} className="text-emerald-500" /> Approve
                                </button>
                                <button onClick={() => handleAction('remove', [item.id])} className="flex-1 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm">
                                    <XCircle size={14} /> Remove
                                </button>
                                <button onClick={() => handleAction('hide', [item.id])} className="flex-1 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-[#ededed] px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                                    <EyeOff size={14} /> Hide
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        )}

        {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#232323] p-6 rounded-lg border border-gray-200 dark:border-[#282828] shadow-sm">
                     <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-emerald-600"/> Auto-Moderation
                     </h3>
                     <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Block Profanity</p>
                                 <p className="text-xs text-gray-500 dark:text-[#888]">Automatically hide messages with bad words.</p>
                             </div>
                             <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                         </div>
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Anti-Spam Filter</p>
                                 <p className="text-xs text-gray-500 dark:text-[#888]">Block repeated messages and excessive links.</p>
                             </div>
                             <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                         </div>
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Competitor Monitoring</p>
                                 <p className="text-xs text-gray-500 dark:text-[#888]">Flag mentions of known competitors.</p>
                             </div>
                             <div className="w-10 h-5 bg-gray-200 dark:bg-[#444] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                         </div>
                     </div>
                </div>

                <div className="bg-white dark:bg-[#232323] p-6 rounded-lg border border-gray-200 dark:border-[#282828] shadow-sm">
                     <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-emerald-600"/> Response Automation
                     </h3>
                     <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Auto-Reply to FAQs</p>
                                 <p className="text-xs text-gray-500 dark:text-[#888]">Use AI to answer common questions instantly.</p>
                             </div>
                             <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                         </div>
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">After-Hours Responder</p>
                                 <p className="text-xs text-gray-500 dark:text-[#888]">Let users know when support is offline.</p>
                             </div>
                             <div className="w-10 h-5 bg-gray-200 dark:bg-[#444] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                         </div>
                     </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Moderation;
