
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import FeaturePreviewsModal from './components/FeaturePreviewsModal';
import FeatureComingSoonModal from './components/FeatureComingSoonModal';
import Dashboard from './views/Dashboard';
import Inbox from './views/Inbox';
import Publisher from './views/Publisher';
import Settings from './views/Settings';
import Communities from './views/Communities';
import Calendar from './views/Calendar';
import Moderation from './views/Moderation';
import Analytics from './views/Analytics';
import Billing from './views/Billing';
import Support from './views/Support';
import Auth from './views/Auth';
import Landing from './views/marketing/Landing';
import Features from './views/marketing/Features';
import Pricing from './views/marketing/Pricing';
import Documentation from './views/marketing/Documentation';
import Terms from './views/marketing/Terms';
import Privacy from './views/marketing/Privacy';
import ProductPage from './views/marketing/ProductPage';
import SolutionPage from './views/marketing/SolutionPage';
import CompanyPage from './views/marketing/CompanyPage';
import ResourcesPage from './views/marketing/ResourcesPage';
import DesignSystemPage from './views/marketing/DesignSystemPage';
import Onboarding from './views/Onboarding';
import Clients from './views/Clients';
import Projects from './views/Projects'; 
import ProjectDetails from './views/ProjectDetails';
import ClientOverview from './views/ClientOverview';
import DomainBuilder from './views/admin/DomainBuilder';
import ProjectTypes from './views/admin/ProjectTypes';
import ClientBriefing from './views/ClientBriefing';
import ActivityDomains from './views/ActivityDomains';
import ActionPlanView from './views/ActionPlanView';
import BriefsDashboard from './views/briefing/BriefsDashboard';
import SendBriefingRequest from './views/briefing/SendBriefingRequest';
import PublicBriefView from './views/briefing/PublicBriefView';
import Usage from './views/Usage';
import NotificationsView from './views/NotificationsView';
import Assets from './views/Assets';

// Import New Audit & Strategy Views
import AuditProjectList from './views/Audit/AuditProjectList';
import AuditDashboard from './views/Audit/AuditDashboard';
import StrategyProjectList from './views/strategies/StrategyProjectList';
import StrategyDashboard from './views/strategies/StrategyDashboard';

import { AuthProvider, useAuth } from './src/contexts/AuthProvider';
import { ProjectProvider } from './src/contexts/ProjectContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { syncUserProfile } from './src/services/dbService';

type ViewState = 'landing' | 'features' | 'pricing' | 'documentation' | 'auth' | 'app' | 'terms' | 'privacy' | 'onboarding' | 'product' | 'solutions' | 'company' | 'resources' | 'public_brief' | 'design_system';

