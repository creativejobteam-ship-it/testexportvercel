
import React, { useState } from 'react';
import { Check, CreditCard, Download, ShieldCheck, X } from 'lucide-react';

const Billing: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleUpgrade = (plan: string) => {
      setSelectedPlan(plan);
      setShowCheckout(true);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 relative">
       {showCheckout && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
               <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                   <div className="p-6 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                       <div>
                           <h3 className="font-bold text-gray-900 dark:text-[#ededed]">Upgrade to {selectedPlan}</h3>
                           <p className="text-xs text-gray-500 dark:text-[#888]">Secure checkout powered by Stripe</p>
                       </div>
                       <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20} /></button>
                   </div>
                   <div className="p-6 space-y-4">
                       <div className="p-4 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex gap-3">
                            <ShieldCheck size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-400">14-Day Free Trial</h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-300">You won't be charged until your trial ends.</p>
                            </div>
                       </div>
                       <div>
                           <label className="block text-xs font-semibold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-2">Card Details</label>
                           <div className="border border-gray-300 dark:border-[#333] rounded-md p-3 bg-white dark:bg-[#2a2a2a] flex items-center gap-2">
                               <CreditCard size={16} className="text-gray-400" />
                               <input type="text" placeholder="Card number" className="w-full outline-none text-sm bg-transparent text-gray-900 dark:text-[#ededed]" />
                           </div>
                       </div>
                       <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                           Start Trial
                       </button>
                   </div>
               </div>
           </div>
       )}

       <div className="flex flex-col gap-1 border-b border-gray-200 dark:border-[#282828] pb-6">
        <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Billing & Plans</h2>
        <p className="text-gray-500 dark:text-[#8b9092]">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Starter', 'Pro', 'Agency'].map((plan) => (
              <div key={plan} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm flex flex-col relative">
                  {plan === 'Pro' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-[#ededed] mb-2">{plan}</h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-[#ededed] mb-4">
                      {plan === 'Starter' ? '$0' : plan === 'Pro' ? '$49' : '$199'}
                      <span className="text-sm font-normal text-gray-500 dark:text-[#888]">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                      <li className="flex gap-2 text-sm text-gray-600 dark:text-[#ccc]"><Check size={16} className="text-emerald-500"/> {plan === 'Starter' ? '1 Project' : plan === 'Pro' ? '10 Projects' : 'Unlimited Projects'}</li>
                      <li className="flex gap-2 text-sm text-gray-600 dark:text-[#ccc]"><Check size={16} className="text-emerald-500"/> {plan === 'Starter' ? 'Basic Analytics' : 'Advanced Analytics'}</li>
                      <li className="flex gap-2 text-sm text-gray-600 dark:text-[#ccc]"><Check size={16} className="text-emerald-500"/> {plan === 'Agency' ? 'White-label Reports' : 'Standard Reports'}</li>
                  </ul>
                  <button 
                    onClick={() => handleUpgrade(plan)}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${plan === 'Pro' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#ededed] hover:bg-gray-200 dark:hover:bg-[#333]'}`}
                  >
                      {plan === 'Starter' ? 'Current Plan' : 'Upgrade'}
                  </button>
              </div>
          ))}
      </div>

      <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
          <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Invoices</h3>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-500 dark:text-[#888]">
                      <tr>
                          <th className="p-3 rounded-l-lg">Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 rounded-r-lg text-right">Download</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr className="border-b border-gray-100 dark:border-[#333]">
                          <td className="p-3 text-gray-900 dark:text-[#ededed]">Oct 1, 2023</td>
                          <td className="p-3 text-gray-600 dark:text-[#ccc]">$49.00</td>
                          <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Paid</span></td>
                          <td className="p-3 text-right"><button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default Billing;
