
import React, { useState, useEffect, useRef } from 'react';
import { getAllProjects as getLocalProjects, getStrategies as getLocalStrategies } from '../../services/strategyService';
import { getAllProjects as getLiveProjects, getStrategies as getLiveStrategies } from '../../src/services/dbService';
import { useAuth } from '../../src/contexts/AuthProvider';
import { Project, WorkflowStage, Strategy } from '../../types';
import { Search, FolderOpen, ArrowRight, Target, Grid, List, ChevronDown, Check, Loader2, MoreHorizontal, Download } from 'lucide-react';
import WorkflowProgressCircle from '../../components/WorkflowProgressCircle';

interface StrategyProjectListProps {
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

const StrategyProjectList: React.FC<StrategyProjectListProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  const refreshData = async () => {
      setIsLoading(true);
      try {
          if (user && user.uid !== 'demo-user-123') {
              // Live Mode
              const liveProjects = await getLiveProjects(user.uid);
              const liveStrategies = await getLiveStrategies(user.uid);
              setProjects(liveProjects);
              setStrategies(liveStrategies);
          } else {
              // Demo Mode
              setProjects([...getLocalProjects()]);
              setStrategies([...getLocalStrategies()]);
          }
      } catch (error) {
          console.error("Error loading strategies:", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('strategy-data-change', refreshData);
    return () => window.removeEventListener('strategy-data-change', refreshData);
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
    
    // STRICT FILTER: Project must be in 'STRATEGY_GEN' stage.
    const isStrategyPhase = p.autopilotSettings?.currentWorkflowStage === 'STRATEGY_GEN';

    return matchesSearch && matchesClient && isStrategyPhase;
  });

  const uniqueClients = Array.from(new Set(projects.map(p => JSON.stringify({id: p.clientId, name: p.clientName}))))
    .map((str: string) => JSON.parse(str));

  // Determine steps based on strategy status
  const getStrategyProgress = (clientId: string) => {
      const strat = strategies.find(s => s.clientId === clientId);
      const totalSteps = 4; // Draft, Vision, Tactics, Validation
      let current = 0;
      let isActive = false;
      let isCompleted = false;

      if (!strat) {
          current = 0; 
      } else {
          switch (strat.status) {
              case 'draft': 
                  current = 1; 
                  isActive = true;
                  break;
              case 'active': // Means ready for validation
                  current = 3; 
                  isActive = false;
                  break;
              case 'completed': 
                  current = 4;
                  isCompleted = true;
                  break;
              default: 
                  current = 2; 
                  isActive = true;
          }
      }
      
      return { current, total: totalSteps, isActive, isCompleted };
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Strategies</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Generate and approve strategies for audited projects.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              {/* Search */}
              <div className="relative group w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                  <input 
                      className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                      placeholder="Search projects..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>

              {/* Filters */}
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
              <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#1c1c1c] border border-dashed border-gray-200 dark:border-[#383838] rounded-lg">
            <Target size={48} className="mx-auto text-gray-300 dark:text-[#333] mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-[#ededed]">Aucun projet à afficher</h3>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1 max-w-md mx-auto">
                {searchTerm || filterClient !== 'all' 
                    ? "Aucun résultat ne correspond à vos filtres." 
                    : "Il faut finaliser l’audit pour voir la liste dans Stratégies."}
            </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const { current, total, isActive, isCompleted } = getStrategyProgress(project.clientId || '');
            return (
            <div 
              key={project.id} 
              onClick={() => onNavigate('strategy-view', project.id)}
              className="group bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                  <Target size={24} />
                </div>
                <WorkflowProgressCircle current={current} total={total} isActive={isActive} isCompleted={isCompleted} size={36} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500 dark:text-[#8b9092] mb-4">{project.clientName}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[#666] pt-4 border-t border-gray-100 dark:border-[#333]">
                <FolderOpen size={14} /> {project.activitySector || 'General'}
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
                        const { current, total, isActive, isCompleted } = getStrategyProgress(project.clientId || '');
                        return (
                            <tr 
                                key={project.id} 
                                onClick={() => onNavigate('strategy-view', project.id)}
                                className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#ededed]">{project.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">{project.clientName}</td>
                                <td className="px-6 py-4">
                                    <WorkflowProgressCircle current={current} total={total} isActive={isActive} isCompleted={isCompleted} size={32} />
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <div className="flex justify-end gap-2 items-center">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); alert('Downloading Strategy...'); }}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] hover:bg-gray-100 dark:hover:bg-[#333] rounded-md transition-colors"
                                            title="Download Strategy"
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
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-slide-up"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <button 
                                                        onClick={() => onNavigate('strategy-view', project.id)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium"
                                                    >
                                                        <Target size={14} /> Open Strategy
                                                    </button>
                                                    <button 
                                                        onClick={() => onNavigate('project-details', project.id)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
                                                    >
                                                        <FolderOpen size={14} /> Project Details
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

export default StrategyProjectList;
