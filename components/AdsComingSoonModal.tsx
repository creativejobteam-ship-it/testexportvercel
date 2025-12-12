import React from 'react';
import { X, Rocket, Bell } from 'lucide-react';

interface AdsComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdsComingSoonModal: React.FC<AdsComingSoonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-indigo-100 dark:border-[#282828] relative animate-slide-up">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0"></div>
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] transition-colors z-10 p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-full"
        >
            <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white dark:ring-[#1c1c1c]">
                <Rocket size={40} className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed] mb-3">
                Ads Autopilot Arrive Bientôt !
            </h2>
            
            <p className="text-gray-600 dark:text-[#8b9092] text-sm leading-relaxed mb-8">
                Nous construisons le premier gestionnaire de publicité <span className="font-semibold text-indigo-600 dark:text-indigo-400">100% autonome</span>. Bientôt, notre IA gérera vos budgets et vos campagnes Meta/Google pour maximiser votre ROI sans effort.
            </p>

            <div className="flex flex-col w-full gap-3">
                <button 
                    onClick={() => {
                        // Logic to subscribe user could go here
                        onClose();
                    }}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    <Bell size={18} /> M'avertir quand c'est prêt
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-transparent hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-500 dark:text-[#888] rounded-xl font-medium transition-colors"
                >
                    Fermer
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdsComingSoonModal;