
import React from 'react';
import MarketingLayout from './MarketingLayout';
import { Briefcase, Globe, Building2, Calendar, Layers, Share2, Users, Check, ArrowRight } from 'lucide-react';

interface SolutionPageProps {
  slug: string;
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const SOLUTION_DATA: Record<string, any> = {
    'agencies': {
        title: 'For Agencies',
        subtitle: 'Manage 100+ clients without the chaos.',
        icon: <Briefcase size={32} />,
        benefits: ['Unified Client Portal', 'White-label Reports', 'Approval Workflows', 'Team Roles'],
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    },
    'multi-location': {
        title: 'Multi-location Brands',
        subtitle: 'Localize content at global scale.',
        icon: <Globe size={32} />,
        benefits: ['Location Groups', 'Localized Assets', 'Central Governance', 'Regional Analytics'],
        heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
    },
    'multi-brand': {
        title: 'Multi-brand Companies',
        subtitle: 'One platform for all your brand portfolios.',
        icon: <Building2 size={32} />,
        benefits: ['Brand Workspaces', 'Asset Separation', 'Cross-brand Insights', 'Enterprise SSO'],
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    'calendar': {
        title: 'Content Calendar',
        subtitle: 'The ultimate view for your social strategy.',
        icon: <Calendar size={32} />,
        benefits: ['Drag & Drop', 'Campaign Filters', 'Multi-channel View', 'Status Tracking'],
        heroImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80'
    },
    'workflow': {
        title: 'Workflow Management',
        subtitle: 'Automate the busywork out of your day.',
        icon: <Layers size={32} />,
        benefits: ['Custom Statuses', 'Auto-assignments', 'Deadline Alerts', 'Review Cycles'],
        heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    },
    'campaign': {
        title: 'Campaign Management',
        subtitle: 'Launch integrated campaigns across channels.',
        icon: <Share2 size={32} />,
        benefits: ['Campaign Tagging', 'Budget Tracking', 'Combined Analytics', 'Asset Kits'],
        heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    },
    'collaboration': {
        title: 'Social Collaboration',
        subtitle: 'Bring your team and clients together.',
        icon: <Users size={32} />,
        benefits: ['Internal Comments', 'External Links', 'Mentioning', 'Activity Feed'],
        heroImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
    }
};

const SolutionPage: React.FC<SolutionPageProps> = ({ slug, onStart, onNavigate, toggleTheme }) => {
  const data = SOLUTION_DATA[slug] || SOLUTION_DATA['agencies'];

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        
        {/* Header Section */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-8">
                {data.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                {data.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10">
                {data.subtitle}
            </p>
            <button onClick={onStart} className="btn btn-primary px-8 py-3 text-lg rounded-full">
                Try Auto-CM for {data.title}
            </button>
        </section>

        {/* Hero Visual */}
        <section className="px-6 mb-24">
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-[#333] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img src={data.heroImage} alt={data.title} className="w-full h-[500px] object-cover" />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-md">
                        <h3 className="text-white font-bold text-xl mb-2">Built for scale</h3>
                        <p className="text-gray-200 text-sm">Enterprise-grade infrastructure designed to handle millions of interactions per day.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-gray-50 dark:bg-[#0E0E0E] border-y border-gray-200 dark:border-[#282828]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.benefits.map((benefit: string, i: number) => (
                    <div key={i} className="bg-white dark:bg-[#1c1c1c] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#333]">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 font-bold text-sm">
                            {i + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Streamline your operations with dedicated tools for {benefit.toLowerCase()}.</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Case Study Snippet */}
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto bg-[#1c1c1c] rounded-2xl overflow-hidden text-white flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <span className="text-emerald-400 font-mono text-sm mb-4 uppercase tracking-widest">Case Study</span>
                    <h3 className="text-3xl font-bold mb-6">How TechFlow scaled to 50 locations in 3 months</h3>
                    <p className="text-gray-400 mb-8">"Auto-CM allowed us to maintain brand consistency while giving local managers the freedom to engage with their specific communities."</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div>
                            <p className="font-bold">Sarah Jenkins</p>
                            <p className="text-sm text-gray-500">CMO, TechFlow</p>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 bg-gray-800 relative">
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-50" />
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to transform your workflow?</h2>
            <button onClick={onStart} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Get Started
            </button>
        </section>

      </div>
    </MarketingLayout>
  );
};

export default SolutionPage;
