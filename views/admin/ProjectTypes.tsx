
import React, { useState, useEffect, useRef } from 'react';
import { getProjectTypes, saveProjectType, deleteProjectType } from '../../services/strategyService';
import { ProjectType } from '../../types';
import { Plus, Trash2, Edit2, Search, Grid, List, MoreHorizontal, Save, X, Briefcase, Check } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../src/contexts/ToastContext';

const ProjectTypes: React.FC = () => {
  const { success, error: showError, warning } = useToast();
  const [types, setTypes] = useState<ProjectType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Partial<ProjectType>>({});
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  useEffect(() => {
    setTypes(getProjectTypes());
  }, []);

  useEffect(() => {
      const handleClick = () => setActionMenuOpenId(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleEdit = (type: ProjectType) => {
    setCurrentType(type);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleCreate = () => {
    setCurrentType({ id: '', name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTypeToDelete(id);
    setDeleteModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      deleteProjectType(typeToDelete);
      setTypes(getProjectTypes());
      setTypeToDelete(null);
      success("Project type deleted.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentType.name) {
        warning("Please enter a name for the project type.");
        return;
    }

    const typeToSave: ProjectType = {
      id: currentType.id || `pt_${Date.now()}`,
      name: currentType.name,
      description: currentType.description || ''
    };

    saveProjectType(typeToSave);
    setTypes(getProjectTypes());
    setIsModalOpen(false);
    success(currentType.id ? "Project type updated." : "New project type created.");
  };

  const filteredTypes = types.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
      <ConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Project Type?" message="This will permanently delete this category. Projects using this type will lose their classification." confirmLabel="Delete Type" />
      
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6"><h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Project Types</h2><p className="text-gray-500 dark:text-[#8b9092] mt-2">Define categories for client projects (e.g., E-commerce, Branding, Event).</p></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative group w-full md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} /><input className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" placeholder="Search types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><Grid size={14} /></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><List size={14} /></button></div>
              <button onClick={handleCreate} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm ml-2"><Plus size={16} /> Add Type</button>
          </div>
      </div>

      {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTypes.map(type => (
              <div key={type.id} className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group flex flex-col relative">
              <div className="flex justify-between items-start mb-4"><div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><Briefcase size={24} /></div><div className="relative"><button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === type.id ? null : type.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]"><MoreHorizontal size={18} /></button>{actionMenuOpenId === type.id && (<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}><button onClick={() => handleEdit(type)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit2 size={14} /> Edit Details</button><div className="border-t border-gray-100 dark:border-[#333] my-1"></div><button onClick={() => handleDeleteClick(type.id)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete</button></div>)}</div></div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed] mb-2">{type.name}</h3><p className="text-sm text-gray-500 dark:text-[#8b9092] line-clamp-2 mb-4">{type.description || 'No description provided.'}</p>
              </div>
          ))}
          <button onClick={handleCreate} className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 dark:border-[#2e2e2e] text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-[#3ecf8e] transition-colors gap-2 min-h-[180px]"><Plus size={32} /><span className="font-medium">Add Project Type</span></button>
          </div>
      ) : (
          <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm overflow-visible"><table className="w-full text-left text-sm"><thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]"><tr><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Type Name</th><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Description</th><th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">{filteredTypes.map((type) => (<tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"><td className="px-6 py-4 font-bold text-gray-900 dark:text-[#ededed]">{type.name}</td><td className="px-6 py-4 text-gray-600 dark:text-[#8b9092] max-w-md truncate">{type.description}</td><td className="px-6 py-4 text-right"><div className="relative inline-block text-left"><button onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(actionMenuOpenId === type.id ? null : type.id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"><MoreHorizontal size={18} /></button>{actionMenuOpenId === type.id && (<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}><button onClick={() => handleEdit(type)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"><Edit2 size={14} /> Edit</button><div className="border-t border-gray-100 dark:border-[#333] my-1"></div><button onClick={() => handleDeleteClick(type.id)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"><Trash2 size={14} /> Delete</button></div>)}</div></td></tr>))}</tbody></table></div>
      )}
      
      {isModalOpen && (<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"><div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]"><div className="p-6 border-b border-gray-100 dark:border-[#282828] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]"><h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">{currentType.id ? 'Edit Type' : 'Add New Type'}</h3><button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20} /></button></div><form onSubmit={handleSave} className="p-6 space-y-4"><div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Type Name</label><input type="text" required placeholder="e.g. Non-Profit Organization" value={currentType.name || ''} onChange={(e) => setCurrentType({...currentType, name: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" /></div><div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Description (Optional)</label><textarea placeholder="Brief description..." value={currentType.description || ''} onChange={(e) => setCurrentType({...currentType, description: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed] h-20 resize-none" /></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button><button type="submit" disabled={!currentType.name} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-50"><Save size={16} className="inline mr-2" /> Save Type</button></div></form></div></div>)}
    </div>
  );
};

export default ProjectTypes;
