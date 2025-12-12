
import React, { useState, useEffect } from 'react';
import { 
  History, 
  AlertTriangle, 
  Save, 
  Edit3, 
  ArrowRight, 
  ShieldAlert, 
  Building2, 
  Users, 
  Target, 
  FileText, 
  Clock,
  Info,
  X,
  Loader2
} from 'lucide-react';
import { getBriefingById } from '../services/briefingService';

interface ClientBriefingProps {
    clientId?: string | null; // This acts as the briefId in the current implementation
    onNavigate?: (view: string, id?: string | null) => void;
    isEmbedded?: boolean;
}

// --- Types ---

type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface ChangeLogEntry {
  id: string;
  date: string;
  author: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  impact: ImpactLevel;
  impactDescription: string;
}

interface BriefingData {
  companyName: string;
  businessModel: string;
  targetAudience: string;
  competitors: string;
  primaryGoal: string;
}

// --- Mock Data ---

const INITIAL_HISTORY: ChangeLogEntry[] = [
  {
    id: 'evt-1',
    date: 'Dec 08, 14:30',
    author: 'Admin',
    fieldChanged: 'Business Model',
    oldValue: 'Physical Store (Paris)',
    newValue: 'E-commerce Only',
    impact: 'HIGH',
    impactDescription: 'Strategy Reset: Local SEO paused, National Shipping keywords activated.'
  },
  {
    id: 'evt-2',
    date: 'Dec 08, 14:35',
    author: 'Admin',
    fieldChanged: 'Target Audience',
    oldValue: 'Walk-in customers (Ile-de-France)',
    newValue: 'National shipping (France Wide)',
    impact: 'MEDIUM',
    impactDescription: 'Content Update: Removal of "Visit us" CTAs.'
  }
];

const INITIAL_STATE: BriefingData = {
  companyName: "",
  businessModel: "",
  targetAudience: "",
  competitors: "",
  primaryGoal: ""
};

// --- Components ---

const ImpactBadge = ({ level }: { level: ImpactLevel }) => {
  const styles = {
    HIGH: 'bg-red-100 text-red-700 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${styles[level]} flex items-center gap-1`}>
      {level === 'HIGH' && <ShieldAlert size={10} />}
      {level} IMPACT
    </span>
  );
};

