
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Circle, BrainCircuit, Search, ChevronRight } from 'lucide-react';

interface AuditProcessRunnerProps {
  title: string;
  steps: string[];
  onComplete?: () => void;
  children: React.ReactNode;
  autoStart?: boolean;
  onStepClick?: (index: number) => void;
}

const AuditProcessRunner: React.FC<AuditProcessRunnerProps> = ({ 
  title, 
  steps, 
  onComplete, 
  children, 
  autoStart = true,
  onStepClick
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Reset effect if autoStart changes (e.g., relaunch)
  useEffect(() => {
      if (autoStart) {
          setIsComplete(false);
          setCurrentStepIndex(0);
          setIsRunning(true);
      }
  }, [autoStart]);

  useEffect(() => {
    if (!isRunning || isComplete) return;

    if (currentStepIndex < steps.length) {
      // Simulate varying processing times for "Agentic" feel (1.5s to 2.5s)
      const processTime = Math.floor(Math.random() * 1000) + 1500;
      
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, processTime);

      return () => clearTimeout(timer);
    } else {
      // All steps done
      const finishTimer = setTimeout(() => {
        setIsComplete(true);
        setIsRunning(false);
        if (onComplete) onComplete();
      }, 800);
      
      return () => clearTimeout(finishTimer);
    }
  }, [currentStepIndex, isRunning, steps.length, onComplete, isComplete]);

  return (
    <div className="w-full h-full min-h-[500px]">
      {!isComplete ? (
        <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
          <div className="max-w-lg w-full bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainCircuit size={32} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#ededed]">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-[#8b9092] mt-2">AI Agent is performing deep analysis...</p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const isFinished = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div 
                    key={index} 
                    onClick={() => isFinished && onStepClick && onStepClick(index)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 scale-105 shadow-sm' 
                      : isFinished
                        ? 'bg-white dark:bg-[#2a2a2a] border-transparent hover:border-gray-200 dark:hover:border-[#333] cursor-pointer group'
                        : 'border-transparent opacity-50'
                  }`}
                  >
                    <div className="flex items-center gap-4">
                        <div className="shrink-0">
                        {isFinished ? (
                            <CheckCircle2 size={20} className="text-emerald-500" />
                        ) : isCurrent ? (
                            <Loader2 size={20} className="text-emerald-600 animate-spin" />
                        ) : (
                            <Circle size={20} className="text-gray-300 dark:text-[#444]" />
                        )}
                        </div>
                        <span className={`text-sm font-medium ${
                        isFinished ? 'text-gray-700 dark:text-[#ccc]' : 
                        isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 
                        'text-gray-400 dark:text-[#666]'
                        }`}>
                        {step}
                        </span>
                    </div>
                    
                    {isFinished && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                            <Search size={12} /> Sources <ChevronRight size={12} />
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
           {children}
        </div>
      )}
    </div>
  );
};

export default AuditProcessRunner;
