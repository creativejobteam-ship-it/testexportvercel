
import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../../src/contexts/ProjectContext';
import { getAllProjects, updateStrategy, getStrategies, addNewStrategy } from '../../services/strategyService';
import { triggerWorkflowStep } from '../../services/autopilotService';
import { generateActionPlan, generateStrategyFromContext } from '../../services/geminiService';
import { getBriefings } from '../../services/briefingService';
import GlobalVision from './GlobalVision';
import ChannelTactics from './ChannelTactics';
import PresentationExport from './PresentationExport';
import { ArrowLeft, Lightbulb, Layers, Presentation, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '../../src/contexts/ToastContext';
import { ActionItem, Strategy } from '../../types';

interface StrategyDashboardProps {
  projectId: string | null;
  onBack?: () => void;
  onNavigate?: (view: string, id?: string | null) => void;
  isEmbedded?: boolean;
}

const StrategyDashboard: React.FC<StrategyDashboardProps> = ({ projectId, onBack, onNavigate, isEmbedded = false }) => {
  const { selectProject, selectClient } = useProjectContext();
  const { success, error: showError, info } = useToast();
  const [activeTab, setActiveTab] = useState('global');
  const [projectData, setProjectData] = useState<any>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
      const allProjs = getAllProjects();
      const proj = allProjs.find(p => p.id === projectId);
      if (proj) {
        setProjectData(proj);
        selectClient(proj.clientId);
        
        // CHECKPOINT 3.5: Auto-Generate Draft Strategy if missing but Audit exists
        checkAndGenerateDraft(proj);
      }
    }
  }, [projectId]);

  const checkAndGenerateDraft = async (proj: any) => {
      const strategies = getStrategies();
      const existingStrategy = strategies.find(s => s.clientId === proj.clientId);

      if (!existingStrategy && proj.auditResults && Object.keys(proj.auditResults).length > 0) {
          setIsGeneratingDraft(true);
          try {
              // Get Brief
              const briefs = getBriefings();
              const brief = briefs.find(b => b.projectId === proj.id);

              // Call Agent
              const generated = await generateStrategyFromContext(
                  brief ? { 
                      id: brief.id, 
                      clientId: brief.clientId, 
                      answers: brief.answers || {}, 
                      submittedAt: brief.createdAt,
                      status: 'reviewed',
                      domainId: 'gen' 
                  } : undefined,
                  proj.auditResults
              );

              // Create Strategy Object
              const newStrategy: Strategy = {
                  id: `str_${Date.now()}`,
                  clientId: proj.clientId,
                  clientName: proj.clientName,
                  // @ts-ignore
                  clientAvatar: `https://ui-avatars.com/api/?name=${proj.clientName.replace(' ', '+')}`,
                  domain: proj.activitySector || 'General',
                  periodStart: new Date().toISOString(),
                  periodEnd: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
                  performanceScore: 0,
                  month: new Date().toLocaleString('default', { month: 'long' }),
                  year: new Date().getFullYear(),
                  theme: "AI Generated Strategy", // Could come from gen result
                  goals: ["Growth", "Engagement"], // Could come from gen result
                  contentPillars: generated.contentPillars.map(p => p.title),
                  executiveSummary: generated.executiveSummary,
                  status: 'draft',
                  actionPlan: []
              };

              addNewStrategy(newStrategy);
              success("Strategy Draft Generated from Audit Data");
          } catch (e) {
              console.error("Draft generation failed", e);
              showError("Failed to generate draft strategy from audit.");
          } finally {
              setIsGeneratingDraft(false);
          }
      }
  };

  const handleApproveStrategy = async () => {
      if (!projectId || !projectData) return;
      setIsApproving(true);
      
      try {
          // 1. Get current strategy details
          const strategies = getStrategies();
          const currentStrategy = strategies.find(s => s.clientId === projectData.clientId);

          if (currentStrategy) {
              // 2. Generate Action Plan using Gemini AI
              const aiActionPlan = await generateActionPlan(currentStrategy);

              // Map ActionTask to ActionItem to match Strategy interface
              const mappedActionPlan: ActionItem[] = aiActionPlan.tasks.map(t => ({
                  id: t.id,
                  task: t.title,
                  status: t.status === 'done' ? 'completed' : t.status,
                  dueDate: t.dueDate || new Date().toISOString(),
                  priority: t.priority
              }));

              // 3. Update Strategy in DB/Local Store with new tasks and active status
              updateStrategy(currentStrategy.id, {
                  status: 'active',
                  actionPlan: mappedActionPlan
              });

              // 4. Update Project Workflow Status
              triggerWorkflowStep(projectId, 'STRATEGY_APPROVED');

              success("Strategy Approved & Plan Generated", "Redirecting to Action Plan...");
              
              // 5. Navigate to 'action-plan' view
              if (onNavigate) {
                  setTimeout(() => {
                      onNavigate('action-plan');
                  }, 1000);
              }
          } else {
              showError("No strategy found for this project.");
          }
      } catch (e) {
          console.error("Strategy approval failed", e);
          showError("Failed to generate action plan.");
      } finally {
          setIsApproving(false);
      }
  };

  if (!projectId || !projectData) return <div className="p-8 text-center">Loading Strategy Context...</div>;

  if (isGeneratingDraft) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                  <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-[#ededed]">Synthesizing Audit Intelligence</h2>
              <p className="text-gray-500 mt-2">Creating initial strategic pillars based on competitor analysis...</p>
          </div>
      );
  }

  return (
    <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
      {/* Header */}
      {!isEmbedded && (
      <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-[#282828] pb-4">
        {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] transition-colors w-fit">
            <ArrowLeft size={16} /> Back to Strategies
            </button>
        )}
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-[#ededed] tracking-tight">Strategy / {projectData.name}</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1">Define the roadmap for {projectData.clientName}.</p>
        </div>
      </div>
      )}

      {/* Embedded Actions */}
      <div className={`flex justify-between items-center ${isEmbedded ? 'mb-4' : 'mb-6'}`}>
          {isEmbedded && <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">Strategy Definition</h3>}
          <div className="flex gap-2 ml-auto">
                <button 
                    onClick={handleApproveStrategy}
                    disabled={isApproving}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isApproving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {isApproving ? 'Generating Action Plan...' : 'Approve & Save Strategy'}
                </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
        {[
          { id: 'global', label: 'Global Vision', icon: <Lightbulb size={16} /> },
          { id: 'tactics', label: 'Channel Tactics', icon: <Layers size={16} /> },
          { id: 'export', label: 'Presentation & Export', icon: <Presentation size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-[#232323] text-gray-600 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-[#333]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`mt-4 ${isEmbedded ? 'flex-1 overflow-y-auto custom-scrollbar pr-2' : ''}`}>
        {activeTab === 'global' && <GlobalVision />}
        {activeTab === 'tactics' && <ChannelTactics />}
        {activeTab === 'export' && <PresentationExport />}
      </div>
    </div>
  );
};

export default StrategyDashboard;
