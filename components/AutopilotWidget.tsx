
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight
} from 'lucide-react';
import { getAutopilotState, runCycleTransition, generateNextStep } from '../services/autopilotService';
import { AutopilotState, AutopilotStage } from '../types';

interface AutopilotWidgetProps {
    onStatusChange?: (status: boolean) => void;
}

const getStageDisplay = (stage: AutopilotStage) => {
    switch (stage) {
        case 'audit_benchmark': 
            return 'Analyzing Market Data...';
        case 'strategy': 
            return 'Updating Strategy...';
        case 'action_plan': 
            return 'Generating Action Plan...';
        case 'production': 
            return 'Drafting Content...';
        case 'analytics': 
            return 'Reviewing Performance...';
        default: 
            return 'System Idle';
    }
};

const AutopilotWidget: React.FC<AutopilotWidgetProps> = ({ onStatusChange }) => {
    const [state, setState] = useState<AutopilotState>(getAutopilotState());
    const [isProcessing, setIsProcessing] = useState(false);

    // Poll for changes
    useEffect(() => {
        const interval = setInterval(() => {
            setState({ ...getAutopilotState() });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAutoNext = async () => {
        setIsProcessing(true);
        if (state.currentStage === 'analytics') {
            await runCycleTransition();
        } else {
            await generateNextStep(state.currentStage);
        }
        setState({ ...getAutopilotState() });
        setIsProcessing(false);
    };

    // Auto-runner effect for demo (Internal simulation)
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (state.isEnabled && !isProcessing) {
            timeout = setTimeout(() => {
                handleAutoNext();
            }, 8000); // 8 second delay for demo purposes
        }
        return () => clearTimeout(timeout);
    }, [state.isEnabled, state.currentStage, isProcessing]);

    const currentTaskText = getStageDisplay(state.currentStage);

    return (
        <div className="w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 transition-all hover:border-emerald-200 dark:hover:border-emerald-900/30">
            {/* Left: Active Status */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex h-3 w-3 shrink-0">
                    {state.isEnabled && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${state.isEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-[#ededed]">
                        {state.isEnabled ? `Autopilot is Active: ${currentTaskText}` : 'Autopilot is Paused'}
                    </span>
                </div>
            </div>

            {/* Middle: Context (Hidden on small mobile) */}
            <div className="hidden md:block flex-1 text-center border-l border-r border-gray-100 dark:border-[#2e2e2e] mx-6 px-4">
                <span className="text-xs text-gray-500 dark:text-[#888]">
                    Next: <span className="font-medium text-gray-700 dark:text-[#ccc]">Post scheduled for Tomorrow 09:00</span>
                </span>
            </div>

            {/* Right: Navigation */}
            <button className="group whitespace-nowrap text-xs font-medium text-gray-600 dark:text-[#ccc] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                View Activity Log
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default AutopilotWidget;
