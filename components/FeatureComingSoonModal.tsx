
import React from 'react';
import { X, Rocket, Bell, MessageSquare } from 'lucide-react';

export interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ads' | 'engagement' | null;
}

const FeatureComingSoonModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const content = {
    ads: {
      title: "Ads Autopilot Arrive Bientôt !",
      description: "Nous construisons le premier gestionnaire de publicité 100% autonome. Bientôt, notre IA gérera vos budgets et vos campagnes Meta/Google pour maximiser votre ROI sans effort.",
      icon: <Rocket size={40} className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />,
      gradient: "from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30",
      ring: "ring-white dark:ring-[#1c1c1c]",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      highlightColor: "text-indigo-600 dark:text-indigo-400"
    },
    engagement: {
      title: "AI Engagement Arrive Bientôt !",
      description: "Nous construisons le premier gestionnaire de communauté 100% autonome. Bientôt, notre IA gérera vos commentaires, messages privés et interactions pour maximiser votre engagement sans effort.",
      icon: <MessageSquare size={40} className="text-pink-600 dark:text-pink-400 drop-shadow-sm" />,
      gradient: "from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30",
      ring: "ring-white dark:ring-[#1c1c1c]",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      highlightColor: "text-pink-600 dark:text-pink-400"
    }
  };

  const data = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-[#282828] relative animate-slide-up">
        
        {/* Decorative Background */}
        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${type === 'ads' ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} z-0`}></div>
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] transition-colors z-10 p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-full"
        >
            <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center text-center relative z-10">
            <div className={`w-20 h-20 bg-gradient-to-br ${data.gradient} rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ${data.ring}`}>
                {data.icon}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed] mb-3">
                {data.title}
            </h2>
            
            <p className="text-gray-600 dark:text-[#8b9092] text-sm leading-relaxed mb-8">
                {data.description}
            </p>

            <div className="flex flex-col w-full gap-3">
                <button 
                    onClick={onClose}
                    className={`w-full py-3 px-4 ${data.buttonColor} text-white rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2`}
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

export default FeatureComingSoonModal;
