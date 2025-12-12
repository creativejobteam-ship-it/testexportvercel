
import React from 'react';
import MarketingHeader from './components/MarketingHeader';
import MarketingFooter from './components/MarketingFooter';
import { MARKETING_CSS } from './styles';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  onLogin: () => void;
  toggleTheme: () => void;
}

const MarketingLayout: React.FC<LayoutProps> = ({ children, onNavigate, onLogin, toggleTheme }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS }} />
      <div className="page-container">
        <MarketingHeader onNavigate={onNavigate} onLogin={onLogin} />
        <main>
            {children}
        </main>
        <MarketingFooter onNavigate={onNavigate} toggleTheme={toggleTheme} />
      </div>
    </>
  );
};
export default MarketingLayout;
