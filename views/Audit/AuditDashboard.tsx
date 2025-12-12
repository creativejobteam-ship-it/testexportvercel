
import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../../src/contexts/ProjectContext';
import { getClientById, getAllProjects, updateProject } from '../../services/strategyService';
import { triggerWorkflowStep } from '../../services/autopilotService';
import { runAuditWorkflow, runConsolidatedResearch } from '../../services/geminiService';
import { AuditResult, Project } from '../../types';
import { ArrowLeft, Eye, TrendingUp, CheckCircle, BrainCircuit, Search, Loader2, Globe, ExternalLink, BarChart2, Zap, Layers, RefreshCw, Download } from 'lucide-react';
import { useToast } from '../../src/contexts/ToastContext';
import { useAuth } from '../../src/contexts/AuthProvider';
import * as dbService from '../../src/services/dbService';

interface AuditDashboardProps {
  projectId: string | null;
  onBack?: () => void;
  isEmbedded?: boolean;
}

const PHASE_1_WORKFLOWS = [
    { id: 'competitive_analysis', label: 'Competitive Analysis', icon: <Eye size={18} /> },
    { id: 'market_analysis', label: 'Market Analysis', icon: <Globe size={18} /> },
    { id: 'keyword_research', label: 'Keyword Research', icon: <Search size={18} /> },
    { id: 'seo_audit', label: 'SEO Audit', icon: <BarChart2 size={18} /> },
    { id: 'trend_analysis', label: 'Trend Analysis', icon: <TrendingUp size={18} /> }
];

const PHASE_2_WORKFLOWS = [
    { id: 'deep_competitor_audit', label: 'Deep Competitor Scan', icon: <Layers size={18} /> },
    { id: 'content_opportunities', label: 'Content Gaps', icon: <Zap size={18} /> },
    { id: 'backlink_analysis', label: 'Backlink Recon', icon: <ExternalLink size={18} /> },
    { id: 'technical_audit', label: 'Tech Stack Audit', icon: <BrainCircuit size={18} /> },
    { id: 'strategic_recommendations', label: 'Strategy Synth', icon: <CheckCircle size={18} /> }
];

