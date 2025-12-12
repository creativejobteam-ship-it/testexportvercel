
import React, { useState } from 'react';
import { Linkedin, Instagram, Twitter, Facebook, Video, Image, FileText, Hash, Clock, CheckCircle2 } from 'lucide-react';

const ChannelTactics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'instagram' | 'twitter'>('linkedin');

  const channels = [
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
    { id: 'twitter', label: 'Twitter / X', icon: <Twitter size={16} /> },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Channel Tactics</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Platform-specific execution plans, frequency, and formats.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
            {channels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => setActiveTab(channel.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === channel.id 
                        ? 'bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] shadow-sm ring-1 ring-gray-200 dark:ring-[#333]' 
                        : 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#ccc] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                    }`}
                >
                    {channel.icon} {channel.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Stats & Frequency */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-emerald-500" /> Cadence
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-[#333]">
                            <span className="text-sm text-gray-600 dark:text-[#8b9092]">Frequency</span>
                            <span className="font-semibold text-gray-900 dark:text-[#ededed]">
                                {activeTab === 'linkedin' ? '3x / week' : activeTab === 'instagram' ? '5x / week' : 'Daily'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-[#333]">
                            <span className="text-sm text-gray-600 dark:text-[#8b9092]">Best Times</span>
                            <span className="font-semibold text-gray-900 dark:text-[#ededed]">
                                {activeTab === 'linkedin' ? 'Tue/Thu 9AM' : activeTab === 'instagram' ? '12PM & 6PM' : '9AM, 1PM, 5PM'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-[#8b9092]">Tone</span>
                            <span className="font-semibold text-gray-900 dark:text-[#ededed]">
                                {activeTab === 'linkedin' ? 'Professional & Educational' : activeTab === 'instagram' ? 'Visual & Inspiring' : 'Conversational & Reactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                        <Hash size={18} className="text-blue-500" /> Key Hashtags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['#GrowthMarketing', '#SaaS', '#TechTrends', '#Leadership', '#Innovation', '#FutureOfWork'].map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-[#ccc] px-2 py-1 rounded-md border border-gray-200 dark:border-[#333]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle: Content Pillars */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-6">Editorial Pillars</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Expertise & Authority</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Deep dives into industry problems, how-to guides, and trend analysis.</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-gray-500">Carousel</span>
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-gray-500">Long-form</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2">Social Proof & Trust</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">Client success stories, testimonials, and case study highlights.</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-gray-500">Video Interview</span>
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-gray-500">Quote Card</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                            <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">Company Culture</h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">Behind the scenes, team spotlights, and values in action.</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 text-gray-500">Photo Dump</span>
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 text-gray-500">Stories</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                            <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Product Innovation</h4>
                            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">Feature updates, tips & tricks, and roadmap teasers.</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800 text-gray-500">Demo Video</span>
                                <span className="text-[10px] bg-white dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800 text-gray-500">GIF</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Format Distribution</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center"><Video size={20} className="text-pink-500" /></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-gray-700 dark:text-[#ccc]">Short-form Video (Reels/Shorts)</span>
                                    <span className="text-gray-500">40%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500 w-[40%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center"><Image size={20} className="text-blue-500" /></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-gray-700 dark:text-[#ccc]">Carousels / Slides</span>
                                    <span className="text-gray-500">35%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[35%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center"><FileText size={20} className="text-gray-500" /></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-gray-700 dark:text-[#ccc]">Text / Static Posts</span>
                                    <span className="text-gray-500">25%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-500 w-[25%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChannelTactics;
