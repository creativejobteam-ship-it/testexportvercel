
import React from 'react';
import { Check, Loader2, Circle, RefreshCw } from 'lucide-react';
import { WorkflowStage } from '../types';

interface CycleProgressWidgetProps {
  currentStage: WorkflowStage;
  cycleNumber?: number;
}

const PHASES = [
  { id: 1, label: 'Briefing', match: ['BRIEF_RECEIVED'] },
  { id: 2, label: 'Audit & Research', match: ['AUDIT_SEARCH'] },
  { id: 3, label: 'Strategy Gen', match: ['STRATEGY_GEN'] },
  { id: 4, label: 'Roadmap & Plan', match: ['ACTION_PLAN'] },
  { id: 5, label: 'Production', match: ['PRODUCTION'] },
  { id: 6, label: 'Analytics', match: ['REPORTING_ROTATION'] }
];

const CycleProgressWidget: React.FC<CycleProgressWidgetProps> = ({ currentStage, cycleNumber = 1 }) => {
  
  // Helper to find current step index based on internal stage
  const getCurrentStepIndex = () => {
    switch (currentStage) {
      case 'BRIEF_RECEIVED': return 0;
      case 'AUDIT_SEARCH': return 1;
      case 'STRATEGY_GEN': return 2;
      case 'ACTION_PLAN': return 3;
      case 'PRODUCTION': return 4;
      case 'REPORTING_ROTATION': return 5;
      default: return 0;
    }
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#282828] p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-[#333] pb-4">
        <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
            <RefreshCw size={16} className="text-emerald-500" /> 
            Cycle #{cycleNumber}
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-[#888] mt-0.5 uppercase tracking-wider">Automated Workflow</p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded font-medium">
            Active
        </span>
      </div>

      <div className="space-y-0 relative flex-1 flex flex-col justify-center">
        {/* Connecting Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-[#333] -z-10"></div>

        {PHASES.map((phase, index) => {
          let status: 'completed' | 'current' | 'pending' = 'pending';
          
          if (index < currentIndex) status = 'completed';
          else if (index === currentIndex) status = 'current';
          
          return (
            <div key={phase.id} className="flex items-center gap-4 py-3 bg-white dark:bg-[#1c1c1c]">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 relative
                ${status === 'completed' 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : status === 'current'
                    ? 'bg-white dark:bg-[#1c1c1c] border-blue-500 text-blue-500' // Base style
                    : 'bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#555]'
                }
              `}>
                {status === 'current' && (
                    <span className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/40 animate-ping opacity-75"></span>
                )}
                {status === 'completed' ? <Check size={14} strokeWidth={3} /> : 
                 status === 'current' ? <Loader2 size={16} className="animate-spin" /> : 
                 <Circle size={10} fill="currentColor" className="text-gray-300 dark:text-[#444]" />}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium transition-colors ${
                    status === 'completed' ? 'text-gray-900 dark:text-[#ededed]' :
                    status === 'current' ? 'text-blue-600 dark:text-blue-400 font-bold' :
                    'text-gray-400 dark:text-[#666]'
                }`}>
                    {phase.label}
                </p>
                {status === 'current' && (
                    <p className="text-[10px] text-blue-500/80 animate-pulse font-medium">Processing...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CycleProgressWidget;
