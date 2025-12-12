
import React from 'react';
import { useProjectContext } from '../src/contexts/ProjectContext';
import { Building2, FolderOpen, ChevronDown, Plus } from 'lucide-react';

const ContextSwitcher: React.FC = () => {
  const { clients, selectedClient, selectedProject, selectClient, selectProject, isLoading } = useProjectContext();

  if (isLoading) return <div className="p-4 text-xs text-gray-400">Loading context...</div>;

  return (
    <div className="px-3 py-4 border-b border-gray-200 dark:border-[#282828] space-y-3">
        
        {/* Client Selector */}
        <div className="relative group">
            <label className="text-[10px] font-bold text-gray-400 dark:text-[#666] uppercase tracking-wider mb-1 block pl-1">
                Client
            </label>
            <div className="relative">
                <select
                    value={selectedClient?.id || ''}
                    onChange={(e) => selectClient(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-transparent hover:border-gray-300 dark:hover:border-[#444] text-gray-900 dark:text-[#ededed] text-sm rounded-md py-1.5 pl-8 pr-8 appearance-none outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer truncate"
                >
                    <option value="">Select Client...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.companyName}
                        </option>
                    ))}
                </select>
                <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Project Selector (Disabled if no client) */}
        <div className={`relative group transition-opacity ${!selectedClient ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <label className="text-[10px] font-bold text-gray-400 dark:text-[#666] uppercase tracking-wider mb-1 block pl-1">
                Project
            </label>
            <div className="relative">
                <select
                    value={selectedProject?.id || ''}
                    onChange={(e) => selectProject(e.target.value)}
                    disabled={!selectedClient}
                    className="w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-900 dark:text-[#ededed] text-sm rounded-md py-1.5 pl-8 pr-8 appearance-none outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer truncate shadow-sm"
                >
                    <option value="">Select Project...</option>
                    {selectedClient?.projects?.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                    {selectedClient && (!selectedClient.projects || selectedClient.projects.length === 0) && (
                        <option disabled>No projects found</option>
                    )}
                </select>
                <FolderOpen size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${selectedProject ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>

    </div>
  );
};

export default ContextSwitcher;
