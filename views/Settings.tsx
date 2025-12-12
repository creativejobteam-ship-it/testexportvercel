
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Globe, 
  Shield, 
  CreditCard, 
  Upload, 
  Zap, 
  Loader2,
  Lock as LockIcon,
  Search,
  Target,
  Rocket,
  FileText,
  BrainCircuit,
  Users,
  Key,
  Briefcase,
  MoreHorizontal,
  Server,
  MonitorPlay,
  ThumbsUp,
  AlertTriangle,
  Bot,
  ShieldBan,
  Bell,
  ScanFace,
  ChevronDown,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { useAuth } from '../src/contexts/AuthProvider';
import useStorage from '../src/hooks/useStorage';
import { updateProfile } from 'firebase/auth';
import { getAutopilotState, toggleAutopilot } from '../services/autopilotService';
import { getAllPlatforms, getEnabledPlatforms, setPlatformStatus, PLATFORM_CONFIG } from '../services/platformService';
import Billing from './Billing'; 
import { useToast } from '../src/contexts/ToastContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { Platform } from '../types';

interface SettingsProps {
    context: 'account' | 'organization';
    activeTab: string;
}

// --- Sub-Components (Tabs) ---

const ProfileTab = () => {
    const { user, refreshUser } = useAuth();
    const { uploadFile, isUploading } = useStorage();
    const { success, error: showError } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Profile State
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.photoURL || 'https://picsum.photos/seed/user/100/100');
    const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.displayName?.split(' ')[1] || '');

    useEffect(() => {
        if (user?.photoURL) setAvatarUrl(user.photoURL);
        if (user?.displayName) {
            const parts = user.displayName.split(' ');
            if (parts.length > 0) setFirstName(parts[0]);
            if (parts.length > 1) setLastName(parts.slice(1).join(' '));
        }
    }, [user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const path = `avatars/${user.uid}/profile_pic_${Date.now()}`;
            const downloadUrl = await uploadFile(file, path);

            if (downloadUrl) {
                setAvatarUrl(downloadUrl);
                if (user.uid !== 'demo-user-123') {
                    await updateProfile(user, { photoURL: downloadUrl });
                } else {
                    user.photoURL = downloadUrl;
                }
                await refreshUser();
                success("Avatar updated successfully!");
            }
        } catch (err) {
            console.error("Failed to upload avatar", err);
            showError("Failed to upload image. Please try again.");
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            if (user.uid !== 'demo-user-123') {
                await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
                await refreshUser();
            }
            success("Profile information saved.");
        } catch (e) {
            console.error("Error updating profile", e);
            showError("Failed to save profile.");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-3xl">
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">My Profile</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage your personal details and photo.</p>
            </div>

            <div className="flex items-start gap-6 p-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl shadow-sm">
                <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className={`w-20 h-20 rounded-full object-cover border-4 border-gray-50 dark:border-[#333] transition-opacity ${isUploading ? 'opacity-50' : ''}`} 
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={20} className="text-white" />
                    </div>
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 size={24} className="text-emerald-500 animate-spin" />
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">First Name</label>
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Last Name</label>
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Email Address</label>
                        <div className="relative">
                            <input type="email" value={user?.email || ''} readOnly className="w-full bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-[#666] outline-none cursor-not-allowed" />
                            <LockIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-[#2e2e2e]">
                <button onClick={handleSaveProfile} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">Save Changes</button>
            </div>
        </div>
    );
};

const SecurityTab = () => (
    <div className="space-y-8 animate-fade-in max-w-3xl">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Security</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage your password and security settings.</p>
        </div>
        <section className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-[#ededed] mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div className="md:col-span-2 pt-2 flex justify-end">
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Update Password</button>
                </div>
            </div>
        </section>
    </div>
);

const AccessTokensTab = () => (
    <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Access Tokens</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage API keys and personal access tokens.</p>
                </div>
                <button className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                    <Zap size={16} /> Generate New Token
                </button>
            </div>
        </div>
        
        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden">
            <div className="p-8 text-center text-gray-500 dark:text-[#888]">
                <Key size={32} className="mx-auto mb-3 text-gray-300 dark:text-[#444]" />
                <p>No active access tokens.</p>
            </div>
        </div>
    </div>
);

const AuditLogsTab = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Audit Logs</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-1">View security events and important actions.</p>
        </div>
        
        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-500 dark:text-[#888] border-b border-gray-100 dark:border-[#333]">
                    <tr>
                        <th className="px-6 py-3 font-medium">Event</th>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium text-right">IP Address</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                    {[
                        { event: 'User Login', user: 'demo@autocm.app', date: 'Oct 24, 2023 10:42 AM', ip: '192.168.1.1' },
                        { event: 'Password Changed', user: 'demo@autocm.app', date: 'Oct 20, 2023 09:15 AM', ip: '192.168.1.1' },
                        { event: 'Project Created', user: 'demo@autocm.app', date: 'Oct 18, 2023 02:30 PM', ip: '192.168.1.1' },
                    ].map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                            <td className="px-6 py-3 font-medium text-gray-900 dark:text-[#ededed]">{log.event}</td>
                            <td className="px-6 py-3 text-gray-500 dark:text-[#888]">{log.user}</td>
                            <td className="px-6 py-3 text-gray-500 dark:text-[#888]">{log.date}</td>
                            <td className="px-6 py-3 text-right text-gray-400 font-mono text-xs">{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const GeneralWorkspaceTab = () => {
    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">General Settings</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage organization details.</p>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Workspace Name</label>
                        <input type="text" defaultValue="My Agency" className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#383838] rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Workspace URL</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 dark:border-[#383838] bg-gray-50 dark:bg-[#2a2a2a] text-gray-500 dark:text-[#888] text-sm">
                                autocm.app/
                            </span>
                            <input type="text" defaultValue="my-agency" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-gray-200 dark:border-[#383838] bg-white dark:bg-[#2a2a2a] text-sm outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Agency Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-[#333] rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-[#555]">
                                <Upload size={20} className="text-gray-400" />
                            </div>
                            <button className="text-sm text-emerald-600 font-medium hover:underline">Upload new logo</button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#2e2e2e] flex justify-end">
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const MembersTab = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Team Members</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Manage access to your workspace.</p>
                </div>
                <button className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                    <Users size={16} /> Invite Member
                </button>
            </div>
        </div>

        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-500 dark:text-[#888] border-b border-gray-100 dark:border-[#333]">
                    <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">DU</div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-[#ededed]">Demo User</p>
                                    <p className="text-xs text-gray-500">demo@autocm.app</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                Owner
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400">
                            Manage
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const AutopilotTab = () => {
    const [autopilotEnabled, setAutopilotEnabled] = useState(false);
    const { success, warning: showWarning } = useToast();
    const [stages, setStages] = useState({
        briefing: true, audit: true, strategy: true, actionPlan: true, production: true, reporting: true
    });

    useEffect(() => {
        setAutopilotEnabled(getAutopilotState().isEnabled);
    }, []);

    const handleGlobalToggle = () => {
        const newState = toggleAutopilot(!autopilotEnabled);
        setAutopilotEnabled(newState.isEnabled);
        
        if (newState.isEnabled) {
            success("Global Autopilot Activated", "All projects will now process automatically.");
        } else {
            showWarning("Global Autopilot Paused", "Automated workflows have been stopped.");
        }
    };

    const toggleStage = (key: keyof typeof stages) => {
        setStages(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Workflow Configuration</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Configure global autopilot behaviors.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-[#1a2e26] dark:to-[#1c1c1c] border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                    <Zap size={140} />
                </div>
                
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                            <Zap size={20} className="text-emerald-500 fill-emerald-500" /> Agency Autopilot Control
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#8b9092] mt-1 max-w-md">
                            Global control center. Disabling this overrides all project-level automation settings.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            onClick={handleGlobalToggle}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${autopilotEnabled ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-[#333]'}`}
                        >
                            <span className={`${autopilotEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200`} />
                        </button>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${autopilotEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                            {autopilotEnabled ? 'Global Active' : 'Global Paused'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#1c1c1c]">
                    <h4 className="font-semibold text-gray-900 dark:text-[#ededed]">Workflow Stage Automation</h4>
                    <p className="text-xs text-gray-500 dark:text-[#888]">Enable or disable AI intervention for specific stages.</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                    {[
                        { id: 'briefing', label: 'Briefing & Onboarding', icon: <Briefcase size={16} />, desc: 'Auto-send briefs and process initial client data.' },
                        { id: 'audit', label: 'Audit & Research', icon: <Search size={16} />, desc: 'Perform competitor analysis and trend scanning.' },
                        { id: 'strategy', label: 'Strategy Generation', icon: <BrainCircuit size={16} />, desc: 'Draft comprehensive strategies based on audit data.' },
                        { id: 'actionPlan', label: 'Action Plan & Roadmap', icon: <Target size={16} />, desc: 'Create tasks and timelines automatically.' },
                        { id: 'production', label: 'Content Production', icon: <Rocket size={16} />, desc: 'Generate copy and visuals for approval.' },
                        { id: 'reporting', label: 'Reporting & Optimization', icon: <FileText size={16} />, desc: 'Compile performance reports and insights.' },
                    ].map((stage) => (
                        <div key={stage.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${stages[stage.id as keyof typeof stages] ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-[#333]'}`}>
                                    {stage.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{stage.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#888]">{stage.desc}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleStage(stage.id as keyof typeof stages)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${stages[stage.id as keyof typeof stages] ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-[#333]'}`}
                            >
                                <span className={`${stages[stage.id as keyof typeof stages] ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ConnectionsTab = () => {
    const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'market' | 'content' | 'all'>('market');
    const { success } = useToast();

    useEffect(() => {
        setActivePlatforms(getEnabledPlatforms());
    }, []);

    const handleToggle = (platform: any) => {
        const isEnabled = activePlatforms.includes(platform);
        setPlatformStatus(platform, !isEnabled);
        const newStatus = getEnabledPlatforms();
        setActivePlatforms(newStatus);
        
        if (!isEnabled) {
            success(`${platform} enabled.`);
        }
    };

    const GROUPS = {
        market: [
            { title: 'B2C & Social Branding', platforms: [Platform.Facebook, Platform.Instagram, Platform.TikTok, Platform.YouTube, Platform.Snapchat, Platform.Pinterest] },
            { title: 'B2B & Corporate', platforms: [Platform.LinkedIn, Platform.Twitter, Platform.GoogleBusiness, Platform.WordPress, Platform.Mastodon] },
            { title: 'Messaging & CRM', platforms: [Platform.WhatsApp, Platform.Telegram, Platform.Slack, Platform.Discord] }
        ],
        content: [
            { title: 'Visual & Video', platforms: [Platform.Instagram, Platform.TikTok, Platform.YouTube, Platform.Pinterest, Platform.Snapchat] },
            { title: 'Feed & Updates', platforms: [Platform.Facebook, Platform.LinkedIn, Platform.Twitter, Platform.GoogleBusiness, Platform.WordPress, Platform.Mastodon] },
            { title: 'Communication', platforms: [Platform.WhatsApp, Platform.Slack, Platform.Discord, Platform.Telegram] }
        ]
    };

    const renderPlatformCard = (platform: Platform) => {
        const config = PLATFORM_CONFIG[platform] || { label: platform };
        const isEnabled = activePlatforms.includes(platform);

        return (
            <div key={platform} className={`flex items-center justify-between p-4 rounded-xl border transition-all animate-fade-in ${isEnabled ? 'bg-white dark:bg-[#1c1c1c] border-emerald-200 dark:border-emerald-900/30 shadow-sm' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] opacity-75'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#2a2a2a] shadow-sm border border-gray-100 dark:border-[#333]">
                        <PlatformIcon platform={platform} size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{config.label}</p>
                        <p className="text-[10px] text-gray-500 dark:text-[#888]">{isEnabled ? 'Active' : 'Disabled'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleToggle(platform)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-[#444]'}`}
                >
                    <span className={`${isEnabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-[#282828] pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Platform Connections</h3>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Enable platforms available for your agency projects.</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-[#232323] p-1 rounded-lg flex items-center shrink-0">
                    <button 
                        onClick={() => setViewMode('market')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'market' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#ccc]'}`}
                    >
                        Market Focus
                    </button>
                    <button 
                        onClick={() => setViewMode('content')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'content' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#ccc]'}`}
                    >
                        Content Type
                    </button>
                    <button 
                        onClick={() => setViewMode('all')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'all' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#ccc]'}`}
                    >
                        All Platforms
                    </button>
                </div>
            </div>

            {viewMode === 'all' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getAllPlatforms().sort().map(renderPlatformCard)}
                </div>
            ) : (
                <div className="space-y-8">
                    {GROUPS[viewMode].map((group) => (
                        <div key={group.title}>
                            <h4 className="text-xs font-bold text-gray-400 dark:text-[#666] uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                                {viewMode === 'market' ? <LayoutGrid size={14} /> : <ListFilter size={14} />}
                                {group.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.platforms.map(renderPlatformCard)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OtherTab = () => {
    const { user, signInDemo, logout } = useAuth();
    const isDemo = user?.uid === 'demo-user-123';
    const [isProcessing, setIsProcessing] = useState(false);
    const { success, error } = useToast();

    const handleToggle = async () => {
        setIsProcessing(true);
        try {
            if (isDemo) {
                // Currently Demo -> Switch to Live (logout first to let user sign in)
                await logout();
            } else {
                // Currently Live -> Switch to Demo
                await signInDemo();
            }
            success(`Switched to ${!isDemo ? 'Demo' : 'Live'} mode`);
        } catch (err) {
            console.error("Failed to switch mode", err);
            error("Failed to switch application mode");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Autres</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Paramètres avancés et modes d'application.</p>
            </div>

            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-lg ${isDemo ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                            {isDemo ? <MonitorPlay size={24} /> : <Server size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed]">Mode Démonstration</h3>
                            <p className="text-sm text-gray-500 dark:text-[#888] mt-1 max-w-md">
                                Basculez entre le mode démo (données locales simulées) et le mode live (base de données réelle).
                            </p>
                            <p className="text-xs font-medium mt-2">
                                État actuel : <span className={isDemo ? 'text-amber-600' : 'text-emerald-600'}>{isDemo ? 'DEMO (Sandbox)' : 'LIVE (Production)'}</span>
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleToggle}
                        disabled={isProcessing}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDemo ? 'bg-amber-500 focus:ring-amber-500' : 'bg-gray-200 dark:bg-[#333] focus:ring-emerald-500'}`}
                    >
                        <span className={`${isDemo ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200`} />
                    </button>
                </div>
                
                {isDemo && (
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg text-sm text-amber-800 dark:text-amber-400">
                        <p><strong>Note :</strong> En mode démo, toutes les modifications sont locales et seront perdues lors du rechargement de la page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AiEngagementRulesTab = () => {
    const { success } = useToast();

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl relative">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-[#282828] pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ededed]">Engagement Rules</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Define how your autopilot interacts with your community's comments.</p>
                </div>
            </div>

            {/* Content Container with Overlay */}
            <div className="relative rounded-xl border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] shadow-sm overflow-hidden">
                
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 z-20 bg-white/60 dark:bg-[#1c1c1c]/60 backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white dark:ring-[#1c1c1c]">
                        <Rocket size={32} className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-[#ededed] mb-2">Engagement Rules is coming soon!</h3>
                    <p className="text-gray-600 dark:text-[#8b9092] max-w-md mb-6 text-sm">
                        You will be able to fine-tune exactly how Auto-CM handles comments based on sentiment.
                    </p>
                    <button 
                        onClick={() => success("Notification enabled! We'll let you know when it's ready.")}
                        className="px-6 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#444] text-gray-700 dark:text-[#ededed] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Bell size={16} /> Notify me when available
                    </button>
                </div>

                {/* Mock UI (Disabled visual state) */}
                <div className="p-8 space-y-8 opacity-40 pointer-events-none filter grayscale-[30%]">
                    
                    {/* Sentinel Mode Mockup */}
                    <div className="flex items-center justify-between p-4 border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-[#2a2a2a] rounded-full border border-emerald-100 dark:border-emerald-800">
                                <ScanFace size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-[#ededed]">Sentinel Mode (Recommended)</h3>
                                <p className="text-xs text-gray-500 dark:text-[#888]">Analyze the sentiment of every comment before taking action.</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    {/* Logic Matrix Mockup */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Automation Logic Matrix</h4>
                        
                        {/* Positive Row */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <ThumbsUp size={18} className="text-blue-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-[#ccc]">Positive Comments (Questions, Praise)</span>
                            </div>
                            <div className="w-48 h-8 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#444] rounded flex items-center justify-between px-3 text-xs text-gray-600 dark:text-[#999]">
                                <span>Auto-Reply Immediately</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        {/* Negative Row */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={18} className="text-amber-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-[#ccc]">Negative Comments (Complaints)</span>
                            </div>
                            <div className="w-48 h-8 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#444] rounded flex items-center justify-between px-3 text-xs text-gray-600 dark:text-[#999]">
                                <span>STOP Automation & Alert Me</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        {/* Trolls Row */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <ShieldBan size={18} className="text-red-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-[#ccc]">Trolls & Spam</span>
                            </div>
                            <div className="w-48 h-8 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#444] rounded flex items-center justify-between px-3 text-xs text-gray-600 dark:text-[#999]">
                                <span>Auto-Block & Hide</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Settings Component ---

const Settings: React.FC<SettingsProps> = ({ context, activeTab }) => {
    
    return (
        <div className="w-full">
            {context === 'account' && (
                <>
                    {activeTab === 'preferences' && <ProfileTab />}
                    {activeTab === 'access-tokens' && <AccessTokensTab />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'audit-logs' && <AuditLogsTab />}
                </>
            )}

            {context === 'organization' && (
                <>
                    {activeTab === 'general' && <GeneralWorkspaceTab />}
                    {activeTab === 'members' && <MembersTab />}
                    {activeTab === 'billing' && <Billing />}
                    {activeTab === 'workflow' && <AutopilotTab />}
                    {activeTab === 'ai-rules' && <AiEngagementRulesTab />}
                    {activeTab === 'connections' && <ConnectionsTab />}
                    {activeTab === 'other' && <OtherTab />}
                </>
            )}
        </div>
    );
};

export default Settings;
