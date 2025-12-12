
import React, { useState, useEffect, useRef } from 'react';
import { getAllProjects as getLocalProjects, saveProject as saveLocalProject, deleteProject as deleteLocalProject, updateProjectStatus as updateLocalProjectStatus, getDomains, getClients as getLocalClients } from '../services/strategyService';
import { getAllProjects as getLiveProjects, deleteProject as deleteLiveProject, updateProject as updateLiveProject, updateClient, getClients as getLiveClients } from '../src/services/dbService';
import { getAutopilotState } from '../services/autopilotService';
import { getEnabledPlatforms } from '../services/platformService';
import { useAuth } from '../src/contexts/AuthProvider';
import { useToast } from '../src/contexts/ToastContext';
import { Project, Platform, WorkflowStage, ActivityDomain, Client } from '../types';
import { 
    Search, Plus, MoreHorizontal, Edit2, Mail, FileText, 
    Calendar as CalendarIcon, Sparkles, Trash2, FolderOpen, 
    Grid, List, Filter, ChevronDown, Check, X,
    Twitter, Facebook, Linkedin, Instagram, Youtube, MessageSquare,
    BrainCircuit, Power, Play, Pause, Ban, Globe, Briefcase, Loader2, ArrowRight
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { PlatformIcon } from '../components/PlatformIcon';

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

const Projects: React.FC<any> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]); // To populate dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGlobalAutopilotEnabled, setIsGlobalAutopilotEnabled] = useState(getAutopilotState().isEnabled);
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New State for Modal Options
  const [availableDomains, setAvailableDomains] = useState<ActivityDomain[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);

  const refreshProjects = async () => {
      setIsLoading(true);
      try {
          if (user && user.uid !== 'demo-user-123') {
              const liveProjects = await getLiveProjects(user.uid);
              const liveClients = await getLiveClients(user.uid);
              setProjects(liveProjects);
              setAllClients(liveClients);
          } else {
              setProjects([...getLocalProjects()]);
              setAllClients([...getLocalClients()]);
          }
      } catch (error) {
          console.error("Error loading projects", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    refreshProjects();
    
    // Load config data
    setAvailableDomains(getDomains());
    setAvailablePlatforms(getEnabledPlatforms());

    window.addEventListener('strategy-data-change', refreshProjects);
    const handleGlobalChange = (e: CustomEvent) => {
        setIsGlobalAutopilotEnabled(e.detail);
    };
    window.addEventListener('global-autopilot-change', handleGlobalChange as EventListener);
    return () => {
        window.removeEventListener('strategy-data-change', refreshProjects);
        window.removeEventListener('global-autopilot-change', handleGlobalChange as EventListener);
    };
  }, [user]);

  useEffect(() => {
      const handleClick = () => setActionMenuOpen(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleOpenEditModal = (project?: Project, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setEditingProject(project || {
          name: '',
          type: 'General',
          clientId: '', // Empty for new project, forcing selection
          clientName: '',
          status: 'active',
          platformCount: 0,
          activitySector: availableDomains[0]?.name || '',
          platforms: []
      });
      setIsModalOpen(true);
      setActionMenuOpen(null);
  };

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      setProjectToDelete(project);
      setDeleteModalOpen(true);
      setActionMenuOpen(null);
  };

  const handleConfirmDelete = async () => {
      if (!projectToDelete) return;
      
      if (user && user.uid !== 'demo-user-123') {
          if (projectToDelete.clientId) {
              try {
                  await deleteLiveProject(user.uid, projectToDelete.clientId, projectToDelete.id);
                  refreshProjects();
                  success("Project deleted.");
              } catch (err) {
                  showError("Failed to delete project. Please try again.");
              }
          } else {
              showError("Cannot delete project: Missing Client ID.");
          }
      } else {
          deleteLocalProject(projectToDelete.id);
          refreshProjects();
          success("Project deleted (Demo).");
      }
      setProjectToDelete(null);
  };

  const handleToggleAutopilot = async (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      const newStatus = !project.autopilotEnabled;
      
      if (user && user.uid !== 'demo-user-123' && project.clientId) {
          try {
              await updateLiveProject(user.uid, project.clientId, project.id, { autopilotEnabled: newStatus });
              refreshProjects();
              success(`Autopilot ${newStatus ? 'enabled' : 'disabled'} for ${project.name}`);
          } catch (error) {
              console.error(error);
              showError("Failed to update autopilot status");
          }
      } else {
          updateLocalProjectStatus(project.id, { autopilotEnabled: newStatus });
          refreshProjects();
          success(`Autopilot ${newStatus ? 'enabled' : 'disabled'} for ${project.name}`);
      }
  };

  const handleToggleStatus = async (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      const newStatus = project.status === 'active' ? 'planned' : 'active';
      
      if (user && user.uid !== 'demo-user-123' && project.clientId) {
          try {
              await updateLiveProject(user.uid, project.clientId, project.id, { status: newStatus });
              refreshProjects();
              setActionMenuOpen(null);
              success(`Project status updated to ${newStatus}`);
          } catch (error) {
              console.error(error);
              showError("Failed to update project status");
          }
      } else {
          updateLocalProjectStatus(project.id, { status: newStatus });
          refreshProjects();
          setActionMenuOpen(null);
          success(`Project status updated to ${newStatus}`);
      }
  };

  const handleOpenProjectDetails = (project: Project, e?: React.MouseEvent) => { e?.stopPropagation(); onNavigate('project-details', project.id); };
  const handleSendProjectBriefing = (project: Project, e: React.MouseEvent) => { e.stopPropagation(); onNavigate('send-briefing', null); setActionMenuOpen(null); };
  const handleFillProjectBriefing = (project: Project, e: React.MouseEvent) => { e.stopPropagation(); onNavigate('client-briefing', null); setActionMenuOpen(null); };
  const handleOpenCalendar = (project: Project, e: React.MouseEvent) => { e.stopPropagation(); onNavigate('calendar', project.id); setActionMenuOpen(null); };

  const togglePlatform = (p: Platform) => {
      const currentPlatforms = editingProject.platforms || [];
      if (currentPlatforms.includes(p)) {
          setEditingProject({ ...editingProject, platforms: currentPlatforms.filter(pl => pl !== p) });
      } else {
          setEditingProject({ ...editingProject, platforms: [...currentPlatforms, p] });
      }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProject.name) return;
      
      if (!editingProject.clientId) {
          showError("Please select a client for this project.");
          return;
      }

      const client = allClients.find(c => c.id === editingProject.clientId);
      if (!client) {
          showError("Selected client not found.");
          return;
      }

      setIsSaving(true);

      const projectToSave: Project = {
          id: editingProject.id || `proj_${Date.now()}`,
          name: editingProject.name,
          type: editingProject.type || 'General',
          clientId: client.id,
          clientName: client.companyName,
          status: editingProject.status || 'active',
          platformCount: editingProject.platforms?.length || 0,
          platforms: editingProject.platforms || [],
          activitySector: editingProject.activitySector || 'General',
          nextDeadline: new Date().toISOString(),
          autopilotEnabled: false,
          briefingStatus: editingProject.briefingStatus || 'not_sent'
      };

      try {
          if (user && user.uid !== 'demo-user-123') {
              // LIVE MODE: Update Client Document in Firestore
              const currentProjects = client.projects || [];
              const idx = currentProjects.findIndex(p => p.id === projectToSave.id);
              let updatedProjects = [...currentProjects];
              
              if (idx > -1) {
                  updatedProjects[idx] = projectToSave;
              } else {
                  updatedProjects.push(projectToSave);
              }

              await updateClient(user.uid, client.id, { projects: updatedProjects });
          } else {
              // DEMO MODE
              saveLocalProject(projectToSave);
          }

          await refreshProjects();
          setIsModalOpen(false);
          success(editingProject.id ? "Project updated." : "Project created.");
      } catch (err) {
          console.error("Failed to save project", err);
          showError("Failed to save project.");
      } finally {
          setIsSaving(false);
      }
  };

  // Extract unique clients for filter from available projects or all clients list
  const uniqueClients = Array.from(new Set(allClients.map(c => JSON.stringify({id: c.id, name: c.companyName})))).map((str: string) => JSON.parse(str));
  
  const filteredProjects = projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.clientName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient = filterClient === 'all' || p.clientId === filterClient;
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesClient && matchesStatus;
  });
  const getStageColor = (stage?: WorkflowStage) => {
      switch(stage) {
          case 'BRIEF_RECEIVED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
          case 'AUDIT_SEARCH': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
          case 'STRATEGY_GEN': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
          case 'ACTION_PLAN': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
          case 'PRODUCTION': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
          default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      }
  };
  const getAutopilotSwitchColor = (isEnabled: boolean) => {
      if (!isEnabled) return 'bg-gray-300 dark:bg-[#444]'; 
      return isGlobalAutopilotEnabled ? 'bg-emerald-500' : 'bg-red-500';
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
      <ConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This will remove all associated data.`}
        confirmLabel="Delete Project"
      />
      
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Projects</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage ongoing campaigns and client deliverables.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative group w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                  <input className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <FilterPill label="Client" value={filterClient} options={[{label: 'All Clients', value: 'all'}, ...uniqueClients.map((c: any) => ({label: c.name, value: c.id}))]} onSelect={setFilterClient} active={filterClient !== 'all'} />
                <FilterPill label="Status" value={filterStatus} options={[{label: 'All Status', value: 'all'}, {label: 'Active', value: 'active'}, {label: 'Completed', value: 'completed'}, {label: 'Planned', value: 'planned'}]} onSelect={setFilterStatus} active={filterStatus !== 'all'} />
              </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><Grid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><List size={14} /></button>
              </div>
              <button onClick={(e) => handleOpenEditModal(undefined, e)} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"><Plus size={16} /> New Project</button>
          </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-500" /></div> : (
      <>
      {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                  <div key={project.id} className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col cursor-pointer" onClick={() => handleOpenProjectDetails(project)}>
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl text-gray-600 dark:text-[#ededed] border border-gray-100 dark:border-[#333] group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 transition-colors"><FolderOpen size={24} /></div>
                          <div className="relative">
                              <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === project.id ? null : project.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><MoreHorizontal size={18} /></button>
                              {actionMenuOpen === project.id && (
                                    <div className="absolute right-8 top-0 w-56 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                                        <button onClick={(e) => handleOpenProjectDetails(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><FolderOpen size={14} /> Open Dashboard</button>
                                        <button onClick={(e) => handleToggleStatus(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">{project.status === 'active' ? <Ban size={14} /> : <Play size={14} />} {project.status === 'active' ? 'Disable Project' : 'Enable Project'}</button>
                                        <button onClick={(e) => handleSendProjectBriefing(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-blue-600 dark:text-blue-400"><Mail size={14} /> Send Briefing {project.briefingStatus === 'sent' && '(Sent)'}</button>
                                        <button onClick={(e) => handleFillProjectBriefing(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><FileText size={14} /> Fill Briefing Manually</button>
                                        <button onClick={(e) => handleOpenCalendar(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><CalendarIcon size={14} /> Editorial Calendar</button>
                                        <button onClick={(e) => handleOpenEditModal(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit2 size={14} /> Edit Details</button>
                                        <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                        <button onClick={(e) => handleDeleteClick(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete Project</button>
                                    </div>
                              )}
                          </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1 group-hover:text-emerald-600 transition-colors">{project.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                          <p className="text-sm text-gray-500 dark:text-[#8b9092]">{project.clientName}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${project.status === 'active' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-[#333] dark:text-[#888]'}`}>{project.status === 'active' ? 'Active' : 'Disabled'}</span>
                      </div>
                      <div className="mb-4 bg-gray-50 dark:bg-[#2a2a2a] p-2.5 rounded-lg border border-gray-100 dark:border-[#333]">
                          <div className="flex items-center justify-between cursor-pointer" onClick={(e) => handleToggleAutopilot(project, e)} title="Toggle Autopilot">
                             <div className="flex items-center gap-2">
                                <BrainCircuit size={16} className={project.autopilotEnabled && isGlobalAutopilotEnabled ? "text-emerald-500" : project.autopilotEnabled ? "text-red-500" : "text-gray-400"} />
                                <span className={`text-xs font-medium ${project.autopilotEnabled && isGlobalAutopilotEnabled ? "text-emerald-700 dark:text-emerald-400" : project.autopilotEnabled ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-[#888]"}`}>{project.autopilotEnabled ? 'Autopilot Active' : 'Autopilot Off'}</span>
                             </div>
                             <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative ${getAutopilotSwitchColor(!!project.autopilotEnabled)}`}><div className={`w-3 h-3 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${project.autopilotEnabled ? 'left-4.5' : 'left-0.5'}`} style={{left: project.autopilotEnabled ? 'calc(100% - 14px)' : '2px'}}></div></div>
                          </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#333]">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(project.autopilotSettings?.currentWorkflowStage)}`}>{project.autopilotSettings?.currentWorkflowStage?.replace('_', ' ') || 'Planning'}</div>
                          <div className="flex gap-2">
                              {project.platforms?.map(p => (
                                  <div key={p} className="text-gray-400 hover:text-emerald-500 transition-colors">
                                      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#333] border border-gray-200 dark:border-[#444]">
                                          <PlatformIcon platform={p} size={10} grayscale />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm overflow-visible">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                      <tr>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Project</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Stage</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-center">Autopilot</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                      {filteredProjects.map(project => (
                          <tr key={project.id} className={`hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer`} onClick={() => handleOpenProjectDetails(project)}>
                              <td className={`px-6 py-4 font-medium text-gray-900 dark:text-[#ededed] group ${project.status !== 'active' ? 'opacity-50' : ''}`}><div className="flex items-center gap-2">{project.name}{project.status !== 'active' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-[#444] text-gray-600 dark:text-[#ccc]">DISABLED</span>}<ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity" /></div></td>
                              <td className={`px-6 py-4 text-gray-600 dark:text-[#8b9092] ${project.status !== 'active' ? 'opacity-50' : ''}`}>{project.clientName}</td>
                              <td className={`px-6 py-4 ${project.status !== 'active' ? 'opacity-50' : ''}`}><span className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(project.autopilotSettings?.currentWorkflowStage)}`}>{project.autopilotSettings?.currentWorkflowStage?.replace('_', ' ') || 'Planning'}</span></td>
                              <td className={`px-6 py-4 text-center ${project.status !== 'active' ? 'opacity-50' : ''}`} onClick={(e) => e.stopPropagation()}><div className="flex justify-center"><div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors relative ${getAutopilotSwitchColor(!!project.autopilotEnabled)}`} onClick={(e) => handleToggleAutopilot(project, e)} title={!isGlobalAutopilotEnabled && project.autopilotEnabled ? "Global Autopilot is OFF (System Paused)" : "Toggle Autopilot"}><div className={`w-3 h-3 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform`} style={{left: project.autopilotEnabled ? 'calc(100% - 14px)' : '2px'}}></div></div></div></td>
                              <td className="px-6 py-4 text-right relative">
                                  <div className="relative inline-block text-left">
                                      <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === project.id ? null : project.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><MoreHorizontal size={18} /></button>
                                      {actionMenuOpen === project.id && (
                                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                                                <button onClick={(e) => handleOpenProjectDetails(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><FolderOpen size={14} /> Open Dashboard</button>
                                                <button onClick={(e) => handleToggleStatus(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">{project.status === 'active' ? <Ban size={14} /> : <Play size={14} />} {project.status === 'active' ? 'Disable Project' : 'Enable Project'}</button>
                                                <button onClick={(e) => handleSendProjectBriefing(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-blue-600 dark:text-blue-400"><Mail size={14} /> Send Briefing</button>
                                                <button onClick={(e) => handleFillProjectBriefing(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><FileText size={14} /> Fill Briefing</button>
                                                <button onClick={(e) => handleOpenCalendar(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><CalendarIcon size={14} /> Editorial Calendar</button>
                                                <button onClick={(e) => handleOpenEditModal(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit2 size={14} /> Edit Details</button>
                                                <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                                <button onClick={(e) => handleDeleteClick(project, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete Project</button>
                                            </div>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
      </>
      )}

      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                  <div className="p-6 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                      <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                      
                      {/* Client Selection (New Projects Only) */}
                      {!editingProject.id && (
                          <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Select Client</label>
                              <select 
                                  value={editingProject.clientId || ''} 
                                  onChange={(e) => setEditingProject({...editingProject, clientId: e.target.value})} 
                                  className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"
                                  required
                              >
                                  <option value="">-- Choose a Client --</option>
                                  {allClients.map(client => (
                                      <option key={client.id} value={client.id}>{client.companyName} ({client.firstName} {client.lastName})</option>
                                  ))}
                              </select>
                          </div>
                      )}

                      <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Project Name</label><input type="text" required value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Type</label><select value={editingProject.type} onChange={(e) => setEditingProject({...editingProject, type: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"><option value="General">General</option><option value="Event">Event</option><option value="Campaign">Campaign</option><option value="Retainer">Retainer</option></select></div>
                      
                      {/* Activity Sector Dropdown */}
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Activity Sector</label>
                          <select 
                              value={editingProject.activitySector || ''} 
                              onChange={(e) => setEditingProject({...editingProject, activitySector: e.target.value})} 
                              className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"
                          >
                              <option value="">Select Sector...</option>
                              {availableDomains.map(d => (
                                  <option key={d.id} value={d.name}>{d.name}</option>
                              ))}
                          </select>
                      </div>

                      {/* Active Platforms Multi-select */}
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-2">Active Platforms</label>
                          <div className="flex flex-wrap gap-2">
                              {availablePlatforms.map(p => {
                                  const isSelected = editingProject.platforms?.includes(p);
                                  return (
                                      <button 
                                          key={p} 
                                          type="button"
                                          onClick={() => togglePlatform(p)} 
                                          className={`p-2 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-500' : 'bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-[#383838] hover:border-gray-300 dark:hover:border-[#444]'}`}
                                          title={p}
                                      >
                                          <PlatformIcon 
                                            platform={p} 
                                            size={20} 
                                            grayscale={!isSelected}
                                          />
                                      </button>
                                  );
                              })}
                          </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button><button type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-70 flex items-center gap-2">{isSaving && <Loader2 size={14} className="animate-spin" />} {isSaving ? 'Saving...' : 'Save Project'}</button></div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Projects;
