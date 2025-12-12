
import React, { useState, useRef } from 'react';
import { 
  ChevronDown, 
  Github, 
  Menu, 
  X,
  Layers,
  Calendar,
  Users,
  BarChart3,
  PenTool,
  CheckCircle,
  Clock,
  MessageSquare,
  Calculator,
  FileText,
  Briefcase,
  Building2,
  Globe,
  Share2,
  Palette
} from 'lucide-react';

interface MarketingHeaderProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

const MarketingHeader: React.FC<MarketingHeaderProps> = ({ onNavigate, onLogin }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-left">
          <a onClick={() => onNavigate('landing')} className="header-logo">
            <div className="logo-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#3ecf8e" stroke="#3ecf8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="logo-text">Auto-CM</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="main-nav">
            <ul>
              {/* Solutions Dropdown */}
              <li 
                className="nav-item-wrapper"
                onMouseEnter={() => handleMouseEnter('solutions')}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`nav-item ${activeMenu === 'solutions' ? 'active' : ''}`}>
                  Solutions <ChevronDown size={14} className={`chevron ${activeMenu === 'solutions' ? 'rotate' : ''}`} />
                </button>
                
                {activeMenu === 'solutions' && (
                  <div className="nav-dropdown mega-menu">
                    <div className="mega-menu-content">
                        <div className="mega-menu-columns">
                            {/* By Industry */}
                            <div className="menu-column">
                                <span className="column-header">BY INDUSTRY</span>
                                <a onClick={() => onNavigate('solutions/agencies')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Briefcase size={16} /></div>
                                    <div className="item-content">
                                        <span className="item-title">For Agencies</span>
                                        <span className="item-desc">Manage multiple client portfolios</span>
                                    </div>
                                </a>
                                <a onClick={() => onNavigate('solutions/multi-location')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Globe size={16} /></div>
                                    <div className="item-content">
                                        <span className="item-title">Multi-location Brands</span>
                                        <span className="item-desc">Localize content at scale</span>
                                    </div>
                                </a>
                                <a onClick={() => onNavigate('solutions/multi-brand')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Building2 size={16} /></div>
                                    <div className="item-content">
                                        <span className="item-title">Multi-brand Companies</span>
                                        <span className="item-desc">Centralize brand governance</span>
                                    </div>
                                </a>
                            </div>

                            {/* By Use Case */}
                            <div className="menu-column">
                                <span className="column-header">BY USE CASE</span>
                                <a onClick={() => onNavigate('solutions/calendar')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Calendar size={16} /></div>
                                    <span className="item-label">Multi-channel content calendar</span>
                                </a>
                                <a onClick={() => onNavigate('solutions/workflow')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Layers size={16} /></div>
                                    <span className="item-label">Agency workflow management</span>
                                </a>
                                <a onClick={() => onNavigate('solutions/campaign')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Share2 size={16} /></div>
                                    <span className="item-label">Centralized campaign management</span>
                                </a>
                                <a onClick={() => onNavigate('solutions/collaboration')} className="dropdown-item cursor-pointer">
                                    <div className="item-icon"><Users size={16} /></div>
                                    <span className="item-label">Social media collaboration</span>
                                </a>
                            </div>
                        </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Product Dropdown */}
              <li 
                className="nav-item-wrapper"
                onMouseEnter={() => handleMouseEnter('product')}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`nav-item ${activeMenu === 'product' ? 'active' : ''}`}>
                  Product <ChevronDown size={14} className={`chevron ${activeMenu === 'product' ? 'rotate' : ''}`} />
                </button>
                {activeMenu === 'product' && (
                   <div className="nav-dropdown simple-dropdown">
                      <a onClick={() => onNavigate('product/create')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><PenTool size={16}/></div>
                        <div className="item-content">
                            <span className="item-title">Create</span>
                            <span className="item-desc">Visual content builder</span>
                        </div>
                      </a>
                      <a onClick={() => onNavigate('product/plan')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Calendar size={16}/></div>
                        <div className="item-content">
                            <span className="item-title">Plan</span>
                            <span className="item-desc">Strategic calendar</span>
                        </div>
                      </a>
                      <a onClick={() => onNavigate('product/collaborate')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Users size={16}/></div>
                        <div className="item-content">
                            <span className="item-title">Collaborate</span>
                            <span className="item-desc">Team workflows</span>
                        </div>
                      </a>
                      <a onClick={() => onNavigate('product/approve')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><CheckCircle size={16}/></div>
                        <span className="item-label">Approve</span>
                      </a>
                      <a onClick={() => onNavigate('product/schedule')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Clock size={16}/></div>
                        <span className="item-label">Schedule</span>
                      </a>
                      <a onClick={() => onNavigate('product/analyze')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><BarChart3 size={16}/></div>
                        <span className="item-label">Analyze</span>
                      </a>
                      <a onClick={() => onNavigate('product/engage')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><MessageSquare size={16}/></div>
                        <span className="item-label">Engage</span>
                      </a>
                   </div>
                )}
              </li>

              {/* Pricing Link */}
              <li><a onClick={() => onNavigate('pricing')} className="nav-item-link">Pricing</a></li>

              {/* Resources Dropdown */}
              <li 
                className="nav-item-wrapper"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`nav-item ${activeMenu === 'resources' ? 'active' : ''}`}>
                  Resources <ChevronDown size={14} className={`chevron ${activeMenu === 'resources' ? 'rotate' : ''}`} />
                </button>
                {activeMenu === 'resources' && (
                   <div className="nav-dropdown simple-dropdown">
                      <a onClick={() => onNavigate('resources/blog')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><FileText size={16}/></div>
                        <span className="item-label">Blog</span>
                      </a>
                      <a onClick={() => onNavigate('resources/tools')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Layers size={16}/></div>
                        <span className="item-label">Free tools</span>
                      </a>
                      <a onClick={() => onNavigate('design-system')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Palette size={16}/></div>
                        <span className="item-label">Design System</span>
                      </a>
                      <a onClick={() => onNavigate('resources/freebies')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Share2 size={16}/></div>
                        <span className="item-label">Freebies</span>
                      </a>
                      <a onClick={() => onNavigate('resources/quiz')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Users size={16}/></div>
                        <span className="item-label">Social Media Job Title Quiz</span>
                      </a>
                      <a onClick={() => onNavigate('resources/calculator')} className="dropdown-item cursor-pointer">
                        <div className="item-icon"><Calculator size={16}/></div>
                        <span className="item-label">Pricing Calculator</span>
                      </a>
                   </div>
                )}
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <div className="hidden md:flex items-center gap-4">
            <a href="https://github.com" target="_blank" className="github-btn">
                <Github size={16} />
                <span className="font-medium">Star</span>
                <span className="github-count">12.4K</span>
            </a>
            <button onClick={onLogin} className="login-btn">Log in</button>
            <button onClick={onLogin} className="start-btn">Book a demo</button>
          </div>
          
          <button className="mobile-menu-btn md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Placeholder */}
      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden absolute top-[64px] left-0 w-full bg-white dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] p-4 flex flex-col gap-4 shadow-lg">
            <a className="py-2 text-lg font-medium" onClick={() => onNavigate('solutions/agencies')}>Solutions</a>
            <a className="py-2 text-lg font-medium" onClick={() => onNavigate('product/create')}>Product</a>
            <a className="py-2 text-lg font-medium" onClick={() => onNavigate('pricing')}>Pricing</a>
            <a className="py-2 text-lg font-medium" onClick={() => onNavigate('resources/blog')}>Resources</a>
            <a className="py-2 text-lg font-medium" onClick={() => onNavigate('design-system')}>Design System</a>
            <hr className="border-gray-100 dark:border-[#333]" />
            <button onClick={onLogin} className="btn btn-secondary justify-center w-full">Log in</button>
            <button onClick={onLogin} className="btn btn-primary justify-center w-full">Book a demo</button>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;
