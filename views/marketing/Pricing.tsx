
import React, { useState } from 'react';
import MarketingLayout from './MarketingLayout';
import { Check, Minus, ChevronDown, ChevronUp } from 'lucide-react';

interface PricingProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStart, onNavigate, toggleTheme }) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const plans = [
    {
      name: 'Basic',
      description: 'Creative personal sites',
      price: billing === 'monthly' ? '$15' : '$10',
      period: billing === 'monthly' ? 'per month' : 'per month, billed annually',
      features: [
        'Connect your own domain',
        'AI-powered design tools',
        'Fast and secure hosting',
        'Built-in SEO'
      ],
      button: 'Start with Basic',
      highlight: false
    },
    {
      name: 'Pro',
      description: 'Growing professional sites',
      price: billing === 'monthly' ? '$39' : '$30',
      period: billing === 'monthly' ? 'per month' : 'per month, billed annually',
      features: [
        'Everything from Basic, plus:',
        'Staging and instant rollback',
        'Roles and permissions',
        'Relational CMS',
        'Site redirects',
        'Multiple locales (add-on)'
      ],
      button: 'Start with Pro',
      highlight: true
    },
    {
      name: 'Scale',
      description: 'Advanced, high-traffic sites',
      price: billing === 'monthly' ? '$120' : '$100',
      period: billing === 'monthly' ? 'per month' : 'per month, billed annually',
      features: [
        'Everything from Pro, plus:',
        'Custom locale regions',
        'Events and funnels',
        'Priority support',
        'Premium CDN',
        'Flexible limits',
        'A/B testing (add-on)',
        'Custom proxy setup (add-on)'
      ],
      button: 'Start with Scale',
      highlight: false
    }
  ];

  const tableRows = [
    { category: 'Custom domain', basic: true, pro: true, scale: true, note: 'Connect your own domain' },
    { category: 'Limits', basic: 'Fixed', pro: 'Fixed', scale: 'Flexible', note: 'Scale with usage' },
    { category: 'Site pages', basic: '30', pro: '150', scale: '300', note: 'Create custom designed pages' },
    { category: 'CMS collections', basic: '1', pro: '10', scale: '20', note: 'Store content in CMS collections' },
    { category: 'CMS items', basic: '1,000', pro: '2,500', scale: '10,000', note: 'Add CMS items to your collections' },
    { category: 'Bandwidth usage', basic: '10 GB', pro: '100 GB', scale: '200 GB', note: 'Monthly bandwidth with overage alerts' },
    { category: 'Hosting', basic: '20 locations', pro: '20 locations', scale: '300+ locations', note: 'Global content delivery network' },
    { category: 'Password protect', basic: true, pro: true, scale: true, note: 'Protect your site with a password' },
    { category: 'Site search', basic: true, pro: true, scale: true, note: 'Find anything on your site instantly' },
    { category: 'Site redirects', basic: false, pro: true, scale: true, note: 'Add redirects to maintain SEO' },
    { category: 'Staging environment', basic: false, pro: true, scale: true, note: 'Test changes before publishing' },
    { category: 'Advanced analytics', basic: false, pro: false, scale: true, note: 'Events, funnels, and extended history' },
  ];

  const collaborationRows = [
    { category: 'Workspace owner', basic: 'Free', pro: 'Free', scale: 'Free', note: 'One user who manages billing' },
    { category: 'Additional editors', basic: '$20 per editor', pro: '$40 per editor', scale: '$40 per editor', note: 'Design, edit content, and publish' },
    { category: 'Seats', basic: '2', pro: '10', scale: '10', note: 'The maximum number of users' },
    { category: 'Expert access', basic: true, pro: true, scale: true, note: 'Pro Experts get free edit access' },
    { category: 'Roles and permissions', basic: false, pro: true, scale: true, note: 'Manage who can view, edit, or publish' },
  ];

  const faqItems = [
      { q: "What's included in the Free plan?", a: "Projects on the Free plan include access to 10 CMS collections, 1,000 pages, 5 MB file uploads, and one free locale to try. This makes it easy to explore Framer, use it as a design tool, or create templates. To connect a custom domain, you'll need to upgrade to a paid plan. Workspaces without a subscription also support collaboration with up to three editors." },
      { q: "Which plan is right for me?", a: "Our Free plan is ideal for non-commercial use. The Basic plan caters to students, freelancers, and small studios. The Pro and Scale plans are designed for teams at agencies, startups, and scale-ups who run their full marketing stack on Framer. The Enterprise plan is tailored towards teams that need custom limits, annual billing, and dedicated support." },
      { q: "How are extra editors billed?", a: "Editors are billed per editor per month and can be added to your workspace or projects at any time. We will notify you when an editor is added to your billing, and you won't be charged until the next renewal date of your monthly billing cycle." },
      { q: "What happens if I go over a limit?", a: "When you reach certain limits, we will ask you to upgrade your plan. For other limits, like bandwidth, we allow you to exceed your limit for one month. You'll receive a notification via email so you can upgrade your plan accordingly." }
  ];

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#ededed] transition-colors duration-300">
        
        {/* Header */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Pricing</h1>
            <p className="text-xl text-gray-500 dark:text-[#888] mb-12">
                Design for free. Upgrade to unlock more features.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8 relative z-20">
                <div className="bg-gray-100 dark:bg-[#232323] p-1 rounded-lg inline-flex items-center relative shadow-sm">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all relative z-10 ${
                            billing === 'monthly'
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 relative z-10 ${
                            billing === 'yearly'
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Yearly
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                            -20%
                        </span>
                    </button>
                </div>
            </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 mb-24 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.name} className={`bg-white dark:bg-[#1c1c1c] border ${plan.highlight ? 'border-[#3ecf8e] ring-1 ring-[#3ecf8e]' : 'border-gray-200 dark:border-[#282828]'} rounded-xl p-8 flex flex-col relative shadow-sm hover:shadow-lg transition-shadow`}>
                        {plan.highlight && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-[10px] font-bold text-[#3ecf8e] border border-[#3ecf8e] px-2 py-0.5 rounded uppercase">POPULAR</span>
                            </div>
                        )}

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-[#888] mb-6">{plan.description}</p>
                        
                        <div className="mb-8">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                            <span className="text-sm text-gray-500 dark:text-[#888] ml-2">{plan.period}</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-[#ccc]">
                                    {feature.includes('Everything') ? (
                                        <span className="text-gray-500 dark:text-[#888] font-medium">{feature}</span>
                                    ) : (
                                        <>
                                            <div className="mt-0.5"><Check size={14} className={`${feature.includes('add-on') ? "text-gray-400" : "text-gray-900 dark:text-white"}`} /></div>
                                            <span className={feature.includes('add-on') ? "text-gray-500" : ""}>{feature}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={onStart}
                            className={`w-full py-2.5 rounded-md text-sm font-medium transition-all ${
                                plan.highlight 
                                ? 'bg-[#3ecf8e] text-[#121212] hover:bg-[#34b27b] shadow-md shadow-[#3ecf8e]/20' 
                                : 'bg-gray-900 text-white dark:bg-[#333] dark:text-white dark:border dark:border-[#444] hover:opacity-90'
                            }`}
                        >
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {/* Enterprise Banner */}
        <section className="px-6 mb-24">
            <div className="max-w-7xl mx-auto bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Enterprise <span className="font-normal text-gray-500 dark:text-[#888]">For teams that need custom limits, enterprise security, and dedicated support.</span></h3>
                </div>
                <button className="px-6 py-2 bg-white dark:bg-[#282828] text-gray-900 dark:text-white border border-gray-200 dark:border-[#333] rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors shadow-sm">
                    Request trial
                </button>
            </div>
        </section>

        {/* Logos */}
        <section className="px-6 mb-32">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 text-gray-900 dark:text-white">
                {['BIRD', 'SPACEX', 'IIElevenLabs', 'Dribbble', 'Miro', 'Perplexity', 'DOORDASH', 'mixpanel'].map(brand => (
                    <span key={brand} className="text-xl font-bold uppercase">{brand}</span>
                ))}
            </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 mb-32">
            <div className="max-w-7xl mx-auto">
                <div className="border border-gray-200 dark:border-[#282828] rounded-xl bg-white dark:bg-[#1c1c1c] relative isolate">
                    
                    {/* Sticky Header Row */}
                    <div className="grid grid-cols-4 border-b border-gray-200 dark:border-[#282828] bg-white dark:bg-[#1c1c1c] sticky top-[64px] z-30 shadow-sm rounded-t-xl">
                        <div className="p-6"></div>
                        <div className="p-6 text-center text-sm font-medium text-gray-900 dark:text-white">
                            Basic <span className="text-gray-500 dark:text-[#888] ml-2 block sm:inline">{billing === 'monthly' ? '$15' : '$10'}</span>
                        </div>
                        <div className="p-6 text-center text-sm font-medium text-gray-900 dark:text-white">
                            Pro <span className="text-gray-500 dark:text-[#888] ml-2 block sm:inline">{billing === 'monthly' ? '$39' : '$30'}</span>
                        </div>
                        <div className="p-6 text-center text-sm font-medium text-gray-900 dark:text-white">
                            Scale <span className="text-gray-500 dark:text-[#888] ml-2 block sm:inline">{billing === 'monthly' ? '$120' : '$100'}</span>
                        </div>
                    </div>

                    {/* Feature Rows */}
                    {tableRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-4 border-b border-gray-200 dark:border-[#282828] hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors group">
                            <div className="p-6 border-r border-gray-200 dark:border-[#282828]">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{row.category}</div>
                                <div className="text-xs text-gray-500 dark:text-[#666] mt-1 group-hover:text-gray-700 dark:group-hover:text-[#888] transition-colors">{row.note}</div>
                            </div>
                            <div className="p-6 flex items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc]">
                                {row.basic === true ? <Check size={16} className="text-gray-900 dark:text-white"/> : row.basic === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.basic}
                            </div>
                            <div className="p-6 flex items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc]">
                                {row.pro === true ? <Check size={16} className="text-emerald-500 dark:text-white"/> : row.pro === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.pro}
                            </div>
                            <div className="p-6 flex items-center justify-center text-sm text-gray-700 dark:text-[#ccc]">
                                {row.scale === true ? <Check size={16} className="text-emerald-500 dark:text-white"/> : row.scale === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.scale}
                            </div>
                        </div>
                    ))}

                    {/* Collaboration Section Header */}
                    <div className="p-8 bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-[#282828]">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Live collaboration</h3>
                        <p className="text-sm text-gray-500 dark:text-[#888]">Invite your team to collaborate on design, content, and publishing.</p>
                    </div>

                    {/* Collaboration Rows */}
                    {collaborationRows.map((row, i) => (
                        <div key={`collab-${i}`} className="grid grid-cols-4 border-b border-gray-200 dark:border-[#282828] hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors group">
                            <div className="p-6 border-r border-gray-200 dark:border-[#282828]">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{row.category}</div>
                                <div className="text-xs text-gray-500 dark:text-[#666] mt-1 group-hover:text-gray-700 dark:group-hover:text-[#888] transition-colors">{row.note}</div>
                            </div>
                            <div className="p-6 flex items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc]">
                                {row.basic === true ? <Check size={16} className="text-gray-900 dark:text-white"/> : row.basic === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.basic}
                            </div>
                            <div className="p-6 flex items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc]">
                                {row.pro === true ? <Check size={16} className="text-emerald-500 dark:text-white"/> : row.pro === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.pro}
                            </div>
                            <div className="p-6 flex items-center justify-center text-sm text-gray-700 dark:text-[#ccc]">
                                {row.scale === true ? <Check size={16} className="text-emerald-500 dark:text-white"/> : row.scale === false ? <Minus size={16} className="text-gray-300 dark:text-[#333]"/> : row.scale}
                            </div>
                        </div>
                    ))}

                    {/* Add-ons Section */}
                    <div className="p-8 bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-[#282828]">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Add-ons</h3>
                        <p className="text-sm text-gray-500 dark:text-[#888]">From localizing your site to running multiple A/B-tests, power up your site with add-ons.</p>
                    </div>

                    <div className="grid grid-cols-4 border-b border-gray-200 dark:border-[#282828] hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors">
                        <div className="p-6 border-r border-gray-200 dark:border-[#282828]">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Translation locales</div>
                            <div className="text-xs text-gray-500 dark:text-[#666] mt-1">Translate your site into multiple languages</div>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc] text-center">
                            <span>Up to 2</span>
                            <span className="text-[10px] text-gray-500 dark:text-[#666]">$20 per locale</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center border-r border-gray-200 dark:border-[#282828] text-sm text-gray-700 dark:text-[#ccc] text-center">
                            <span>Up to 10</span>
                            <span className="text-[10px] text-gray-500 dark:text-[#666]">$20 per locale</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-sm text-gray-700 dark:text-[#ccc] text-center">
                            <span>Up to 20</span>
                            <span className="text-[10px] text-gray-500 dark:text-[#666]">$20 per locale</span>
                        </div>
                    </div>

                    {/* Table Footer */}
                    <div className="grid grid-cols-4 bg-gray-50 dark:bg-[#111] p-6 rounded-b-xl">
                        <div></div>
                        <div className="text-center">
                            <button className="px-4 py-2 bg-white dark:bg-[#282828] text-gray-900 dark:text-white text-xs font-medium rounded border border-gray-300 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#333]">Start with Basic</button>
                        </div>
                        <div className="text-center">
                            <button className="px-4 py-2 bg-[#3ecf8e] text-[#121212] text-xs font-medium rounded hover:bg-[#34b27b] shadow-sm shadow-emerald-500/20">Start with Pro</button>
                        </div>
                        <div className="text-center">
                            <button className="px-4 py-2 bg-gray-900 dark:bg-[#282828] text-white text-xs font-medium rounded border border-gray-900 dark:border-[#333] hover:opacity-90">Start with Scale</button>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-8 text-xs text-gray-500 dark:text-[#666]">
                    All prices are monthly and billed according to the billing cycle selected at checkout.<br/>
                    Any applicable sales tax will be added at checkout based on your location.
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 mb-32">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">FAQ</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqItems.map((item, i) => (
                    <div key={i} className="border border-gray-200 dark:border-[#282828] rounded-xl bg-white dark:bg-[#1c1c1c] overflow-hidden transition-all duration-200">
                        <button 
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors"
                        >
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.q}</h4>
                            {openFaqIndex === i ? (
                                <ChevronUp className="text-gray-500 dark:text-[#888]" size={20} />
                            ) : (
                                <ChevronDown className="text-gray-500 dark:text-[#888]" size={20} />
                            )}
                        </button>
                        <div 
                            className={`px-6 text-gray-600 dark:text-[#a1a1a1] transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        >
                            <p className="text-sm leading-relaxed">{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </MarketingLayout>
  );
};

export default Pricing;
