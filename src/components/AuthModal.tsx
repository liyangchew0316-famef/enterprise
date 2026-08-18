import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Flame,
  Crown,
  LogOut,
  ShoppingBag,
  KeyRound,
  BadgePercent,
  Check
} from 'lucide-react';
import { imageConfig } from '../config/assets';

export const AuthModal: React.FC = () => {
  const { 
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isInitialLoginGateOpen,
    loginWithVipPasscode,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout,
    orders,
    setCurrentView
  } = useApp();

  const isOpen = isInitialLoginGateOpen || isAuthModalOpen;
  const isGateMode = !currentUser;

  const [activeTab, setActiveTab] = useState<'vip' | 'signin' | 'signup'>('vip');
  
  // VIP Login Form State (Password only)
  const [vipPasscode, setVipPasscode] = useState('');

  // Standard Sign In / Up Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    // Only allow closing if already logged in!
    if (currentUser) {
      setIsAuthModalOpen(false);
      setErrorMessage('');
    }
  };

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!vipPasscode.trim()) {
      setErrorMessage('Please enter the VIP access password.');
      return;
    }

    setLoading(true);
    const res = await loginWithVipPasscode(vipPasscode);
    if (!res.success) {
      setErrorMessage(res.error || 'Incorrect VIP password. Please check your passcode.');
    }
    setLoading(false);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    if (activeTab === 'signin') {
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your details.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage('Please provide your name.');
        setLoading(false);
        return;
      }
      const res = await signUpWithEmail(email, password, fullName);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register account.');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await loginWithGoogle();
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
    setLoading(false);
  };

  const userOrdersCount = orders.filter(o => 
    currentUser && (o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() || o.userId === currentUser.uid)
  ).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={currentUser ? handleClose : undefined}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Background Banner */}
        <div className="relative bg-gradient-to-br from-[#1a1c1c] via-[#260e12] to-[#af101a] text-white p-6 sm:p-7 text-center">
          {/* Close button: ONLY visible when already logged in */}
          {currentUser && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Studio Brand Icon & Title */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-black border-2 border-red-500/50 p-1 shadow-xl shadow-black/50 mb-3 flex items-center justify-center">
              <img 
                src={imageConfig.logos.header} 
                alt="Cabai Enterprise Logo" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = imageConfig.logos.favicon;
                }}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 text-[11px] font-extrabold tracking-wide uppercase mb-1.5 shadow-xs">
              {currentUser?.role === 'vip' ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Cabai VIP Member</span>
                </>
              ) : currentUser?.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Studio Admin</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                  <span>Cabai Auth Portal</span>
                </>
              )}
            </div>

            <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white">
              {currentUser 
                ? (currentUser.role === 'vip' ? 'VIP Maker Profile' : 'Your Member Profile')
                : 'Authentication Required'}
            </h2>
            <p className="text-xs text-gray-200 mt-1 max-w-xs leading-relaxed">
              {currentUser 
                ? 'Manage your 3D printing orders, slicing parameters, and account.' 
                : 'Please enter the VIP password or log in to access the studio catalog.'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {currentUser ? (
            /* Logged-In User Profile Card */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-4 bg-red-50/80 border border-red-100 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#af101a] text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.role === 'vip' ? 'V' : 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {currentUser.displayName || (currentUser.role === 'vip' ? 'VIP Member' : 'Member')}
                    </h3>
                    {currentUser.role === 'vip' ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#1a1c1c] text-amber-400">
                        <Crown className="w-2.5 h-2.5" />
                        <span>VIP</span>
                      </span>
                    ) : currentUser.role === 'admin' ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-900 text-white">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-800">
                        <User className="w-2.5 h-2.5" />
                        <span>Member</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {currentUser.email || (currentUser.role === 'vip' ? 'VIP Passcode Access' : 'Registered Member')}
                  </p>
                </div>
              </div>

              {/* User Quick Stats & Actions */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-[#af101a]">
                    {userOrdersCount}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Your Orders
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-green-700">
                    Free
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Delivery &gt; RM80
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('order_tracking');
                  }}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-red-400" />
                  <span>View My Orders &amp; Purchases</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                  }}
                  className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Account</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Shopping in Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Auth Login / VIP Gate */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setActiveTab('vip'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'vip' 
                      ? 'bg-gradient-to-r from-[#af101a] to-[#8d0a12] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>VIP Passcode</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'signin' 
                      ? 'bg-white text-[#1a1c1c] shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'signup' 
                      ? 'bg-white text-[#1a1c1c] shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. VIP PASSCODE TAB */}
              {activeTab === 'vip' && (
                <form onSubmit={handleVipSubmit} className="space-y-4">
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-left">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                      <KeyRound className="w-4 h-4 text-amber-700" />
                      <span>VIP Member Password Access</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Enter your authorized VIP passcode to unlock immediate full access to the studio catalog, 3D printing custom lab, and member privileges.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      VIP Access Password <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={vipPasscode}
                        onChange={(e) => setVipPasscode(e.target.value)}
                        placeholder="Enter VIP password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* VIP Unlock Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#af101a] to-[#8d0a12] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Unlock VIP Access &amp; Enter Store</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 2. STANDARD SIGN IN / SIGN UP TABS */}
              {(activeTab === 'signin' || activeTab === 'signup') && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name <span className="text-[#af101a]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Alex Tan"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">
                        Password <span className="text-[#af101a]">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#af101a] hover:bg-[#8d0a12] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{activeTab === 'signin' ? 'Sign In & Enter Store' : 'Create Account & Enter'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Trust Badges */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-3 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>VIP Access System</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>SSL Encrypted</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
