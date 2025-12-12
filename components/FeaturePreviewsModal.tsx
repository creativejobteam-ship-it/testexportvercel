import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

interface FeaturePreviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturePreviewsModal: React.FC<FeaturePreviewsModalProps> = ({ isOpen, onClose }) => {
  const [toggles, setToggles] = useState({
      feature1: false,
      feature2: false,
      feature3: false,
      feature4: false,
      feature5: false
  });
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('feature1');

  if (!isOpen) return null;

  const handleToggle = (key: string) => {
      setToggles(prev => ({
          ...prev,
          [key]: !prev[key as keyof typeof toggles]
      }));
  };

  const features = [
      { id: 'feature1', title: 'Security notification emails', desc: 'Receive emails about sensitive account actions.', isNew: true },
      { id: 'feature2', title: 'Branching via dashboard', desc: 'Manage database branching directly from the UI.' },
      { id: 'feature3', title: 'Disable Advisor rules', desc: 'Turn off specific linting rules for your project.' },
      { id: 'feature4', title: 'Project API documentation', desc: 'Enhanced auto-generated API docs based on schema.' },
      { id: 'feature5', title: 'Column-level privileges', desc: 'Granular control over column access policies.' }
  ];

  const selectedFeature = features.find(f => f.id === selectedFeatureId) || features[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-[#282828] flex flex-col max-h-[85vh] animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#282828] bg-white dark:bg-[#1c1c1c] shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#ededed]">Dashboard feature previews</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]">
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar List */}
                <div className="w-1/3 border-r border-gray-200 dark:border-[#282828] overflow-y-auto p-2 bg-gray-50 dark:bg-[#151515]">
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer mb-1 transition-colors ${
                                selectedFeatureId === feature.id 
                                ? 'bg-white dark:bg-[#2a2a2a] shadow-sm border border-gray-200 dark:border-[#333]' 
                                : 'hover:bg-gray-100 dark:hover:bg-[#232323] border border-transparent'
                            }`}
                            onClick={() => setSelectedFeatureId(feature.id)}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className={`text-sm font-medium ${selectedFeatureId === feature.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-[#888]'}`}>
                                    {feature.title}
                                </span>
                                {feature.isNew && selectedFeatureId !== feature.id && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">New</span>
                                )}
                            </div>
                            
                            {toggles[feature.id as keyof typeof toggles] && (
                                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check size={10} className="text-white" strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-[#1c1c1c]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">{selectedFeature.title}</h2>
                                {selectedFeature.isNew && (
                                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-[#888]">{selectedFeature.desc}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-[#444] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-[#ededed]">
                                Give feedback
                            </button>
                            <button 
                                onClick={() => handleToggle(selectedFeature.id)}
                                className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                                    toggles[selectedFeature.id as keyof typeof toggles]
                                    ? 'bg-white dark:bg-[#2a2a2a] text-red-700 dark:text-red-400 border-gray-200 dark:border-[#444] hover:bg-red-50 dark:hover:bg-red-900/10'
                                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                {toggles[selectedFeature.id as keyof typeof toggles] ? 'Disable feature' : 'Enable feature'}
                            </button>
                        </div>
                    </div>

                    {/* Preview Image / Content */}
                    <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden relative shadow-md border border-gray-800 mb-6 flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#000] opacity-80"></div>
                        
                        {/* Mock Interface based on feature */}
                        <div className="relative z-10 w-3/4 p-4 border border-gray-700 rounded-md bg-[#1a1a1a] shadow-2xl">
                            {selectedFeature.id === 'feature1' && (
                                <div className="space-y-3">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-700 pb-2 mb-2">Security Notifications</div>
                                    <div className="flex justify-between items-center bg-[#222] p-2 rounded border border-gray-700">
                                        <div className="text-xs text-gray-300">Password Changed</div>
                                        <div className="w-8 h-4 bg-emerald-900/50 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-emerald-500 rounded-full"></div></div>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#222] p-2 rounded border border-gray-700">
                                        <div className="text-xs text-gray-300">New Device Login</div>
                                        <div className="w-8 h-4 bg-emerald-900/50 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-emerald-500 rounded-full"></div></div>
                                    </div>
                                </div>
                            )}
                            {selectedFeature.id !== 'feature1' && (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <p className="text-sm">Preview UI for {selectedFeature.title}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600 dark:text-[#8b9092]">
                        <p>
                            Try out our expanded set of features. Enabling this preview will update your dashboard experience immediately. 
                            You can disable it at any time from this menu.
                        </p>
                        
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-[#ededed] mb-2">Enabling this preview will:</p>
                            <ul className="list-disc list-inside space-y-1 ml-1 text-gray-500 dark:text-[#888]">
                                <li>Provide early access to {selectedFeature.title} workflows</li>
                                <li>Add new UI components to your project settings</li>
                                <li>Allow direct feedback to the product team via the feedback widget</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FeaturePreviewsModal;