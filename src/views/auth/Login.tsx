
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Zap, Loader2 } from 'lucide-react';

// Custom Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Login: React.FC = () => {
  const { signInWithGoogle, signInDemo, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSigningIn(true);
      // For demo purposes, we trigger the demo login
      try {
          await signInDemo();
      } catch (error) {
          console.error("Login failed", error);
      } finally {
          setIsSigningIn(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2e2e2e] rounded-2xl shadow-xl p-8 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
            <Zap size={32} fill="currentColor" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Auto-CM</h1>
        <p className="text-gray-500 dark:text-[#888] mb-8">
          Sign in to manage your clients and automate your community strategy.
        </p>

        <button 
          onClick={handleLogin}
          disabled={isSigningIn || !!user}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed] border border-gray-300 dark:border-[#383838] px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#333] transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mb-4"
        >
          {isSigningIn ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>{isSigningIn ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#2e2e2e]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#1c1c1c] px-2 text-gray-500">Or continue with email</span>
            </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
            <input 
                type="email" 
                placeholder="demo@autocm.app" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button 
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-70"
            >
                {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
        </form>

        <p className="mt-6 text-xs text-gray-400">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
