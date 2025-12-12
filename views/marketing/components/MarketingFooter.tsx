
import React from 'react';
import { Twitter, Github, Disc, Youtube, Sun, Moon, ShieldCheck, Check } from 'lucide-react';

interface MarketingFooterProps {
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const MarketingFooter: React.FC<MarketingFooterProps> = ({ onNavigate, toggleTheme }) => {
  return (
    <footer className="site-footer-main">
      <div className="footer-container">
        {/* Security Banner */}
        <div className="security-bar">
          <div className="security-left">
            <span className="security-text">We protect your data.</span>
            <a className="security-link">Security Overview</a>
          </div>
          <div className="security-right">
            <div className="cert-badge">
              <Check size={14} strokeWidth={3} /> <span>GDPR</span> <span className="cert-gray">Ready</span>
            </div>
            <div className="cert-badge">
              <Check size={14} strokeWidth={3} /> <span>ISO 27001</span> <span className="cert-gray">Certified</span>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-grid">
          {/* Column 1: Company */}
          <div className="footer-column">
            <h6>Company</h6>
            <ul>
              <li><a onClick={() => onNavigate('company/about')}>About Us</a></li>
              <li><a onClick={() => onNavigate('company/careers')}>Careers</a></li>
              <li><a onClick={() => onNavigate('company/ambassadors')}>Ambassadors</a></li>
              <li><a onClick={() => onNavigate('company/media-kit')}>Media Kit</a></li>
            </ul>
          </div>

          {/* Column 2: Product */}
          <div className="footer-column">
            <h6>Product</h6>
            <ul>
              <li><a onClick={() => onNavigate('pricing')}>Pricing</a></li>
              <li><a onClick={() => onNavigate('resources/changelog')}>Changelog</a></li>
              <li><a onClick={() => onNavigate('resources/help')}>Help Center</a></li>
              <li><a onClick={() => onNavigate('resources/status')}>Status</a></li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="footer-column">
            <h6>Industries</h6>
            <ul>
              <li><a onClick={() => onNavigate('solutions/agencies')}>For agencies</a></li>
              <li><a onClick={() => onNavigate('solutions/multi-location')}>Multi-location brands</a></li>
              <li><a onClick={() => onNavigate('solutions/multi-brand')}>Multi-brand companies</a></li>
            </ul>
          </div>

          {/* Column 4: Use Cases */}
          <div className="footer-column">
            <h6>Use Cases</h6>
            <ul>
              <li><a onClick={() => onNavigate('solutions/calendar')}>Multi-channel content calendar</a></li>
              <li><a onClick={() => onNavigate('solutions/workflow')}>Agency workflow management</a></li>
              <li><a onClick={() => onNavigate('solutions/campaign')}>Centralized campaign management</a></li>
              <li><a onClick={() => onNavigate('solutions/collaboration')}>Social media collaboration</a></li>
            </ul>
          </div>

          {/* Column 5: Features */}
          <div className="footer-column">
            <h6>Features</h6>
            <ul>
              <li><a onClick={() => onNavigate('product/create')}>Create</a></li>
              <li><a onClick={() => onNavigate('product/plan')}>Plan</a></li>
              <li><a onClick={() => onNavigate('product/collaborate')}>Collaborate</a></li>
              <li><a onClick={() => onNavigate('product/approve')}>Approve</a></li>
              <li><a onClick={() => onNavigate('product/schedule')}>Schedule</a></li>
              <li><a onClick={() => onNavigate('product/analyze')}>Analyze</a></li>
              <li><a onClick={() => onNavigate('product/engage')}>Engage</a></li>
            </ul>
          </div>

          {/* Column 6: Resources */}
          <div className="footer-column">
            <h6>Resources</h6>
            <ul>
              <li><a onClick={() => onNavigate('resources/blog')}>Blog</a></li>
              <li><a onClick={() => onNavigate('resources/tools')}>Free tools</a></li>
              <li><a onClick={() => onNavigate('resources/freebies')}>Freebies</a></li>
              <li><a onClick={() => onNavigate('resources/profit-report')}>Agency profit margins report</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="copyright-bar">
          <div className="flex items-center gap-6">
             <div className="footer-logo cursor-pointer" onClick={() => onNavigate('landing')}>
                <span className="logo-name text-sm">Auto-CM</span>
             </div>
             <small>© Auto-CM Inc.</small>
             <div className="flex gap-4 ml-4">
                <a onClick={() => onNavigate('terms')} className="hover:text-emerald-500 transition-colors">Terms</a>
                <a onClick={() => onNavigate('privacy')} className="hover:text-emerald-500 transition-colors">Privacy</a>
                <a className="hover:text-emerald-500 transition-colors">Cookies</a>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="social-links">
                <a href="#" aria-label="X (Twitter)"><Twitter size={16} /></a>
                <a href="#" aria-label="GitHub"><Github size={16} /></a>
                <a href="#" aria-label="Discord"><Disc size={16} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
                <Sun size={16} className="sun-icon" />
                <Moon size={16} className="moon-icon" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
