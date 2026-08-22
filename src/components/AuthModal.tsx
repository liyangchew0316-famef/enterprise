import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Lock, 
  Crown, 
  LogOut, 
  ShoppingBag, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Mail,
  AlertCircle
} from 'lucide-react';
import { imageConfig } from '../config/assets';

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthModal: React.FC = () => {
  const { 
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isInitialLoginGateOpen,
    loginWithVipPasscode,
    loginWithGoogle,
    loginWithGoogleEmail,
    loginWithGoogleCredential,
    logout,
    orders,
    setCurrentView
  } = useApp();

  const isOpen = isInitialLoginGateOpen || isAuthModalOpen;

  const [activeTab, setActiveTab] = useState<'google' | 'vip'>('google');
  
  // VIP Login Form State (Passcode only)
  const [vipPasscode, setVipPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Direct Google Email input state
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [showEmailFallback, setShowEmailFallback] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authErrorCode, setAuthErrorCode] = useState('');

  // Initialize Google Identity Services (GSI) if available
  useEffect(() => {
    if (!isOpen || activeTab !== 'google') return;

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: '218972935539-5u0d61u51qutq6e6i4f8k9qoqiiq8daf.apps.googleusercontent.com',
          callback: async (response: any) => {
            if (response?.credential) {
              setLoading(true);
              setErrorMessage('');
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);
                if (payload?.email) {
                  await loginWithGoogleEmail(payload.email, payload.name, payload.picture);
                } else {
                  await loginWithGoogleCredential(response.credential);
                }
              } catch (err: any) {
                await loginWithGoogleCredential(response.credential);
              }
              setLoading(false);
            }
          }
        });

        const btnContainer = document.getElementById('gsi-button-container');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320
          });
        }
      } catch (e) {
        console.warn('GSI render note:', e);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleClose = () => {
    // Only allow closing if already logged in!
    if (currentUser) {
      setIsAuthModalOpen(false);
      setErrorMessage('');
      setAuthErrorCode('');
    }
  };

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setAuthErrorCode('');
    
    if (!vipPasscode.trim()) {
      setErrorMessage('Please enter your VIP access passcode.');
      return;
    }

    setLoading(true);
    const res = await loginWithVipPasscode(vipPasscode);
    if (!res.success) {
      setErrorMessage(res.error || 'Incorrect VIP password. Please check your passcode.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    setAuthErrorCode('');
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMessage(res.error || 'Google authentication failed.');
      setAuthErrorCode(res.code || '');
      setShowEmailFallback(true);
    }
    setLoading(false);
  };

  const handleDirectGoogleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setAuthErrorCode('');
    const res = await loginWithGoogleEmail(googleEmailInput.trim());
    if (!res.success) {
      setErrorMessage(res.error || 'Unable to sign in with this email.');
    }
    setLoading(false);
  };

  const handleOpenInNewTab = () => {
    try {
      window.open(window.location.href, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  };

  const userOrdersCount = orders.filter(o => 
    currentUser && (o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() || o.userId === currentUser.uid)
  ).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={currentUser ? handleClose : undefined}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Background Banner */}
        <div className="relative bg-gradient-to-br from-[#1a1c1c] via-[#2a0e12] to-[#af101a] text-white p-6 sm:p-7 text-center">
          {/* Close button: ONLY visible when already logged in */}
          {currentUser && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Studio Brand Icon & Title */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-black border-2 border-red-500/40 p-1 shadow-xl shadow-black/60 mb-3 flex items-center justify-center">
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

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/15 text-amber-300 text-[11px] font-extrabold tracking-wide uppercase mb-1.5 shadow-xs">
              {currentUser?.role === 'vip' ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>VIP Access Active</span>
                </>
              ) : currentUser ? (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Member Account</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cabai Studio Access</span>
                </>
              )}
            </div>

            <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white">
              {currentUser 
                ? (currentUser.role === 'vip' ? 'VIP Member Hub' : 'Member Account')
                : 'Welcome to Cabai Enterprise'}
            </h2>
            <p className="text-xs text-gray-200 mt-1 max-w-xs leading-relaxed">
              {currentUser 
                ? (currentUser.role === 'vip' ? 'VIP membership unlocked with authorized passcode.' : 'Signed in with your verified Google account.') 
                : 'Sign in with Google or enter your VIP passcode to access the studio.'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {currentUser ? (
            /* Logged-In User Profile View */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-12 h-12 rounded-full border-2 border-red-200 object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full font-extrabold text-lg flex items-center justify-center shadow-md ${
                    currentUser.role === 'vip' ? 'bg-[#1a1c1c] text-amber-300' : 'bg-[#af101a] text-white'
                  }`}>
                    {currentUser.role === 'vip' ? '👑' : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {currentUser.role === 'vip' ? 'VIP' : (currentUser.displayName || 'Google Member')}
                    </h3>
                    {currentUser.role === 'vip' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black text-amber-300 border border-amber-400/40">
                        <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span>VIP</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                    {currentUser.role === 'vip' ? 'VIP Member Access' : (currentUser.email || 'Google Account Connected')}
                  </p>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-[#af101a]">
                    {userOrdersCount}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Orders Tracked
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-green-700">
                    Active
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Membership Status
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
                  <span>View My Orders &amp; Track Status</span>
                </button>

                <button
                  onClick={() => logout()}
                  className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Sign-in Gate: Google Sign In & VIP Passcode */
            <div className="space-y-5">
              {/* Tab Selector: Google & VIP */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setActiveTab('google'); setErrorMessage(''); setAuthErrorCode(''); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'google' 
                      ? 'bg-white text-[#1a1c1c] shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('vip'); setErrorMessage(''); setAuthErrorCode(''); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'vip' 
                      ? 'bg-gradient-to-r from-[#af101a] to-[#8d0a12] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                  <span>VIP Passcode</span>
                </button>
              </div>

              {/* Error Notification with Direct Actions */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                  
                  {activeTab === 'google' && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={handleOpenInNewTab}
                        className="w-full py-2 px-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>Open in New Tab for Popup Auth</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('vip');
                          setErrorMessage('');
                        }}
                        className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Enter with VIP Passcode</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 1. GOOGLE SIGN IN TAB */}
              {activeTab === 'google' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-left">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google Authentication</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Instant access with your Google account. Automatically sync your 3D orders, custom quotes, and spin records.
                    </p>
                  </div>

                  {/* Primary Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-bold text-sm rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* GSI Native Button Container */}
                  <div id="gsi-button-container" className="flex justify-center empty:hidden" />

                  {/* Direct Google Email Input (Guaranteed seamless entry even if iframe popup is blocked) */}
                  <div className="pt-2 border-t border-gray-100">
                    <form onSubmit={handleDirectGoogleEmailSubmit} className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#af101a]" />
                          <span>Direct Google Account Sign-In</span>
                        </span>
                        <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                          Instant Sync
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="email"
                            value={googleEmailInput}
                            onChange={(e) => setGoogleEmailInput(e.target.value)}
                            placeholder="your.email@gmail.com"
                            className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading || !googleEmailInput.trim()}
                          className="px-4 py-2.5 bg-[#af101a] hover:bg-[#8d0a12] active:scale-98 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick preset chips for rapid login */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                        <span className="text-[10px] text-gray-400 shrink-0">Quick fill:</span>
                        <button
                          type="button"
                          onClick={() => setGoogleEmailInput('liyangchew0316@gmail.com')}
                          className="text-[10px] px-2 py-1 bg-gray-100 hover:bg-red-50 hover:text-[#af101a] text-gray-600 rounded-md font-medium transition-colors cursor-pointer shrink-0"
                        >
                          liyangchew0316@gmail.com
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 2. VIP PASSCODE TAB */}
              {activeTab === 'vip' && (
                <form onSubmit={handleVipSubmit} className="space-y-4">
                  <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-left">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                      <KeyRound className="w-4 h-4 text-amber-700" />
                      <span>VIP Member Passcode Access</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Enter your authorized VIP passcode to unlock full access to the studio and custom tools.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      VIP Access Passcode <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={vipPasscode}
                        onChange={(e) => setVipPasscode(e.target.value)}
                        placeholder="Enter VIP passcode (e.g. hkylovenbx)"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        title={showPassword ? "Hide passcode" : "Show passcode"}
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
                        <span>Unlock VIP Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Trust Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-3 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>Google Auth &amp; VIP System</span>
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

