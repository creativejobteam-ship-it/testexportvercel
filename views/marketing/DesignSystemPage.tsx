
import React, { useState } from 'react';
import MarketingLayout from './MarketingLayout';
import { 
  Palette, Type, Layout, MousePointer2, AlertCircle, 
  CheckCircle2, Loader2, ArrowRight, Layers, 
  Copy, Check, Activity, BarChart3, Shield,
  ToggleLeft, Calendar, Users, FolderOpen
} from 'lucide-react';
import { PlatformIcon } from '../../components/PlatformIcon';
import { Platform } from '../../types';
import MetricCard from '../../components/MetricCard';
import WorkflowProgressCircle from '../../components/WorkflowProgressCircle';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface DesignSystemPageProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const SECTIONS = [
  { id: 'colors', label: 'Color Palette', icon: <Palette size={18} /> },
  { id: 'typography', label: 'Typography', icon: <Type size={18} /> },
  { id: 'buttons', label: 'Buttons & Actions', icon: <MousePointer2 size={18} /> },
  { id: 'inputs', label: 'Forms & Controls', icon: <Layout size={18} /> },
  { id: 'components', label: 'UI Components', icon: <Layers size={18} /> },
  { id: 'dataviz', label: 'Data Visualization', icon: <BarChart3 size={18} /> },
];

// Mock Data for Charts
const CHART_DATA = [
  { name: 'Mon', value: 4000, secondary: 2400 },
  { name: 'Tue', value: 3000, secondary: 1398 },
  { name: 'Wed', value: 2000, secondary: 9800 },
  { name: 'Thu', value: 2780, secondary: 3908 },
  { name: 'Fri', value: 1890, secondary: 4800 },
  { name: 'Sat', value: 2390, secondary: 3800 },
  { name: 'Sun', value: 3490, secondary: 4300 },
];

const PIE_DATA = [
  { name: 'Group A', value: 400, color: '#10b981' }, // Emerald
  { name: 'Group B', value: 300, color: '#3b82f6' }, // Blue
  { name: 'Group C', value: 300, color: '#6366f1' }, // Indigo
  { name: 'Group D', value: 200, color: '#94a3b8' }, // Slate
];

