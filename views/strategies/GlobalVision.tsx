
import React from 'react';
import { Target, Lightbulb, Users, ArrowRight, TrendingUp, FolderOpen } from 'lucide-react';
import { useProjectContext } from '../../src/contexts/ProjectContext';

const GlobalVision: React.FC = () => {
  const { selectedProject, selectedClient } = useProjectContext();

  if (!selectedProject) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#232323] rounded-full flex items-center justify-center mb-6 text-gray-400">
                  <FolderOpen size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed] mb-2">No Project Selected</h2>
              <p className="text-gray-500 dark:text-[#888] max-w-md">
                  Please select a client and a project from the sidebar to view the strategic vision.
              </p>
          </div>
      );
  }

  // Placeholder logic for project-specific data
  // In a real app, you would fetch the strategy associated with selectedProject.id here.
  const hasStrategy = true; // Assume true for demo

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Global Vision</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">
                Strategy for <span className="font-medium text-emerald-600">{selectedProject.name}</span> ({selectedClient?.companyName})
            </p>
        </div>

        {/* The Big Idea */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Lightbulb size={180} />
            </div>
            <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-4 text-emerald-100 uppercase tracking-widest text-xs font-bold">
                    <SparklesIcon /> Core Concept
                </div>
                <h3 className="text-3xl font-bold mb-4 leading-tight">"Community-First Expansion"</h3>
                <p className="text-emerald-50 text-lg leading-relaxed mb-6">
                    Shift focus from broad acquisition to deepening engagement with our core user base. Leverage user-generated content and expert-led webinars to build authority and trust, driving organic referrals as the primary growth engine.
                </p>
                <div className="flex gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Authenticity</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Education</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Partnership</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Funnel */}
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-6 flex items-center gap-2">
                    <Target size={20} className="text-blue-500" /> Strategic Funnel
                </h3>
                
                <div className="space-y-4">
                    {/* Awareness */}
                    <div className="relative">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 w-full">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-blue-700 dark:text-blue-400">Awareness (TOFU)</span>
                                <span className="text-xs text-blue-600 dark:text-blue-300">Reach: 150k</span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-300">Viral Reels, LinkedIn Thought Leadership, PR mentions.</p>
                        </div>
                        <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 text-gray-300 dark:text-[#444] z-10">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    {/* Consideration */}
                    <div className="relative mx-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-purple-700 dark:text-purple-400">Consideration (MOFU)</span>
                                <span className="text-xs text-purple-600 dark:text-purple-300">Engage: 12k</span>
                            </div>
                            <p className="text-sm text-purple-600 dark:text-purple-300">Webinars, Case Studies, Newsletter Deep Dives.</p>
                        </div>
                        <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 text-gray-300 dark:text-[#444] z-10">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    {/* Conversion */}
                    <div className="mx-8">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">Conversion (BOFU)</span>
                                <span className="text-xs text-emerald-600 dark:text-emerald-300">Leads: 450</span>
                            </div>
                            <p className="text-sm text-emerald-600 dark:text-emerald-300">Demo booking, Free Audit offer, Direct Sales.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" /> Key Performance Indicators
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-[#333]">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider mb-1">Total Reach</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">250,000</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+15% vs last month</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-[#333]">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider mb-1">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">5.2%</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Target: > 4.5%</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-[#333]">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider mb-1">Qualified Leads</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">85</p>
                        <p className="text-xs text-gray-400 mt-1">Via LinkedIn & Web</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-[#333]">
                        <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-wider mb-1">Brand Mentions</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">1,240</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+8% Positive Sentiment</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const SparklesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
    </svg>
);

export default GlobalVision;
