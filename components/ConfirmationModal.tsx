import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-[#282828] animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-[#8b9092] leading-relaxed">
                {message}
              </p>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] transition-colors"
            >
                <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#151515] border-t border-gray-100 dark:border-[#2e2e2e] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#ededed] bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
                onConfirm();
                onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${
                isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;