import React from 'react';
import { ArrowRight, Check, Zap, Shield, Bot, BarChart3, Users, Globe, MessageSquare, Code, Terminal, Database } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#1c1c1c] text-[#ededed] font-sans selection:bg-[#3ecf8e] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#1c1c1c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#3ecf8e] p-1 rounded">
                <Zap size={18} className="text-[#1c1c1c]" />
              </div>
              <span className="font-bold text-lg tracking-tight">AutoCommunity</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-[#8b9092] font-medium">
              <a href="#" className="hover:text-[#ededed] transition-colors">Product</a>
              <a href="#" className="hover:text-[#ededed] transition-colors">Developers</a>
              <a href="#" className="hover:text-[#ededed] transition-colors">Pricing</a>
              <a href="#" className="hover:text-[#ededed] transition-colors">Docs</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onStart} className="text-sm font-medium text-[#ededed] hover:text-[#3ecf8e] transition-colors">
              Sign in
            </button>
            <button 
              onClick={onStart}
              className="text-sm font-medium bg-[#3ecf8e] text-[#151515] px-4 py-1.5 rounded-md hover:bg-[#34b27b] transition-all shadow-[0_0_15px_rgba(62,207,142,0.3)]"
            >
              Start your project
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3ecf8e] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#232323] border border-white/10 rounded-full px-3 py-1 mb-8">
            <span className="text-[#3ecf8e] text-xs font-bold px-1.5 py-0.5 bg-[#3ecf8e]/10 rounded">NEW</span>
            <span className="text-xs text-[#8b9092]">AutoCommunity AI is now in Public Beta</span>
            <ArrowRight size={12} className="text-[#8b9092]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            Build Communities in a weekend.<br />
            <span className="text-[#3ecf8e]">Scale to millions.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#8b9092] mb-10 max-w-2xl mx-auto leading-relaxed">
            An intelligent, fully automated community management platform. 
            Replace traditional managers with AI that handles moderation, engagement, and analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-[#3ecf8e] text-[#151515] px-6 py-3 rounded-md font-bold text-sm hover:bg-[#34b27b] transition-all"
            >
              Start your project
            </button>
            <button className="w-full sm:w-auto bg-[#232323] text-[#ededed] border border-white/10 px-6 py-3 rounded-md font-medium text-sm hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 group">
              Request a demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid (Bento) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Feature 1: Database/Communities (Large) */}
          <div className="md:col-span-6 bg-[#1c1c1c] border border-[#282828] rounded-xl p-px group hover:border-[#3ecf8e]/50 transition-colors overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#232323] to-[#1c1c1c] rounded-xl z-0"></div>
             <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4 text-[#ededed]">
                  <Users className="text-[#3ecf8e]" />
                  <h3 className="text-xl font-medium">Unified Communities</h3>
                </div>
                <p className="text-[#8b9092] text-sm mb-8">
                  Manage Discord, Slack, Twitter, and WhatsApp from a single dashboard. 
                  Every interaction is essentially a row in your database.
                </p>
                <div className="mt-auto border border-[#333] rounded-lg bg-[#111] p-4 font-mono text-xs text-[#8b9092] shadow-2xl">
                   <div className="flex gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <p><span className="text-[#3ecf8e]">const</span> community = <span className="text-blue-400">await</span> ai.connect(<span className="text-orange-300">'discord'</span>);</p>
                   <p><span className="text-blue-400">await</span> community.moderate(<span className="text-orange-300">{'{ strict: true }'}</span>);</p>
                </div>
             </div>
          </div>

          {/* Feature 2: Auth/Publisher (Medium) */}
          <div className="md:col-span-6 bg-[#1c1c1c] border border-[#282828] rounded-xl p-px group hover:border-[#3ecf8e]/50 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#232323] to-[#1c1c1c] rounded-xl z-0"></div>
            <div className="relative z-10 p-8 h-full">
                <div className="flex items-center gap-3 mb-4 text-[#ededed]">
                  <Bot className="text-[#3ecf8e]" />
                  <h3 className="text-xl font-medium">AI Publisher</h3>
                </div>
                <p className="text-[#8b9092] text-sm mb-6">
                  Generate, schedule, and publish content across all channels instantly. 
                  Built-in generative AI helps you draft the perfect post.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-8">
                   <div className="bg-[#111] border border-[#333] p-3 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3ecf8e]/20 flex items-center justify-center text-[#3ecf8e]">
                        <Bot size={16} />
                      </div>
                      <div className="h-2 w-16 bg-[#333] rounded"></div>
                   </div>
                   <div className="bg-[#111] border border-[#333] p-3 rounded-lg flex items-center gap-3 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-gray-500">
                        <Users size={16} />
                      </div>
                      <div className="h-2 w-16 bg-[#333] rounded"></div>
                   </div>
                </div>
            </div>
          </div>

          {/* Feature 3: Edge Functions/Moderation (Small) */}
          <div className="md:col-span-4 bg-[#1c1c1c] border border-[#282828] rounded-xl p-px group hover:border-[#3ecf8e]/50 transition-colors relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#232323] to-[#1c1c1c] rounded-xl z-0"></div>
             <div className="relative z-10 p-6">
                <Shield className="text-[#3ecf8e] mb-4" size={24} />
                <h3 className="text-lg font-medium text-[#ededed] mb-2">Auto-Moderation</h3>
                <p className="text-[#8b9092] text-sm">
                  Block spam and toxic content instantly with Edge Functions.
                </p>
             </div>
          </div>

          {/* Feature 4: Realtime/Analytics (Small) */}
          <div className="md:col-span-4 bg-[#1c1c1c] border border-[#282828] rounded-xl p-px group hover:border-[#3ecf8e]/50 transition-colors relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#232323] to-[#1c1c1c] rounded-xl z-0"></div>
             <div className="relative z-10 p-6">
                <BarChart3 className="text-[#3ecf8e] mb-4" size={24} />
                <h3 className="text-lg font-medium text-[#ededed] mb-2">Realtime Analytics</h3>
                <p className="text-[#8b9092] text-sm">
                  Watch your community grow live with synchronized data.
                </p>
             </div>
          </div>

          {/* Feature 5: Storage/Inbox (Small) */}
          <div className="md:col-span-4 bg-[#1c1c1c] border border-[#282828] rounded-xl p-px group hover:border-[#3ecf8e]/50 transition-colors relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#232323] to-[#1c1c1c] rounded-xl z-0"></div>
             <div className="relative z-10 p-6">
                <MessageSquare className="text-[#3ecf8e] mb-4" size={24} />
                <h3 className="text-lg font-medium text-[#ededed] mb-2">Unified Inbox</h3>
                <p className="text-[#8b9092] text-sm">
                  Store and reply to every message from one centralized place.
                </p>
             </div>
          </div>
          
        </div>
      </section>

      {/* Community / Social Proof */}
      <section className="py-20 text-center border-t border-[#282828]">
        <h3 className="text-[#8b9092] text-sm uppercase tracking-widest mb-8 font-mono">Trusted by fast-growing communities</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2"><Globe size={20}/> <span>GlobalCorp</span></div>
           <div className="flex items-center gap-2"><Terminal size={20}/> <span>DevHouse</span></div>
           <div className="flex items-center gap-2"><Database size={20}/> <span>DataFlow</span></div>
           <div className="flex items-center gap-2"><Code size={20}/> <span>CodeBase</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#282828] bg-[#161616] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#3ecf8e] p-1 rounded">
                <Zap size={16} className="text-[#1c1c1c]" />
              </div>
              <span className="font-bold text-[#ededed]">AutoCommunity</span>
            </div>
            <div className="flex gap-4 mt-6">
                {/* Social Icons */}
                <div className="w-5 h-5 bg-[#282828] rounded"></div>
                <div className="w-5 h-5 bg-[#282828] rounded"></div>
                <div className="w-5 h-5 bg-[#282828] rounded"></div>
            </div>
          </div>
          <div>
            <h4 className="text-[#ededed] font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[#8b9092]">
              <li><a href="#" className="hover:text-[#3ecf8e]">Database</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Authentication</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Edge Functions</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Realtime</a></li>
            </ul>
          </div>
           <div>
            <h4 className="text-[#ededed] font-medium mb-4">Developers</h4>
            <ul className="space-y-2 text-sm text-[#8b9092]">
              <li><a href="#" className="hover:text-[#3ecf8e]">Documentation</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Changelog</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Guides</a></li>
            </ul>
          </div>
           <div>
            <h4 className="text-[#ededed] font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[#8b9092]">
              <li><a href="#" className="hover:text-[#3ecf8e]">Blog</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Careers</a></li>
              <li><a href="#" className="hover:text-[#3ecf8e]">Pricing</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
