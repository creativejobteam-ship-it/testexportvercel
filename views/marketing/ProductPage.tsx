
import React from 'react';
import MarketingLayout from './MarketingLayout';
import { PenTool, Calendar, Users, CheckCircle, Clock, BarChart3, MessageSquare, ArrowRight, Zap, Layers, Globe } from 'lucide-react';

interface ProductPageProps {
  slug: string;
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const PRODUCT_DATA: Record<string, any> = {
    'create': {
        title: 'Visual Content Builder',
        subtitle: 'Create stunning content for every platform in seconds.',
        icon: <PenTool size={48} />,
        features: ['AI-powered copywriting', 'Built-in image editor', 'Multi-platform preview', 'Asset library'],
        color: 'text-purple-500',
        gradient: 'from-purple-500/20 to-blue-500/20'
    },
    'plan': {
        title: 'Strategic Calendar',
        subtitle: 'Map out your entire content strategy in one view.',
        icon: <Calendar size={48} />,
        features: ['Drag & drop scheduling', 'Campaign grouping', 'Holiday reminders', 'Gap analysis'],
        color: 'text-blue-500',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    'collaborate': {
        title: 'Team Workflows',
        subtitle: 'Work together seamlessly with your team and clients.',
        icon: <Users size={48} />,
        features: ['Real-time commenting', 'Role-based access', 'External sharing', 'Activity logs'],
        color: 'text-orange-500',
        gradient: 'from-orange-500/20 to-red-500/20'
    },
    'approve': {
        title: 'Approval Workflows',
        subtitle: 'Get sign-off faster with automated approval chains.',
        icon: <CheckCircle size={48} />,
        features: ['One-click approvals', 'Client portal', 'Version history', 'Feedback loops'],
        color: 'text-emerald-500',
        gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    'schedule': {
        title: 'Smart Scheduling',
        subtitle: 'Post at the perfect time, every time.',
        icon: <Clock size={48} />,
        features: ['Best time predictions', 'Auto-queue', 'Timezone management', 'Bulk scheduling'],
        color: 'text-pink-500',
        gradient: 'from-pink-500/20 to-rose-500/20'
    },
    'analyze': {
        title: 'Deep Analytics',
        subtitle: 'Measure what matters and prove ROI.',
        icon: <BarChart3 size={48} />,
        features: ['Cross-channel reporting', 'Competitor analysis', 'Custom dashboards', 'PDF exports'],
        color: 'text-indigo-500',
        gradient: 'from-indigo-500/20 to-violet-500/20'
    },
    'engage': {
        title: 'Unified Inbox',
        subtitle: 'Never miss a conversation with your community.',
        icon: <MessageSquare size={48} />,
        features: ['All messages in one place', 'AI-suggested replies', 'Assignment rules', 'Saved responses'],
        color: 'text-yellow-500',
        gradient: 'from-yellow-500/20 to-orange-500/20'
    }
};

const ProductPage: React.FC<ProductPageProps> = ({ slug, onStart, onNavigate, toggleTheme }) => {
  const data = PRODUCT_DATA[slug] || PRODUCT_DATA['create'];

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b ${data.gradient} rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/4 pointer-events-none`}></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-[#232323] mb-6 ${data.color}`}>
                        {data.icon}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        {data.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={onStart} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                            Get Started Free <ArrowRight size={18} />
                        </button>
                        <button className="px-8 py-3 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors">
                            View Documentation
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[4/3] bg-gray-100 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl overflow-hidden flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/50 to-white/50 dark:from-[#1c1c1c]/50 dark:to-[#232323]/50 z-10"></div>
                        {/* Mock UI */}
                        <div className="w-[90%] h-[80%] bg-white dark:bg-[#0f0f0f] rounded-lg shadow-lg border border-gray-200 dark:border-[#333] z-20 flex flex-col p-4">
                            <div className="h-8 w-full border-b border-gray-100 dark:border-[#333] mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="col-span-2 bg-gray-50 dark:bg-[#1c1c1c] rounded-md animate-pulse"></div>
                                <div className="col-span-1 bg-gray-50 dark:bg-[#1c1c1c] rounded-md animate-pulse delay-75"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-gray-50 dark:bg-[#0E0E0E] border-y border-gray-200 dark:border-[#282828]">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Why use our {data.title}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.features.map((feature: string, i: number) => (
                        <div key={i} className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#333] hover:border-emerald-500/50 transition-colors">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Optimized for modern workflows and designed to scale with your team.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Integration / How it works */}
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Integrates with your stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Slack', 'Discord', 'Notion', 'Linear'].map(tool => (
                        <div key={tool} className="p-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl flex items-center justify-center gap-3 hover:shadow-md transition-shadow">
                            <Layers size={20} className="text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{tool}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#1c1c1c] text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10 max-w-2xl mx-auto px-6">
                <h2 className="text-4xl font-bold mb-6">Ready to upgrade your workflow?</h2>
                <p className="text-gray-400 mb-8 text-lg">Start your 14-day free trial today. No credit card required.</p>
                <button onClick={onStart} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#121212] rounded-lg font-bold transition-colors">
                    Start Building
                </button>
            </div>
        </section>
      </div>
    </MarketingLayout>
  );
};

export default ProductPage;
