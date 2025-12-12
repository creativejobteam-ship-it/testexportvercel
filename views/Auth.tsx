
import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen, Zap, Lock, Loader2, AlertCircle, Server, MonitorPlay } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthProvider';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/lib/firebase';

interface AuthProps {
  onLogin: () => void;
  onSignup?: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  onNavigate?: (page: string) => void;
}

// --- Custom Icons ---

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, toggleTheme, isDarkMode, onNavigate }) => {
  const { signInWithGoogle, signInDemo } = useAuth();
  
  // State
  const [authMode, setAuthMode] = useState<'live' | 'demo'>('live');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validation for Live Mode
    if (authMode === 'live') {
        if (!email.trim()) {
            setError("Please enter a valid email address.");
            setIsProcessing(false);
            return;
        }
        if (!isResetMode && !password) {
            setError("Please enter your password.");
            setIsProcessing(false);
            return;
        }
    }

    try {
        if (authMode === 'demo') {
            // Demo Mode: Direct Access
            await signInDemo();
            if (onLogin) onLogin();
        } else {
            // Live Mode: Firebase Auth
            if (!auth) {
                throw new Error("Firebase is not configured. Please check your API keys or switch to Demo Mode.");
            }

            const cleanEmail = email.trim();

            if (isResetMode) {
                // Password reset logic (placeholder)
                setError("Password reset email sent (simulated).");
            } else if (isSignUp) {
                await createUserWithEmailAndPassword(auth, cleanEmail, password);
                if (onLogin) onLogin();
            } else {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
                if (onLogin) onLogin();
            }
        }
    } catch (err: any) {
        console.error("Authentication error:", err);
        // Map Firebase error codes to user-friendly messages
        if (err.code === 'auth/invalid-email') {
            setError("The email address entered is invalid.");
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError("Invalid email or password.");
        } else if (err.code === 'auth/email-already-in-use') {
            setError("This email is already in use. Please sign in.");
        } else if (err.code === 'auth/weak-password') {
            setError("Password should be at least 6 characters.");
        } else {
            setError(err.message || "Authentication failed.");
        }
    } finally {
        setIsProcessing(false);
    }
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setIsResetMode(false);
    setError(null);
  }

  const handleSocialLogin = async () => {
      setIsProcessing(true);
      setError(null);
      try {
          await signInWithGoogle();
          if (onLogin) onLogin();
      } catch (err: any) {
          setError("Authentication failed. Please try again.");
          console.error(err);
      } finally {
          setIsProcessing(false);
      }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1c1c1c] text-[#ededed]">
      {/* Left Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white dark:bg-[#1c1c1c] border-r border-gray-200 dark:border-[#2e2e2e]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-[#3ecf8e] p-1.5 rounded">
                        <Zap size={20} className="text-[#1c1c1c] fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-[#ededed]">auto-cm</span>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
                    <button
                        onClick={() => { setAuthMode('demo'); setError(null); }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${authMode === 'demo' ? 'bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <MonitorPlay size={14} /> Demo
                    </button>
                    <button
                        onClick={() => { setAuthMode('live'); setError(null); }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${authMode === 'live' ? 'bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <Server size={14} /> Live
                    </button>
                </div>
            </div>
            
            {authMode === 'demo' ? (
                <>
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-[#ededed]">Explore Demo</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-2">No account required. Enter sandbox mode.</p>
                </>
            ) : isResetMode ? (
                <>
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-[#ededed]">Reset Password</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-2">Enter your email to receive a reset link</p>
                </>
            ) : isSignUp ? (
                <>
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-[#ededed]">Get started</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-2">Create a new account</p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-[#ededed]">Welcome back</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-2">Sign in to your account</p>
                </>
            )}
          </div>

          {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-100">
                  <AlertCircle size={16} /> {error}
              </div>
          )}

          {authMode === 'demo' ? (
              // DEMO MODE UI
              <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-sm text-emerald-800 dark:text-emerald-400">
                      <p className="font-medium mb-1">You are entering Demo Mode.</p>
                      <p className="opacity-90">Changes will be local and temporary. Perfect for testing features without connecting a real database.</p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full bg-[#3ecf8e] text-white font-medium py-3 rounded-lg hover:bg-[#34b27b] transition-colors shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <MonitorPlay size={18} />}
                    Enter Dashboard Directly
                  </button>
              </div>
          ) : (
              // LIVE MODE UI
              <>
                {!isResetMode && (
                    <div className="space-y-3">
                    <button 
                        onClick={handleSocialLogin}
                        disabled={isProcessing}
                        className="relative w-full flex items-center justify-center gap-3 bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-300 dark:border-[#383838] px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all group font-medium disabled:opacity-70"
                    >
                        {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <GoogleIcon />}
                        <span>{isProcessing ? 'Connecting...' : 'Continue with Google'}</span>
                        {!isProcessing && (
                            <div className="absolute -top-3 -right-2 bg-[#3ecf8e] text-[#1c1c1c] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-[#232323]">
                                Recommended
                            </div>
                        )}
                    </button>
                    </div>
                )}

                {!isResetMode && (
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-[#2e2e2e]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-[#1c1c1c] text-gray-500 dark:text-[#8b9092]">or</span>
                        </div>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none transition-all placeholder-gray-400"
                            />
                        </div>
                    )}
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed] mb-1.5">Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none transition-all placeholder-gray-400"
                    />
                    </div>
                    
                    {!isResetMode && (
                        <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#ededed]">Password</label>
                            {!isSignUp && (
                                <button type="button" onClick={() => setIsResetMode(true)} className="text-sm text-[#3ecf8e] hover:text-[#34b27b] hover:underline">
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#232323] text-gray-900 dark:text-[#ededed] focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] outline-none transition-all placeholder-gray-400"
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        </div>
                    )}

                    <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#3ecf8e] text-white font-medium py-2.5 rounded-lg hover:bg-[#34b27b] transition-colors shadow-lg shadow-[#3ecf8e]/20 mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                    {isProcessing && <Loader2 size={18} className="animate-spin" />}
                    {isResetMode ? 'Send Reset Instructions' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    {isResetMode ? (
                        <button type="button" onClick={() => setIsResetMode(false)} className="text-[#3ecf8e] hover:underline">
                            Back to Sign In
                        </button>
                    ) : isSignUp ? (
                        <p className="text-gray-500 dark:text-[#8b9092]">
                        Already have an account?{' '}
                        <button onClick={handleToggleSignUp} className="text-[#3ecf8e] hover:underline font-medium">
                            Sign In
                        </button>
                        </p>
                    ) : (
                        <p className="text-gray-500 dark:text-[#8b9092]">
                        Don't have an account?{' '}
                        <button onClick={handleToggleSignUp} className="text-[#3ecf8e] hover:underline font-medium">
                            Sign Up Now
                        </button>
                        </p>
                    )}
                </div>
              </>
          )}
          
          <div className="pt-8 mt-8 border-t border-gray-100 dark:border-[#2e2e2e] text-xs text-gray-400 text-center">
            <p className="mb-2">
                Need help? Visit our <button onClick={() => onNavigate?.('documentation')} className="underline hover:text-gray-600 dark:hover:text-gray-300">Documentation</button>.
            </p>
            <p>
                By continuing, you agree to Auto-CM's <button onClick={() => onNavigate?.('terms')} className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</button> and <button onClick={() => onNavigate?.('privacy')} className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</button>.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Testimonial */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-[#f8f9fa] dark:bg-[#111] p-12 relative overflow-hidden">
         {/* Background accent */}
         <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
             <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         </div>

         <div className="absolute top-8 right-8">
             <button onClick={() => onNavigate?.('documentation')} className="flex items-center gap-2 text-gray-600 dark:text-[#8b9092] hover:text-gray-900 dark:hover:text-[#ededed] bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
                 <BookOpen size={16} /> Documentation
             </button>
         </div>

         <div className="max-w-md relative z-10">
             <div className="text-6xl text-gray-200 dark:text-[#333] font-serif mb-4">“</div>
             <h3 className="text-2xl font-medium text-gray-900 dark:text-[#ededed] leading-relaxed mb-8">
                 This community is STRONG and will continue to be the reason why developers flock to @autocm over an alternative.
             </h3>
             <div className="flex items-center gap-4">
                 <img src="https://picsum.photos/seed/wilhelm/100/100" className="w-12 h-12 rounded-full border-2 border-white dark:border-[#333] shadow-sm" alt="User" />
                 <div>
                     <p className="font-semibold text-gray-900 dark:text-[#ededed]">Wilhelm K.</p>
                     <p className="text-sm text-gray-500 dark:text-[#8b9092]">@_wilhelm__</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;
