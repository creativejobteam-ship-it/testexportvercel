
import React, { useState } from 'react';
import AuditProcessRunner from '../../components/Audit/AuditProcessRunner';
import { 
  TrendingUp, 
  Globe, 
  Users, 
  ArrowUpRight, 
  BarChart2, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Edit3,
  X,
  Search,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface Competitor {
  id: number;
  name: string;
  frequency: string;
  topChannel: string;
  marketShare: string;
  trend: string;
}

interface MarketInsight {
  title: string;
  value: string;
  delta: string;
  insight: string;
  icon: 'globe' | 'users' | 'trending';
}

interface ResearchLog {
    stepId: number;
    query: string;
    sources: { title: string; domain: string; url: string; }[];
    findings: string[];
}

const INITIAL_COMPETITORS: Competitor[] = [
  { id: 1, name: 'NexTech Solutions', frequency: 'Daily (5/week)', topChannel: 'LinkedIn', marketShare: '12.5%', trend: '+1.2%' },
  { id: 2, name: 'Global Systems', frequency: 'Low (1/week)', topChannel: 'Twitter/X', marketShare: '8.2%', trend: '-0.5%' },
  { id: 3, name: 'Innovate Labs', frequency: 'High (10/week)', topChannel: 'Instagram', marketShare: '5.1%', trend: '+3.4%' },
];

const INITIAL_INSIGHTS: MarketInsight[] = [
  { title: 'Market Share', value: '12.5%', delta: '+1.2%', insight: 'Your brand is gaining traction against "Competitor A" in the European region.', icon: 'globe' },
  { title: 'Competitor Audience', value: 'High Overlap', delta: '', insight: '85% audience overlap with "TechGiant Inc." on LinkedIn.', icon: 'users' },
  { title: 'Viral Strategy', value: 'Video Short-form', delta: '', insight: 'Competitors are pivoting to 15s video content for acquisition.', icon: 'trending' }
];

const RESEARCH_DATA: ResearchLog[] = [
    {
        stepId: 0,
        query: "SaaS marketing automation competitive landscape 2024 report",
        sources: [
            { title: "Top Marketing Automation Software 2024", domain: "g2.com", url: "#" },
            { title: "State of Marketing Report", domain: "hubspot.com", url: "#" },
            { title: "Competitor Analysis Framework", domain: "semrush.com", url: "#" }
        ],
        findings: [
            "Market is consolidating around AI-first solutions.",
            "Top 5 players control 60% of enterprise market share.",
            "Emerging challengers focusing on niche vertical integrations."
        ]
    },
    {
        stepId: 1,
        query: "Identify direct competitors for Auto-CM platform",
        sources: [
            { title: "Alternative to Buffer & Hootsuite", domain: "capterra.com", url: "#" },
            { title: "Best Social Media Management Tools", domain: "zapier.com", url: "#" },
            { title: "TechCrunch Startup Directory", domain: "techcrunch.com", url: "#" }
        ],
        findings: [
            "Identified 'NexTech' as primary direct feature competitor.",
            "Detected 'Global Systems' pivoting into our space.",
            "Filtered out 12 indirect competitors due to lack of AI features."
        ]
    },
    {
        stepId: 2,
        query: "site:linkedin.com/company/nextech-solutions posts",
        sources: [
            { title: "NexTech Solutions - LinkedIn", domain: "linkedin.com", url: "#" },
            { title: "Global Systems - X (Twitter)", domain: "twitter.com", url: "#" },
            { title: "Ad Library - Meta", domain: "facebook.com", url: "#" }
        ],
        findings: [
            "NexTech posts 5x/week, primarily video content.",
            "Global Systems has stopped posting on Facebook entirely.",
            "High engagement on 'Founder Stories' across all competitors."
        ]
    },
    {
        stepId: 3,
        query: "Competitor engagement rate analysis social media",
        sources: [
            { title: "Social Blade Stats", domain: "socialblade.com", url: "#" },
            { title: "Engagement Benchmarks 2024", domain: "sproutsocial.com", url: "#" }
        ],
        findings: [
            "Average engagement rate for sector is 1.2%.",
            "Innovate Labs is over-performing at 3.4%.",
            "Video content receiving 200% more comments than static images."
        ]
    },
    {
        stepId: 4,
        query: "SWOT analysis generation based on gathered data",
        sources: [
            { title: "Internal Analysis Engine", domain: "auto-cm.ai", url: "#" }
        ],
        findings: [
            "Strength: Our AI automation is faster than incumbents.",
            "Weakness: Lower brand recognition in APAC region.",
            "Opportunity: Competitors ignoring TikTok B2B potential."
        ]
    }
];

type WorkflowStatus = 'RUNNING' | 'REVIEW' | 'VALIDATED';

const CompetitorWatch: React.FC = () => {
  const [status, setStatus] = useState<WorkflowStatus>('RUNNING');
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS);
  const [insights, setInsights] = useState<MarketInsight[]>(INITIAL_INSIGHTS);
  
  // Research Modal State
  const [selectedResearchStep, setSelectedResearchStep] = useState<number | null>(null);

  const tasks = [
    "Scanning competitive landscape...",
    "Identifying top 5 direct competitors...",
    "Scraping social media signals (LinkedIn, Twitter)...",
    "Analyzing content frequency & engagement...",
    "Synthesizing SWOT analysis..."
  ];

  // --- Handlers ---

  const handleRelaunch = () => {
    if (confirm("This will discard current changes and restart the AI analysis. Continue?")) {
      setStatus('RUNNING');
      setCompetitors(INITIAL_COMPETITORS); // Reset data simulation
    }
  };

  const handleValidate = () => {
    // Simulate API Save
    setStatus('VALIDATED');
  };

  const handleCompetitorChange = (id: number, field: keyof Competitor, value: string) => {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleInsightChange = (index: number, field: keyof MarketInsight, value: string) => {
    setInsights(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleStepClick = (index: number) => {
      setSelectedResearchStep(index);
  };

  // --- Render Helpers ---

  const renderInsightCard = (item: MarketInsight, index: number) => {
    const isEdit = status === 'REVIEW';
    
    return (
      <div key={index} className={`bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border ${status === 'VALIDATED' ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-gray-200 dark:border-[#282828]'} shadow-sm transition-all`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${item.icon === 'globe' ? 'bg-blue-50 text-blue-600' : item.icon === 'users' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'} dark:bg-opacity-20`}>
            {item.icon === 'globe' && <Globe size={20} />}
            {item.icon === 'users' && <Users size={20} />}
            {item.icon === 'trending' && <TrendingUp size={20} />}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-[#888]">{item.title}</p>
            {isEdit ? (
               <input 
                  value={item.value} 
                  onChange={(e) => handleInsightChange(index, 'value', e.target.value)}
                  className="text-lg font-bold text-gray-900 dark:text-[#ededed] bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded px-2 py-0.5 w-full mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
               />
            ) : (
               <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed]">{item.value} <span className="text-emerald-500 text-xs ml-1">{item.delta}</span></h3>
            )}
          </div>
        </div>
        {isEdit ? (
            <textarea 
                value={item.insight}
                onChange={(e) => handleInsightChange(index, 'insight', e.target.value)}
                className="text-xs text-gray-600 dark:text-[#ccc] bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded p-2 w-full h-20 resize-none focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            />
        ) : (
            <p className="text-xs text-gray-500 leading-relaxed">{item.insight}</p>
        )}
      </div>
    );
  };

  const renderResearchModal = () => {
      if (selectedResearchStep === null) return null;
      const data = RESEARCH_DATA[selectedResearchStep];
      const taskName = tasks[selectedResearchStep];

      return (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-[#282828] animate-slide-up flex flex-col max-h-[85vh]">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Step {selectedResearchStep + 1}
                              </span>
                              <span className="text-gray-400 dark:text-[#666] text-xs">Research Verification</span>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg leading-tight">{taskName}</h3>
                      </div>
                      <button onClick={() => setSelectedResearchStep(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                      
                      {/* Search Query Section */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Search size={14} /> Agent Query Used
                          </h4>
                          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#333] rounded-lg p-3 text-sm font-mono text-gray-700 dark:text-[#ccc]">
                              > {data.query}
                          </div>
                      </div>

                      {/* Sources Grid */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-3 flex items-center gap-2">
                              <BookOpen size={14} /> Verified Sources
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                              {data.sources.map((source, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors group cursor-pointer">
                                      <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#333] flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                          {i + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 dark:text-[#ededed] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                              {source.title}
                                          </p>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                              <img src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=16`} className="w-3 h-3 opacity-70" alt="" />
                                              <p className="text-xs text-gray-500 dark:text-[#888] truncate">{source.domain}</p>
                                          </div>
                                      </div>
                                      <ExternalLink size={14} className="text-gray-300 dark:text-[#444] group-hover:text-blue-500" />
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Key Findings */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-3 flex items-center gap-2">
                              <CheckCircle2 size={14} /> Extracted Intelligence
                          </h4>
                          <ul className="space-y-2">
                              {data.findings.map((finding, i) => (
                                  <li key={i} className="text-sm text-gray-700 dark:text-[#b4b4b4] flex gap-2 leading-relaxed">
                                      <span className="text-emerald-500 mt-1.5">•</span>
                                      {finding}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="relative pb-20"> {/* Padding bottom for sticky footer */}
      {renderResearchModal()}

      {/* 1. PROCESS RUNNER (Handles the 'RUNNING' state internally, then shows children) */}
      <AuditProcessRunner 
        title="Competitor Intelligence Agent" 
        steps={tasks} 
        autoStart={status === 'RUNNING'}
        onComplete={() => setStatus('REVIEW')}
        onStepClick={handleStepClick}
      >
        <div className="space-y-6 animate-slide-up">
          
          {/* HEADER */}
          <div className="flex justify-between items-end border-b border-gray-200 dark:border-[#282828] pb-4">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Competitor Watch</h2>
                  <p className="text-gray-500 dark:text-[#8b9092]">Real-time analysis of your market rivals.</p>
              </div>
              <div className="flex items-center gap-2">
                  {status === 'REVIEW' && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                          <Edit3 size={12} /> Review Mode
                      </span>
                  )}
                  {status === 'VALIDATED' && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={12} /> Validated
                      </span>
                  )}
              </div>
          </div>

          {/* STATUS BANNER (REVIEW MODE) */}
          {status === 'REVIEW' && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                      <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Autopilot is OFF: Human Verification Required</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                          The AI agent has completed its analysis. Please review the data below, correct any inaccuracies, and validate to proceed to the Strategy phase.
                      </p>
                  </div>
              </div>
          )}

          {/* INSIGHTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((item, i) => renderInsightCard(item, i))}
          </div>

          {/* COMPETITORS TABLE */}
          <div className={`bg-white dark:bg-[#1c1c1c] border rounded-xl overflow-hidden ${status === 'VALIDATED' ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-gray-200 dark:border-[#282828]'}`}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-[#333] flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-[#ededed]">Top 3 Competitors Activity</h3>
                  {status === 'VALIDATED' && <Lock size={14} className="text-emerald-500" />}
              </div>
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-[#232323] text-gray-500 dark:text-[#888]">
                      <tr>
                          <th className="px-6 py-3 font-medium">Competitor Name</th>
                          <th className="px-6 py-3 font-medium">Post Freq.</th>
                          <th className="px-6 py-3 font-medium">Top Channel</th>
                          <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                      {competitors.map((comp) => (
                          <tr key={comp.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] group">
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#ededed]">
                                  {status === 'REVIEW' ? (
                                      <input 
                                          value={comp.name} 
                                          onChange={(e) => handleCompetitorChange(comp.id, 'name', e.target.value)}
                                          className="bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded px-2 py-1 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                                      />
                                  ) : comp.name}
                              </td>
                              <td className="px-6 py-4">
                                  {status === 'REVIEW' ? (
                                      <input 
                                          value={comp.frequency} 
                                          onChange={(e) => handleCompetitorChange(comp.id, 'frequency', e.target.value)}
                                          className="bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded px-2 py-1 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                                      />
                                  ) : comp.frequency}
                              </td>
                              <td className="px-6 py-4 text-blue-600">
                                  {status === 'REVIEW' ? (
                                      <input 
                                          value={comp.topChannel} 
                                          onChange={(e) => handleCompetitorChange(comp.id, 'topChannel', e.target.value)}
                                          className="bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded px-2 py-1 w-full text-blue-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                                      />
                                  ) : comp.topChannel}
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-emerald-600 text-xs hover:underline flex items-center justify-end gap-1 ml-auto">
                                      Analyze <ArrowUpRight size={12}/>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      </AuditProcessRunner>

      {/* STICKY ACTION BAR (Only in REVIEW mode) */}
      {status === 'REVIEW' && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-slide-up">
              <button 
                  onClick={handleRelaunch}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] text-sm font-medium transition-colors"
              >
                  <RefreshCw size={16} /> Relaunch Analysis
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-[#333]"></div>
              <button 
                  onClick={handleValidate}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                  <CheckCircle2 size={18} /> Validate & Lock
              </button>
          </div>
      )}
    </div>
  );
};

export default CompetitorWatch;
