
import React, { useState } from 'react';
import { Download, Mail, CheckCircle2, FileText, Target, Calendar, BarChart3, List, Share2, Printer, X, Send } from 'lucide-react';
import { useToast } from '../../src/contexts/ToastContext';

const PresentationExport: React.FC = () => {
  const { success, info } = useToast();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const docData = {
      title: "Strategic Growth Plan Q4 2024",
      client: "TechFlow Solutions",
      date: "October 24, 2024",
      summary: "This strategy aims to position TechFlow as the leading authority in AI automation for enterprise. By pivoting our content towards high-value educational carousels and case studies, we expect to increase qualified inbound leads by 25%.",
      pillars: ["Thought Leadership", "Customer Success", "Product Innovation"],
      kpis: [
          { label: "Engagement Rate", val: "5.2%" },
          { label: "New Leads", val: "150/mo" },
          { label: "Reach", val: "250k" }
      ]
  };

  const handleDownloadPdf = () => {
      setIsGeneratingPdf(true);
      setTimeout(() => {
          setIsGeneratingPdf(false);
          success("PDF Downloaded successfully (Simulation)");
      }, 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
      e.preventDefault();
      setIsEmailModalOpen(false);
      info("Email sent to client!");
  };

  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col animate-fade-in relative">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-200 dark:border-[#282828] pb-4 shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Presentation & Export</h2>
                <p className="text-gray-500 dark:text-[#8b9092]">Preview, download, or email the final strategy document.</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setIsEmailModalOpen(true)}
                    className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-[#ededed] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                    <Mail size={16} /> Send to Client
                </button>
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                >
                    {isGeneratingPdf ? 'Generating...' : <><Download size={16} /> Generate PDF</>}
                </button>
            </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-[#151515] p-8 overflow-y-auto flex justify-center relative">
            
            {/* A4 Paper Container */}
            <div className="bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] p-[20mm] relative shrink-0">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-gray-900 pb-6">
                    <div>
                        <div className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Strategy Document</div>
                        <h1 className="text-4xl font-bold leading-tight">{docData.title}</h1>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">Auto-CM</div>
                        <div className="text-sm text-gray-500 mt-1">{docData.date}</div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 uppercase tracking-wide text-sm">
                        <FileText size={18} className="text-emerald-600" /> 1. Executive Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-500">
                        {docData.summary}
                    </p>
                </div>

                {/* Content Pillars */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 uppercase tracking-wide text-sm">
                        <Target size={18} className="text-emerald-600" /> 2. Strategic Pillars
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                        {docData.pillars.map((pillar, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200 text-center">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">{i+1}</div>
                                <h3 className="font-bold text-gray-800">{pillar}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPIs */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 uppercase tracking-wide text-sm">
                        <BarChart3 size={18} className="text-emerald-600" /> 3. Projected Impact
                    </h2>
                    <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                        {docData.kpis.map((kpi, i) => (
                            <div key={i} className="p-6 text-center border-r border-gray-200 last:border-r-0 bg-white">
                                <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.val}</div>
                                <div className="text-xs uppercase tracking-wider text-gray-500">{kpi.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Placeholder */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 uppercase tracking-wide text-sm">
                        <Calendar size={18} className="text-emerald-600" /> 4. Action Timeline
                    </h2>
                    <div className="border border-gray-200 rounded p-4 h-32 bg-gray-50 flex items-center justify-center text-gray-400 italic">
                        [Weekly Content Calendar Visualization]
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
                    <span>Proprietary & Confidential</span>
                    <span>Prepared for {docData.client}</span>
                    <span>Page 1 of 1</span>
                </div>
            </div>
        </div>

        {/* Email Modal */}
        {isEmailModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                    <div className="p-4 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                        <h3 className="font-bold text-gray-900 dark:text-[#ededed]">Send to Client</h3>
                        <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Recipient</label>
                            <input type="email" defaultValue="client@techflow.com" className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"/>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Subject</label>
                            <input type="text" defaultValue={`Strategy Proposal: ${docData.title}`} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"/>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Message</label>
                            <textarea className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed] h-24 resize-none" defaultValue="Hi team, please find attached the Q4 strategy document for your review. Let me know if you have any questions."/>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-[#222] p-2 rounded border border-gray-200 dark:border-[#333]">
                            <FileText size={14} />
                            <span>Attachment: {docData.title}.pdf</span>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                            <Send size={16} /> Send Email
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default PresentationExport;
