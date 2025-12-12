
import React from 'react';

interface WorkflowProgressCircleProps {
  current: number;
  total: number;
  isActive?: boolean; // If true, the border spins
  isCompleted?: boolean;
  size?: number;
}

const WorkflowProgressCircle: React.FC<WorkflowProgressCircleProps> = ({ 
  current, 
  total, 
  isActive = false, 
  isCompleted = false,
  size = 40 
}) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on state
  let colorClass = "text-blue-500";
  if (isCompleted || percentage === 100) colorClass = "text-emerald-500";
  else if (isActive) colorClass = "text-blue-500";
  else colorClass = "text-gray-400";

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-100 dark:text-[#333]"
          />
        </svg>

        {/* Progress Circle (Animated or Static) */}
        <svg 
            className={`absolute top-0 left-0 transform -rotate-90 ${isActive && !isCompleted ? 'animate-spin duration-[3000ms]' : 'transition-all duration-500'}`} 
            width={size} 
            height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>

        {/* Text Content */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-[#ededed]">
          {isCompleted ? (
             <span className="text-emerald-600">✓</span>
          ) : (
             <span>{current}/{total}</span>
          )}
        </div>
      </div>
      
      {/* Text Label (Optional context) */}
      <div className="flex flex-col">
          <span className={`text-xs font-semibold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-[#ededed]'}`}>
              {isCompleted ? 'Completed' : isActive ? 'Processing' : 'Pending'}
          </span>
          <span className="text-[10px] text-gray-400">
              {isActive ? 'AI Agent working...' : `${Math.round(percentage)}% done`}
          </span>
      </div>
    </div>
  );
};

export default WorkflowProgressCircle;
