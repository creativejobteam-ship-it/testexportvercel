
import React from 'react';
import MarketingLayout from './MarketingLayout';

interface DocumentationProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
  toggleTheme?: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onBack, onNavigate, toggleTheme }) => {
  const handleNav = (page: string) => {
      if (onNavigate) onNavigate(page);
      else onBack();
  };

  return (
    <MarketingLayout onNavigate={handleNav} onLogin={onBack} toggleTheme={toggleTheme || (() => {})}>
        <div className="docs-section">
            <div className="docs-container">
                <aside className="docs-sidebar">
                    <nav className="docs-nav">
                        <div className="docs-nav-section">
                            <h4>Introduction</h4>
                            <ul>
                                <li><a href="#" className="active">Getting Started</a></li>
                                <li><a href="#">Architecture</a></li>
                                <li><a href="#">Installation</a></li>
                            </ul>
                        </div>
                        <div className="docs-nav-section">
                            <h4>Core Concepts</h4>
                            <ul>
                                <li><a href="#">Automation Rules</a></li>
                                <li><a href="#">AI Agents</a></li>
                                <li><a href="#">Workflows</a></li>
                            </ul>
                        </div>
                        <div className="docs-nav-section">
                            <h4>API Reference</h4>
                            <ul>
                                <li><a href="#">Authentication</a></li>
                                <li><a href="#">Endpoints</a></li>
                                <li><a href="#">Webhooks</a></li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                <div className="docs-content">
                    <article className="docs-article">
                        <h1>Getting Started with Auto-CM</h1>
                        <p className="docs-lead">
                            Welcome to the Auto-CM documentation. This guide will help you set up your first automated community management agent in minutes.
                        </p>
                        
                        <h2>Installation</h2>
                        <p>You can start by creating an account on our platform or by self-hosting the agent.</p>
                        
                        <div className="docs-code-block">
                            <code>npm install @autocm/sdk</code>
                        </div>

                        <h2>Configuration</h2>
                        <p>Configure your API keys and connect your social accounts.</p>

                        <div className="docs-steps">
                            <div className="docs-step">
                                <div className="docs-step-number">1</div>
                                <div className="docs-step-content">
                                    <h3>Create an account</h3>
                                    <p>Sign up at dashboard.autocm.com to get your API keys.</p>
                                </div>
                            </div>
                            <div className="docs-step">
                                <div className="docs-step-number">2</div>
                                <div className="docs-step-content">
                                    <h3>Connect platforms</h3>
                                    <p>Link your Twitter, Discord, and LinkedIn accounts via OAuth.</p>
                                </div>
                            </div>
                            <div className="docs-step">
                                <div className="docs-step-number">3</div>
                                <div className="docs-step-content">
                                    <h3>Set rules</h3>
                                    <p>Define your moderation guidelines and content pillars.</p>
                                </div>
                            </div>
                        </div>

                        <h2>Next Steps</h2>
                        <ul className="docs-next-steps">
                            <li><a href="#">Explore the API Reference →</a></li>
                            <li><a href="#">Join the Community Discord →</a></li>
                        </ul>
                    </article>
                </div>
            </div>
        </div>
    </MarketingLayout>
  );
};

export default Documentation;
