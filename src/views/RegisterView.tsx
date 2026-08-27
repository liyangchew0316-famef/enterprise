import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Circle, Chrome, Github, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from 'firebase/auth';
import { saveUserToFirestore } from '../lib/firestoreService';
import { UserProfile } from '../types';
import imgWorkshopBg from '../assets/images/cabai_3d_workshop_bg_1787834261436.jpg';

// ==================================================
// REUSABLE SUB-COMPONENTS
// ==================================================

export interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

export const StepItem: React.FC<StepItemProps> = ({ number, text, active = false }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        active
          ? 'bg-white text-black border border-white'
          : 'bg-[#1A1A1A] text-white border-none'
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
          active
            ? 'bg-black text-white'
            : 'bg-white/10 text-white/40'
        }`}
      >
        {number}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2.5 h-12 bg-black border border-white/10 rounded-xl hover:bg-white/5 text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full px-3"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
};

export interface InputGroupProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  name,
  error,
  autoComplete,
  required = false
}) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full bg-[#1A1A1A] rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 text-sm transition-all ${
          error ? 'border border-red-500/50 focus:ring-red-500/30' : 'border-none focus:ring-white/20'
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name = 'password',
  error,
  hint,
  autoComplete = 'new-password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-[#1A1A1A] rounded-xl h-11 pl-4 pr-11 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 text-sm transition-all ${
            error ? 'border border-red-500/50 focus:ring-red-500/30' : 'border-none focus:ring-white/20'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-xs text-white/30">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

// ==================================================
// MAIN REGISTER VIEW
// ==================================================

export const RegisterView: React.FC = () => {
  const { setCurrentView, setIsAuthModalOpen, currentUser } = useApp();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Validation State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Cabai Enterprise — Create Account';
  }, []);

  // Animation variants
  const leftContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const leftChildVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Requires at least 8 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const displayName = `${cleanFirstName} ${cleanLastName}`;

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 2. Update Auth display name
      try {
        await updateProfile(user, { displayName });
      } catch (err) {
        console.warn('Profile update note:', err);
      }

      // 3. Save basic customer profile to Firestore (WITHOUT password)
      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        displayName: displayName,
        photoURL: null,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'email_password',
        createdAt: now,
        signedUpAt: now
      });

      // Save active profile to localStorage for quick hydration
      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      // 4. Redirect to customer dashboard/home
      setCurrentView('home');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setFormError('An account with this email address already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setFieldErrors(prev => ({ ...prev, password: 'Password is too weak. Requires at least 8 characters.' }));
      } else if (err.code === 'auth/invalid-email') {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      } else {
        setFormError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const names = (user.displayName || '').split(' ');
      const gFirstName = names[0] || 'Maker';
      const gLastName = names.slice(1).join(' ') || '';

      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: gFirstName,
        lastName: gLastName,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Maker',
        photoURL: user.photoURL,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'google',
        createdAt: now,
        signedUpAt: now
      });

      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      setCurrentView('home');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled popup, do nothing
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setFormError('Google sign-in is not enabled in Firebase Console. Please register with Email.');
      } else {
        setFormError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setFormError('');
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const names = (user.displayName || '').split(' ');
      const ghFirstName = names[0] || 'Maker';
      const ghLastName = names.slice(1).join(' ') || '';

      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: ghFirstName,
        lastName: ghLastName,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Maker',
        photoURL: user.photoURL,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'github',
        createdAt: now,
        signedUpAt: now
      });

      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      setCurrentView('home');
    } catch (err: any) {
      console.error('GitHub Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // Cancelled
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setFormError('GitHub sign-in is not configured in Firebase. Please use Google or Email registration.');
      } else {
        setFormError(err.message || 'GitHub sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setCurrentView('home');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 font-sans text-white">
      {/* Back to Store Navigation (Mobile & Desktop Accessible) */}
      <button
        onClick={() => setCurrentView('home')}
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
        title="Back to Cabai Enterprise Catalog"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Explore Creations</span>
      </button>

      {/* LEFT: Brand / visual section (Desktop only) */}
      <div className="hidden lg:flex w-[52%] relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
        {/* Background Visual (No heavy dark overlay, clean and premium) */}
        <img
          src={imgWorkshopBg}
          alt="Cabai Enterprise 3D Printing Studio"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Visual content sits above background */}
        <motion.div
          variants={leftContainerVariants}
          initial="initial"
          animate="animate"
          className="z-10 w-full max-w-xs space-y-8 text-center"
        >
          {/* Hero Heading & Description */}
          <motion.div variants={leftChildVariants} className="space-y-2">
            <h2 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white">
              Create with Cabai
            </h2>
            <p className="text-white/60 text-sm leading-relaxed px-4">
              Explore creative 3D printed products and bring your ideas to life.
            </p>
          </motion.div>

          {/* Registration Steps */}
          <motion.div variants={leftChildVariants} className="space-y-2.5">
            <StepItem number={1} text="Create your account" active={true} />
            <StepItem number={2} text="Explore our creations" active={false} />
            <StepItem number={3} text="Start creating" active={false} />
          </motion.div>

          {/* Cabai Branding Row */}
          <motion.div variants={leftChildVariants} className="pt-2 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <Circle className="w-3.5 h-3.5 fill-white text-white" />
              <span className="text-xl font-semibold tracking-tight text-white">
                Cabai Enterprise
              </span>
            </div>
            <p className="text-white/60 text-sm mt-0.5">Build. Print. Create.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT: Registration form */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10 my-auto"
        >
          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-3xl font-medium tracking-tight text-white">
              Create Your Cabai Account
            </h1>
            <p className="text-white/40 text-sm">
              Join Cabai Enterprise and start exploring our 3D printed creations.
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={<Chrome className="w-4 h-4 text-white" />}
              label="Continue with Google"
              onClick={handleGoogleSignIn}
              disabled={loading}
            />
            <SocialButton
              icon={<Github className="w-4 h-4 text-white" />}
              label="Continue with GitHub"
              onClick={handleGithubSignIn}
              disabled={loading}
            />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest">
              Or
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-left" noValidate>
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                {formError}
              </div>
            )}

            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="First Name"
                placeholder="First name"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: '' }));
                }}
                autoComplete="given-name"
                error={fieldErrors.firstName}
                required
              />
              <InputGroup
                label="Last Name"
                placeholder="Last name"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: '' }));
                }}
                autoComplete="family-name"
                error={fieldErrors.lastName}
                required
              />
            </div>

            {/* Row 2: Email Address */}
            <InputGroup
              label="Email Address"
              placeholder="you@example.com"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              autoComplete="email"
              error={fieldErrors.email}
              required
            />

            {/* Row 3: Password */}
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
              }}
              hint="Requires at least 8 characters."
              autoComplete="new-password"
              error={fieldErrors.password}
            />

            {/* Row 4: Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
            />

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Footer */}
          <div className="text-center pt-2">
            <p className="text-white/60 text-sm">
              Already a member?{' '}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-white font-medium hover:underline hover:text-white/90 transition-all cursor-pointer inline-block ml-1"
              >
                Log in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