const AppContent: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [marketingSubPage, setMarketingSubPage] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [publicBriefParams, setPublicBriefParams] = useState<{projectId?: string, token: string} | null>(null);
  
  // Sidebar State lifted to App to control layout
  const [sidebarMode, setSidebarMode] = useState<'expanded' | 'collapsed' | 'hover'>('expanded');

  // Modal States
  const [showFeaturePreviews, setShowFeaturePreviews] = useState(false);
  const [featureModalType, setFeatureModalType] = useState<'ads' | 'engagement' | null>(null);

  // Listen to Auth Changes
  useEffect(() => {
    if (user) {
        setViewState('app');
        syncUserProfile(user).catch(console.error);
    } else {
        if (viewState === 'app' || viewState === 'onboarding') {
            setViewState('landing');
        }
    }
  }, [user]);

  // Handle Hash Routing for external links (e.g. Briefing)
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        
        // 1. Match /#brief/:projectId/:token (New Standard)
        if (hash.startsWith('#/brief/')) {
            const parts = hash.split('/');
            // #/brief/proj_123/token_abc
            if (parts.length >= 4) {
                setPublicBriefParams({ projectId: parts[2], token: parts[3] });
                setViewState('public_brief');
                return;
            }
        }

        // 2. Legacy / Public link fallback
        if (hash.includes('/public/brief/')) {
            // Extract just the token from legacy format if possible, or handle appropriately
            // For now, assume simple token
            const parts = hash.split('/');
            const token = parts[parts.length - 1];
            setPublicBriefParams({ token });
            setViewState('public_brief');
            return;
        }

        if (hash.startsWith('#/brief')) {
            // Legacy/Demo fallback ?client=...
            const params = new URLSearchParams(hash.split('?')[1]);
            const clientId = params.get('client');
            if (clientId) {
                setViewState('app');
                setCurrentView('client-briefing');
                setCurrentRecordId(clientId);
            }
        }
    };

    handleHashChange(); // Check on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Path Redirects (SPA Fallback for Legacy Links)
  useEffect(() => {
      // If we are on a path like /brief/..., redirect to /#/brief/...
      const path = window.location.pathname;
      if (path.startsWith('/brief/')) {
          // Keep the path parts but move them to hash
          // e.g. /brief/123/456 -> /#/brief/123/456
          const newHash = '#' + path;
          // Redirect
          window.location.href = window.location.origin + '/' + newHash;
      }
  }, []);

  // Initialize theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleStart = () => {
    if (user) setViewState('app');
    else setViewState('auth');
  };

  const handleLogin = () => {}; 
  const handleSignup = () => {};

  const handleOnboardingComplete = () => setViewState('app');

  const handleLogout = async () => {
    await logout();
    setViewState('auth');
    setCurrentView('dashboard');
    setCurrentRecordId(null);
  };

  const handleNavigate = (view: string, id: string | null = null) => {
    setCurrentView(view);
    setCurrentRecordId(id);
  };

  const handleNavigatePage = (page: string) => {
    if (page === 'design-system') {
        setViewState('design_system');
        window.scrollTo(0, 0);
        return;
    }

    if (page.includes('/')) {
        const [main, sub] = page.split('/');
        if (['product', 'solutions', 'company', 'resources'].includes(main)) {
            setViewState(main as ViewState);
            setMarketingSubPage(sub);
            window.scrollTo(0, 0);
            return;
        }
    }
    if (['landing', 'features', 'pricing', 'documentation', 'terms', 'privacy', 'auth'].includes(page)) {
        setViewState(page as ViewState);
        window.scrollTo(0, 0);
    }
  };

  const handleBackToAuth = () => setViewState('auth');

  // --- RENDER LOGIC ---

  // 1. PUBLIC BRIEF VIEW (No Sidebar, No Auth required for viewing, handled by component)
  if (viewState === 'public_brief') {
      return (
        <ToastProvider>
            <PublicBriefView projectId={publicBriefParams?.projectId} token={publicBriefParams?.token} />
        </ToastProvider>
      );
  }

  // 2. MARKETING PAGES
  if (viewState === 'landing') return <Landing onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'features') return <Features onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'pricing') return <Pricing onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'documentation') return <Documentation onBack={handleBackToAuth} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'terms') return <Terms onBack={handleBackToAuth} />;
  if (viewState === 'privacy') return <Privacy onBack={handleBackToAuth} />;
  if (viewState === 'design_system') return <DesignSystemPage onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  
  if (viewState === 'product') return <ProductPage slug={marketingSubPage} onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'solutions') return <SolutionPage slug={marketingSubPage} onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'company') return <CompanyPage slug={marketingSubPage} onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;
  if (viewState === 'resources') return <ResourcesPage slug={marketingSubPage} onStart={handleStart} onNavigate={handleNavigatePage} toggleTheme={toggleTheme} />;

  // 3. AUTH & ONBOARDING
  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1c1c1c]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
      );
  }
  if (viewState === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;
  if (viewState === 'auth') return <Auth onLogin={handleLogin} onSignup={handleSignup} toggleTheme={toggleTheme} isDarkMode={isDarkMode} onNavigate={(p) => handleNavigatePage(p)} />;

  // 4. MAIN APP LAYOUT
  const renderView = () => {
    // Check for Account Settings Routes
    if (currentView.startsWith('account-')) {
        const tab = currentView.replace('account-', '');
        return <Settings context="account" activeTab={tab} />;
    }
    if (currentView.startsWith('org-')) {
        const tab = currentView.replace('org-', '');
        return <Settings context="organization" activeTab={tab} />;
    }

    // Engagement AI Sub-items fallbacks (Leftover just in case)
    if (currentView === 'inbox' || currentView === 'auto-replies' || currentView === 'sentiments') {
        return <Inbox />; 
    }

    switch (currentView) {
      case 'clients': return <Clients onNavigate={handleNavigate} />;
      case 'client-details': return <ClientOverview clientId={currentRecordId} onNavigate={handleNavigate} />;
      case 'projects-manage': return <Projects onNavigate={handleNavigate} />;
      case 'projects-sectors': return <ActivityDomains onNavigate={handleNavigate} />;
      case 'project-types': return <ProjectTypes />;
      case 'projects': return <Projects onNavigate={handleNavigate} />;
      case 'project-details': return <ProjectDetails projectId={currentRecordId} onNavigate={handleNavigate} />;
      case 'briefing-manager': return <BriefsDashboard onNavigate={handleNavigate} />;
      case 'send-briefing': return <SendBriefingRequest />;
      case 'templates-builder': return <DomainBuilder domainId={currentRecordId} />;
      case 'audit': return <AuditProjectList onNavigate={handleNavigate} />;
      case 'audit-view': return <AuditDashboard projectId={currentRecordId} onBack={() => handleNavigate('audit')} />;
      case 'strategies': return <StrategyProjectList onNavigate={handleNavigate} />;
      case 'strategy-view': return <StrategyDashboard projectId={currentRecordId} onBack={() => handleNavigate('strategies')} />;
      case 'action-plan': return <ActionPlanView />;
      case 'calendar': return <Calendar projectId={currentRecordId} />;
      case 'publisher': return <Publisher />;
      case 'assets': return <Assets />;
      case 'inbox': return <Inbox />;
      case 'moderation': return <Moderation />;
      case 'analytics': return <Analytics viewMode="overview" onNavigate={handleNavigate} />;
      case 'reports': return <Analytics viewMode="reports" onNavigate={handleNavigate} />;
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'communities': return <Communities />;
      case 'notifications': return <NotificationsView onNavigate={handleNavigate} />;
      case 'settings': return <Settings context="organization" activeTab="general" />;
      case 'billing': return <Billing />;
      case 'usage': return <Usage />;
      case 'support': return <Support />;
      case 'activity-domains': return <ActivityDomains onNavigate={handleNavigate} />;
      case 'client-briefing': return <ClientBriefing clientId={currentRecordId} />; 
      
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1c] font-sans text-gray-900 dark:text-[#ededed] transition-colors duration-300">
      <ToastProvider>
        <ProjectProvider>
            <DashboardHeader 
                toggleTheme={toggleTheme} 
                onLogout={handleLogout} 
                onNavigate={handleNavigate}
                onOpenFeaturePreviews={() => setShowFeaturePreviews(true)} 
            />
            
            <div className={`flex pt-14 h-screen overflow-hidden`}>
                <Sidebar 
                    currentView={currentView} 
                    setView={(view) => handleNavigate(view, null)} 
                    mode={sidebarMode}
                    setMode={setSidebarMode}
                    context='workspace'
                    onShowFeature={(type) => setFeatureModalType(type)}
                />
                
                <main 
                    className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 bg-white dark:bg-[#1c1c1c] ${
                        (currentView === 'project-details' || currentView === 'client-details') ? 'p-0' : 'p-8' // Remove padding for full-width views
                    } ${
                        sidebarMode === 'expanded' ? 'ml-64' : 'ml-[60px]'
                    }`}
                >
                    {renderView()}
                </main>
            </div>

            <FeaturePreviewsModal 
                isOpen={showFeaturePreviews} 
                onClose={() => setShowFeaturePreviews(false)} 
            />

            <FeatureComingSoonModal
                isOpen={!!featureModalType}
                onClose={() => setFeatureModalType(null)}
                type={featureModalType}
            />
        </ProjectProvider>
      </ToastProvider>
    </div>
  );
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