const ColorSwatch = ({ name, color, text = "white" }: { name: string, color: string, text?: string }) => {
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="flex flex-col gap-2 cursor-pointer group" 
            onClick={copyToClipboard}
        >
            <div 
                className={`h-24 w-full rounded-xl shadow-sm flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 ${color}`}
            >
                <span className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${text === 'white' ? 'text-white' : 'text-slate-900'}`}>
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </span>
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-slate-500 font-mono">var(--{name.toLowerCase().replace(' ', '-')})</p>
            </div>
        </div>
    );
};

const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onStart, onNavigate, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('colors');
  const [toggleState, setToggleState] = useState(true);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        
        {/* Header Hero */}
        <section className="pt-32 pb-12 px-6 border-b border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-[#0E0E0E]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Layers size={24} className="text-emerald-500" />
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm uppercase tracking-widest font-bold">Auto-CM Design System v2.4</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                    Foundations & Components
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl">
                    A complete guide to the UI/UX patterns used across the Auto-CM platform. 
                    Includes typography, colors, interactive elements, and complex data visualizations.
                </p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Nav */}
            <aside className="lg:w-64 shrink-0 hidden lg:block sticky top-32 h-fit">
                <nav className="space-y-1">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                activeSection === section.id
                                ? 'bg-emerald-5 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                            }`}
                        >
                            {section.icon}
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-24">
                
                {/* COLORS */}
                <section id="colors" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Color Palette</h2>
                        <p className="text-gray-500 dark:text-gray-400">Our colors are designed to be accessible, vibrant, and focused on clarity.</p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Brand Emerald</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <ColorSwatch name="Emerald 50" color="bg-emerald-50" text="dark" />
                                <ColorSwatch name="Emerald 100" color="bg-emerald-100" text="dark" />
                                <ColorSwatch name="Emerald 400" color="bg-emerald-400" />
                                <ColorSwatch name="Emerald 500" color="bg-emerald-500" />
                                <ColorSwatch name="Emerald 600" color="bg-emerald-600" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Neutral Slate</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <ColorSwatch name="White" color="bg-white border border-gray-200" text="dark" />
                                <ColorSwatch name="Gray 50" color="bg-gray-50" text="dark" />
                                <ColorSwatch name="Gray 200" color="bg-gray-200" text="dark" />
                                <ColorSwatch name="Gray 800" color="bg-gray-800" />
                                <ColorSwatch name="Gray 900" color="bg-gray-900" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Semantic</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ColorSwatch name="Blue 500 (Info)" color="bg-blue-500" />
                                <ColorSwatch name="Red 500 (Error)" color="bg-red-500" />
                                <ColorSwatch name="Amber 500 (Warn)" color="bg-amber-500" />
                                <ColorSwatch name="Purple 500 (AI)" color="bg-purple-500" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* TYPOGRAPHY */}
                <section id="typography" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Typography</h2>
                        <p className="text-gray-500 dark:text-gray-400">We use Inter for UI text to ensure readability across all sizes.</p>
                    </div>

                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-baseline border-b border-gray-100 dark:border-[#333] pb-8">
                            <span className="text-xs text-gray-400 font-mono">Display</span>
                            <div className="col-span-2">
                                <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">The quick brown fox</h1>
                                <p className="text-xs text-gray-400 mt-2 font-mono">text-5xl / font-bold / tracking-tight</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-baseline border-b border-gray-100 dark:border-[#333] pb-8">
                            <span className="text-xs text-gray-400 font-mono">Heading 1</span>
                            <div className="col-span-2">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Automated workflows</h2>
                                <p className="text-xs text-gray-400 mt-2 font-mono">text-3xl / font-bold / tracking-tight</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-baseline border-b border-gray-100 dark:border-[#333] pb-8">
                            <span className="text-xs text-gray-400 font-mono">Heading 2</span>
                            <div className="col-span-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                                <p className="text-xs text-gray-400 mt-2 font-mono">text-xl / font-semibold</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-baseline">
                            <span className="text-xs text-gray-400 font-mono">Body</span>
                            <div className="col-span-2">
                                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Auto-CM helps agencies scale their social media operations by automating content creation, scheduling, and reporting. Our AI understands context and maintains brand voice.
                                </p>
                                <p className="text-xs text-gray-400 mt-2 font-mono">text-base / text-gray-600 / leading-relaxed</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BUTTONS */}
                <section id="buttons" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Buttons</h2>
                        <p className="text-gray-500 dark:text-gray-400">Core interaction elements for primary and secondary actions.</p>
                    </div>

                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-8 overflow-x-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 min-w-[600px]">
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary</p>
                                <button className="btn btn-primary w-full">Action Button</button>
                                <button className="btn btn-primary w-full opacity-50 cursor-not-allowed">Disabled</button>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secondary</p>
                                <button className="btn btn-secondary w-full">Cancel</button>
                                <button className="btn btn-secondary w-full opacity-50 cursor-not-allowed">Disabled</button>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">With Icon</p>
                                <button className="btn btn-primary w-full gap-2">
                                    <Layers size={16} /> Dashboard
                                </button>
                                <button className="btn btn-secondary w-full gap-2">
                                    <ArrowRight size={16} /> Next Step
                                </button>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ghost / Text</p>
                                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium text-sm flex items-center justify-center gap-2 py-2">
                                    Read more <ArrowRight size={16} />
                                </button>
                                <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium py-2">
                                    Skip this step
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INPUTS & CONTROLS */}
                <section id="inputs" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forms & Controls</h2>
                        <p className="text-gray-500 dark:text-gray-400">Clean, accessible form fields, toggles, and selectors.</p>
                    </div>

                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-400"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Select Option</label>
                                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Message</label>
                                <textarea 
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Enter your message here..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Switches & Toggles</h4>
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-[#2a2a2a] mb-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Notifications</span>
                                    <button 
                                        onClick={() => setToggleState(!toggleState)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${toggleState ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-[#444]'}`}
                                    >
                                        <span className={`${toggleState ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tabs</h4>
                                <div className="border-b border-gray-200 dark:border-[#333] mb-4">
                                    <nav className="flex gap-6">
                                        <button className="pb-3 text-sm font-medium border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400">
                                            Active Tab
                                        </button>
                                        <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-[#ededed]">
                                            Inactive
                                        </button>
                                        <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-[#ededed]">
                                            Inactive
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Checkboxes</h4>
                                <label className="flex items-center gap-3 cursor-pointer group mb-2">
                                    <div className="w-5 h-5 rounded border border-gray-300 dark:border-[#444] flex items-center justify-center bg-emerald-500 border-emerald-500 text-white">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-[#ccc]">Checked option</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-gray-300 dark:border-[#444] flex items-center justify-center bg-white dark:bg-[#1c1c1c]"></div>
                                    <span className="text-sm text-gray-700 dark:text-[#ccc]">Unchecked option</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UI COMPONENTS */}
                <section id="components" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UI Components</h2>
                        <p className="text-gray-500 dark:text-gray-400">Complex, reusable patterns used across the dashboard.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Metric Cards */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metric Cards</h3>
                            <MetricCard 
                                title="Total Reach" 
                                value="1.2M" 
                                change="12.5%" 
                                isPositive={true} 
                                icon={<Activity size={20} />} 
                            />
                            <MetricCard 
                                title="Bounce Rate" 
                                value="42%" 
                                change="2.1%" 
                                isPositive={false} 
                                icon={<ArrowRight size={20} className="rotate-45" />} 
                            />
                        </div>

                        {/* Workflow & Status */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Workflow Progress</h3>
                                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828]">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Audit Phase</span>
                                        <WorkflowProgressCircle current={3} total={5} isActive={true} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Strategy Phase</span>
                                        <WorkflowProgressCircle current={5} total={5} isCompleted={true} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Badges & Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">Active</span>
                                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">Processing</span>
                                    <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700">Draft</span>
                                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">Pending</span>
                                </div>
                            </div>
                        </div>

                        {/* Avatars */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Avatars</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#333] border-2 border-white dark:border-[#1c1c1c] overflow-hidden">
                                    <img src="https://i.pravatar.cc/150?img=68" alt="User" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-200 dark:border-emerald-800">
                                    JD
                                </div>
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-200 dark:border-purple-800">
                                    AI
                                </div>
                            </div>
                        </div>

                        {/* Platform Icons */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Platform Integrations</h3>
                            <div className="flex gap-3">
                                <PlatformIcon platform={Platform.LinkedIn} size={24} />
                                <PlatformIcon platform={Platform.Twitter} size={24} />
                                <PlatformIcon platform={Platform.Instagram} size={24} />
                                <PlatformIcon platform={Platform.Facebook} size={24} />
                                <PlatformIcon platform={Platform.YouTube} size={24} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* DATA VISUALIZATION (Charts) */}
                <section id="dataviz" className="scroll-mt-32">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data Visualization</h2>
                        <p className="text-gray-500 dark:text-gray-400">High-performance charts powered by Recharts, themed for Auto-CM.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Area Chart */}
                        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededed] mb-6">Engagement Trends (Area)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-[#333]" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }}
                                            itemStyle={{ color: '#3ecf8e' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededed] mb-6">Activity Comparison (Bar)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CHART_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-[#333]" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }}
                                            cursor={{fill: 'transparent'}}
                                        />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="secondary" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm lg:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededed] mb-6">Audience Distribution (Donut)</h3>
                            <div className="h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={PIE_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {PIE_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151', color: '#f9fafb' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                {PIE_DATA.map((entry, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                <div className="py-12 border-t border-gray-200 dark:border-[#282828] text-center">
                    <p className="text-gray-500 text-sm">
                        Design System maintained by the Auto-CM Engineering Team.
                    </p>
                </div>

            </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default DesignSystemPage;
