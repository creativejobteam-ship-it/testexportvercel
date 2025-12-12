
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Settings, CheckCircle2, 
  Loader2, TrendingUp, BrainCircuit, 
  Briefcase, Check, Clock, FileText, 
  Search, Target, Calendar as CalendarIcon, Rocket, 
  AlertTriangle, ChevronDown, ChevronUp, 
  Terminal, Activity, Layout, Eye, Lock,
  ArrowRight, Smile, BarChart3, Zap, MessageSquare, ArrowUpRight,
  Play, PauseCircle, RotateCcw, StopCircle, RefreshCw, Radio,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';
import { Project, Strategy, BriefingRecord, WorkflowStage } from '../types';
import { updateProjectStatus, getStrategies as getLocalStrategies } from '../services/strategyService';
import { getBriefings as getLocalBriefings } from '../services/briefingService';
import { getBriefs as getLiveBriefs, getStrategies as getLiveStrategies } from '../src/services/dbService';
import { getAutopilotState, toggleAutopilot } from '../services/autopilotService';
import { useProjectContext } from '../src/contexts/ProjectContext';
import { useToast } from '../src/contexts/ToastContext';
import { useAuth } from '../src/contexts/AuthProvider';

// Workflow Modules
import CalendarView from './Calendar';
import PublisherView from './Publisher';
import AnalyticsView from './Analytics';
import AuditDashboard from './Audit/AuditDashboard';
import StrategyDashboard from './strategies/StrategyDashboard';
import ClientBriefing from './ClientBriefing';

interface ProjectDetailsProps {
  projectId: string | null;
  onNavigate: (view: string, id?: string | null) => void;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'briefing', label: 'Briefing' },
  { id: 'audit', label: 'Audit' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'planning', label: 'Planning' },
  { id: 'production', label: 'Production' },
  { id: 'reporting', label: 'Reporting' },
];

const TIMELINE_STEPS = [
  { id: 'briefing', label: 'Briefing', icon: FileText, stage: 'BRIEF_RECEIVED' },
  { id: 'audit', label: 'Audit', icon: Search, stage: 'AUDIT_SEARCH' },
  { id: 'strategy', label: 'Strategy', icon: Target, stage: 'STRATEGY_GEN' },
  { id: 'planning', label: 'Planning', icon: CalendarIcon, stage: 'ACTION_PLAN' },
  { id: 'production', label: 'Production', icon: Rocket, stage: 'PRODUCTION' },
  { id: 'reporting', label: 'Reporting', icon: BarChart3, stage: 'REPORTING_ROTATION' },
];

// Mock Data for New Dashboard
const STRATEGIC_DATA = {
    engagement: [
        { name: 'W1', value: 2400 },
        { name: 'W2', value: 1398 },
        { name: 'W3', value: 9800 },
        { name: 'W4', value: 3908 },
        { name: 'W5', value: 4800 },
        { name: 'W6', value: 3800 },
        { name: 'W7', value: 4300 },
    ],
    shareOfVoice: [
        { name: 'Our Brand', value: 45, color: '#6366f1' }, // Indigo
        { name: 'Competitor A', value: 30, color: '#10b981' }, // Emerald
        { name: 'Competitor B', value: 25, color: '#f43f5e' }, // Rose
    ],
    conversion: [
        { value: 100, name: 'Impressions', fill: '#f43f5e' },
        { value: 80, name: 'Clicks', fill: '#fb7185' },
        { value: 50, name: 'Leads', fill: '#fda4af' },
        { value: 20, name: 'Sales', fill: '#fecdd3' }
    ]
};

const AI_DATA = {
    relevance: [
        { name: 'Mon', auto: 80, edited: 20 },
        { name: 'Tue', auto: 85, edited: 15 },
        { name: 'Wed', auto: 90, edited: 10 },
        { name: 'Thu', auto: 75, edited: 25 },
        { name: 'Fri', auto: 88, edited: 12 },
    ],
    velocity: [
        { name: 'Blog', last: 4, current: 6 },
        { name: 'Social', last: 12, current: 18 },
        { name: 'Video', last: 2, current: 5 },
    ],
    nps: 72,
    botResolution: 94.5
};