const AuditDashboard: React.FC<AuditDashboardProps> = ({ projectId, onBack, isEmbedded = false }) => {
  const { selectProject, selectClient, clients, refreshData } = useProjectContext(); // Use context to find project
  const { success, info, warning } = useToast();
  const { user } = useAuth();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Audit Execution State
  const [auditResults, setAuditResults] = useState<Record<string, AuditResult>>({});
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const [isResearching, setIsResearching] = useState(false); // New state for initial research phase
  const [activeTab, setActiveTab] = useState<string>('competitive_analysis');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (projectId) {
      // Find project from loaded clients in context (handles both Live and Demo correctly)
      let foundProject = null;
      for (const client of clients) {
          const p = client.projects?.find(prj => prj.id === projectId);
          if (p) {
              foundProject = { ...p, clientName: client.companyName, clientId: client.id };
              break;
          }
      }

      if (foundProject) {
        setProjectData(foundProject);
        selectProject(projectId);
        selectClient(foundProject.clientId);
        
        // Load existing results if any
        if (foundProject.auditResults) {
            setAuditResults(foundProject.auditResults);
        }
        
        // Auto-start Audit if in correct stage AND no results yet
        if (foundProject.autopilotSettings?.currentWorkflowStage === 'AUDIT_SEARCH' && !isAuditRunning && !isResearching && (!foundProject.auditResults || Object.keys(foundProject.auditResults).length === 0)) {
             startAuditPhase(foundProject);
        }
      }
    }
  }, [projectId, clients]);

  const startAuditPhase = async (proj: Project) => {
      // Step 0: Check for Global Research Cache
      let researchContext = proj.global_research_cache;

      if (!researchContext) {
          setIsResearching(true);
          info("Research Agent Active", "Performing deep web scan and consolidating market intelligence...");
          
          try {
              // Create context for search
              const searchContext = {
                  name: proj.name,
                  client: proj.clientName,
                  sector: proj.activitySector,
                  type: proj.type
              };

              researchContext = await runConsolidatedResearch(searchContext);
              
              // Save Cache Immediately
              if (user && user.uid !== 'demo-user-123') {
                  await dbService.updateProject(user.uid, proj.clientId!, proj.id, { global_research_cache: researchContext });
              } else {
                  updateProject(proj.id, { global_research_cache: researchContext });
              }
              
              success("Research Completed", "Intelligence secured. Starting analysis agents.");
          } catch (e) {
              console.error("Research failed", e);
              // We can continue without cache, but it might be less accurate/slower (fallback to individual searches)
              warning("Research Agent Encountered Issues", "Proceeding with individual agent searches.");
          } finally {
              setIsResearching(false);
          }
      } else {
          info("Loading from Intelligence Cache", "Using existing market data to accelerate analysis.");
      }

      // Step 1: Start Agent Workflows using Research Context
      setIsAuditRunning(true);

      // Prepare context from project (redundant but safe)
      const context = {
          name: proj.name,
          client: proj.clientName,
          sector: proj.activitySector,
          type: proj.type
      };

      // Initialize placeholders for UI
      const initialResults: Record<string, AuditResult> = {};
      [...PHASE_1_WORKFLOWS, ...PHASE_2_WORKFLOWS].forEach(wf => {
          initialResults[wf.id] = { workflowType: wf.id, summary: '', status: 'pending' };
      });
      // Mark Phase 1 as running immediately
      PHASE_1_WORKFLOWS.forEach(wf => {
          initialResults[wf.id].status = 'running';
      });
      setAuditResults(initialResults);

      // Launch Phase 1 Parallel Executions
      const phase1Promises = PHASE_1_WORKFLOWS.map(async (wf) => {
          try {
              // Add small random delay for visual cascading effect
              await new Promise(r => setTimeout(r, Math.random() * 800));
              
              // Pass the cached research context to the workflow
              const result = await runAuditWorkflow(wf.id, context, researchContext);
              
              setAuditResults(prev => ({
                  ...prev,
                  [wf.id]: result
              }));
              setCompletedCount(c => c + 1);
              return result;
          } catch (e) {
              console.error(e);
              setAuditResults(prev => ({
                  ...prev,
                  [wf.id]: { workflowType: wf.id, summary: "Failed", status: 'failed' }
              }));
          }
      });

      // Launch Phase 2 in Background (don't await for UI block)
      PHASE_2_WORKFLOWS.forEach(async (wf) => {
          // Wait a bit before starting phase 2 to prioritize phase 1 network
          await new Promise(r => setTimeout(r, 5000 + Math.random() * 2000));
          
          setAuditResults(prev => ({ ...prev, [wf.id]: { ...prev[wf.id], status: 'running' } }));
          // Pass the cached research context here too
          const result = await runAuditWorkflow(wf.id, context, researchContext);
          
          setAuditResults(prev => ({
              ...prev,
              [wf.id]: result
          }));
      });

      // Wait for Phase 1 to finish "officially"
      await Promise.all(phase1Promises);
      setIsAuditRunning(false);
      success("Phase 1 Complete", "Initial strategic data is ready for review.");
  };

  const handleRestartAnalysis = async () => {
      if (!projectData) return;
      
      if (confirm("Restarting analysis will clear current results and perform a fresh web search. This may take a few minutes. Continue?")) {
          // 1. Clear UI state
          setAuditResults({});
          
          // 2. Clear Database Cache
          try {
              if (user && user.uid !== 'demo-user-123') {
                  // Firestore update to nullify cache and results
                  await dbService.updateProject(user.uid, projectData.clientId!, projectData.id, { 
                      global_research_cache: '', // Empty string to clear
                      auditResults: {}
                  });
              } else {
                  // Local store update
                  updateProject(projectData.id, { 
                      global_research_cache: '',
                      auditResults: {}
                  });
              }
              
              // 3. Trigger Start
              // We pass a modified project object without cache to force re-research
              const cleanProject = { ...projectData, global_research_cache: undefined, auditResults: {} };
              startAuditPhase(cleanProject);
              
          } catch (e) {
              console.error("Failed to clear cache", e);
              warning("Failed to reset project data completely.");
          }
      }
  };

  const handleCompleteAudit = async () => {
      if (!projectId || !projectData) return;
      setIsCompleting(true);
      
      try {
          // 1. SAVE AUDIT RESULTS to the Project (Checkpoint 3: The Handoff)
          if (user && user.uid !== 'demo-user-123') {
              await dbService.updateProject(user.uid, projectData.clientId!, projectId, {
                  auditResults: auditResults
              });
          } else {
              updateProject(projectId, {
                  auditResults: auditResults
              });
          }

          // 2. Trigger Workflow Transition
          setTimeout(() => {
              triggerWorkflowStep(projectId, 'AUDIT_COMPLETED');
              setIsCompleting(false);
              success("Audit Validated!", "Data saved. Autopilot is moving project to Strategy Generation.");
              if (onBack) onBack(); 
          }, 800);

      } catch (e) {
          console.error("Failed to save audit results", e);
          setIsCompleting(false);
      }
  };

  const renderResultContent = (result: AuditResult) => {
      if (result.status === 'pending') {
          return (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-[#444] animate-spin-slow"></div>
                  <p className="mt-4 text-xs">Waiting in queue...</p>
              </div>
          );
      }
      if (result.status === 'running') {
          return (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="relative">
                      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                      <BrainCircuit size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
                  </div>
                  <p className="mt-4 text-sm font-medium animate-pulse">Gemini 3 Agent Reasoning...</p>
                  <p className="text-xs mt-1">Analyzing {result.workflowType.replace(/_/g, ' ')}</p>
              </div>
          );
      }

      if (result.status === 'failed') {
          return (
              <div className="p-8 text-center text-red-500">
                  <p>Analysis failed. Please retry.</p>
              </div>
          );
      }

      return (
          <div className="animate-fade-in space-y-6">
              {/* Score Header */}
              {result.score !== undefined && (
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{result.score}/100</div>
                      <div>
                          <h4 className="font-bold text-gray-900 dark:text-[#ededed]">Impact Score</h4>
                          <p className="text-xs text-gray-500 dark:text-[#888]">Calculated relevance based on sector data.</p>
                      </div>
                  </div>
              )}

              {/* Text Summary */}
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-[#ccc]">
                  <p>{result.summary}</p>
              </div>

              {/* Data Tables (HTML Render) */}
              {result.tables && result.tables.length > 0 && (
                  <div className="space-y-4">
                      {result.tables.map((table, idx) => (
                          <div key={idx} className="border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden">
                              <div className="bg-gray-50 dark:bg-[#222] px-4 py-2 border-b border-gray-200 dark:border-[#333] font-semibold text-xs uppercase text-gray-500 dark:text-[#888]">
                                  {table.title}
                              </div>
                              <div className="p-4 overflow-x-auto text-sm text-gray-700 dark:text-[#ccc] [&>table]:w-full [&>table>thead]:bg-gray-50 [&>table>thead]:dark:bg-[#1a1a1a] [&>table>thead>tr>th]:p-2 [&>table>thead>tr>th]:text-left [&>table>tbody>tr>td]:p-2 [&>table>tbody>tr>td]:border-t [&>table>tbody>tr>td]:border-gray-100 [&>table>tbody>tr>td]:dark:border-[#333]" dangerouslySetInnerHTML={{ __html: table.html }} />
                          </div>
                      ))}
                  </div>
              )}

              {/* Sources */}
              {result.sources && result.sources.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-[#333]">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Verified Sources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {result.sources.map((source, idx) => (
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                key={idx} 
                                className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 dark:border-[#333] bg-white dark:bg-[#232323] hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group"
                              >
                                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                                      <ExternalLink size={12} />
                                  </div>
                                  <span className="text-xs text-gray-700 dark:text-[#ededed] font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">{source.title || source.url}</span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      );
  };

  if (!projectId || !projectData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;

  return (
    <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
      {/* Header */}
      {!isEmbedded && (
        <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-[#282828] pb-4">
            {onBack && (
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] transition-colors w-fit">
                <ArrowLeft size={16} /> Back to Audit List
                </button>
            )}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-[#ededed] tracking-tight">Live Audit Operations</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Analyzing {projectData.name} ({projectData.clientName})</p>
            </div>
        </div>
      )}

      {/* Embedded Header / Controls */}
      <div className={`flex justify-between items-center ${isEmbedded ? 'mb-4' : 'mb-0'}`}>
          <div className="flex items-center gap-3">
              {isEmbedded && <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">Audit Results</h3>}
              {isAuditRunning && !isResearching && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Agents Active</span>}
              {isResearching && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Globe size={10} className="animate-pulse"/> Global Researching...</span>}
          </div>
          
          <div className="flex gap-2">
              {!isAuditRunning && !isResearching && (
                  <>
                  <button 
                      onClick={() => alert("Generating PDF Report...")}
                      className="px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-[#ededed] rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                      <Download size={16} /> Report
                  </button>
                  <button 
                      onClick={handleRestartAnalysis}
                      className="px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-[#ededed] rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                      title="Clear cache and restart analysis"
                  >
                      <RefreshCw size={16} /> Restart
                  </button>
                  </>
              )}
              {(!projectData.auditResults || Object.keys(projectData.auditResults).length > 0) && (
                  <button 
                      onClick={handleCompleteAudit}
                      disabled={isCompleting || isAuditRunning || isResearching}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {isCompleting ? 'Finalizing...' : <><CheckCircle size={16} /> Validate & Next</>}
                  </button>
              )}
          </div>
      </div>

      {/* Main Layout */}
      <div className={`grid grid-cols-12 gap-6 ${isEmbedded ? 'flex-1 min-h-0' : 'h-[calc(100vh-200px)]'}`}>
          
          {/* Left Sidebar: Agent Grid */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Phase 1 Group */}
              <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Phase 1: Priority Agents</h4>
                  <div className="space-y-2">
                      {PHASE_1_WORKFLOWS.map(wf => {
                          const result = auditResults[wf.id] || { status: 'pending' };
                          const isActive = activeTab === wf.id;
                          return (
                              <button
                                  key={wf.id}
                                  onClick={() => setActiveTab(wf.id)}
                                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm border transition-all ${
                                      isActive 
                                      ? 'bg-white dark:bg-[#232323] border-emerald-500 shadow-md transform scale-[1.02]' 
                                      : 'bg-white dark:bg-[#1c1c1c] border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444] text-gray-500'
                                  }`}
                              >
                                  <div className="flex items-center gap-3">
                                      <div className={`p-1.5 rounded-md ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 dark:bg-[#2a2a2a]'}`}>
                                          {wf.icon}
                                      </div>
                                      <span className={`font-medium ${isActive ? 'text-gray-900 dark:text-[#ededed]' : ''}`}>{wf.label}</span>
                                  </div>
                                  {result.status === 'running' && <Loader2 size={14} className="animate-spin text-blue-500" />}
                                  {result.status === 'completed' && <CheckCircle size={14} className="text-emerald-500" />}
                              </button>
                          );
                      })}
                  </div>
              </div>

              {/* Phase 2 Group */}
              <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1 flex justify-between">
                      <span>Phase 2: Deep Dive</span>
                      <span className="text-[10px] bg-gray-100 dark:bg-[#333] px-1.5 rounded text-gray-500">Background</span>
                  </h4>
                  <div className="space-y-2 opacity-90">
                      {PHASE_2_WORKFLOWS.map(wf => {
                          const result = auditResults[wf.id] || { status: 'pending' };
                          const isActive = activeTab === wf.id;
                          return (
                              <button
                                  key={wf.id}
                                  onClick={() => setActiveTab(wf.id)}
                                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm border transition-all ${
                                      isActive 
                                      ? 'bg-white dark:bg-[#232323] border-blue-500 shadow-md' 
                                      : 'bg-gray-50 dark:bg-[#1a1a1a] border-transparent hover:bg-white dark:hover:bg-[#232323] text-gray-500'
                                  }`}
                              >
                                  <div className="flex items-center gap-3">
                                      <div className={`p-1.5 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400 dark:bg-[#333]'}`}>
                                          {wf.icon}
                                      </div>
                                      <span className={`font-medium ${isActive ? 'text-gray-900 dark:text-[#ededed]' : ''}`}>{wf.label}</span>
                                  </div>
                                  {result.status === 'running' && <Loader2 size={14} className="animate-spin text-blue-500" />}
                                  {result.status === 'completed' && <CheckCircle size={14} className="text-blue-500" />}
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>

          {/* Right Content: Agent Output */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
              {/* Output Header */}
              <div className="p-4 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50/50 dark:bg-[#1f1f1f]">
                  <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">
                          {[...PHASE_1_WORKFLOWS, ...PHASE_2_WORKFLOWS].find(w => w.id === activeTab)?.label}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded border bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-[#333] text-gray-500">
                          {activeTab.includes('deep') || activeTab.includes('tech') ? 'Phase 2' : 'Phase 1'}
                      </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Zap size={12} className="text-yellow-500" /> Powered by Gemini 3 Pro
                  </div>
              </div>
              
              {/* Output Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {isResearching ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <Globe size={48} className="text-blue-500 animate-pulse mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 dark:text-[#ededed] mb-2">Global Research In Progress...</h3>
                          <p className="max-w-md text-center text-sm">Scanning competitive landscape, market trends, and technical benchmarks. This data will be cached for all agents.</p>
                      </div>
                  ) : auditResults[activeTab] ? (
                      renderResultContent(auditResults[activeTab])
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <Loader2 size={40} className="animate-spin mb-4 text-gray-300" />
                          <p>Initializing agent...</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
