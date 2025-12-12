
import React, { useEffect, useState } from 'react';
import { getStrategies as getLocalStrategies } from '../services/strategyService';
import { getStrategies as getLiveStrategies } from '../src/services/dbService';
import { useAuth } from '../src/contexts/AuthProvider';
import { Strategy } from '../types';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Share2, 
  Printer,
  Calendar as CalendarIcon,
  CheckCircle2,
  List,
  Target,
  BarChart2,
  Clock,
  ChevronRight,
  MoreVertical,
  Pencil,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import WorkflowProgressCircle from '../components/WorkflowProgressCircle';

interface ActionPlanViewProps {
  // 
}

const ActionPlanView: React.FC<ActionPlanViewProps> = () => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('context');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
        setIsLoading(true);
        try {
            let all: Strategy[] = [];
            if (user && user.uid !== 'demo-user-123') {
                all = await getLiveStrategies(user.uid);
            } else {
                all = getLocalStrategies();
            }
            // STRICT FILTER: Show only strategies that are Active or Completed
            const readyStrategies = all.filter(s => s.status === 'active' || s.status === 'completed');
            setStrategies(readyStrategies);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchStrategies();
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const selectedDoc = strategies.find(s => s.id === selectedDocId);

  const getProgressData = (strategy: Strategy) => {
      const actionPlan = strategy.actionPlan || [];
      const total = actionPlan.length;
      const completed = actionPlan.filter(t => t.status === 'completed').length;
      // Active if tasks exist but not all are done
      const isActive = total > 0 && completed < total;
      const isCompleted = total > 0 && completed === total;
      
      return { current: completed, total, isActive, isCompleted };
  };

  // --- Document Editor View ---
  if (selectedDoc) {
      // ... (Existing editor code)
      return (
          <div className="w-full flex flex-col h-[calc(100vh-6rem)] animate-fade-in relative">
              {/* Document Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#282828] mb-6">
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedDocId(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full text-gray-500 transition-colors"
                      >
                          <ArrowLeft size={20} />
                      </button>
                      <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                              {selectedDoc.theme} 
                              <span className="text-gray-400 font-normal">| {selectedDoc.month} {selectedDoc.year}</span>
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-[#8b9092]">
                              Prepared for <span className="font-medium text-gray-700 dark:text-[#ccc]">{selectedDoc.clientName}</span>
                          </p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <button className="text-gray-500 hover:text-gray-900 dark:text-[#8b9092] dark:hover:text-[#ededed] px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
                          <Share2 size={16} /> Share
                      </button>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
                          <Download size={16} /> Export PDF
                      </button>
                  </div>
              </div>

              <div className="flex gap-8 flex-1 overflow-hidden">
                  {/* Sidebar Navigation */}
                  <div className="w-64 shrink-0 overflow-y-auto hidden lg:block pr-4 border-r border-gray-100 dark:border-[#282828]">
                      <nav className="space-y-1 sticky top-0">
                          <button 
                            onClick={() => setActiveSection('context')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeSection === 'context' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-600 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                          >
                              <FileText size={16} /> Executive Context
                          </button>
                          <button 
                            onClick={() => setActiveSection('objectives')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeSection === 'objectives' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-600 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                          >
                              <Target size={16} /> Objectives & Goals
                          </button>
                          <button 
                            onClick={() => setActiveSection('calendar')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeSection === 'calendar' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-600 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                          >
                              <CalendarIcon size={16} /> Operational Calendar
                          </button>
                           <button 
                            onClick={() => setActiveSection('kpis')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeSection === 'kpis' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-600 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                          >
                              <BarChart2 size={16} /> KPI Forecast
                          </button>
                      </nav>
                  </div>

                  {/* Main Document Content (A4 Style) */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1c1c1c] shadow-lg border border-gray-200 dark:border-[#282828] min-h-[800px] p-12 rounded-sm relative">
                          
                          {/* Watermark / Background Styling */}
                          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                              <span className="text-6xl font-bold text-gray-300 dark:text-[#333]">DRAFT</span>
                          </div>

                          {/* Paper Header */}
                          <div className="border-b border-gray-200 dark:border-[#333] pb-8 mb-8 flex justify-between items-end">
                              <div>
                                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                      <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                                      <span className="font-bold tracking-tight">AutoCommunity</span>
                                  </div>
                                  <h1 className="text-3xl font-bold text-gray-900 dark:text-[#ededed]">{selectedDoc.theme}</h1>
                                  <p className="text-gray-500 dark:text-[#8b9092] mt-2 text-lg">Action Plan • {selectedDoc.month} {selectedDoc.year}</p>
                              </div>
                              <div className="text-right">
                                  <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Client</div>
                                  <div className="flex items-center justify-end gap-2 mt-1">
                                      <img src={selectedDoc.clientAvatar} className="w-6 h-6 rounded-full" />
                                      <span className="font-medium text-gray-900 dark:text-[#ededed]">{selectedDoc.clientName}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Section 1: Executive Context */}
                          <div id="context" className="mb-12">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                  <FileText size={16} className="text-emerald-600" /> 1. Executive Context
                              </h3>
                              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-[#b4b4b4] bg-gray-50 dark:bg-[#232323] p-6 rounded-lg border border-gray-100 dark:border-[#333] italic" contentEditable suppressContentEditableWarning>
                                  {selectedDoc.executiveSummary || "This strategy is designed to maximize engagement and drive conversions through a mix of high-value content and targeted community interactions. The focus for this period is to strengthen brand loyalty while expanding our reach to new audiences."}
                              </div>
                          </div>

                          {/* Section 2: Objectives */}
                          <div id="objectives" className="mb-12">
                               <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                  <Target size={16} className="text-emerald-600" /> 2. Strategic Objectives
                              </h3>
                              <div className="grid grid-cols-1 gap-4">
                                  {selectedDoc.goals.map((goal, idx) => (
                                      <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-[#333] rounded-lg">
                                          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                              {idx + 1}
                                          </div>
                                          <div>
                                              <h4 className="font-semibold text-gray-900 dark:text-[#ededed] mb-1" contentEditable suppressContentEditableWarning>{goal}</h4>
                                              <p className="text-sm text-gray-500 dark:text-[#8b9092]" contentEditable suppressContentEditableWarning>Primary objective for this period.</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                           {/* Section 3: Content Pillars */}
                           <div id="pillars" className="mb-12">
                               <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                  <List size={16} className="text-emerald-600" /> 3. Content Pillars
                              </h3>
                              <div className="grid grid-cols-3 gap-4">
                                  {selectedDoc.contentPillars.map((pillar, idx) => (
                                      <div key={idx} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-center border border-blue-100 dark:border-blue-800/30">
                                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{pillar}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Section 4: Calendar */}
                          <div id="calendar" className="mb-12">
                               <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                  <CalendarIcon size={16} className="text-emerald-600" /> 4. Operational Timeline
                              </h3>
                              <div className="border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-gray-50 dark:bg-[#232323] border-b border-gray-200 dark:border-[#333]">
                                          <tr>
                                              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#8b9092]">Task</th>
                                              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#8b9092]">Due Date</th>
                                              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#8b9092]">Status</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                                          {selectedDoc.actionPlan?.map((task) => (
                                              <tr key={task.id}>
                                                  <td className="px-4 py-3 text-gray-900 dark:text-[#ededed]">{task.task}</td>
                                                  <td className="px-4 py-3 text-gray-500 dark:text-[#8b9092] whitespace-nowrap">{task.dueDate}</td>
                                                  <td className="px-4 py-3">
                                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                                          {task.status}
                                                      </span>
                                                  </td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>

                          {/* Section 5: KPIs */}
                          <div id="kpis" className="mb-8">
                               <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                  <BarChart2 size={16} className="text-emerald-600" /> 5. Projected KPIs
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {(selectedDoc.kpis || [
                                      {label: 'Engagement', value: '+15%'},
                                      {label: 'Reach', value: '50k'},
                                      {label: 'Leads', value: '120'},
                                      {label: 'Conversion', value: '3.2%'}
                                  ]).map((kpi, idx) => (
                                      <div key={idx} className="p-4 border border-gray-200 dark:border-[#333] rounded-lg text-center" contentEditable suppressContentEditableWarning>
                                          <div className="text-2xl font-bold text-gray-900 dark:text-[#ededed] mb-1">{kpi.value}</div>
                                          <div className="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Footer */}
                          <div className="border-t border-gray-200 dark:border-[#333] pt-8 flex justify-between items-center text-xs text-gray-400">
                              <div>Generated by AutoCommunity AI</div>
                              <div>{new Date().toLocaleDateString()}</div>
                          </div>

                      </div>

                      {/* Annexes / Bottom Actions */}
                      <div className="max-w-3xl mx-auto mt-8 flex justify-between items-center px-4">
                          <button className="text-gray-500 hover:text-gray-900 dark:hover:text-[#ededed] text-sm flex items-center gap-2">
                              + Add Annex / File
                          </button>
                          <div className="text-xs text-gray-400">Document ID: {selectedDoc.id}</div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- Library View (List) ---
  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Action Plan Library</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Access, edit, and export your approved strategic documents.</p>
      </div>

      <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-visible">
          {isLoading ? (
              <div className="flex justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-emerald-500" />
              </div>
          ) : strategies.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-[#8b9092]">
                  <p className="text-lg font-medium text-gray-900 dark:text-[#ededed]">Aucun projet à afficher</p>
                  <p className="text-xs mt-2">Il faut valider la stratégie pour voir la liste dans Plan d’Action.</p>
              </div>
          ) : (
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                      <tr>
                          <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client</th>
                          <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Document Title</th>
                          <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Period</th>
                          <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                          <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                      {strategies.map((strategy) => {
                          const { current, total, isActive, isCompleted } = getProgressData(strategy);
                          return (
                          <tr 
                            key={strategy.id} 
                            onClick={() => setSelectedDocId(strategy.id)}
                            className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                          >
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <img src={strategy.clientAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                                      <span className="font-medium text-gray-900 dark:text-[#ededed]">{strategy.clientName}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <FileText size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                      <span className="font-medium text-gray-900 dark:text-[#ededed]">{strategy.theme}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">
                                  {strategy.month} {strategy.year}
                              </td>
                              <td className="px-6 py-4">
                                   <WorkflowProgressCircle current={current} total={total} isActive={isActive} isCompleted={isCompleted} size={32} />
                              </td>
                              <td className="px-6 py-4 text-right relative">
                                  <div className="flex justify-end gap-2 items-center">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); alert('Downloading PDF...'); }}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] hover:bg-gray-100 dark:hover:bg-[#333] rounded-md transition-colors"
                                        title="Download PDF"
                                      >
                                          <Download size={18} />
                                      </button>
                                      
                                      <div className="relative inline-block text-left">
                                          <button 
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActionMenuOpenId(actionMenuOpenId === strategy.id ? null : strategy.id);
                                              }}
                                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                          >
                                              <MoreHorizontal size={18} />
                                          </button>

                                          {actionMenuOpenId === strategy.id && (
                                              <div 
                                                  className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-slide-up"
                                                  onClick={e => e.stopPropagation()}
                                              >
                                                  <button 
                                                      onClick={() => setSelectedDocId(strategy.id)}
                                                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                  >
                                                      <Pencil size={14} /> Edit Document
                                                  </button>
                                                  <button 
                                                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                  >
                                                      <Share2 size={14} /> Share
                                                  </button>
                                                  <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                                  <button 
                                                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                                  >
                                                      <Trash2 size={14} /> Delete
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </td>
                          </tr>
                      )})}
                  </tbody>
              </table>
          )}
      </div>
    </div>
  );
};

export default ActionPlanView;