const CountUp = ({ end, duration = 1500, suffix = '', decimals = 0 }: { end: number, duration?: number, suffix?: string, decimals?: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = time - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);
            
            setCount(ease * end);
            
            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{count.toFixed(decimals)}{suffix}</>;
};

// Vertical Ticker Component for Marquee effect
const VerticalTicker = ({ logs }: { logs: string[] }) => {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        if (logs.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % logs.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [logs]);

    return (
        <div className="h-5 overflow-hidden relative w-full">
           <div key={index} className="animate-slide-up-fade text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate flex items-center gap-2">
              <Activity size={12} className="animate-pulse" />
              {logs[index] || "Waiting for activity..."}
           </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const ProjectLifecycleSection = ({ project, logs, setActiveTab, onAction }: { project: Project, logs: string[], setActiveTab: (id: string) => void, onAction: (stepId: string, status: string, e: React.MouseEvent) => void }) => {
    const getStepStatus = (stepStage: string) => {
        const currentStage = project.autopilotSettings?.currentWorkflowStage || 'BRIEF_RECEIVED';
        const stagesOrder = ['BRIEF_RECEIVED', 'AUDIT_SEARCH', 'STRATEGY_GEN', 'ACTION_PLAN', 'PRODUCTION', 'REPORTING_ROTATION'];
        
        const currentIndex = stagesOrder.indexOf(currentStage);
        const stepIndex = stagesOrder.indexOf(stepStage);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    const activeStepIndex = TIMELINE_STEPS.findIndex(s => getStepStatus(s.stage) === 'current');
    const progressPercent = activeStepIndex === -1 ? 100 : (activeStepIndex / (TIMELINE_STEPS.length - 1)) * 100;

    return (
        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-8 shadow-sm relative z-10 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">Project Lifecycle</h3>
                    <p className="text-sm text-gray-500 dark:text-[#888]">Cycle #{project.autopilotSettings?.rotationPeriod || 1}_days</p>
                </div>
                
                {/* Marquee Vertical Carousel for Logs */}
                <div className="flex-1 w-full md:max-w-md bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-lg px-4 py-2">
                    <VerticalTicker logs={logs} />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${project.autopilotEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    <span className="text-xs font-medium text-gray-600 dark:text-[#ccc]">
                        {project.autopilotEnabled ? 'Autopilot Engaged' : 'Autopilot Paused'}
                    </span>
                </div>
            </div>

            <div className="relative flex justify-between items-center px-4 mb-4">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-[#333] -z-10 -translate-y-1/2 rounded-full"></div>
                
                {/* Active Progress Line */}
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                ></div>

                {/* Steps */}
                {TIMELINE_STEPS.map((step, index) => {
                    const status = getStepStatus(step.stage);
                    const isAudit = step.id === 'audit';
                    const isPaused = isAudit && !project.autopilotEnabled && status === 'current';
                    
                    let statusText = 'Pending';
                    if (status === 'completed') statusText = 'Completed';
                    if (status === 'current') statusText = isPaused ? 'Paused' : 'Running';

                    let statusColor = 'text-gray-400';
                    if (status === 'completed') statusColor = 'text-emerald-600 dark:text-emerald-400';
                    if (status === 'current') statusColor = isPaused ? 'text-red-500' : 'text-blue-600 dark:text-blue-400';

                    return (
                        <div 
                            key={step.id}
                            onClick={() => setActiveTab(step.id)}
                            className="group relative flex flex-col items-center gap-3 cursor-pointer"
                        >
                            {/* Icon Circle */}
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 relative bg-white dark:bg-[#1c1c1c]
                                ${status === 'completed' 
                                    ? 'border-emerald-500 text-emerald-600'
                                    : status === 'current'
                                        ? isPaused 
                                            ? 'border-red-500 text-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]'
                                            : 'border-emerald-500 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]'
                                        : 'border-gray-200 dark:border-[#444] text-gray-400'
                                }
                            `}>
                                {status === 'current' && !isPaused && (
                                    <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-20"></span>
                                )}
                                
                                {/* Base Icon */}
                                <div className="group-hover:opacity-0 transition-opacity duration-200">
                                    {status === 'completed' ? <Check size={20} strokeWidth={3} /> : (isPaused ? <PauseCircle size={20} /> : <step.icon size={20} />)}
                                </div>

                                {/* Hover Action Overlay */}
                                <div 
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-[#1c1c1c] rounded-full"
                                    onClick={(e) => onAction(step.id, status, e)}
                                >
                                    {status === 'current' ? (
                                        <PauseCircle size={24} className="text-red-500 fill-red-50 dark:fill-red-900/20" />
                                    ) : status === 'completed' ? (
                                        <RotateCcw size={20} className="text-orange-500" />
                                    ) : (
                                        <Play size={20} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-900/20" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Labels */}
                            <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                                <span className={`text-xs font-semibold ${status === 'current' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {step.label}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${statusColor}`}>
                                    {statusText}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StrategicKPIsSection = () => {
    return (
        <div className="bg-white dark:bg-[#1c1c1c] rounded-xl p-6 mb-8 border border-gray-200 dark:border-[#282828] shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-6 flex items-center gap-2">
                <Target size={18} className="text-indigo-600 dark:text-indigo-400" /> Strategic Impact
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Global Engagement - Large */}
                <div className="lg:col-span-2 bg-white dark:bg-[#232323] rounded-lg p-4 border border-gray-100 dark:border-[#333] hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider">Global Engagement Rate</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">5.2%</span>
                                <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded font-medium">+12%</span>
                            </div>
                        </div>
                        <Activity size={16} className="text-indigo-500" />
                    </div>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={STRATEGIC_DATA.engagement}>
                                <defs>
                                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#1e293b', fontSize: '12px', borderRadius: '8px' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Share of Voice - Square */}
                <div className="bg-white dark:bg-[#232323] rounded-lg p-4 border border-gray-100 dark:border-[#333] hover:shadow-md transition-shadow duration-300">
                    <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider">Share of Voice</p>
                    </div>
                    <div className="h-40 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={STRATEGIC_DATA.shareOfVoice}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={true}
                                >
                                    {STRATEGIC_DATA.shareOfVoice.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-gray-900 dark:text-[#ededed]">45%</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-3 text-[10px] text-gray-500 dark:text-[#888]">
                        {STRATEGIC_DATA.shareOfVoice.map((item, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversion - Square */}
                <div className="bg-white dark:bg-[#232323] rounded-lg p-4 border border-gray-100 dark:border-[#333] hover:shadow-md transition-shadow duration-300">
                    <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider">Conversion Funnel</p>
                    </div>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={STRATEGIC_DATA.conversion} barSize={12}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={true}>
                                  {STRATEGIC_DATA.conversion.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AiAutomationKPIsSection = () => {
    return (
        <div className="bg-white dark:bg-[#1c1c1c] rounded-xl p-6 border border-gray-200 dark:border-[#282828] shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-6 flex items-center gap-2">
                <BrainCircuit size={18} className="text-emerald-500" /> AI & Automation Efficiency
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* NPS Social */}
                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-100 dark:border-[#333] hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between mb-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase">NPS Social</p>
                        <Smile size={16} className="text-emerald-500" />
                    </div>
                    <div className="h-24 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: 72 }, { value: 28 }]}
                                    cx="50%"
                                    cy="100%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={30}
                                    outerRadius={50}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={true}
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#e2e8f0" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-0 left-0 right-0 text-center">
                            <span className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">
                                <CountUp end={72} />
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Relevance */}
                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-100 dark:border-[#333] hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between mb-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase">AI Relevance</p>
                        <Zap size={16} className="text-yellow-500" />
                    </div>
                    <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AI_DATA.relevance} stackOffset="expand">
                                <Bar dataKey="auto" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} isAnimationActive={true} />
                                <Bar dataKey="edited" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Auto</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div> Edited</span>
                    </div>
                </div>

                {/* Bot Resolution */}
                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-100 dark:border-[#333] hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <p className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase">Bot Resolution</p>
                        <MessageSquare size={16} className="text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-[#ededed]">
                            <CountUp end={94.5} decimals={1} suffix="%" />
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-[#666] mt-2">Requests handled without human intervention.</p>
                </div>

                {/* Content Velocity */}
                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-100 dark:border-[#333] hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between mb-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase">Velocity</p>
                        <Rocket size={16} className="text-purple-500" />
                    </div>
                    <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AI_DATA.velocity} barGap={2}>
                                <Bar dataKey="last" fill="#e2e8f0" radius={[2, 2, 0, 0]} isAnimationActive={true} />
                                <Bar dataKey="current" fill="#8b5cf6" radius={[2, 2, 0, 0]} isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-[9px] text-gray-400 mt-2">
                        Last Month vs Current
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onNavigate }) => {
  const { clients, isLoading: isContextLoading, refreshData } = useProjectContext();
  const { user } = useAuth();
  const { success, info } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Related Data
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [brief, setBrief] = useState<BriefingRecord | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Effect to find the project and related data
  useEffect(() => {
      const loadProjectContext = async () => {
          if (projectId && !isContextLoading && clients.length > 0) {
              let found: Project | undefined;
              for (const client of clients) {
                  const p = client.projects?.find(prj => prj.id === projectId);
                  if (p) {
                      found = { ...p, clientName: client.companyName, clientId: client.id };
                      break;
                  }
              }
              setProject(found || null);

              if (found) {
                  // Load Strategy
                  if (user && user.uid !== 'demo-user-123') {
                      try {
                          const liveStrategies = await getLiveStrategies(user.uid);
                          const foundStrat = liveStrategies.find(s => s.clientId === found?.clientId);
                          setStrategy(foundStrat || null);
                      } catch (e) { console.error("Strategy load error", e); }
                  } else {
                      const allStrategies = getLocalStrategies();
                      const foundStrat = allStrategies.find(s => s.clientId === found?.clientId);
                      setStrategy(foundStrat || null);
                  }

                  // Load Brief
                  let foundBrief: BriefingRecord | undefined;
                  if (user && user.uid !== 'demo-user-123') {
                      try {
                          const liveBriefs = await getLiveBriefs(user.uid);
                          foundBrief = liveBriefs.find(b => b.projectId === found?.id);
                      } catch (e) {
                          console.error("Brief load error", e);
                      }
                  } else {
                      const allBriefs = getLocalBriefings();
                      foundBrief = allBriefs.find(b => b.projectId === found?.id);
                  }
                  setBrief(foundBrief || null);
              }
          }
      };
      
      loadProjectContext();
  }, [projectId, clients, isContextLoading, user]);

  // Live Logs Simulation for Overview
  useEffect(() => {
      if (activeTab === 'overview') {
          const state = getAutopilotState();
          // Filter logs to show only relevant ones or mock variety
          const relevantLogs = state.logs.length > 0 
            ? state.logs.slice(-10).reverse() 
            : ["Monitoring system active...", "Checking social feeds...", "Analyzing sentiment...", "No new alerts."];
          setLogs(relevantLogs);
          
          const interval = setInterval(() => {
              const freshState = getAutopilotState();
              if (freshState.logs.length > 0) {
                  setLogs(freshState.logs.slice(-10).reverse());
              }
          }, 4000);
          return () => clearInterval(interval);
      }
  }, [activeTab]);

  if (isContextLoading) {
      return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212]">
              <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
              <p className="text-gray-500 dark:text-[#888] text-sm">Loading workspace...</p>
          </div>
      );
  }

  if (!project) {
      return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212]">
              <div className="text-center max-w-md">
                  <AlertTriangle className="mx-auto text-amber-500 mb-4" size={40} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-[#ededed] mb-2">Project Not Found</h2>
                  <button onClick={() => onNavigate('projects-manage', null)} className="text-emerald-600 hover:underline">Return to Projects</button>
              </div>
          </div>
      );
  }

  const handleAutopilotToggle = async () => {
      const newState = !project.autopilotEnabled;
      setProject({ ...project, autopilotEnabled: newState });
      updateProjectStatus(project.id, { autopilotEnabled: newState });
      // Also update global state for widget consistency
      toggleAutopilot(newState); 
      await refreshData();
  };

  const handleStepAction = (stepId: string, status: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (status === 'current') {
          info("Pausing Agent...");
      } else if (status === 'completed') {
          success(`Restarting ${stepId} Phase...`);
      } else {
          success(`Force starting ${stepId}...`);
      }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#121212] pb-12 animate-fade-in flex flex-col">
      
      {/* 1. Header (Sticky) */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#1c1c1c]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#282828] px-6">
        <div className="w-full pt-4 pb-0">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('projects-manage', null)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500 dark:text-[#888]">{project.clientName} /</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{project.name}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#ededed] tracking-tight">{project.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#232323] rounded-md border border-gray-200 dark:border-[#333]">
                        <BrainCircuit size={14} className={project.autopilotEnabled ? "text-emerald-500" : "text-gray-400"} />
                        <span className="text-xs font-medium text-gray-600 dark:text-[#ccc]">Autopilot</span>
                        <button
                            onClick={handleAutopilotToggle}
                            className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${project.autopilotEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-[#444]'}`}
                        >
                            <span className={`${project.autopilotEnabled ? 'translate-x-3' : 'translate-x-0'} pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232323] rounded-lg transition-colors"><Settings size={20} /></button>
                </div>
            </div>

            {/* Secondary Tabs */}
            <div className="flex gap-8 mt-6 overflow-x-auto custom-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-[#888] dark:hover:text-[#ccc] hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* 2. Content Area - Full height flexible container */}
      <div className="flex-1 w-full px-6 py-8 flex flex-col min-h-0">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {/* Section A: Project Lifecycle */}
                  <ProjectLifecycleSection 
                      project={project} 
                      logs={logs} 
                      setActiveTab={setActiveTab} 
                      onAction={handleStepAction}
                  />

                  {/* Section B: Strategic KPIs */}
                  <StrategicKPIsSection />

                  {/* Section C: AI & Automation */}
                  <AiAutomationKPIsSection />
              </div>
          )}

          {/* TAB: BRIEFING */}
          {activeTab === 'briefing' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  {brief ? (
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                           {/* Pass brief ID as the clientId prop because ClientBriefing handles brief IDs in that prop */}
                          <ClientBriefing clientId={brief.id} onNavigate={onNavigate} isEmbedded={true} />
                      </div>
                  ) : (
                      // Empty state
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <AlertTriangle className="text-gray-400 mb-4" size={48} />
                          <p className="text-gray-500 mb-4">No briefing record found for this project.</p>
                          <button 
                            onClick={() => onNavigate('send-briefing', null)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Create Briefing Request
                          </button>
                      </div>
                  )}
              </div>
          )}

          {/* TAB: AUDIT */}
          {activeTab === 'audit' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-hidden">
                      <AuditDashboard projectId={projectId} onBack={() => {}} isEmbedded={true} />
                  </div>
              </div>
          )}

          {/* TAB: STRATEGY */}
          {activeTab === 'strategy' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-hidden">
                      <StrategyDashboard projectId={projectId} onNavigate={onNavigate} isEmbedded={true} />
                  </div>
              </div>
          )}

          {/* TAB: PLANNING */}
          {activeTab === 'planning' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="flex-1 p-4 overflow-hidden flex flex-col">
                      <CalendarView projectId={projectId} isEmbedded={true} />
                  </div>
              </div>
          )}

          {/* TAB: PRODUCTION */}
          {activeTab === 'production' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-hidden flex flex-col">
                      <PublisherView isEmbedded={true} />
                  </div>
              </div>
          )}

          {/* TAB: REPORTING */}
          {activeTab === 'reporting' && (
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-hidden flex flex-col">
                      <AnalyticsView viewMode="reports" isEmbedded={true} />
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default ProjectDetails;