const ClientBriefing: React.FC<ClientBriefingProps> = ({ clientId, isEmbedded = false }) => {
  const [formData, setFormData] = useState<BriefingData>(INITIAL_STATE);
  const [history, setHistory] = useState<ChangeLogEntry[]>(INITIAL_HISTORY);
  const [isDirty, setIsDirty] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load Real Data
  useEffect(() => {
    if (clientId) {
      setIsLoading(true);
      // Simulate network fetch
      setTimeout(() => {
        const data = getBriefingById(clientId);
        if (data) {
          // Map dynamic answers to our fixed form structure for this view
          setFormData({
            companyName: data.answers?.business_name || data.clientName || "",
            businessModel: data.answers?.business_desc_fallback || "See full brief for details",
            targetAudience: data.answers?.target_audience_macro || "",
            competitors: data.answers?.competitors || "",
            primaryGoal: data.answers?.main_goal || ""
          });
        }
        setIsLoading(false);
      }, 500);
    }
  }, [clientId]);

  const handleInputChange = (field: keyof BriefingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSaveVersion = () => {
    setIsDirty(false);
    
    const newLog: ChangeLogEntry = {
      id: `evt-${Date.now()}`,
      date: 'Just now',
      author: 'You',
      fieldChanged: 'Manual Update',
      oldValue: 'Previous Version',
      newValue: 'Current Version',
      impact: 'LOW',
      impactDescription: 'Routine update logged by system.'
    };
    setHistory([newLog, ...history]);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-slate-50 font-sans text-slate-900 ${isEmbedded ? '' : 'min-h-screen'} relative overflow-hidden`}>
      
      {/* 1. Impact Alert Banner (Sticky Top) */}
      {showCriticalAlert && (
        <div className="sticky top-0 z-30 bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start sm:items-center justify-between shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Critical Strategy Shift Detected</h3>
              <p className="text-xs text-amber-700">
                Recent changes require a full audit of existing keywords.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-medium bg-white border border-amber-200 text-amber-800 px-3 py-1.5 rounded hover:bg-amber-100 transition-colors">
              Review Audit
            </button>
            <button 
              onClick={() => setShowCriticalAlert(false)}
              className="text-xs font-medium text-amber-600 hover:text-amber-800 px-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full mx-auto p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <header className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-blue-600" /> Project Briefing
              </h1>
              <p className="text-slate-500 text-sm mt-1">The living source of truth for the marketing team.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium transition-opacity ${isDirty ? 'opacity-100 text-amber-600' : 'opacity-0'}`}>
                Unsaved changes
              </span>
              
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-white bg-slate-100 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                title="View Evolution Log"
              >
                <History size={16} />
                <span className="hidden sm:inline">History</span>
              </button>

              <button 
                onClick={handleSaveVersion}
                disabled={!isDirty}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm
                  ${isDirty 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md translate-y-0' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
              >
                <Save size={16} />
                Save New Version
              </button>
            </div>
          </header>

          {/* Form Content - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
            
            {/* Section: Identity */}
            <div className="group">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                <Building2 size={18} className="text-slate-400" />
                <h2>Company Identity</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Brand Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter brand name..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Business Model <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.businessModel}
                    onChange={(e) => handleInputChange('businessModel', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g. E-commerce, SaaS, Service..."
                  />
                </div>
              </div>
            </div>

            {/* Section: Market */}
            <div className="group">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                <Users size={18} className="text-slate-400" />
                <h2>Market Position</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Audience</label>
                  <textarea 
                    rows={3}
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Describe the ideal customer profile..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Key Competitors</label>
                  <input 
                    type="text" 
                    value={formData.competitors}
                    onChange={(e) => handleInputChange('competitors', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="List main competitors..."
                  />
                </div>
              </div>
            </div>

            {/* Section: Goals */}
            <div className="group">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                <Target size={18} className="text-slate-400" />
                <h2>Objectives</h2>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Goal (Q1)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.primaryGoal}
                    onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-4 py-3 text-sm text-slate-800 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="What is the main objective?"
                  />
                  <Target size={18} className="absolute left-3 top-3 text-emerald-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* History Drawer (Slide-Over) */}
      <div 
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" 
          onClick={() => setIsHistoryOpen(false)} 
        />
        
        <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none transform transition-transform duration-300 ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-screen max-w-md pointer-events-auto bg-white shadow-2xl h-full flex flex-col">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <History className="text-purple-600" size={20} /> Evolution Log
              </h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-10">
                {history.map((item, idx) => (
                  <div key={item.id} className="relative pl-6">
                    
                    {/* Timeline Dot */}
                    <div className={`
                      absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm
                      ${idx === 0 ? 'bg-purple-600 ring-4 ring-purple-100' : 'bg-slate-300'}
                    `}></div>

                    {/* Card */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                      
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock size={12} />
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{item.author}</span>
                        </div>
                        <ImpactBadge level={item.impact} />
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Changed: {item.fieldChanged}</p>
                        <div className="text-sm leading-relaxed">
                          <span className="line-through text-red-400 decoration-red-400/50 mr-2 opacity-80">
                            {item.oldValue}
                          </span>
                          <ArrowRight size={12} className="inline text-slate-400 mr-2" />
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                            {item.newValue}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2 rounded border border-slate-100 flex gap-2 items-start">
                        <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 leading-snug">
                          {item.impactDescription}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

                {/* End of timeline indicator */}
                <div className="relative pl-6 opacity-50">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                  <p className="text-xs text-slate-400">Project Created</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ClientBriefing;
