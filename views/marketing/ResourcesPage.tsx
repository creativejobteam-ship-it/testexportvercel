
import React, { useState } from 'react';
import MarketingLayout from './MarketingLayout';
import { 
  Search, FileText, Wrench, Gift, MessageCircle, Info, 
  Calculator, Download, Hash, Type, Image, Link, DollarSign, 
  Smile, Grid, Clock, CheckSquare, RefreshCw, 
  Users, Target, Settings, Shield
} from 'lucide-react';

interface ResourcesPageProps {
  slug: string;
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ slug, onStart, onNavigate, toggleTheme }) => {
  const [jobTitle, setJobTitle] = useState("Click to generate");
  const [clientCount, setClientCount] = useState(5);
  const [monthlyRate, setMonthlyRate] = useState(2000);

  const getHeader = () => {
      switch(slug) {
          case 'blog': return { title: 'Blog', sub: 'Latest news, updates, and engineering deep dives.' };
          case 'tools': return { title: 'Free Tools', sub: 'Generators and calculators to help you grow.' };
          case 'freebies': return { title: 'Freebies', sub: 'Templates, guides, and checklists for your workflow.' };
          case 'quiz': return { title: 'Job Title Generator', sub: 'Find your true calling in the social media world.' };
          case 'calculator': return { title: 'Agency Calculator', sub: 'Estimate your potential revenue and growth.' };
          case 'help': return { title: 'Help Center', sub: 'Guides and documentation for Auto-CM.' };
          default: return { title: 'Resources', sub: 'Everything you need to succeed.' };
      }
  };

  const generateJobTitle = () => {
      const titles = [
          "Chief Meme Officer", "Director of Vibe Curation", "Senior Emoji Architect", 
          "Head of Doomscrolling", "VP of Hashtags", "Community Hugger", 
          "Brand Voice Whisperer", "Gif Coordinator", "Trend Surfer", 
          "Viral Content Ninja", "Story Telling Guru", "Reels Director"
      ];
      const random = titles[Math.floor(Math.random() * titles.length)];
      setJobTitle(random);
  };

  const header = getHeader();

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        
        {/* Header */}
        <section className="pt-24 pb-8 px-6 bg-gray-50 dark:bg-[#0E0E0E] border-b border-gray-200 dark:border-[#282828]">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{header.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">{header.sub}</p>
                
                {slug !== 'quiz' && slug !== 'calculator' && (
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder={`Search ${slug}...`}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-[#333] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                        />
                    </div>
                )}
            </div>
        </section>

        {/* Content Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
            {slug === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "The Ultimate Guide to Social Media Workflows in 2024", cat: "Workflow", img: "workflow" },
                        { title: "How to Build a Content Strategy that Scales", cat: "Strategy", img: "strategy" },
                        { title: "Social Media Trends: What's In and What's Out", cat: "Trends", img: "trends" },
                        { title: "Mastering Approval Workflows for Large Agencies", cat: "Agency", img: "agency" },
                        { title: "The ROI of Community Management: A Deep Dive", cat: "Analytics", img: "roi" },
                        { title: "Automating Engagement: Best Practices & Pitfalls", cat: "Automation", img: "auto" }
                    ].map((article, i) => (
                        <div key={i} className="group cursor-pointer flex flex-col h-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div className="aspect-video bg-gray-100 dark:bg-[#232323] relative overflow-hidden">
                                <img 
                                    src={`https://picsum.photos/seed/${article.img}/800/450`} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                    alt={article.title}
                                />
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {article.cat}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                                    Discover actionable insights and expert advice to elevate your social media game. Learn how top brands are leveraging {article.cat.toLowerCase()} to drive growth.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-[#333]">
                                    <Clock size={14} /> <span>5 min read</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {slug === 'tools' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Caption Generator", icon: <Wrench />, desc: "AI-powered captions" },
                        { name: "Hashtag Finder", icon: <Hash />, desc: "Find trending tags" },
                        { name: "Engagement Calc", icon: <Calculator />, desc: "Measure your impact" },
                        { name: "Bio Optimizer", icon: <Smile />, desc: "Perfect your profile" },
                        { name: "UTM Builder", icon: <Link />, desc: "Track your links" },
                        { name: "ROI Calculator", icon: <DollarSign />, desc: "Prove your value" },
                        { name: "Thread Maker", icon: <MessageCircle />, desc: "Split long text" },
                        { name: "Poll Creator", icon: <CheckSquare />, desc: "Engage followers" },
                        { name: "Image Resizer", icon: <Image />, desc: "Fit every platform" },
                        { name: "Caption Spacer", icon: <Grid />, desc: "Clean line breaks" },
                        { name: "Username Gen", icon: <Users />, desc: "Find available handles" },
                        { name: "Font Generator", icon: <Type />, desc: "Style your text" },
                    ].map((tool, i) => (
                        <div key={i} className="p-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl hover:shadow-lg hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-[#232323] rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform border border-gray-100 dark:border-[#333]">
                                {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 24 })}
                            </div>
                            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{tool.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {slug === 'freebies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "Social Media Strategy Template", type: "Notion Template", icon: <FileText /> },
                        { title: "2024 Content Calendar", type: "Google Sheets", icon: <Grid /> },
                        { title: "Audit Checklist", type: "PDF Guide", icon: <CheckSquare /> },
                        { title: "Influencer Outreach Scripts", type: "Email Templates", icon: <MessageCircle /> },
                        { title: "Crisis Management Plan", type: "Word Doc", icon: <Shield /> },
                        { title: "Brand Voice Guidelines", type: "Presentation", icon: <Target /> }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl hover:border-emerald-500 transition-colors group cursor-pointer shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.type}</p>
                                </div>
                            </div>
                            <div className="text-gray-400 group-hover:text-emerald-500 transition-colors">
                                <Download size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {slug === 'quiz' && (
                <div className="max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden font-mono border border-gray-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="text-center relative z-10">
                        <div className="mb-8">
                            <p className="text-emerald-400 text-sm mb-2 uppercase tracking-widest font-semibold">System Output</p>
                            <div className="text-2xl md:text-3xl font-bold bg-black/50 p-6 rounded-xl border border-gray-700 min-h-[70px] flex items-center justify-center shadow-inner">
                                <span className="text-emerald-500 mr-3 animate-pulse">{'>'}</span> {jobTitle}
                            </div>
                        </div>
                        
                        <button 
                            onClick={generateJobTitle}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 mx-auto w-full md:w-auto"
                        >
                            <RefreshCw size={20} /> Generate New Title
                        </button>
                        
                        <p className="mt-8 text-gray-500 text-xs">
                            Warning: Results may cause increased LinkedIn profile views and sudden urges to use more hashtags.
                        </p>
                    </div>
                </div>
            )}

            {slug === 'calculator' && (
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                    <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#333]">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                            <Settings className="text-gray-400" /> Parameters
                        </h3>
                        
                        <div className="mb-10">
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Number of Clients</label>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-sm">{clientCount}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="50" 
                                value={clientCount} 
                                onChange={(e) => setClientCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-[#333] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Monthly Retainer</label>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-sm">${monthlyRate}</span>
                            </div>
                            <input 
                                type="range" 
                                min="500" 
                                max="10000" 
                                step="100"
                                value={monthlyRate} 
                                onChange={(e) => setMonthlyRate(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-[#333] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="p-8 md:w-1/2 bg-gray-50 dark:bg-[#151515] flex flex-col justify-center">
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm">
                                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">Monthly Revenue</p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
                                    ${(clientCount * monthlyRate).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-emerald-600 p-6 rounded-xl border border-emerald-500 shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <DollarSign size={64} />
                                </div>
                                <p className="text-emerald-100 text-xs mb-1 uppercase tracking-wider font-semibold relative z-10">Annual Revenue</p>
                                <p className="text-4xl font-bold font-mono tracking-tight relative z-10">
                                    ${(clientCount * monthlyRate * 12).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {slug === 'help' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Getting Started', 'Account Management', 'API Reference', 'Billing & Plans'].map(topic => (
                        <div key={topic} className="p-6 flex items-center justify-between bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl cursor-pointer hover:border-emerald-500 transition-colors shadow-sm">
                            <span className="font-medium text-gray-900 dark:text-white">{topic}</span>
                            <Info size={16} className="text-gray-400" />
                        </div>
                    ))}
                </div>
            )}
        </section>

      </div>
    </MarketingLayout>
  );
};

export default ResourcesPage;
