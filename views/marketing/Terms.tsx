import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] font-sans">
      <header className="border-b border-gray-200 dark:border-[#2e2e2e] sticky top-0 bg-white/80 dark:bg-[#1c1c1c]/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg tracking-tight">Terms of Service</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 prose dark:prose-invert">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#3ecf8e]/10 p-3 rounded-lg text-[#3ecf8e]">
                <FileText size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-bold m-0">Terms of Service</h1>
                <p className="text-gray-500 dark:text-[#8b9092] mt-1">Last updated: October 24, 2023</p>
            </div>
        </div>

        <section className="space-y-6 text-gray-700 dark:text-[#8b9092]">
            <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the AutoCommunity AI website and service operated by AutoCommunity Inc.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">1. Acceptance of Terms</h3>
            <p>
                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">2. Accounts</h3>
            <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">3. Intellectual Property</h3>
            <p>
                The Service and its original content, features and functionality are and will remain the exclusive property of AutoCommunity Inc and its licensors.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#ededed]">4. Termination</h3>
            <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
        </section>
      </main>
    </div>
  );
};

export default Terms;