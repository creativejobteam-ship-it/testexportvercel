
import React, { useState, useEffect, useRef } from 'react';
import { getDomains, saveDomain, deleteDomain } from '../services/strategyService';
import { generateBriefingQuestions } from '../services/geminiService';
import { ActivityDomain, QuestionDefinition } from '../types';
import { Plus, Trash2, Edit2, Globe, Settings, Sparkles, Loader2, X, Search, Grid, List, MoreHorizontal, Save } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../src/contexts/ToastContext';

interface ActivityDomainsProps {
  onNavigate?: (view: string, id: string | null) => void;
}

const ActivityDomains: React.FC<ActivityDomainsProps> = ({ onNavigate }) => {
  const { success, error: showError } = useToast();
  
  const [domains, setDomains] = useState<ActivityDomain[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<Partial<ActivityDomain>>({});
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainDesc, setNewDomainDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

  useEffect(() => {
    setDomains(getDomains());
  }, []);

  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleEdit = (domain: ActivityDomain) => {
    setCurrentDomain(domain);
    setIsEditing(true);
    setActionMenuOpenId(null);
  };

  const handleConfigureQuestions = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onNavigate) {
      onNavigate('templates-builder', id);
    }
    setActionMenuOpenId(null);
  };

  const openCreateModal = () => {
    setNewDomainName('');
    setNewDomainDesc('');
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDomainToDelete(id);
    setDeleteModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
    if (domainToDelete) {
      deleteDomain(domainToDelete);
      setDomains(getDomains());
      setDomainToDelete(null);
      success("Activity sector deleted.");
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDomain.name || !currentDomain.id) return;

    const existing = domains.find(d => d.id === currentDomain.id);

    const domainToSave: ActivityDomain = {
      id: currentDomain.id,
      name: currentDomain.name,
      slug: currentDomain.slug || currentDomain.name.toLowerCase().replace(/\s+/g, '-'),
      description: currentDomain.description || '',
      domainTemplate: existing?.domainTemplate || [],
      createdAt: currentDomain.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveDomain(domainToSave);
    setDomains(getDomains());
    setIsEditing(false);
    success("Sector updated successfully.");
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newDomainName) return;

      setIsCreating(true);

      try {
          let generatedQuestions: QuestionDefinition[] = [];
          try {
              generatedQuestions = await generateBriefingQuestions(newDomainName, newDomainDesc || `Business sector: ${newDomainName}`);
          } catch (err) {
              console.error("AI generation failed, falling back to empty", err);
          }

          const newDomain: ActivityDomain = {
              id: `dom_${Date.now()}`,
              name: newDomainName,
              slug: newDomainName.toLowerCase().replace(/\s+/g, '-'),
              description: newDomainDesc,
              domainTemplate: generatedQuestions, 
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
          };

          saveDomain(newDomain);
          setDomains(getDomains());
          setIsCreateModalOpen(false);
          success("Activity sector created with AI templates.");

      } catch (error) {
          console.error(error);
          showError("Failed to create sector");
      } finally {
          setIsCreating(false);
      }
  };

  const filteredDomains = domains.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || (d.description || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
      <ConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Sector?" 
        message="This will permanently delete the activity sector and its associated templates. This cannot be undone." 
        confirmLabel="Delete Sector" 
      />

      <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Activity Sectors</h2>
        <p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage industry verticals and their specific briefing templates.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative group w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                  <input 
                      className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                      placeholder="Search sectors..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><Grid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><List size={14} /></button>
              </div>
              <button onClick={openCreateModal} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm ml-2"><Plus size={16} /> Add Sector</button>
          </div>
      </div>

      {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map(domain => (
                <div key={domain.id} className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Globe size={24} />
                        </div>
                        <div className="relative">
                            <button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === domain.id ? null : domain.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]">
                                <MoreHorizontal size={18} />
                            </button>
                            {actionMenuOpenId === domain.id && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => handleEdit(domain)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                        <Edit2 size={14} /> Edit Details
                                    </button>
                                    <button onClick={(e) => handleConfigureQuestions(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                        <Settings size={14} /> Configure Template
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                    <button onClick={(e) => handleDeleteClick(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed] mb-2">{domain.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-[#8b9092] line-clamp-2 mb-4 h-10">{domain.description || 'No description provided.'}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#333] flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1 rounded border border-gray-100 dark:border-[#333]">{domain.domainTemplate.length} Questions</span>
                        <button onClick={(e) => handleConfigureQuestions(domain.id, e)} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                            Edit Template <Settings size={10} />
                        </button>
                    </div>
                </div>
            ))}
            <button onClick={openCreateModal} className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 dark:border-[#2e2e2e] text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-[#3ecf8e] transition-colors gap-2 min-h-[180px]">
                <Plus size={32} />
                <span className="font-medium">Add Activity Sector</span>
            </button>
          </div>
      ) : (
          <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm overflow-visible">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                      <tr>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Sector Name</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Description</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Template Items</th>
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                      {filteredDomains.map((domain) => (
                          <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer" onClick={() => handleEdit(domain)}>
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-[#ededed]">{domain.name}</td>
                              <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092] max-w-md truncate">{domain.description || '-'}</td>
                              <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">{domain.domainTemplate.length}</td>
                              <td className="px-6 py-4 text-right relative">
                                  <div className="relative inline-block text-left">
                                      <button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === domain.id ? null : domain.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]">
                                          <MoreHorizontal size={18} />
                                      </button>
                                      {actionMenuOpenId === domain.id && (
                                          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                                              <button onClick={() => handleEdit(domain)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                                  <Edit2 size={14} /> Edit Details
                                              </button>
                                              <button onClick={(e) => handleConfigureQuestions(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
                                                  <Settings size={14} /> Configure Template
                                              </button>
                                              <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                              <button onClick={(e) => handleDeleteClick(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                                                  <Trash2 size={14} /> Delete
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* Edit Modal */}
      {isEditing && currentDomain && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                  <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                      <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">Edit Sector</h3>
                      <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Sector Name</label>
                          <input 
                              type="text" 
                              required 
                              value={currentDomain.name} 
                              onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} 
                              className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Description</label>
                          <textarea 
                              value={currentDomain.description} 
                              onChange={(e) => setCurrentDomain({...currentDomain, description: e.target.value})} 
                              className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed] h-20 resize-none" 
                          />
                      </div>
                      <div className="pt-2 flex justify-end gap-3">
                          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button>
                          <button type="submit" disabled={!currentDomain.name} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-50">
                              <Save size={16} className="inline mr-2" /> Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                  <div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                      <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">Add New Sector</h3>
                      <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleConfirmCreate} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Sector Name</label>
                          <input 
                              type="text" 
                              required 
                              placeholder="e.g. Fintech, Retail"
                              value={newDomainName} 
                              onChange={(e) => setNewDomainName(e.target.value)} 
                              className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Description (Optional)</label>
                          <textarea 
                              placeholder="Brief description to help AI generate context..."
                              value={newDomainDesc} 
                              onChange={(e) => setNewDomainDesc(e.target.value)} 
                              className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed] h-20 resize-none" 
                          />
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-md border border-purple-100 dark:border-purple-800/30 flex gap-2">
                          <Sparkles size={16} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-purple-700 dark:text-purple-300">
                              AI will automatically generate a briefing questionnaire based on the sector name and description.
                          </p>
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                          <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button>
                          <button type="submit" disabled={!newDomainName || isCreating} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center gap-2">
                              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                              {isCreating ? 'Generating...' : 'Create & Generate'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default ActivityDomains;
