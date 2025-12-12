import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] font-sans">
      <header className="border-b border-gray-200 dark:border-[#2e2e2e] sticky top-0 bg-white/80 dark:bg-[#1c1c1c]/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg tracking-tight">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 prose dark:prose-invert">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#3ecf8e]/10 p-3 rounded-lg text-[#3ecf8e]">
                <Shield size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-bold m-0">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Last updated: October 24, 2023</p>
            </div>
        </div>

        <section className="space-y-6 text-gray-700 dark:text-[#8b9092]">
            <p>
                Your privacy is important to us. It is AutoCommunity's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">1. Information We Collect</h3>
            <p>
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">2. Usage of Data</h3>
            <p>
                We use the data we collect to operate and improve our services, including AI model training to better moderate your communities. We do not sell your data to third parties.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">3. Data Storage</h3>
            <p>
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">4. Third-Party Links</h3>
            <p>
                Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;