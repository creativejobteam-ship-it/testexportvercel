
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  BarChart3, 
  HelpCircle,
  Target,
  ChevronRight,
  ClipboardList,
  Search,
  FolderOpen,
  Image as ImageIcon,
  Users,
  PanelLeft,
  User,
  Shield,
  Key,
  FileText,
  CreditCard,
  Zap,
  Globe,
  ArrowLeft,
  PenTool,
  MoreHorizontal,
  Layers,
  MessageSquare,
  Rocket,
  Bot
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  mode: 'expanded' | 'collapsed' | 'hover';
  setMode: (mode: 'expanded' | 'collapsed' | 'hover') => void;
  context: 'workspace' | 'account';
  onShowFeature?: (feature: 'ads' | 'engagement') => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  subItems?: MenuItem[];
  isBack?: boolean;
  isHeader?: boolean;
  isSpecial?: boolean; // Added for Ads module styling
  featureKey?: 'ads' | 'engagement'; // Key to trigger modal
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, mode, setMode, onShowFeature }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'briefs-group', 
    'projects-group',
    'planning-group',
    'production-group',
    'analytics-group'
  ]);
  const [showSidebarControl, setShowSidebarControl] = useState(false);
  const controlButtonRef = useRef<HTMLButtonElement>(null);
  const controlMenuRef = useRef<HTMLDivElement>(null);

  // States for Hover Mode and Floating Menus
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: visually collapsed?
  const isVisualCollapsed = mode === 'collapsed' || (mode === 'hover' && !isHoverExpanded);

  // Determine Context based on currentView
  const isAccountContext = currentView.startsWith('account-');
  const isOrgContext = currentView.startsWith('org-');
  const isSettingsMode = isAccountContext || isOrgContext;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlMenuRef.current && 
        !controlMenuRef.current.contains(event.target as Node) &&
        controlButtonRef.current &&
        !controlButtonRef.current.contains(event.target as Node)
      ) {
        setShowSidebarControl(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isVisualCollapsed) return;
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const handleSidebarMouseEnter = () => {
    if (mode === 'hover') {
      setIsHoverExpanded(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (mode === 'hover') {
      setIsHoverExpanded(false);
    }
  };

  const handleItemMouseEnter = (e: React.MouseEvent, itemId: string) => {
    if (!isVisualCollapsed) return;
    
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuTop(rect.top);
    setHoveredItem(itemId);
  };

  const handleItemMouseLeave = () => {
    if (!isVisualCollapsed) return;
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
  };

  // --- MENUS DEFINITIONS ---

  const defaultWorkflowItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    {
      id: 'projects-group',
      label: 'Projects',
      icon: <FolderOpen size={20} />,
      subItems: [
        { id: 'projects-manage', label: 'All Projects' },
        { id: 'project-types', label: 'Project Types' },
        { id: 'projects-sectors', label: 'Activity Sectors' },
      ]
    },
    { 
      id: 'briefs-group', 
      label: 'Briefs', 
      icon: <ClipboardList size={20} />,
      subItems: [
        { id: 'briefing-manager', label: 'Manage Briefs' },
        { id: 'templates-builder', label: 'Templates' },
      ]
    },
    { id: 'audit', label: 'Audit', icon: <Search size={20} /> },
    { id: 'strategies', label: 'Strategies', icon: <Target size={20} /> },
    { 
      id: 'planning-group', 
      label: 'Planning', 
      icon: <Layers size={20} />, 
      subItems: [
        { id: 'action-plan', label: "Action Plan" }, 
      ]
    },
    { 
      id: 'production-group', 
      label: 'Production', 
      icon: <PenTool size={20} />,
      subItems: [
        { id: 'publisher', label: 'Publisher' },
        { id: 'assets', label: 'Assets' }
      ]
    },
    {
      id: 'engagement-ai',
      label: 'AI Engagement',
      icon: <MessageSquare size={20} />,
      badge: 'SOON',
      featureKey: 'engagement'
    },
    {
      id: 'ads-growth',
      label: 'Ads & Growth',
      icon: <Rocket size={20} />,
      badge: 'SOON',
      isSpecial: true,
      featureKey: 'ads'
    },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { 
      id: 'analytics-group', 
      label: 'Analytics', 
      icon: <BarChart3 size={20} />,
      subItems: [
        { id: 'analytics', label: 'Overview' },
        { id: 'reports', label: 'Reports' },
      ]
    },
  ];

  const defaultFooterItems: MenuItem[] = [
    { id: 'org-general', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'support', label: 'Support', icon: <HelpCircle size={20} /> },
  ];

  // ACCOUNT SETTINGS MENU
  const accountItems: MenuItem[] = [
    { id: 'dashboard', label: 'Back to Dashboard', icon: <ArrowLeft size={20} />, isBack: true },
    { id: 'header-account', label: 'ACCOUNT SETTINGS', isHeader: true },
    { id: 'account-preferences', label: 'Preferences', icon: <User size={20} /> },
    { id: 'account-access-tokens', label: 'Access Tokens', icon: <Key size={20} /> },
    { id: 'account-security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'header-logs', label: 'LOGS', isHeader: true },
    { id: 'account-audit-logs', label: 'Audit Logs', icon: <FileText size={20} /> },
  ];

  // ORGANIZATION SETTINGS MENU
  const orgItems: MenuItem[] = [
    { id: 'dashboard', label: 'Back to Dashboard', icon: <ArrowLeft size={20} />, isBack: true },
    { id: 'header-settings', label: 'SETTINGS', isHeader: true },
    { id: 'org-general', label: 'General', icon: <Settings size={20} /> },
    { id: 'org-members', label: 'Members / Team', icon: <Users size={20} /> },
    { id: 'org-billing', label: 'Billing', icon: <CreditCard size={20} /> },
    { id: 'org-workflow', label: 'Workflow Config', icon: <Zap size={20} /> },
    { id: 'org-ai-rules', label: 'Engagement Rules', icon: <Bot size={20} /> },
    { id: 'org-connections', label: 'Connections', icon: <Globe size={20} /> },
    { id: 'org-other', label: 'Autres', icon: <MoreHorizontal size={20} /> },
  ];

  // --- RENDER LOGIC ---

  // Determine which menu to show
  let mainItems = defaultWorkflowItems;
  let footerItems = defaultFooterItems;

  if (isAccountContext) {
      mainItems = accountItems;
      footerItems = []; // No footer in settings mode usually
  } else if (isOrgContext) {
      mainItems = orgItems;
      footerItems = [];
  }

  const activeItem = [...mainItems, ...footerItems].find(item => item.id === hoveredItem);

  const renderMenuItem = (item: MenuItem, level = 0) => {
    // Render Section Header
    if (item.isHeader) {
        if (isVisualCollapsed) return null; // Hide headers when collapsed
        return (
            <div key={item.id} className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 dark:text-[#555] uppercase tracking-wider select-none">
                {item.label}
            </div>
        );
    }

    const isExpanded = expandedMenus.includes(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    // Check if descendant active
    const isDescendantActive = (items: MenuItem[] | undefined): boolean => {
      if (!items) return false;
      return items.some(sub => sub.id === currentView || isDescendantActive(sub.subItems));
    };
    
    const isActive = currentView === item.id || (!isExpanded && isDescendantActive(item.subItems));
    
    // Indentation
    const paddingLeft = level === 0 ? (isVisualCollapsed ? 0 : 12) : (level * 16 + 12);

    // Special Styling Logic
    const isAds = item.id === 'ads-growth';
    const isEngagement = item.id === 'engagement-ai';
    
    let baseClasses = "w-full flex items-center justify-between pr-3 py-2 rounded-md transition-all duration-200 select-none";
    let textClasses = "";
    let badgeClasses = "";
    
    if (item.isBack) {
        textClasses = 'text-gray-500 hover:text-gray-900 dark:text-[#8b9092] dark:hover:text-[#ededed] mb-4 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]';
    } else if (isAds) {
        // Special styling for Ads module (Indigo)
        textClasses = 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium';
        badgeClasses = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
    } else if (isEngagement) {
        // Special styling for Engagement module (Pink)
        textClasses = 'text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-medium';
        badgeClasses = 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300';
    } else if (isActive && !hasSubItems && !isVisualCollapsed) {
        textClasses = 'bg-emerald-50 dark:bg-[#232323] text-emerald-600 dark:text-[#3ecf8e] border-emerald-200 dark:border-[#2e2e2e]';
    } else if (isActive && isVisualCollapsed && level === 0) {
        textClasses = 'bg-emerald-50 dark:bg-[#232323] text-emerald-600 dark:text-[#3ecf8e]';
    } else if (level > 0) {
        textClasses = 'text-gray-600 dark:text-[#999] hover:text-gray-900 dark:hover:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#232323]';
    } else {
        textClasses = 'text-gray-700 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#232323] hover:text-gray-900 dark:hover:text-[#ededed]';
    }

    // Default badge style if not set by special
    if (!badgeClasses) {
        badgeClasses = item.badge === 'SOON' 
            ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }

    if (isVisualCollapsed && level === 0) {
        baseClasses = "w-full flex items-center justify-center px-0 py-2 rounded-md transition-all duration-200 select-none";
    }

    return (
      <div 
        key={item.id} 
        className="mb-0.5"
        onMouseEnter={level === 0 ? (e) => handleItemMouseEnter(e, item.id) : undefined}
        onMouseLeave={level === 0 ? handleItemMouseLeave : undefined}
      >
        <button
          onClick={(e) => {
              if (item.featureKey && onShowFeature) {
                  onShowFeature(item.featureKey);
              } else {
                  hasSubItems ? toggleMenu(item.id, e) : setView(item.id);
              }
          }}
          className={`${baseClasses} ${textClasses}`}
          style={{ paddingLeft: isVisualCollapsed && level === 0 ? 0 : `${paddingLeft}px` }}
          title={item.label}
        >
          <div className="flex items-center gap-3 font-medium justify-center truncate">
            {item.icon && (
                <span className={`${level > 0 ? 'opacity-80 scale-90' : ''}`}>{item.icon}</span>
            )}
            {!item.icon && level > 0 && <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 ml-1" />}
            
            {!isVisualCollapsed && <span className={`truncate ${level > 0 ? 'text-[13px]' : 'text-[14px]'}`}>{item.label}</span>}
          </div>
          
          {!isVisualCollapsed && !item.isBack && (
            <div className="flex items-center gap-2">
                {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${badgeClasses}`}>
                        {item.badge}
                    </span>
                )}
                {hasSubItems && (
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight size={14} />
                    </div>
                )}
            </div>
          )}
        </button>

        {!isVisualCollapsed && hasSubItems && isExpanded && (
          <div className="animate-slide-up">
            {item.subItems?.map(sub => renderMenuItem(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div 
          className={`fixed left-0 top-14 bottom-0 z-30 flex flex-col bg-white dark:bg-[#1c1c1c] border-r border-gray-200 dark:border-[#282828] text-gray-900 dark:text-[#ededed] transition-all duration-300 ease-in-out ${
            isVisualCollapsed ? 'w-[60px]' : 'w-64 shadow-xl shadow-gray-200/50 dark:shadow-none'
          }`}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
      >
        <div className={`flex-1 overflow-y-auto ${isVisualCollapsed ? 'px-1' : 'px-3'} py-4 custom-scrollbar flex flex-col`}>
          
          <div className="space-y-1 mb-8">
            {mainItems.map(item => renderMenuItem(item, 0))}
          </div>

          <div>
            {!isVisualCollapsed && !isSettingsMode && (
              <div className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-[#555] uppercase tracking-wider">
                  Organization
              </div>
            )}
            <div className="space-y-0.5">
              {footerItems.map(item => renderMenuItem(item, 0))}
            </div>
          </div>

          <div className="mt-auto pt-4">
              <button 
                  ref={controlButtonRef}
                  onClick={() => setShowSidebarControl(!showSidebarControl)}
                  className={`w-full flex items-center ${isVisualCollapsed ? 'justify-center' : 'justify-between px-3'} py-2.5 rounded-md text-gray-700 dark:text-[#8b9092] hover:bg-gray-50 dark:hover:bg-[#232323] hover:text-gray-900 dark:hover:text-[#ededed] transition-colors ${showSidebarControl ? 'bg-gray-100 dark:bg-[#2a2a2a]' : ''}`}
                  title="Layout Settings"
              >
                  <div className="flex items-center gap-3 justify-center">
                    <PanelLeft size={20} />
                    {!isVisualCollapsed && <span className="text-[14px]">View</span>}
                  </div>
              </button>
          </div>
        </div>
      </div>

      {/* Floating Menu Logic (Only for standard non-header items) */}
      {isVisualCollapsed && activeItem && hoveredItem && !activeItem.isBack && !activeItem.isHeader && (
        <div 
            className="fixed z-[100] bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl py-1 w-56 animate-fade-in"
            style={{ top: menuTop, left: 68 }}
        >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-[#888] border-b border-gray-100 dark:border-[#2e2e2e] mb-1">
                {activeItem.label}
            </div>
            
            {!activeItem.subItems && (
                <button
                    onClick={() => { 
                        if(activeItem.featureKey && onShowFeature) onShowFeature(activeItem.featureKey);
                        else setView(activeItem.id); 
                        setHoveredItem(null); 
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] ${currentView === activeItem.id ? 'bg-emerald-50 text-emerald-600' : ''}`}
                >
                    Open {activeItem.label}
                </button>
            )}

            {activeItem.subItems?.map(sub => (
                <React.Fragment key={sub.id}>
                    <button
                        onClick={() => { setView(sub.id); setHoveredItem(null); }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors ${
                            currentView === sub.id 
                            ? 'text-emerald-600 dark:text-[#3ecf8e] bg-emerald-50/50 dark:bg-[#232323]' 
                            : 'text-gray-700 dark:text-[#ededed]'
                        }`}
                    >
                        {sub.icon ? <span className="opacity-70 scale-90">{sub.icon}</span> : <div className="w-1 h-1 rounded-full bg-current opacity-40" />}
                        {sub.label}
                    </button>
                </React.Fragment>
            ))}
        </div>
      )}

      {showSidebarControl && (
          <div 
              ref={controlMenuRef}
              className="fixed z-[100] bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow-xl w-56 animate-slide-up p-1"
              style={{
                  left: isVisualCollapsed ? '68px' : '260px',
                  bottom: '20px'
              }}
          >
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-[#888] border-b border-gray-100 dark:border-[#2e2e2e]">
                  View Mode
              </div>
              <div className="p-1">
                  <button 
                      onClick={() => { setMode('expanded'); setShowSidebarControl(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md transition-colors"
                  >
                      <div className="w-4 flex justify-center">
                          {mode === 'expanded' ? <div className="w-1.5 h-1.5 bg-emerald-600 dark:bg-white rounded-full" /> : null}
                      </div>
                      Fixed (Expanded)
                  </button>
                  <button 
                      onClick={() => { setMode('collapsed'); setShowSidebarControl(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md transition-colors"
                  >
                      <div className="w-4 flex justify-center">
                          {mode === 'collapsed' ? <div className="w-1.5 h-1.5 bg-emerald-600 dark:bg-white rounded-full" /> : null}
                      </div>
                      Collapsed
                  </button>
                  <button 
                      onClick={() => { setMode('hover'); setShowSidebarControl(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-md transition-colors"
                  >
                      <div className="w-4 flex justify-center">
                          {mode === 'hover' ? <div className="w-1.5 h-1.5 bg-emerald-600 dark:bg-white rounded-full" /> : null}
                      </div>
                      Expand on Hover
                  </button>
              </div>
          </div>
      )}
    </>
  );
};

export default Sidebar;
