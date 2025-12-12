
import React, { useState, useEffect, useRef } from 'react';
import { getAllProjects as getLocalProjects, updateProject as updateLocalProject } from '../../services/strategyService';
import { getAllProjects as getLiveProjects, updateProject as updateLiveProject } from '../../src/services/dbService';
import { useAuth } from '../../src/contexts/AuthProvider';
import { Project } from '../../types';
import { Search, FolderOpen, Grid, List, ChevronDown, Check, Loader2, MoreHorizontal, Download, Play, PauseCircle, CheckCircle2, Square, RotateCcw, Trash2, Activity, Eye, RefreshCw } from 'lucide-react';
import WorkflowProgressCircle from '../../components/WorkflowProgressCircle';
import { useToast } from '../../src/contexts/ToastContext';

interface AuditProjectListProps {
  onNavigate: (view: string, id: string | null) => void;
}

const FilterPill = ({ label, value, options, onSelect, active }: { label: string, value: string, options: {label: string, value: string}[], onSelect: (val: string) => void, active: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${active ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white dark:bg-[#232323] text-gray-600 dark:text-[#999] border-gray-200 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
            >
                <span>{label}:</span>
                <span className="font-semibold">{options.find(o => o.value === value)?.label || value}</span>
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-lg shadow-lg z-50 py-1 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onSelect(opt.value); setIsOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between ${value === opt.value ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-[#ededed]'}`}
                        >
                            {opt.label}
                            {value === opt.value && <Check size={12} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AuditProjectList: React.FC<AuditProjectListProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, warning, error: showError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  
  // Local state for immediate UI feedback
  const [runningProjectIds, setRunningProjectIds] = useState<Set<string>>(new Set());
  const [pausedProjectIds, setPausedProjectIds] = useState<Set<string>>(new Set());

  const refreshProjects = async () => {
      setIsLoading(true);
      try {
          if (user && user.uid !== 'demo-user-123') {
              const liveProjects = await getLiveProjects(user.uid);
              setProjects(liveProjects);
          } else {
              setProjects([...getLocalProjects()]);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    refreshProjects();
    window.addEventListener('strategy-data-change', refreshProjects);
    return () => window.removeEventListener('strategy-data-change', refreshProjects);
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.clientName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === 'all' || p.clientId === filterClient;
    
    // Logically, only completed briefs should be audited.
    const isBriefCompleted = p.briefingStatus === 'completed' || (user && user.uid !== 'demo-user-123' && p.status === 'active');
    const isInAuditPhase = p.autopilotSettings?.currentWorkflowStage === 'AUDIT_SEARCH';

    return matchesSearch && matchesClient && isBriefCompleted && isInAuditPhase;
  });

  const uniqueClients = Array.from(new Set(projects.map(p => JSON.stringify({id: p.clientId, name: p.clientName}))))
    .map((str: string) => JSON.parse(str));

  // --- Real-Time Status Logic ---
  const getAuditStatus = (project: Project) => {
      const results = project.auditResults || {};
      const workflows = Object.values(results);
      const totalSteps = 10; // 5 Phase 1 + 5 Phase 2
      const completedCount = workflows.filter(w => w.status === 'completed').length;
      
      const isApiRunning = workflows.some(w => w.status === 'running');
      
      let status: 'running' | 'paused' | 'completed' = 'paused';
      
      if (completedCount >= totalSteps) {
          status = 'completed';
      } else if (isApiRunning) {
          status = 'running';
      } else if (completedCount > 0) {
          status = 'paused'; 
      }

      // Override with local state for immediate feedback
      if (runningProjectIds.has(project.id)) {
          status = 'running';
      } else if (pausedProjectIds.has(project.id)) {
          if (status !== 'completed') status = 'paused';
      }
      
      return { status, current: completedCount, total: totalSteps };
  };

  const toggleRunState = (id: string, currentStatus: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentStatus === 'running') {
          // Pause Logic
          setRunningProjectIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
          });
          setPausedProjectIds(prev => new Set(prev).add(id));
      } else {
          // Start Logic
          setRunningProjectIds(prev => new Set(prev).add(id));
          setPausedProjectIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
          });
      }
  };

  const handleClearAuditData = async (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete the audit data for "${project.name}"? This will reset the cycle to the beginning of the audit phase.`)) {
          try {
              // We do NOT delete the project, we just clear the results.
              const updates = { 
                  global_research_cache: '', 
                  auditResults: {} 
              };

              if (user && user.uid !== 'demo-user-123' && project.clientId) {
                  await updateLiveProject(user.uid, project.clientId, project.id, updates);
              } else {
                  updateLocalProject(project.id, updates);
              }
              refreshProjects();
              success("Audit data deleted (Cycle Reset).");
          } catch (err) {
              console.error(err);
              showError("Failed to delete audit data.");
          }
      }
      setActionMenuOpenId(null);
  };

  const handleRestartAnalysis = async (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (confirm(`Restart analysis for ${project.name}? This will clear existing data and redirect to the live audit view.`)) {
          try {
              const updates = { 
                  global_research_cache: '', 
                  auditResults: {} 
              };

              // 1. Optimistic Update (Clear data locally first for speed)
              setProjects(prev => prev.map(p => 
                  p.id === project.id ? { ...p, ...updates } : p
              ));

              // 2. Perform DB Update
              if (user && user.uid !== 'demo-user-123') {
                  await updateLiveProject(user.uid, project.clientId!, project.id, updates);
              } else {
                  updateLocalProject(project.id, updates);
              }
              
              // 3. Reset Local Overrides
              setRunningProjectIds(prev => {
                  const next = new Set(prev);
                  next.delete(project.id);
                  return next;
              });
              setPausedProjectIds(prev => {
                  const next = new Set(prev);
                  next.delete(project.id);
                  return next;
              });

              // 4. Force Refresh
              await refreshProjects();
              success("Audit reset successfully", "Redirecting to Live Audit Agent...");
              
              // 5. Navigate to Dashboard to trigger the useEffect that starts the agents
              onNavigate('audit-view', project.id);
              
          } catch (error) {
              console.error(error);
              warning("Failed to restart analysis.");
          }
      }
      setActionMenuOpenId(null);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Audit</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Projects ready for competitive analysis and market research.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative group w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                  <input 
                      className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                      placeholder="Search projects..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>

              <div className="hidden md:flex items-center gap-2">
                <FilterPill 
                    label="Client" 
                    value={filterClient} 
                    options={[
                        {label: 'All Clients', value: 'all'},
                        ...uniqueClients.map((c: any) => ({label: c.name, value: c.id}))
                    ]} 
                    onSelect={setFilterClient} 
                    active={filterClient !== 'all'}
                />
              </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                  <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}
                  >
                      <Grid size={14} />
                  </button>
                  <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}
                  >
                      <List size={14} />
                  </button>
              </div>
          </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
          </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#1c1c1c] border border-dashed border-gray-200 dark:border-[#383838] rounded-lg">
            <FolderOpen size={48} className="mx-auto text-gray-300 dark:text-[#333] mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-[#ededed]">Aucun projet à afficher</h3>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1 max-w-md mx-auto">
                {searchTerm || filterClient !== 'all' 
                    ? "Aucun résultat ne correspond à vos filtres." 
                    : "Il faut compléter le brief pour voir la liste dans Audit."}
            </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const { status, current, total } = getAuditStatus(project);
            return (
            <div 
              key={project.id} 
              onClick={() => onNavigate('audit-view', project.id)}
              className="group bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <FolderOpen size={24} />
                </div>
                <WorkflowProgressCircle current={current} total={total} isActive={status === 'running'} isCompleted={status === 'completed'} size={36} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1">Audit / {project.name}</h3>
              <p className="text-sm text-gray-500 dark:text-[#8b9092] mb-4">{project.clientName}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[#666] pt-4 border-t border-gray-100 dark:border-[#333]">
                <Activity size={14} className={status === 'running' ? 'text-emerald-500 animate-pulse' : ''} /> 
                {status === 'running' ? 'Audit in progress...' : status === 'paused' ? 'Audit paused' : 'Audit Ready'}
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-visible">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                    <tr>
                        <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Project</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Progress</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                    {filteredProjects.map((project) => {
                        const { status, current, total } = getAuditStatus(project);
                        return (
                            <tr 
                                key={project.id} 
                                onClick={() => onNavigate('audit-view', project.id)}
                                className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#ededed]">Audit / {project.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">{project.clientName}</td>
                                
                                {/* INTERACTIVE PROGRESS CELL */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {status === 'completed' ? (
                                            // Special Hover Overlay for Restart
                                            <div className="relative group/refresh cursor-pointer">
                                                <button 
                                                    className="p-1.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 group-hover/refresh:opacity-0 transition-opacity"
                                                >
                                                    <CheckCircle2 size={20} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleRestartAnalysis(project, e)}
                                                    className="absolute inset-0 p-1.5 rounded-full border border-amber-100 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 opacity-0 group-hover/refresh:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                                                    title="Restart Audit"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={(e) => toggleRunState(project.id, status, e)}
                                                className={`p-1.5 rounded-full transition-all duration-200 border ${
                                                    status === 'running' ? 'border-red-100 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 hover:scale-105' :
                                                    'border-blue-100 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 hover:scale-105'
                                                }`}
                                                title={status === 'running' ? 'Pause Workflow' : 'Start Workflow'}
                                            >
                                                {status === 'running' && <Square size={16} fill="currentColor" />}
                                                {status === 'paused' && <Play size={20} className="ml-0.5" />}
                                            </button>
                                        )}
                                        
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${
                                                status === 'running' ? 'text-blue-600 dark:text-blue-400 animate-pulse' :
                                                status === 'paused' ? 'text-gray-600 dark:text-gray-400' :
                                                'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                                {status === 'running' && 'Processing...'}
                                                {status === 'paused' && 'Paused'}
                                                {status === 'completed' && 'Audit Ready'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 dark:text-[#888] font-medium">
                                                Workflow {current} / {total}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right relative">
                                    <div className="flex justify-end gap-2 items-center">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); alert('Downloading Report...'); }}
                                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                            title="Download Report"
                                        >
                                            <Download size={18} />
                                        </button>

                                        <div className="relative inline-block text-left">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActionMenuOpenId(actionMenuOpenId === project.id ? null : project.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {actionMenuOpenId === project.id && (
                                                <div 
                                                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-slide-up"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <button 
                                                        onClick={() => onNavigate('audit-view', project.id)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium"
                                                    >
                                                        <Activity size={14} /> View Audit Report
                                                    </button>
                                                    
                                                    <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>

                                                    <button 
                                                        onClick={(e) => handleClearAuditData(project, e)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2 font-medium"
                                                    >
                                                        <Trash2 size={14} /> Delete Audit Data
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default AuditProjectList;
