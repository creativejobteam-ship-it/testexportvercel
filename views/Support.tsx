import React from 'react';
import { Search, BookOpen, MessageSquare, Video, ExternalLink } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">How can we help you?</h2>
          <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
            />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-sm text-gray-500 mb-4">Detailed guides on how to configure automations and manage communities.</p>
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guides <ExternalLink size={14} />
              </span>
          </div>

           <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Video size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-500 mb-4">Step-by-step video walkthroughs of key features and workflows.</p>
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Watch Videos <ExternalLink size={14} />
              </span>
          </div>

           <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-sm text-gray-500 mb-4">Join our Discord server to ask questions and chat with other users.</p>
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Join Discord <ExternalLink size={14} />
              </span>
          </div>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-lg font-semibold text-gray-900">Still need help?</h3>
              <p className="text-gray-500 mt-1">Our support team is available Mon-Fri, 9am-5pm EST.</p>
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Contact Support
          </button>
      </div>
    </div>
  );
};

export default Support;