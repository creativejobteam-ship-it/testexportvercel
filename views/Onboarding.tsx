

import React, { useState } from 'react';
import { Camera, Check, ChevronRight, Palette, Globe, Target, Zap, Layout, ArrowLeft, Plus, Upload, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { Platform } from '../types';
import { generateMarketingStrategy } from '../services/geminiService';

interface OnboardingProps {
  onComplete: () => void;
}

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Trustworthy, formal, corporate' },
  { id: 'friendly', label: 'Friendly', desc: 'Approachable, warm, helpful' },
  { id: 'witty', label: 'Witty', desc: 'Humorous, clever, engaging' },
  { id: 'bold', label: 'Bold', desc: 'Confident, assertive, energetic' },
  { id: 'empathetic', label: 'Empathetic', desc: 'Understanding, supportive, caring' },
];

const PLATFORMS_LIST = [
  { id: Platform.Facebook, label: 'Facebook', color: 'bg-blue-600' },
  { id: Platform.Instagram, label: 'Instagram', color: 'bg-pink-600' },
  { id: Platform.Twitter, label: 'X (Twitter)', color: 'bg-black' },
  { id: Platform.LinkedIn, label: 'LinkedIn', color: 'bg-blue-700' },
  { id: Platform.TikTok, label: 'TikTok', color: 'bg-black' },
  { id: Platform.Pinterest, label: 'Pinterest', color: 'bg-red-600' },
  { id: Platform.GoogleBusiness, label: 'Google Business', color: 'bg-blue-500' },
  { id: Platform.YouTube, label: 'YouTube', color: 'bg-red-600' },
  { id: Platform.WordPress, label: 'WordPress', color: 'bg-gray-700' },
  { id: Platform.Telegram, label: 'Telegram', color: 'bg-sky-500' },
  { id: Platform.Mastodon, label: 'Mastodon', color: 'bg-purple-600' },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState({
    name: '',
    website: '',
    color: '#3ecf8e',
    logo: null as string | null,
    tone: 'professional',
    audience: '',
    objectives: '',
    competitors: '',
    resources: 'Solo Founder',
    platforms: [] as Platform[]
  });
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  const handleNext = async () => {
    if (step === 3) {
      setIsLoading(true);
      const strategy = await generateMarketingStrategy(brandData);
      setGeneratedStrategy(strategy);
      setIsLoading(false);
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  const togglePlatform = (p: Platform) => {
    if (brandData.platforms.includes(p)) {
      setBrandData({ ...brandData, platforms: brandData.platforms.filter(i => i !== p) });
    } else {
      setBrandData({ ...brandData, platforms: [...brandData.platforms, p] });
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setBrandData({ ...brandData, logo: e.target?.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <Layout size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Brand Identity</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Start by defining your visual identity.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Brand Name</label>
          <input
            type="text"
            value={brandData.name}
            onChange={(e) => setBrandData({...brandData, name: e.target.value})}
            placeholder="e.g. AutoCM"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={brandData.website}
                onChange={(e) => setBrandData({...brandData, website: e.target.value})}
                placeholder="autocm.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Brand Color</label>
            <div className="relative">
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-200 cursor-pointer shadow-sm" 
                style={{ backgroundColor: brandData.color }}
              >
                <input 
                    type="color" 
                    value={brandData.color}
                    onChange={(e) => setBrandData({...brandData, color: e.target.value})}
                    className="opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={brandData.color}
                onChange={(e) => setBrandData({...brandData, color: e.target.value})}
                className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none uppercase"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-2">Brand Logo</label>
          <div 
            onDrop={handleLogoDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative overflow-hidden ${brandData.logo ? 'border-[#3ecf8e] bg-[#3ecf8e]/5' : 'border-gray-300 dark:border-[#383838] hover:border-[#3ecf8e] bg-gray-50 dark:bg-[#1c1c1c]'}`}
          >
            {brandData.logo ? (
                <div className="relative h-24 flex items-center justify-center">
                    <img src={brandData.logo} alt="Logo" className="max-h-full object-contain" />
                    <button 
                        onClick={(e) => { e.stopPropagation(); setBrandData({...brandData, logo: null}); }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                    >
                        <Plus size={14} className="rotate-45" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="w-12 h-12 bg-white dark:bg-[#232323] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm pointer-events-none">
                    <Upload size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#ededed] pointer-events-none">Drag & drop logo here</p>
                    <p className="text-xs text-gray-500 dark:text-[#8b9092] mt-1 pointer-events-none">or click to browse (SVG, PNG, JPG)</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => setBrandData({ ...brandData, logo: e.target?.result as string });
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
          <Target size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Strategic Briefing</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Help our AI understand your business goals.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-3">Tone of Voice</label>
          <div className="grid grid-cols-2 gap-3">
            {TONES.map((tone) => (
              <div
                key={tone.id}
                onClick={() => setBrandData({ ...brandData, tone: tone.id })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  brandData.tone === tone.id
                    ? 'border-[#3ecf8e] bg-[#3ecf8e]/5 ring-1 ring-[#3ecf8e]'
                    : 'border-gray-200 dark:border-[#383838] bg-white dark:bg-[#232323] hover:border-gray-300 dark:hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium text-sm ${brandData.tone === tone.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-[#ededed]'}`}>
                    {tone.label}
                  </span>
                  {brandData.tone === tone.id && <Check size={14} className="text-[#3ecf8e]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Objectives & KPIs</label>
                <textarea
                    value={brandData.objectives}
                    onChange={(e) => setBrandData({...brandData, objectives: e.target.value})}
                    placeholder="e.g. Increase brand awareness, drive traffic to website..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none h-24 resize-none text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Target Audience</label>
                <textarea
                    value={brandData.audience}
                    onChange={(e) => setBrandData({...brandData, audience: e.target.value})}
                    placeholder="e.g. Tech-savvy professionals aged 25-40..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none h-24 resize-none text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Competitors</label>
                <input
                    type="text"
                    value={brandData.competitors}
                    onChange={(e) => setBrandData({...brandData, competitors: e.target.value})}
                    placeholder="e.g. Competitor A, Competitor B"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Resources</label>
                <select 
                    value={brandData.resources}
                    onChange={(e) => setBrandData({...brandData, resources: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none text-sm"
                >
                    <option>Solo Founder</option>
                    <option>Small Team (2-5)</option>
                    <option>Agency / Large Team</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
          <Zap size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Connect Accounts</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Link your social media profiles for auto-publishing.</p>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {PLATFORMS_LIST.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between p-3 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-xl hover:border-[#3ecf8e]/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${platform.color}`}>
                <span className="text-xs font-bold">{platform.label[0]}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-[#ededed] text-sm">{platform.label}</span>
            </div>
            <button
              onClick={() => togglePlatform(platform.id as Platform)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                brandData.platforms.includes(platform.id as Platform)
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-600 dark:text-[#8b9092] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] border border-transparent'
              }`}
            >
              {brandData.platforms.includes(platform.id as Platform) ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 rounded-lg p-3 mt-4 flex items-start gap-3">
        <Zap className="text-emerald-600 mt-0.5 shrink-0" size={16} />
        <p className="text-xs text-emerald-800 dark:text-emerald-400">
          We use official OAuth2 APIs. We never post without your permission.
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <Lightbulb size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">AI Strategy Generated</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Here is your tailored digital marketing roadmap.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {generatedStrategy && (
                <>
                    <div className="bg-white dark:bg-[#232323] p-5 rounded-xl border border-gray-200 dark:border-[#383838]">
                        <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-2">Executive Summary</h3>
                        <p className="text-sm text-gray-600 dark:text-[#8b9092] leading-relaxed">{generatedStrategy.executive_summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#232323] p-5 rounded-xl border border-gray-200 dark:border-[#383838]">
                            <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-3 flex items-center gap-2">
                                <Target size={16} className="text-emerald-500"/> Content Pillars
                            </h3>
                            <ul className="space-y-2">
                                {generatedStrategy.content_pillars?.map((pillar: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-600 dark:text-[#8b9092] flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                        {pillar}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-[#232323] p-5 rounded-xl border border-gray-200 dark:border-[#383838]">
                            <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mb-3 flex items-center gap-2">
                                <TrendingUp size={16} className="text-blue-500"/> Growth Tactics
                            </h3>
                            <ul className="space-y-2">
                                {generatedStrategy.growth_tactics?.map((tactic: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-600 dark:text-[#8b9092] flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                        {tactic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2 text-sm">Recommended Schedule</h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-500">
                            Post frequency: <span className="font-medium">{generatedStrategy.posting_schedule?.frequency}</span>
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-500">
                            Best times: <span className="font-medium">{generatedStrategy.posting_schedule?.best_times}</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2e2e2e] overflow-hidden flex flex-col h-[700px]">
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-[#2e2e2e] w-full shrink-0">
          <div 
            className="h-full bg-[#3ecf8e] transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="flex-1 p-8 md:p-12 overflow-hidden flex flex-col">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        <div className="p-6 md:px-12 border-t border-gray-100 dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] flex justify-between items-center shrink-0">
          <button
            onClick={handleBack}
            disabled={isLoading || step === 1}
            className={`flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-[#8b9092] dark:hover:text-[#ededed] px-4 py-2 ${step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={step === 4 ? onComplete : handleNext}
            disabled={isLoading}
            className="bg-[#3ecf8e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#34b27b] transition-all shadow-lg shadow-[#3ecf8e]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>Generating...</>
            ) : step === 3 ? (
                <>Generate Strategy <Zap size={16} /></>
            ) : step === 4 ? (
                <>Go to Dashboard <ChevronRight size={16} /></>
            ) : (
                <>Next Step <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;