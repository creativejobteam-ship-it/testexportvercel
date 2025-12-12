
import React from 'react';
import { ArrowLeft, User, Shield, Key, FileText, Settings as SettingsIcon, Users, CreditCard, Zap, Globe, LayoutGrid } from 'lucide-react';

export type SettingsContext = 'account' | 'organization';

interface SettingsLayoutProps {
  context: SettingsContext;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onBack: () => void;
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ACCOUNT_MENU: MenuItem[] = [
  { id: 'preferences', label: 'Preferences', icon: <User size={18} /> },
  { id: 'access-tokens', label: 'Access Tokens', icon: <Key size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'audit-logs', label: 'Audit Logs', icon: <FileText size={18} /> },
];

const ORG_MENU: MenuItem[] = [
  { id: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
  { id: 'members', label: 'Members / Team', icon: <Users size={18} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
  { id: 'workflow', label: 'Workflow Config', icon: <Zap size={18} /> },
  { id: 'connections', label: 'Integrations', icon: <Globe size={18} /> },
];

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  context, 
  activeTab, 
  onTabChange, 
  onBack, 
  children 
}) => {
  const menuItems = context === 'account' ? ACCOUNT_MENU : ORG_MENU;
  const sectionTitle = context === 'account' ? 'ACCOUNT SETTINGS' : 'SETTINGS';

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] bg-white dark:bg-[#1c1c1c]">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-[#282828] flex flex-col bg-gray-50/50 dark:bg-[#151515]">
        
        {/* Back Link */}
        <div className="p-6 pb-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] transition-colors font-medium mb-6"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          
          <div className="text-xs font-bold text-gray-400 dark:text-[#666] uppercase tracking-wider mb-2">
            {sectionTitle}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === item.id
                  ? 'bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-[#8b9092] hover:bg-gray-100 dark:hover:bg-[#232323] hover:text-gray-900 dark:hover:text-[#ededed]'
              }`}
            >
              <span className={activeTab === item.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-[#666]'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer (Optional) */}
        <div className="p-4 border-t border-gray-200 dark:border-[#282828]">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <LayoutGrid size={16} />
                </div>
                <div className="text-xs">
                    <p className="font-medium text-gray-900 dark:text-[#ededed]">Auto-CM</p>
                    <p className="text-gray-500 dark:text-[#666]">v2.4.0</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1c1c1c]">
        <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SettingsLayout;
