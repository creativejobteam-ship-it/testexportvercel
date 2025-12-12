import React, { useState, useEffect } from 'react';
import { getBriefResponses, updateBriefStatus } from '../../services/strategyService';
import { BriefResponse } from '../../types';
import { Eye, ArrowRight, ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface ReceivedBriefsProps {
  onNavigate?: (view: string) => void;
}

const ReceivedBriefs: React.FC<ReceivedBriefsProps> = ({ onNavigate }) => {
  const [briefs, setBriefs] = useState<BriefResponse[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<BriefResponse | null>(null);

  useEffect(() => {
    setBriefs(getBriefResponses());
  }, []);

  const handleView = (brief: BriefResponse) => {
    setSelectedBrief(brief);
    if (brief.status === 'new') {
        updateBriefStatus(brief.id, 'reviewed');
        setBriefs(getBriefResponses());
    }
  };

  const handleConvertToStrategy = () => {
    if (selectedBrief) {
        // Mark as converted
        updateBriefStatus(selectedBrief.id, 'converted');
        setBriefs(getBriefResponses());
        // Navigate to strategy manager (simulate for now, or use onNavigate to go to New Strategy flow)
        if (onNavigate) {
            alert("Redirecting to Strategy Generator with pre-filled data...");
            onNavigate('strategies');
        }
    }
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'new': return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>;
          case 'reviewed': return <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Reviewed</span>;
          case 'converted': return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Converted</span>;
          default: return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">Unknown</span>;
      }
  };

  // Detail View
  if (selectedBrief) {
      return (
          <div className="w-full space-y-6 animate-slide-up pb-12">
               <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSelectedBrief(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full text-gray-500 transition-colors"
                  >
                      <ArrowLeft size={20} />
                  </button>
                  <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                          Brief from {selectedBrief.clientName}
                          {getStatusBadge(selectedBrief.status)}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-[#8b9092]">
                          Submitted on {new Date(selectedBrief.submittedAt).toLocaleDateString()} • Domain: {selectedBrief.domainName}
                      </p>
                  </div>
              </div>

              <div className="bg-white dark:bg-[#232323] rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                      <h3 className="font-semibold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                          <FileText size={18} className="text-emerald-600"/> Questionnaire Responses
                      </h3>
                      {selectedBrief.status !== 'converted' && (
                          <button 
                             onClick={handleConvertToStrategy}
                             className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                          >
                              <CheckCircle2 size={16} /> Convert to Strategy
                          </button>
                      )}
                  </div>
                  
                  <div className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                      {Object.entries(selectedBrief.answers).map(([key, value]) => (
                          <div key={key} className="p-6">
                              <h4 className="text-xs font-bold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider mb-2">
                                  {key.replace(/_/g, ' ')}
                              </h4>
                              <div className="text-gray-900 dark:text-[#ededed] text-sm">
                                  {Array.isArray(value) ? (
                                      <div className="flex flex-wrap gap-2">
                                          {value.map((v, i) => (
                                              <span key={i} className="bg-gray-100 dark:bg-[#333] px-2 py-1 rounded-md text-xs">{v}</span>
                                          ))}
                                      </div>
                                  ) : (
                                      <p className="whitespace-pre-line">{value}</p>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // List View
  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
        <div className="flex justify-between items-end pb-4 border-b border-gray-200 dark:border-[#282828]">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Received Briefs</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Review and manage incoming client requirements.</p>
            </div>
        </div>

        <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-hidden">
             {briefs.length === 0 ? (
                 <div className="p-12 text-center text-gray-500 dark:text-[#8b9092]">
                     No briefs received yet. Send a request to a client to get started.
                 </div>
             ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Domain</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Date Received</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                        {briefs.map((brief) => (
                            <tr key={brief.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#ededed]">{brief.clientName}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">{brief.domainName}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092] flex items-center gap-2">
                                    <Calendar size={14} /> {new Date(brief.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(brief.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleView(brief)}
                                        className="text-emerald-600 hover:text-emerald-700 font-medium text-xs flex items-center gap-1 justify-end ml-auto"
                                    >
                                        View Details <ArrowRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
        </div>
    </div>
  );
};

export default ReceivedBriefs;