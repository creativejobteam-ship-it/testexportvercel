
import React, { useState, useEffect, useRef } from 'react';
import { getBriefings as getLocalBriefings, deleteBriefing, updateBriefingStatus } from '../../services/briefingService';
import { getBriefs as getLiveBriefs, updateProject as updateLiveProject } from '../../src/services/dbService';
import { triggerWorkflowStep } from '../../services/autopilotService';
import { BriefingRecord, Platform } from '../../types';
import { PLATFORM_CONFIG } from '../../services/platformService';
import { useProjectContext } from '../../src/contexts/ProjectContext';
import { useAuth } from '../../src/contexts/AuthProvider';
import { useToast } from '../../src/contexts/ToastContext';
import { 
    Eye, 
    MoreHorizontal, 
    Link as LinkIcon, 
    Edit2, 
    Send, 
    Trash2, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Plus, 
    Search, 
    Grid, 
    List, 
    FolderOpen, 
    Users, 
    Globe, 
    Tag, 
    X, 
    Filter, 
    ChevronDown, 
    Check, 
    Loader2, 
    RefreshCw
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

interface BriefsDashboardProps {
  onNavigate?: (view: string, id: string | null) => void;
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

const BriefPreviewModal = ({ brief, onClose }: { brief: BriefingRecord, onClose: () => void }) => {
    if (!brief) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 dark:border-[#282828] flex flex-col max-h-[85vh] animate-slide-up">
                <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg flex items-center gap-2">
                            <FileText size={18} className="text-emerald-500" /> 
                            Brief Details
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#888] mt-1">
                            {brief.projectName} • {brief.clientName}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white dark:bg-[#1c1c1c]">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100 dark:border-[#333]">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Domain</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{brief.config.domainName}</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Context</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{brief.config.context.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{brief.status}</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Created</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{new Date(brief.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Answers */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-[#ededed] uppercase tracking-wider mb-3">Briefing Responses</h4>
                        {brief.answers ? (
                            Object.entries(brief.answers).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 dark:bg-[#232323] p-4 rounded-lg border border-gray-100 dark:border-[#333]">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-[#888] uppercase mb-1.5">{key.replace(/_/g, ' ')}</div>
                                    <div className="text-sm text-gray-800 dark:text-[#ccc] whitespace-pre-wrap">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 italic bg-gray-50 dark:bg-[#232323] rounded-lg border border-dashed border-gray-200 dark:border-[#333]">
                                No answers recorded yet. The brief is still pending or in draft mode.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c] flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#333] transition-colors text-gray-700 dark:text-[#ededed]">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const BriefsDashboard: React.FC<BriefsDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { selectedProject, selectedClient, refreshData } = useProjectContext();
  const [briefings, setBriefings] = useState<BriefingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedPreviewBrief, setSelectedPreviewBrief] = useState<BriefingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [briefToDelete, setBriefToDelete] = useState<string | null>(null);

  const refreshBriefs = async () => {
      // setIsLoading(true); // Don't block UI on refresh interval
      try {
          if (user && user.uid !== 'demo-user-123') {
              const liveBriefs = await getLiveBriefs(user.uid);
              setBriefings(liveBriefs);
          } else {
              setBriefings(getLocalBriefings());
          }
      } catch (error) {
          console.error("Error fetching briefs", error);
      } finally {
          setIsLoading(false);
      }
  }

  useEffect(() => {
    setIsLoading(true);
    refreshBriefs();
    const interval = setInterval(() => {
        refreshBriefs();
    }, 5000); // Slower polling
    return () => clearInterval(interval);
  }, [user]);

  // Close menu on click outside
  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  // Filter based on Global Context + Search + Local Filters
  const filteredBriefings = briefings.filter(b => {
      // 1. Context Filtering
      if (selectedProject) {
          // If project selected, must match project ID
          if (b.projectId !== selectedProject.id) return false;
      } else if (selectedClient) {
          // If only client selected, must match client ID
          if (b.clientId !== selectedClient.id) return false;
      }

      // 2. Search
      const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (b.projectName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // 3. Status
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      
      return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleCopyLink = (brief: BriefingRecord, e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(brief.generatedLink);
      setCopiedId(brief.id);
      setTimeout(() => setCopiedId(null), 2000);
      setActionMenuOpenId(null);
  };

  const handleEditBrief = (brief: BriefingRecord, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onNavigate) onNavigate('client-briefing', brief.id); 
      setActionMenuOpenId(null);
  };

  const handleResend = (brief: BriefingRecord, e: React.MouseEvent) => {
      e.stopPropagation();
      alert(`Email resent for ${brief.clientName}`);
      updateBriefingStatus(brief.id, 'SENT');
      refreshBriefs();
      setActionMenuOpenId(null);
  };

  const handleRegenerateAudit = async (brief: BriefingRecord, e: React.MouseEvent) => {
      e.stopPropagation();
      if (brief.projectId) {
          
          if (user && user.uid !== 'demo-user-123') {
              // LIVE MODE: Directly update database to ensure state consistency
              try {
                  await updateLiveProject(user.uid, brief.clientId, brief.projectId, {
                      autopilotSettings: {
                          rotationPeriod: '15_days',
                          lastRotationDate: new Date().toISOString(),
                          cycleStartDate: new Date().toISOString(),
                          currentWorkflowStage: 'AUDIT_SEARCH'
                      },
                      status: 'active'
                  });
                  // IMPORTANT: Refresh context so the app knows the project is now in audit mode
                  await refreshData();
              } catch(err) {
                  console.error("Failed to update project for audit regeneration", err);
                  showError("Failed to regenerate audit. Please try again.");
                  return;
              }
          } else {
              // DEMO MODE
              triggerWorkflowStep(brief.projectId, 'BRIEF_COMPLETED'); 
          }

          success("Audit regeneration started.", "Redirecting to Live Console...");
          if (onNavigate) onNavigate('audit-view', brief.projectId);
      }
      setActionMenuOpenId(null);
  };

  const handleDeleteClick = (brief: BriefingRecord, e: React.MouseEvent) => {
      e.stopPropagation();
      setBriefToDelete(brief.id);
      setDeleteModalOpen(true);
      setActionMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
      if (briefToDelete) {
          deleteBriefing(briefToDelete);
          refreshBriefs();
          setBriefToDelete(null);
      }
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'SENT': return <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-800"><Clock size={12} /> Awaiting</span>;
          case 'DRAFT': return <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700"><Edit2 size={12} /> Draft</span>;
          case 'COMPLETED': return <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800"><CheckCircle2 size={12} /> Completed</span>;
          default: return null;
      }
  };

  const getProgress = (brief: BriefingRecord) => {
      if (brief.status === 'COMPLETED') return 100;
      if (brief.status === 'DRAFT') return 0;
      const answerCount = brief.answers ? Object.keys(brief.answers).length : 0;
      const totalQuestions = 10; // Estimation
      return Math.min(100, Math.round((answerCount / totalQuestions) * 100));
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
        <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Brief?"
            message="This action is irreversible. Do you really want to delete this brief record?"
            confirmLabel="Delete Brief"
        />

        <BriefPreviewModal brief={selectedPreviewBrief!} onClose={() => setSelectedPreviewBrief(null)} />

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Briefs Manager</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage client requirements and requests.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search briefs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                    />
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <FilterPill 
                        label="Status" 
                        value={statusFilter} 
                        options={[
                            {label: 'All Status', value: 'all'},
                            {label: 'Draft', value: 'DRAFT'},
                            {label: 'Sent', value: 'SENT'},
                            {label: 'Completed', value: 'COMPLETED'}
                        ]} 
                        onSelect={setStatusFilter} 
                        active={statusFilter !== 'all'}
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
                
                <button 
                    onClick={() => onNavigate && onNavigate('send-briefing', null)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus size={16} /> New Request
                </button>
            </div>
        </div>

        {/* Data Display */}
        {isLoading && filteredBriefings.length === 0 ? (
             <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
            </div>
        ) : (
        <>
        {viewMode === 'list' ? (
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm overflow-visible">
                 {filteredBriefings.length === 0 ? (
                     <div className="p-12 text-center text-gray-500 dark:text-[#8b9092]">
                         No briefings found.
                     </div>
                 ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Project & Client</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Type / Domain</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Progress</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {filteredBriefings.map((brief) => {
                                const progress = getProgress(brief);
                                return (
                                    <tr 
                                        key={brief.id} 
                                        className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors group cursor-pointer"
                                        onClick={() => setSelectedPreviewBrief(brief)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-[#ededed] text-sm">
                                                    <FolderOpen size={14} className="text-emerald-600 dark:text-emerald-500" />
                                                    Brief / {brief.projectName || 'General Strategy'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#8b9092] ml-0.5">
                                                    <Users size={12} />
                                                    {brief.clientName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-[#333] text-gray-700 dark:text-[#ccc] border border-gray-200 dark:border-[#444] px-2 py-0.5 rounded text-xs font-medium">
                                                    <Globe size={10} />
                                                    {brief.config.domainName}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#8b9092]">
                                                    <Tag size={10} />
                                                    {brief.config.context.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-[10px] text-gray-500 dark:text-[#888] mb-1">
                                                    <span>Filled</span>
                                                    <span className="font-medium">{progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092] text-xs">
                                            {brief.sentAt ? new Date(brief.sentAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(brief.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="relative inline-block text-left">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionMenuOpenId(actionMenuOpenId === brief.id ? null : brief.id);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                {actionMenuOpenId === brief.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-slide-up">
                                                        <button onClick={(e) => handleCopyLink(brief, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                                            {copiedId === brief.id ? <CheckCircle2 size={14} className="text-green-500"/> : <LinkIcon size={14} />} 
                                                            {copiedId === brief.id ? 'Copied!' : 'Copy Link'}
                                                        </button>
                                                        
                                                        <button onClick={(e) => handleEditBrief(brief, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                                            <Edit2 size={14} /> Edit / Fill
                                                        </button>
                                                        
                                                        {brief.status !== 'COMPLETED' && (
                                                            <button onClick={(e) => handleResend(brief, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                                <Send size={14} /> Resend Email
                                                            </button>
                                                        )}

                                                        {brief.status === 'COMPLETED' && (
                                                            <button onClick={(e) => handleRegenerateAudit(brief, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                                                <RefreshCw size={14} /> Regenerate Audit
                                                            </button>
                                                        )}
                                                        
                                                        <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                                        <button onClick={(e) => handleDeleteClick(brief, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBriefings.map((brief) => {
                    const progress = getProgress(brief);
                    return (
                        <div 
                            key={brief.id} 
                            onClick={() => setSelectedPreviewBrief(brief)}
                            className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                                    <FileText size={24} />
                                </div>
                                {getStatusBadge(brief.status)}
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1">Brief / {brief.projectName}</h3>
                            <p className="text-sm text-gray-500 dark:text-[#8b9092] mb-4">{brief.clientName}</p>
                            
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-[#333]">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-[#888]">
                                    <span>Completion</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        </>
        )}
    </div>
  );
};

export default BriefsDashboard;
