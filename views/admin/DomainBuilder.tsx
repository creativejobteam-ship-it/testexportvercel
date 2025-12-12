
import React, { useState, useEffect, useRef } from 'react';
import { getDomains, saveDomain, deleteDomain, getDomainById, GLOBAL_QUESTIONS } from '../../services/strategyService';
import { generateBriefingQuestions } from '../../services/geminiService';
import { ActivityDomain, QuestionDefinition, QuestionType } from '../../types';
import { Plus, Trash2, Save, GripVertical, Check, Sparkles, Lock, Loader2, Settings, MoreHorizontal, Edit, Copy, Search, ArrowLeft, FileText, LayoutTemplate, Grid, List, ChevronDown, X, Edit2 } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../src/contexts/ToastContext';

const FilterPill = ({ label, value, options, onSelect, active }: { label: string, value: string, options: {label: string, value: string}[], onSelect: (val: string) => void, active: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${active ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white dark:bg-[#232323] text-gray-600 dark:text-[#999] border-gray-200 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}><span>{label}:</span><span className="font-semibold">{options.find(o => o.value === value)?.label || value}</span><ChevronDown size={12} className="opacity-50" /></button>
            {isOpen && (<div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-lg shadow-lg z-50 py-1 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">{options.map(opt => (<button key={opt.value} onClick={() => { onSelect(opt.value); setIsOpen(false); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between ${value === opt.value ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-[#ededed]'}`}>{opt.label}{value === opt.value && <Check size={12} />}</button>))}</div>)}
        </div>
    );
};

const DomainBuilder: React.FC<any> = ({ domainId }) => {
  const { success, error: showError, warning } = useToast();
  
  const [domains, setDomains] = useState<ActivityDomain[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [editingDomain, setEditingDomain] = useState<ActivityDomain | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [listViewType, setListViewType] = useState<'grid' | 'list'>('list');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

  useEffect(() => {
    setDomains(getDomains());
  }, []);

  useEffect(() => {
    if (domainId) {
        const found = getDomainById(domainId);
        if (found) {
            setEditingDomain(found);
            setViewMode('edit');
        }
    }
  }, [domainId]);

  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleCreateNew = () => {
      setEditingDomain({ id: `dom_${Date.now()}`, name: '', slug: '', description: '', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      setViewMode('edit');
  };

  const handleEdit = (domain: ActivityDomain, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setEditingDomain(JSON.parse(JSON.stringify(domain))); 
      setViewMode('edit');
      setActionMenuOpenId(null);
  };

  const handleDuplicate = (domain: ActivityDomain, e: React.MouseEvent) => {
      e.stopPropagation();
      const copy: ActivityDomain = { ...domain, id: `dom_${Date.now()}`, name: `${domain.name} (Copy)`, slug: `${domain.slug}-copy`, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() };
      saveDomain(copy);
      setDomains(getDomains());
      setActionMenuOpenId(null);
      success("Template duplicated successfully.");
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
          if (editingDomain?.id === domainToDelete) {
              setEditingDomain(null);
              setViewMode('list');
          }
          setDomainToDelete(null);
          success("Template deleted.");
      }
  };

  const handleSave = () => {
    if (editingDomain) {
      if (!editingDomain.name) {
          warning("Please enter a template name.");
          return;
      }
      if (!editingDomain.slug) {
          editingDomain.slug = editingDomain.name.toLowerCase().replace(/\s+/g, '-');
      }
      saveDomain(editingDomain);
      setDomains(getDomains());
      setViewMode('list');
      success("Template saved successfully.");
    }
  };

  const handleBackToList = () => {
      setViewMode('list');
      setEditingDomain(null);
  };

  const addQuestion = () => {
    if (!editingDomain) return;
    const newQuestion: QuestionDefinition = { id: `q_${Date.now()}`, label: 'New Question', type: 'text', required: false, order: editingDomain.domainTemplate.length + 20, section: 'Specific' };
    setEditingDomain({ ...editingDomain, domainTemplate: [...editingDomain.domainTemplate, newQuestion] });
  };

  const handleGenerateAI = async () => {
      if (!editingDomain || !editingDomain.name) {
          warning("Please enter a template name first to guide the AI.");
          return;
      }
      setIsGenerating(true);
      
      try {
          const newQuestions = await generateBriefingQuestions(editingDomain.name, editingDomain.description || editingDomain.name);
          if (newQuestions && newQuestions.length > 0) {
              setEditingDomain({ ...editingDomain, domainTemplate: [...editingDomain.domainTemplate, ...newQuestions] });
              success("Questions generated by AI!");
          } else {
              warning("AI did not return any questions. Try improving the description.");
          }
      } catch (e) {
          console.error(e);
          showError("AI generation failed.");
      } finally {
          setIsGenerating(false);
      }
  };

  const updateQuestion = (index: number, field: keyof QuestionDefinition, value: any) => {
    if (!editingDomain) return;
    const updatedTemplate = [...editingDomain.domainTemplate];
    updatedTemplate[index] = { ...updatedTemplate[index], [field]: value };
    setEditingDomain({ ...editingDomain, domainTemplate: updatedTemplate });
  };

  const removeQuestion = (index: number) => {
    if (!editingDomain) return;
    const updatedTemplate = editingDomain.domainTemplate.filter((_, i) => i !== index);
    setEditingDomain({ ...editingDomain, domainTemplate: updatedTemplate });
  };

  const filteredDomains = domains.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || (d.description || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
      <ConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Template?" message="This will permanently delete the briefing template. Are you sure?" confirmLabel="Delete Template" />
      
      {viewMode === 'list' && <div className="border-b border-gray-200 dark:border-[#282828] pb-6"><h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Briefing Templates</h2><p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage industry-specific questionnaires used to brief clients.</p></div>}
      
      {viewMode === 'list' ? (
        <>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                    <button onClick={() => setListViewType('grid')} className={`p-1.5 rounded-sm transition-colors ${listViewType === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><Grid size={14} /></button>
                    <button onClick={() => setListViewType('list')} className={`p-1.5 rounded-sm transition-colors ${listViewType === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><List size={14} /></button>
                </div>
                <button onClick={handleCreateNew} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm ml-2"><Plus size={16} /> New Template</button>
            </div>
        </div>
        
        {listViewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDomains.map(domain => (
                    <div key={domain.id} className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group flex flex-col relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl"><LayoutTemplate size={24} /></div>
                            <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === domain.id ? null : domain.id); }} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] hover:bg-gray-100 dark:hover:bg-[#333] rounded-md transition-colors"><MoreHorizontal size={18} /></button>
                                {actionMenuOpenId === domain.id && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-xl z-50 overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                                        <button onClick={(e) => handleEdit(domain, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit size={14} /> Edit Template</button>
                                        <button onClick={(e) => handleDuplicate(domain, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Copy size={14} /> Duplicate</button>
                                        <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
                                        <button onClick={(e) => handleDeleteClick(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed] mb-1 truncate pr-2">{domain.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8b9092] line-clamp-2 h-10 mb-4">{domain.description || 'No description provided.'}</p>
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#333] flex items-center justify-between"><span className="text-[10px] text-gray-400 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1 rounded border border-gray-100 dark:border-[#333]">{domain.domainTemplate.length} Questions</span><button onClick={() => handleEdit(domain)} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Configure</button></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-visible">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]"><tr><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Template Name</th><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Description</th><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Questions</th><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                        {filteredDomains.map((domain) => (
                            <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer" onClick={() => handleEdit(domain)}>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-[#ededed]">{domain.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092] max-w-md truncate">{domain.description || '-'}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-[#8b9092]">{domain.domainTemplate.length}</td>
                                <td className="px-6 py-4 text-right relative"><div className="relative inline-block text-left"><button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === domain.id ? null : domain.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><MoreHorizontal size={18} /></button>{actionMenuOpenId === domain.id && (<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md shadow-xl z-50 overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}><button onClick={(e) => handleEdit(domain, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit size={14} /> Edit Template</button><button onClick={(e) => handleDuplicate(domain, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Copy size={14} /> Duplicate</button><div className="border-t border-gray-100 dark:border-[#333] my-1"></div><button onClick={(e) => handleDeleteClick(domain.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete</button></div>)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        </>
      ) : (
        // --- EDIT VIEW ---
        <div className="space-y-6 animate-slide-up">
          <button onClick={handleBackToList} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] transition-colors w-fit"><ArrowLeft size={16} /> Back to Templates</button>
          <div className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
             <div className="flex-1 w-full space-y-4">
                 <input type="text" value={editingDomain?.name} onChange={(e) => setEditingDomain(prev => prev ? {...prev, name: e.target.value} : null)} className="text-2xl font-bold text-gray-900 dark:text-[#ededed] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 outline-none w-full transition-colors pb-1" placeholder="Template Name (e.g. Real Estate)" />
                 <input type="text" value={editingDomain?.description} onChange={(e) => setEditingDomain(prev => prev ? {...prev, description: e.target.value} : null)} className="text-sm text-gray-500 dark:text-[#8b9092] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 outline-none w-full transition-colors pb-1" placeholder="Enter a description for this template..." />
                 <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] w-fit px-2 py-1 rounded"><span className="font-mono">ID: {editingDomain?.slug || 'auto-generated'}</span></div>
             </div>
             <div className="flex gap-2 shrink-0">
                 {editingDomain?.id && (<button onClick={(e) => handleDeleteClick(editingDomain.id, e)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 size={18} /></button>)}
                 <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"><Save size={16} /> Save Changes</button>
             </div>
          </div>
          
          {/* Global Questions (Read Only) */}
          <div className="bg-gray-50 dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4"><Lock size={16} className="text-gray-400" /><h3 className="font-semibold text-gray-700 dark:text-[#b4b4b4]">Global Questions (Standard)</h3><span className="text-[10px] bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-[#8b9092] px-2 py-0.5 rounded border border-gray-300 dark:border-[#444]">Read-Only</span></div>
             <div className="space-y-3 opacity-60 grayscale pointer-events-none select-none">{GLOBAL_QUESTIONS.map((q, i) => (<div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] rounded-md shadow-sm"><div className="flex gap-3"><span className="text-xs font-bold text-gray-400 w-6 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded h-6">{i+1}</span><div><p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{q.label}</p><p className="text-[10px] text-gray-500 uppercase">{q.type}</p></div></div></div>))}</div>
          </div>
          
          {/* Form Builder */}
          <div className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2"><FileText size={18} className="text-emerald-500" /> Specific Questions</h3>
              <div className="flex gap-2">
                <button onClick={handleGenerateAI} disabled={isGenerating || !editingDomain?.name} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 px-3 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 font-medium" title={!editingDomain?.name ? "Enter Template Name first" : "Generate questions with AI"}>{isGenerating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />} Auto-Generate with AI</button>
                <button onClick={addQuestion} className="text-xs bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#333] px-3 py-2 rounded-md flex items-center gap-2 transition-colors dark:text-[#ededed] font-medium border border-transparent dark:border-[#333]"><Plus size={14} /> Add Question</button>
              </div>
            </div>
            <div className="space-y-4">
              {editingDomain?.domainTemplate.length === 0 && (<div className="text-center py-12 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 dark:border-[#333] rounded-lg">No specific questions defined yet. Add manually or use AI generator.</div>)}
              {editingDomain?.domainTemplate.map((q, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a] animate-fade-in group hover:border-gray-300 dark:hover:border-[#444] transition-colors">
                  <div className="mt-3 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={16} /></div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4"><label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Label</label><input type="text" value={q.label} onChange={e => updateQuestion(idx, 'label', e.target.value)} className="w-full border border-gray-300 dark:border-[#383838] rounded px-2 py-2 text-sm dark:bg-[#232323] dark:text-[#ededed] outline-none focus:border-emerald-500 transition-colors" placeholder="Question Label" /></div>
                    <div className="md:col-span-2"><label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Type</label><select value={q.type} onChange={e => updateQuestion(idx, 'type', e.target.value as QuestionType)} className="w-full border border-gray-300 dark:border-[#383838] rounded px-2 py-2 text-sm dark:bg-[#232323] dark:text-[#ededed] outline-none focus:border-emerald-500 transition-colors"><option value="text">Text</option><option value="textarea">Long Text</option><option value="select">Dropdown</option><option value="multi-select">Multi Select</option><option value="number">Number</option><option value="boolean">Yes/No (Boolean)</option><option value="date">Date</option><option value="url">URL</option><option value="file">File Upload</option><option value="color">Color Picker</option><option value="color_palette">Color Palette</option></select></div>
                    <div className="md:col-span-2"><label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Slug (ID)</label><input type="text" value={q.id} onChange={e => updateQuestion(idx, 'id', e.target.value)} className="w-full border border-gray-300 dark:border-[#383838] rounded px-2 py-2 text-sm dark:bg-[#232323] dark:text-[#ededed] font-mono text-xs outline-none focus:border-emerald-500 transition-colors" /></div>
                    <div className="md:col-span-3">{(q.type === 'select' || q.type === 'multi-select') ? (<><label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Options (comma separated)</label><input type="text" value={q.options?.join(', ') || ''} onChange={e => updateQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))} className="w-full border border-gray-300 dark:border-[#383838] rounded px-2 py-2 text-sm dark:bg-[#232323] dark:text-[#ededed] outline-none focus:border-emerald-500 transition-colors" placeholder="Option A, Option B" /></>) : (<><label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Placeholder</label><input type="text" value={q.placeholder || ''} onChange={e => updateQuestion(idx, 'placeholder', e.target.value)} className="w-full border border-gray-300 dark:border-[#383838] rounded px-2 py-2 text-sm dark:bg-[#232323] dark:text-[#ededed] outline-none focus:border-emerald-500 transition-colors text-gray-400" placeholder="Placeholder text..." /></>)}</div>
                    <div className="md:col-span-1 flex items-center justify-center pt-6"><button onClick={() => updateQuestion(idx, 'required', !q.required)} className={`p-1.5 rounded transition-colors ${q.required ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`} title={q.required ? "Required Field" : "Optional Field"}><Check size={16} /></button></div>
                  </div>
                  <button onClick={() => removeQuestion(idx)} className="mt-3 text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainBuilder;
