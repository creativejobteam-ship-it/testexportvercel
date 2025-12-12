
import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Bell, Sun, Moon, LogOut, Settings, Laptop, Beaker, User, Zap, BrainCircuit, MessageSquare, Book, Wrench, Activity, Mail, Github, AlertTriangle, Lightbulb, X, Rocket, Check, CheckCircle, XCircle, Info, FileText, Target, RefreshCcw, Shield } from 'lucide-react';
import { getAutopilotState, toggleAutopilot } from '../services/autopilotService';
import { useAuth } from '../src/contexts/AuthProvider';
import { DEMO_DATA } from '../services/demoData';
import { AppNotification } from '../types';

interface DashboardHeaderProps {
  toggleTheme: () => void;
  onLogout?: () => void;
  onNavigate?: (view: string, id?: string | null) => void;
  onOpenFeaturePreviews?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleTheme, onLogout, onNavigate, onOpenFeaturePreviews }) => {
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const [isAutopilotOn, setIsAutopilotOn] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
      setIsAutopilotOn(getAutopilotState().isEnabled);
      const interval = setInterval(() => {
          setIsAutopilotOn(getAutopilotState().isEnabled);
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      setNotifications(DEMO_DATA.notifications);
  }, []);

  const handleAutopilotToggle = () => {
      const newState = toggleAutopilot(!isAutopilotOn);
      setIsAutopilotOn(newState.isEnabled);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) setIsHelpOpen(false);
      if (feedbackRef.current && !feedbackRef.current.contains(event.target as Node)) setIsFeedbackOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (theme: string) => {
      setSelectedTheme(theme);
      if (theme === 'dark' || theme === 'classic-dark') {
          document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
      }
      toggleTheme(); 
  };

  const handleNavigateToAccount = () => {
      if (onNavigate) {
          onNavigate('account-preferences');
          setIsUserMenuOpen(false);
      }
  };

  const handleNavigateToFeatures = () => {
      if (onOpenFeaturePreviews) {
          onOpenFeaturePreviews();
          setIsUserMenuOpen(false);
      }
  };

  const handleNavigateToOrgSettings = () => {
      if (onNavigate) {
          onNavigate('org-general');
      }
  };

  const handleNotificationPreferences = () => {
      if (onNavigate) {
          onNavigate('account-preferences'); 
          setIsNotificationsOpen(false);
      }
  };

  const handleViewAllNotifications = () => {
      if (onNavigate) {
          onNavigate('notifications');
          setIsNotificationsOpen(false);
      }
  };

  const handleLogoClick = () => {
      if (onNavigate) {
          onNavigate('dashboard');
      }
  };

  const handleSupportClick = () => {
      setIsHelpOpen(false);
      if (onNavigate) {
          onNavigate('support');
      }
  };

  const userDisplayName = user?.displayName || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userAvatar = user?.photoURL || 'https://picsum.photos/seed/user/100/100';
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (n: AppNotification) => {
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
          case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
          case 'error': return <XCircle size={16} className="text-red-500" />;
          case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
          default: return <Info size={16} className="text-blue-500" />;
      }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] flex items-center justify-between px-4 shrink-0 z-50 transition-colors duration-300">
      {/* Left: Logo & Context */}
      <div className="flex items-center gap-4 text-sm">
         <div className="flex items-center gap-3">
            <div 
                className="w-8 h-8 flex items-center justify-center text-[#3ecf8e] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
                title="Go to Dashboard"
            >
                <Rocket size={24} fill="currentColor" className="transform -rotate-45"/>
            </div>
            
            <div className="hidden md:flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-[#ededed]">Auto-CM</span>
            </div>

            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-[#444] transform rotate-12 hidden md:block"><path d="M16 3.549L7.12 20.600"></path></svg>
            
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a] py-1 px-2 rounded-md transition-colors" onClick={handleNavigateToAccount}>
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-300 dark:border-[#444] overflow-hidden">
                    <img src={userAvatar} className="w-full h-full object-cover opacity-90" alt="User" />
                </div>
                <span className="font-medium text-[14px] text-gray-900 dark:text-[#ededed] hidden sm:inline-block">{userDisplayName}</span>
            </div>
            
            <button 
                onClick={handleNavigateToOrgSettings}
                className="text-[11px] border border-purple-200 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 px-2.5 py-0.5 rounded-full font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                title="Manage Organization Settings"
            >
                Agency
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-[#333] mx-1"></div>

            {/* Global Autopilot Switch */}
            <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-md border border-transparent hover:border-gray-100 dark:hover:border-[#2a2a2a] transition-all" title="Toggle AI automation for all projects">
                <div className="flex flex-col items-end leading-none">
                    <span className={`text-xs font-bold ${isAutopilotOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-[#888]'}`}>
                        Global Autopilot
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-medium">
                        All Projects
                    </span>
                </div>
                <button
                    onClick={handleAutopilotToggle}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isAutopilotOn ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-[#333]'
                    }`}
                >
                    <span
                        className={`${
                            isAutopilotOn ? 'translate-x-4' : 'translate-x-0'
                        } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                </button>
            </div>
         </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
         
         {/* Feedback Button */}
         <div className="relative" ref={feedbackRef}>
            <button 
                onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                className="hidden md:block text-[13px] font-medium text-gray-600 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
            >
                Feedback
            </button>
            {isFeedbackOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl z-50 animate-fade-in p-1">
                    <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-[#ededed] mb-3">What would you like to share?</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-md border border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444] hover:bg-gray-50 dark:hover:bg-[#232323] transition-all group">
                                <AlertTriangle size={24} className="text-red-500 mb-1" />
                                <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Issue</span>
                                <span className="text-[10px] text-gray-500 dark:text-[#888]">with my project</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-md border border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444] hover:bg-gray-50 dark:hover:bg-[#232323] transition-all group">
                                <Lightbulb size={24} className="text-orange-500 mb-1" />
                                <span className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Idea</span>
                                <span className="text-[10px] text-gray-500 dark:text-[#888]">to improve Auto-CM</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
         </div>

         {/* Search */}
         <div className="relative hidden md:flex items-center group mx-2">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-[#3ecf8e] transition-colors" />
             <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-12 py-2 bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] focus:border-emerald-500 dark:focus:border-[#3ecf8e] focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[#3ecf8e] rounded-full text-[13px] text-gray-900 dark:text-[#ededed] w-64 outline-none transition-all placeholder-gray-500"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5 opacity-50 pointer-events-none">
                 <span className="text-[10px] text-gray-500 dark:text-[#8b9092] border border-gray-300 dark:border-[#444] px-1 rounded">⌘ K</span>
             </div>
         </div>

         {/* Notifications Menu */}
         <div className="relative" ref={notificationsRef}>
             <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-gray-500 dark:text-[#888] relative ${isNotificationsOpen ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#ededed]' : ''}`}
             >
                 <Bell size={20} strokeWidth={1.5} />
                 {unreadCount > 0 && (
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1c1c1c]"></span>
                 )}
             </button>

             {isNotificationsOpen && (
                 <div className="absolute right-0 top-11 w-80 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
                     <div className="p-3 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center">
                         <h4 className="text-sm font-semibold text-gray-900 dark:text-[#ededed]">Notifications</h4>
                         <button 
                             onClick={handleNotificationPreferences}
                             className="text-[10px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline cursor-pointer"
                         >
                             Preferences
                         </button>
                     </div>
                     <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                         {notifications.slice(0, 10).map(notif => (
                             <div key={notif.id} className={`p-3 border-b border-gray-50 dark:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors ${!notif.read ? 'bg-emerald-50/10 dark:bg-emerald-900/5' : ''}`}>
                                 <div className="flex gap-3">
                                     <div className="mt-0.5 shrink-0">
                                         {getNotificationIcon(notif)}
                                     </div>
                                     <div>
                                         <p className="text-xs font-medium text-gray-900 dark:text-[#ededed]">{notif.title}</p>
                                         <p className="text-[11px] text-gray-500 dark:text-[#888] mt-0.5 leading-snug">{notif.description}</p>
                                         <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="p-2 bg-gray-50 dark:bg-[#111] border-t border-gray-100 dark:border-[#2e2e2e] text-center">
                         <button 
                            onClick={handleViewAllNotifications}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] transition-colors"
                         >
                             View All Activity
                         </button>
                     </div>
                 </div>
             )}
         </div>

         {/* Help Menu */}
         <div className="relative" ref={helpRef}>
             <button 
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-gray-500 dark:text-[#888] ${isHelpOpen ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#ededed]' : ''}`}
             >
                 <HelpCircle size={20} strokeWidth={1.5} />
             </button>

             {isHelpOpen && (
                 <div className="absolute right-0 top-11 w-72 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
                     <div className="p-3 border-b border-gray-100 dark:border-[#2e2e2e]">
                         <h4 className="text-sm font-semibold text-gray-900 dark:text-[#ededed] mb-1">Need help with your project?</h4>
                         <p className="text-xs text-gray-500 dark:text-[#888]">Start with our docs or community.</p>
                     </div>
                     <div className="p-1">
                         <button onClick={handleSupportClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                             <Book size={16} className="text-gray-400" /> Docs
                         </button>
                         <button onClick={handleSupportClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                             <Wrench size={16} className="text-gray-400" /> Troubleshooting
                         </button>
                         <button onClick={handleSupportClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                             <Activity size={16} className="text-gray-400" /> Status
                         </button>
                         <div className="my-1 border-t border-gray-100 dark:border-[#2e2e2e]"></div>
                         <button onClick={handleSupportClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                             <Mail size={16} className="text-gray-400" /> Contact Support
                         </button>
                     </div>
                     <div className="p-3 bg-gray-50 dark:bg-[#111] border-t border-gray-100 dark:border-[#2e2e2e]">
                         <h5 className="text-xs font-semibold text-gray-900 dark:text-[#ededed] mb-1">Community support</h5>
                         <p className="text-sm text-gray-500 dark:text-[#888] mb-3">Our Discord community can help with code-related issues. Many questions are answered in minutes.</p>
                         <button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-medium py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                             <MessageSquare size={14} fill="currentColor" /> Join us on Discord
                         </button>
                     </div>
                 </div>
             )}
         </div>

         {/* User Menu */}
         <div className="relative ml-1" ref={menuRef}>
            <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-8 h-8 rounded-full overflow-hidden border transition-all ${isUserMenuOpen ? 'ring-2 ring-emerald-500/50 border-emerald-500' : 'border-gray-200 dark:border-[#333] hover:border-gray-400 dark:hover:border-[#555]'}`}
            >
                <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
            </button>

            {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-[240px] bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-[#2e2e2e]">
                        <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">{userDisplayName}</p>
                        <p className="text-xs text-gray-500 dark:text-[#8b9092] truncate">{userEmail}</p>
                    </div>
                    
                    <div className="p-1 border-b border-gray-100 dark:border-[#2e2e2e]">
                        <button onClick={handleNavigateToAccount} className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                            <Settings size={14} className="text-gray-400 dark:text-[#6e6e6e]" /> Account preferences
                        </button>
                        <button onClick={handleNavigateToFeatures} className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                            <Beaker size={14} className="text-gray-400 dark:text-[#6e6e6e]" /> Feature previews
                        </button>
                    </div>

                    <div className="p-3 border-b border-gray-100 dark:border-[#2e2e2e]">
                        <p className="text-[11px] font-medium text-gray-500 dark:text-[#888] px-1 mb-2">Theme</p>
                        <div className="space-y-0.5">
                            {['Dark', 'Light', 'Classic Dark', 'System'].map((theme) => {
                                const id = theme.toLowerCase().replace(' ', '-');
                                const isSelected = selectedTheme === id;
                                return (
                                    <button 
                                        key={theme}
                                        onClick={() => handleThemeSelect(id)}
                                        className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center justify-between transition-colors group"
                                    >
                                        <span>{theme}</span>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-1">
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md flex items-center gap-3 transition-colors">
                            <LogOut size={14} className="text-gray-400" /> Log out
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
