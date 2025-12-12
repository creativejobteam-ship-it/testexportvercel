
import React from 'react';
import MarketingLayout from './MarketingLayout';
import { Users, Heart, Award, ArrowRight } from 'lucide-react';

interface CompanyPageProps {
  slug: string;
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const CompanyPage: React.FC<CompanyPageProps> = ({ slug, onStart, onNavigate, toggleTheme }) => {
  const isCareers = slug === 'careers';
  const isAmbassadors = slug === 'ambassadors';
  const isMedia = slug === 'media-kit';

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        
        {/* Header */}
        <section className="pt-32 pb-16 px-6 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                {isCareers ? 'Join the Mission' : isAmbassadors ? 'Community Ambassadors' : isMedia ? 'Media Resources' : 'Building the future of community'}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
                {isCareers 
                    ? 'We are building the operating system for modern communities. Help us shape the future.' 
                    : isAmbassadors 
                    ? 'Passionate about community? Become a face of Auto-CM in your region.'
                    : isMedia
                    ? 'Logos, screenshots, and brand guidelines for press usage.'
                    : 'We believe that community is the moat of the future. Our mission is to empower brands to build meaningful connections at scale.'}
            </p>
        </section>

        {!isCareers && !isAmbassadors && !isMedia && (
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-[#1c1c1c] p-8 rounded-2xl text-center">
                        <Users size={40} className="mx-auto mb-4 text-emerald-500" />
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Community First</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">We build for the community, with the community.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1c1c1c] p-8 rounded-2xl text-center">
                        <Heart size={40} className="mx-auto mb-4 text-red-500" />
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Transparent</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Open source roots and open communication.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1c1c1c] p-8 rounded-2xl text-center">
                        <Award size={40} className="mx-auto mb-4 text-blue-500" />
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Excellence</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">We don't settle for "good enough".</p>
                    </div>
                </div>
            </section>
        )}

        {isCareers && (
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <div className="space-y-4">
                    {['Senior Frontend Engineer', 'AI Research Scientist', 'Developer Advocate', 'Product Designer'].map((job) => (
                        <div key={job} className="flex items-center justify-between p-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#333] rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{job}</h3>
                                <p className="text-sm text-gray-500">Remote • Full-time</p>
                            </div>
                            <ArrowRight className="text-gray-400 group-hover:text-emerald-500" />
                        </div>
                    ))}
                </div>
            </section>
        )}

        {isMedia && (
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="aspect-square bg-black rounded-xl flex items-center justify-center border border-gray-800">
                        <span className="text-white font-bold text-xl">Logo Dark</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl flex items-center justify-center border border-gray-200">
                        <span className="text-black font-bold text-xl">Logo Light</span>
                    </div>
                    <div className="aspect-square bg-[#3ecf8e] rounded-xl flex items-center justify-center">
                        <span className="text-black font-bold text-xl">Brand Color</span>
                    </div>
                </div>
            </section>
        )}

      </div>
    </MarketingLayout>
  );
};

export default CompanyPage;
