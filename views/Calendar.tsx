
import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Filter, Download, Plus, Search, List, Grid, ChevronDown, Check, FolderOpen } from 'lucide-react';
import { Platform, CalendarPost, Project } from '../types';
import { getAllProjects, getCalendarPosts, updateCalendarPost } from '../services/strategyService';

interface CalendarProps {
    projectId?: string | null;
    isEmbedded?: boolean;
}

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
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${active ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white dark:bg-[#232323] text-gray-600 dark:text-[#999] border-gray-200 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
            >
                <span>{label}:</span>
                <span className="font-semibold">{options.find(o => o.value === value)?.label || value}</span>
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-lg shadow-lg z-50 py-1 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onSelect(opt.value); setIsOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between ${value === opt.value ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-[#ededed]'}`}
                        >
                            <span className="truncate">{opt.label}</span>
                            {value === opt.value && <Check size={12} className="shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Calendar: React.FC<CalendarProps> = ({ projectId, isEmbedded = false }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [draggedPostId, setDraggedPostId] = useState<number | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeProjectId, setActiveProjectId] = useState<string>('all');

  const refreshData = () => {
      setPosts([...getCalendarPosts()]);
      setProjects([...getAllProjects()]);
  };

  useEffect(() => {
      refreshData();
      window.addEventListener('strategy-data-change', refreshData);
      return () => window.removeEventListener('strategy-data-change', refreshData);
  }, []);

  // Sync prop change to local filter state
  useEffect(() => {
      if (projectId) {
          setActiveProjectId(projectId);
      } else {
          setActiveProjectId('all');
      }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Scheduled': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
        case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#333] dark:text-[#aaa] dark:border-[#444]';
        case 'Published': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch(platform) {
        case Platform.Twitter: return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
        case Platform.Discord: return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
        case Platform.Slack: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        case Platform.Facebook: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        case Platform.WhatsApp: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        default: return 'bg-gray-100 text-gray-700 dark:bg-[#333] dark:text-[#aaa]';
    }
  };

  const handleDragStart = (e: React.DragEvent, postId: number) => {
      setDraggedPostId(postId);
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
      e.preventDefault();
      if (draggedPostId === null) return;

      const post = posts.find(p => p.id === draggedPostId);
      if (post) {
          const updated = { ...post, day: day, date: `Nov ${day}, 2023` };
          updateCalendarPost(updated); // Persist change
      }
      setDraggedPostId(null);
  };

  // Filter Logic
  const filteredPosts = posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (post.projectName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesProject = activeProjectId === 'all' || post.projectId === activeProjectId;
      
      return matchesSearch && matchesPlatform && matchesStatus && matchesProject;
  });

  const projectOptions = [
      { label: 'All Projects', value: 'all' },
      ...projects.map(p => ({ label: p.name, value: p.id }))
  ];

  const renderGrid = () => {
    const days = Array.from({ length: 35 }, (_, i) => i + 1); // Mock calendar days
    
    return (
        <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-hidden select-none flex-1 flex flex-col min-h-0">
             <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-[#888] uppercase text-center">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-gray-200 dark:divide-[#282828] dark:border-[#282828] overflow-y-auto flex-1">
                {days.map(day => {
                    // Filter posts for this specific day using the already filtered list
                    const dayPosts = filteredPosts.filter(p => p.day === day);
                    const isCurrentMonth = day <= 31;
                    
                    return (
                        <div 
                            key={day} 
                            onDragOver={isCurrentMonth ? handleDragOver : undefined}
                            onDrop={isCurrentMonth ? (e) => handleDrop(e, day) : undefined}
                            className={`p-2 relative min-h-[100px] ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-[#151515]' : 'bg-white dark:bg-[#232323]'} transition-colors hover:bg-gray-50 dark:hover:bg-[#2a2a2a]`}
                        >
                            {isCurrentMonth && (
                                <>
                                    <span className={`text-xs font-medium mb-2 block ${day === 24 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-400 dark:text-[#666]'}`}>
                                        {day}
                                    </span>
                                    <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar">
                                        {dayPosts.map(post => (
                                            <div 
                                                key={post.id} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, post.id)}
                                                className="text-[10px] p-1.5 rounded border border-gray-100 dark:border-[#333] bg-white dark:bg-[#1c1c1c] shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group animate-fade-in"
                                            >
                                                <div className="flex items-center gap-1 mb-0.5">
                                                     <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Scheduled' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-[#555]'}`}></div>
                                                     <span className="font-semibold text-gray-700 dark:text-[#ededed] truncate">{post.time}</span>
                                                </div>
                                                <p className="text-gray-500 dark:text-[#888] truncate">{post.content}</p>
                                                {activeProjectId === 'all' && post.projectName && (
                                                    <div className="text-[9px] text-emerald-600 dark:text-emerald-500 mt-0.5 truncate font-medium">
                                                        {post.projectName}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
        <div className={`flex justify-between items-end ${isEmbedded ? 'pb-2 mb-2' : 'pb-4 border-b border-gray-200 dark:border-[#282828]'}`}>
            {!isEmbedded ? (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Content Calendar</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage and schedule your upcoming content. Drag items to reschedule.</p>
                </div>
            ) : (
                <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">Planning</h3>
            )}
            <div className="flex gap-2">
                 <button className="bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-200 dark:border-[#383838] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm flex items-center gap-2">
                    <Download size={16} /> Export
                </button>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
                    <Plus size={16} /> Schedule Post
                </button>
            </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative group mr-2">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input 
                        className="pl-8 pr-3 py-1.5 text-sm bg-transparent border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full sm:w-48 transition-all" 
                        placeholder="Search posts..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="h-4 w-px bg-gray-200 dark:bg-[#333] mx-1 hidden sm:block"></div>

                {/* Project Context Switcher */}
                {!isEmbedded && (
                    <FilterPill 
                        label="Project" 
                        value={activeProjectId} 
                        options={projectOptions} 
                        onSelect={setActiveProjectId} 
                        active={activeProjectId !== 'all'}
                    />
                )}

                <FilterPill 
                    label="Platform" 
                    value={platformFilter} 
                    options={[{label: 'All Platforms', value: 'all'}, ...Object.values(Platform).map(p => ({label: p, value: p}))]} 
                    onSelect={setPlatformFilter} 
                    active={platformFilter !== 'all'}
                />

                <FilterPill 
                    label="Status" 
                    value={statusFilter} 
                    options={[
                        {label: 'All Status', value: 'all'},
                        {label: 'Scheduled', value: 'Scheduled'},
                        {label: 'Published', value: 'Published'},
                        {label: 'Draft', value: 'Draft'}
                    ]} 
                    onSelect={setStatusFilter} 
                    active={statusFilter !== 'all'}
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]'}`}
                    >
                        <List size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]'}`}
                    >
                        <Grid size={14} />
                    </button>
                </div>
                
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md text-sm text-gray-600 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] shadow-sm">
                    <CalendarIcon size={14} /> Oct 2023
                </button>
            </div>
        </div>

        {viewMode === 'list' ? (
            /* Spreadsheet / Table View */
            <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#282828] rounded-lg shadow-sm overflow-hidden animate-fade-in flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs w-10"></th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs">Project</th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs">Platform</th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs">Content</th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs">Date & Time</th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500 dark:text-[#888] uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] group cursor-pointer transition-colors">
                                    <td className="px-6 py-4 text-gray-300 dark:text-[#444]">
                                        <div className="cursor-grab opacity-0 group-hover:opacity-100">⋮⋮</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-[#ededed] font-medium">
                                            <FolderOpen size={14} className="text-gray-400" />
                                            {post.projectName || 'General'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPlatformColor(post.platform)}`}>{post.platform}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-600 dark:text-[#ccc] line-clamp-1 max-w-md">{post.content}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-[#888]">
                                            <CalendarIcon size={14} className="text-gray-400 dark:text-[#555]" />
                                            <span>{post.date}</span>
                                            <span className="text-gray-300 dark:text-[#444]">|</span>
                                            <Clock size={14} className="text-gray-400 dark:text-[#555]" />
                                            <span>{post.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c] flex justify-between items-center text-xs text-gray-500 dark:text-[#888] shrink-0">
                    <span>Showing {filteredPosts.length} entries</span>
                    <div className="flex gap-1">
                        <button className="px-2 py-1 border border-gray-200 dark:border-[#333] rounded hover:bg-white dark:hover:bg-[#2a2a2a] disabled:opacity-50">Prev</button>
                        <button className="px-2 py-1 border border-gray-200 dark:border-[#333] rounded hover:bg-white dark:hover:bg-[#2a2a2a]">1</button>
                        <button className="px-2 py-1 border border-gray-200 dark:border-[#333] rounded hover:bg-white dark:hover:bg-[#2a2a2a]">Next</button>
                    </div>
                </div>
            </div>
        ) : (
            renderGrid()
        )}
    </div>
  );
};

export default Calendar;
