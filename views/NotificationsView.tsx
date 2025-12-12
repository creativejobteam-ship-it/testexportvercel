
import React, { useState, useEffect, useRef } from 'react';
import { 
    CheckCircle2, 
    AlertTriangle, 
    Info, 
    FileText, 
    Search, 
    BrainCircuit, 
    Target, 
    Rocket, 
    RefreshCcw, 
    CheckSquare, 
    Trash2, 
    Filter,
    Shield,
    CreditCard,
    ArrowRight,
    X,
    ChevronDown,
    Inbox
} from 'lucide-react';
import { AppNotification } from '../types';
import { DEMO_DATA } from '../services/demoData';

interface NotificationsViewProps {
    onNavigate?: (view: string, id: string | null) => void;
}

const FilterPill = ({ label, value, options, onSelect, active }: { label: string, value: string, options: string[], onSelect: (val: string) => void, active: boolean }) => {
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
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors ${active ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-[#999] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}
            >
                <span className="opacity-70">{label}:</span>
                <span className="font-medium">{value}</span>
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onSelect(opt); setIsOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] ${value === opt ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-[#ededed]'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [filterType, setFilterType] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setNotifications(DEMO_DATA.notifications);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesType = filterType === 'All' 
            ? true 
            : filterType === 'Workflow' ? n.type === 'workflow' 
            : filterType === 'System' ? ['system', 'security', 'billing', 'info'].includes(n.type)
            : true;
        
        const matchesStatus = filterStatus === 'All' ? true : filterStatus === 'Unread' ? !n.read : true;
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });

    const getIcon = (n: AppNotification) => {
        if (n.type === 'workflow' && n.workflowStep) {
            switch (n.workflowStep) {
                case 'BRIEF_RECEIVED': return <FileText size={16} className="text-blue-500" />;
                case 'AUDIT_SEARCH': return <Search size={16} className="text-purple-500" />;
                case 'STRATEGY_GEN': return <BrainCircuit size={16} className="text-emerald-500" />;
                case 'ACTION_PLAN': return <Target size={16} className="text-orange-500" />;
                case 'PRODUCTION': return <Rocket size={16} className="text-pink-500" />;
                case 'REPORTING_ROTATION': return <RefreshCcw size={16} className="text-indigo-500" />;
                default: return <Info size={16} className="text-gray-500" />;
            }
        }
        switch (n.type) {
            case 'billing': return <CreditCard size={16} className="text-gray-500" />;
            case 'security': return <Shield size={16} className="text-red-500" />;
            case 'system': return <AlertTriangle size={16} className="text-amber-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    const getGroupedNotifications = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups: { label: string; items: AppNotification[] }[] = [
            { label: 'Today', items: [] },
            { label: 'Yesterday', items: [] },
            { label: 'Older', items: [] }
        ];

        filteredNotifications.forEach(n => {
            const date = new Date(n.timestamp);
            if (date.toDateString() === today.toDateString()) {
                groups[0].items.push(n);
            } else if (date.toDateString() === yesterday.toDateString()) {
                groups[1].items.push(n);
            } else {
                groups[2].items.push(n);
            }
        });

        return groups.filter(g => g.items.length > 0);
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12 pt-4">
            
            {/* Header & Title */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight mb-2">Inbox</h2>
                <p className="text-gray-500 dark:text-[#8b9092]">
                    Updates on your automated workflows and system alerts.
                </p>
            </div>

            {/* Notion-like Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-100 dark:border-[#282828] pb-4">
                
                {/* Search */}
                <div className="relative group mr-2">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                    <input 
                        className="pl-8 pr-3 py-1.5 text-sm bg-transparent outline-none placeholder-gray-400 text-gray-900 dark:text-[#ededed] w-full sm:w-48 transition-all" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="h-4 w-px bg-gray-200 dark:bg-[#333] mx-1 hidden sm:block"></div>

                {/* Filters */}
                <FilterPill 
                    label="Type" 
                    value={filterType} 
                    options={['All', 'Workflow', 'System']} 
                    onSelect={setFilterType} 
                    active={filterType !== 'All'}
                />
                
                <FilterPill 
                    label="Status" 
                    value={filterStatus} 
                    options={['All', 'Unread']} 
                    onSelect={setFilterStatus} 
                    active={filterStatus !== 'All'}
                />

                <div className="ml-auto flex items-center gap-2">
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-1.5"
                    >
                        <CheckSquare size={14} /> Mark all read
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-10">
                {getGroupedNotifications().map(group => (
                    <div key={group.label} className="animate-slide-up">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-[#666] uppercase tracking-wider mb-3 pl-2">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => !n.read && markAsRead(n.id)}
                                    className={`group relative flex items-start gap-4 p-3 rounded-lg border border-transparent hover:bg-white dark:hover:bg-[#232323] hover:border-gray-200 dark:hover:border-[#333] hover:shadow-sm transition-all cursor-pointer ${!n.read ? 'bg-gray-50 dark:bg-[#1a1a1a]' : ''}`}
                                >
                                    {/* Unread Indicator */}
                                    {!n.read && (
                                        <div className="absolute left-1 top-5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    )}

                                    <div className="mt-1 p-1.5 bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#333] rounded-md shadow-sm shrink-0">
                                        {getIcon(n)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-medium truncate pr-4 ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-[#ccc]'}`}>
                                                {n.title}
                                            </h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-[#888] mt-0.5 leading-relaxed line-clamp-2">
                                            {n.description}
                                        </p>
                                        
                                        {n.projectId && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onNavigate?.('projects', n.projectId); }}
                                                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                {n.actionLabel || 'View Project'} <ArrowRight size={12}/>
                                            </button>
                                        )}
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 bg-white/80 dark:bg-[#232323]/80 backdrop-blur-sm p-1 rounded">
                                        {!n.read && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]"
                                                title="Mark as read"
                                            >
                                                <CheckCircle2 size={14} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-[#444]">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-[#ededed]">All caught up</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8b9092] mt-1">No notifications matching your filters.</p>
                        {(filterType !== 'All' || filterStatus !== 'All' || searchTerm) && (
                            <button 
                                onClick={() => { setFilterType('All'); setFilterStatus('All'); setSearchTerm(''); }}
                                className="mt-4 text-sm text-emerald-600 hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsView;
