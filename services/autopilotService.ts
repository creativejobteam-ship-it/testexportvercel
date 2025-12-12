
import { GoogleGenAI } from "@google/genai";
import { AutopilotState, AutopilotStage, WorkflowStage } from "../types";
import { getProjectById, updateProjectStatus, getStrategies } from "./strategyService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// MOCK INITIAL STATE
let currentState: AutopilotState = {
  isEnabled: false,
  currentStage: 'audit_benchmark', 
  lastRun: new Date().toISOString(),
  cycleNumber: 2,
  logs: [
    "[1:44:23 AM] ✅ Cycle 2 Started. Stage set to AUDIT.",
    "[1:44:18 AM] 🤖 AI Agent: Analyzing KPIs & Scanning Web for Trends...",
    "[1:44:18 AM] Fetching Cycle 1 KPIs...",
    "[1:44:18 AM] 🔄 END OF CYCLE DETECTED.",
    "System initialized.",
    "Connecting to social APIs...",
    "Connection established (latency: 24ms).",
    "Monitoring incoming stream..."
  ],
  previousPeriodKPIs: {
    reach: "154,000 (+12%)",
    engagement: "4.8% (-0.2%)",
    conversion: "125 leads"
  }
};

export const getAutopilotState = () => currentState;

export const toggleAutopilot = (enabled: boolean) => {
  currentState.isEnabled = enabled;
  const msg = enabled ? "Autopilot ACTIVATED." : "Autopilot PAUSED.";
  currentState.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  
  // Broadcast event for UI components (Header, Projects, etc)
  if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('global-autopilot-change', { detail: enabled }));
  }

  return { ...currentState };
};

export const setWorkflowStage = (stage: AutopilotStage) => {
  currentState.currentStage = stage;
  currentState.logs.push(`[${new Date().toLocaleTimeString()}] Advanced to stage: ${stage.toUpperCase()}`);
  return { ...currentState };
};

// THE BRAIN: Logic to handle the cyclical transition
export const runCycleTransition = async (): Promise<{ nextStage: AutopilotStage, auditSummary: string }> => {
  try {
    // 1. Logic: If we are at Analytics (End of Cycle), we MUST go to Audit, NOT Strategy.
    if (currentState.currentStage !== 'analytics') {
      throw new Error("Can only trigger Cycle Transition from Analytics stage.");
    }

    currentState.logs.push(`[${new Date().toLocaleTimeString()}] 🔄 END OF CYCLE DETECTED.`);
    currentState.logs.push(`[${new Date().toLocaleTimeString()}] Fetching Cycle ${currentState.cycleNumber} KPIs...`);
    
    // Simulate fetching KPIs (In real app, this comes from DB)
    const kpis = currentState.previousPeriodKPIs;

    // 2. AI Prompt: Generate new Audit based on KPIs + New Web Search
    currentState.logs.push(`[${new Date().toLocaleTimeString()}] 🤖 AI Agent: Analyzing KPIs & Scanning Web for Trends...`);
    
    const prompt = `
      Act as a Senior Digital Marketing Strategist running an automated cycle for a client.
      
      STEP 1: ANALYZE PREVIOUS PERFORMANCE
      KPIs from last month:
      - Reach: ${kpis?.reach}
      - Engagement: ${kpis?.engagement}
      - Conversions: ${kpis?.conversion}
      
      STEP 2: NEW BENCHMARK & TRENDS
      Use your knowledge (simulated web search) to identify 3 trending topics in the SaaS/Tech industry for the upcoming month.
      
      STEP 3: SYNTHESIS
      Generate a brief "Cycle Audit Summary" that diagnoses why Engagement might be down (if applicable) and proposes a new direction for the next cycle.
      
      Format the output as a concise HTML string (no markdown blocks) suitable for a notification dashboard.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const auditText = response.text || "Audit generation failed.";

    // 3. Update State
    currentState.cycleNumber += 1;
    currentState.currentStage = 'audit_benchmark'; // CRITICAL: Reset to Audit
    currentState.logs.push(`[${new Date().toLocaleTimeString()}] ✅ Cycle ${currentState.cycleNumber} Started. Stage set to AUDIT.`);
    
    // Add the full audit to logs
    currentState.logs.push(`🔍 New Cycle Audit Generated:\n${auditText.replace(/<[^>]*>?/gm, '')}`);

    return {
      nextStage: 'audit_benchmark',
      auditSummary: auditText
    };

  } catch (error) {
    console.error("Autopilot Cycle Error", error);
    currentState.logs.push(`[Error] ${error}`);
    throw error;
  }
};

// Helper to simulate steps within the new cycle
export const generateNextStep = async (currentStage: AutopilotStage): Promise<AutopilotStage> => {
    // Linear progression map
    const flow: Record<AutopilotStage, AutopilotStage> = {
        'onboarding': 'audit_benchmark',
        'audit_benchmark': 'strategy',
        'strategy': 'action_plan',
        'action_plan': 'editorial_plan',
        'editorial_plan': 'production',
        'production': 'analytics',
        'analytics': 'audit_benchmark' // The Cycle Loop
    };

    const next = flow[currentStage];
    
    // Simulate AI work time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    currentState.currentStage = next;
    currentState.logs.push(`[${new Date().toLocaleTimeString()}] Task completed. Advancing to ${next.replace('_', ' ').toUpperCase()}.`);
    
    return next;
};

// --- REACTIVE AUTOPILOT LOGIC ---

/**
 * Triggers the next workflow step for a specific project based on an event.
 * Logic: If global autopilot is ON AND project autopilot is ON -> Advance Stage.
 */
export const triggerWorkflowStep = (projectId: string, event: 'BRIEF_COMPLETED' | 'AUDIT_COMPLETED' | 'STRATEGY_APPROVED') => {
    // Note: Removed global autopilot check to allow manual trigger via button
    
    const project = getProjectById(projectId);
    if (!project) return;

    const currentStage = project.autopilotSettings?.currentWorkflowStage || 'BRIEF_RECEIVED';
    let nextStage: WorkflowStage | null = null;

    // Transition Logic
    if (event === 'BRIEF_COMPLETED') {
        nextStage = 'AUDIT_SEARCH';
    } else if (event === 'AUDIT_COMPLETED') {
        nextStage = 'STRATEGY_GEN';
    } else if (event === 'STRATEGY_APPROVED') {
        nextStage = 'ACTION_PLAN';
        
        // Also update the linked Strategy object to 'active' status
        // This ensures it appears in the Action Plan view
        const allStrategies = getStrategies();
        const linkedStrategy = allStrategies.find(s => s.clientId === project.clientId);
        if (linkedStrategy) {
            linkedStrategy.status = 'active'; 
        }
    }

    if (nextStage) {
        // Update project state
        const newSettings = { 
            ...project.autopilotSettings, 
            currentWorkflowStage: nextStage 
        };
        // @ts-ignore
        updateProjectStatus(projectId, { autopilotSettings: newSettings });
        
        // Log
        currentState.logs.push(`[${new Date().toLocaleTimeString()}] 🤖 Autopilot triggered for project ${project.name}: Advancing to ${nextStage}`);
    }
};
