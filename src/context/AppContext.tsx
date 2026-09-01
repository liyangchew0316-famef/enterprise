import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderItem,
  OrderStatus, 
  PaymentStatus,
  PaymentMethod,
  MaterialSpool, 
  ViewMode, 
  ProductCategory, 
  ColorOption, 
  MaterialType,
  CustomPrintQuote,
  CustomerInfo,
  UserProfile
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SPOOLS, DEFAULT_COLORS } from '../data/mockData';
import { normalizeProducts, normalizeProduct } from '../utils/imageHelper';
import {
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  updatePaymentStatusInFirestore,
  saveSpoolToFirestore,
  updateSpoolStockInFirestore,
  saveProductToFirestore,
  subscribeToProducts,
  seedFirestoreInitialData,
  saveUserToFirestore,
  findUserByEmailOrUsername,
  updateUserPasswordInFirestore,
  StoredUserData
} from '../lib/firestoreService';
import { uploadCustomDesignToStorage } from '../lib/storageService';
import { auth } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  User 
} from 'firebase/auth';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'warning';
  id: number;
}

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;
  
  // User Authentication
  currentUser: UserProfile | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isInitialLoginGateOpen: boolean;
  setIsInitialLoginGateOpen: (open: boolean) => void;
  loginWithEmailOrUsername: (identifier: string, pass: string) => Promise<{ success: boolean; notRegistered?: boolean; error?: string }>;
  signUpWithCredentials: (params: { nameOrUsername: string; email: string; pass: string; passConfirm: string }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (identifier: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateProfilePassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithVipPasscode: (passcode: string, phone: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; notRegistered?: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (preferredEmail?: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  loginWithGoogleEmail: (email: string, displayName?: string, photoURL?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleCredential: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  dismissInitialLoginGate: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: ColorOption, material?: MaterialType, quantity?: number, customText?: string, customUnitPrice?: number) => void;
  addCustomPrintToCart: (quote: CustomPrintQuote) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  promoCode: string;
  discountAmount: number;
  applyPromoCode: (code: string) => boolean;
  
  // Modals / Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ProductCategory;
  setActiveCategory: (category: ProductCategory) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (
    customer: CustomerInfo, 
    paymentMethod?: PaymentMethod, 
    fpxBank?: string,
    onProgress?: (step: string) => void
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateOrderPaymentStatus: (orderId: string, newStatus: PaymentStatus, note?: string) => Promise<boolean>;
  trackedOrderId: string;
  setTrackedOrderId: (id: string) => void;
  
  // Admin & Inventory
  spools: MaterialSpool[];
  updateSpoolStock: (spoolId: string, newStockKg: number) => void;
  addSpool: (spool: MaterialSpool) => void;
  addNewProduct: (product: Product) => void;
  
  // Toast notifications
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [products, setProducts] = useState<Product[]>(() => normalizeProducts(INITIAL_PRODUCTS));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => normalizeProduct(INITIAL_PRODUCTS[0]));
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('cabai_saved_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Initial Login Gate
  const [isInitialLoginGateOpen, setIsInitialLoginGateOpen] = useState<boolean>(false);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [trackedOrderId, setTrackedOrderId] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Spools / Admin state
  const [spools, setSpools] = useState<MaterialSpool[]>(INITIAL_SPOOLS);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // Automatically dismiss toast information popup after 2 seconds (2000ms)
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Initialize Firebase Auth listener safely without triggering api-key-not-valid
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthLoading(false);
        if (user && !user.isAnonymous) {
          setCurrentUserId(user.uid);
          // Check if previously saved profile was VIP
          let savedRole: 'customer' | 'vip' | 'admin' = 'customer';
          try {
            const raw = localStorage.getItem('cabai_saved_user');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.role) savedRole = parsed.role;
            }
          } catch (e) {}

          const profile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Maker Member',
            photoURL: user.photoURL,
            isAnonymous: false,
            role: savedRole
          };
          setCurrentUser(profile);
          try {
            localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
          } catch (e) {}
        } else if (user) {
          setCurrentUserId(user.uid);
        } else {
          // Do not call signInAnonymously if not needed to prevent api-key error
          setCurrentUserId(`cust_${Math.random().toString(36).substring(2, 9)}`);
        }
      }, (err) => {
        setIsAuthLoading(false);
        console.warn('Firebase Auth state listener note:', err?.message || err);
      });

      return () => unsubscribe();
    } catch (err) {
      setIsAuthLoading(false);
      console.warn('Firebase Auth initialization note:', err);
    }
  }, []);

  const dismissInitialLoginGate = useCallback(() => {
    if (currentUser) {
      setIsInitialLoginGateOpen(false);
    }
  }, [currentUser]);

  const loginWithVipPasscode = async (passcode: string, phone?: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPass = passcode.trim();
    if (cleanPass.toLowerCase() !== 'hkylovegoon' && cleanPass.toLowerCase() !== 'hkylovenbx') {
      return { 
        success: false, 
        error: 'Incorrect VIP password. Please check your passcode and try again.' 
      };
    }

    const cleanPhone = (phone || '').trim();
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || phoneDigits.length < 8) {
      return {
        success: false,
        error: 'Please enter a valid phone number (minimum 8 digits) for VIP sign in.'
      };
    }

    const vipUser: UserProfile = {
      uid: `vip_${phoneDigits}`,
      email: null,
      phone: cleanPhone,
      phoneNumber: cleanPhone,
      displayName: name?.trim() || 'VIP Member',
      photoURL: null,
      isAnonymous: false,
      role: 'vip'
    };

    setCurrentUser(vipUser);
    setCurrentUserId(vipUser.uid);
    try {
      localStorage.setItem('cabai_saved_user', JSON.stringify(vipUser));
      localStorage.setItem('cabai_customer_phone', cleanPhone);
    } catch (e) {}
    
    // Save/record VIP user in Firestore users collection
    try {
      saveUserToFirestore({
        ...vipUser,
        authProvider: 'vip_passcode',
        signedUpAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    } catch (e) {}

    setIsAuthModalOpen(false);
    setIsInitialLoginGateOpen(false);
    showToast(`VIP Access Granted! Welcome VIP (${cleanPhone})! 👑`, 'success');
    return { success: true };
  };

  const loginWithEmailOrUsername = async (
    identifier: string, 
    pass: string
  ): Promise<{ success: boolean; notRegistered?: boolean; error?: string }> => {
    const cleanId = identifier.trim();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Please enter your email/username and password.' };
    }

    // VIP Passcode override
    if (cleanPass.toLowerCase() === 'hkylovenbx' || cleanPass.toLowerCase() === 'hkylovegoon') {
      const digits = cleanId.replace(/\D/g, '');
      if (digits.length >= 8) {
        return loginWithVipPasscode(cleanPass, cleanId);
      }
      return {
        success: false,
        error: 'VIP Passcode recognized! Please enter your phone number to sign in as VIP.'
      };
    }

    // 1. Check if user account exists in system / database
    const existingUser = await findUserByEmailOrUsername(cleanId);

    if (!existingUser) {
      // User has NOT registered yet -> Prompt to register first and signal notRegistered: true
      return { 
        success: false, 
        notRegistered: true, 
        error: `No account found for "${cleanId}". You must register an account first before signing in!` 
      };
    }

    // 2. Validate Password against stored record
    if (existingUser.password) {
      if (existingUser.password !== cleanPass) {
        return { 
          success: false, 
          error: 'Incorrect password. Please verify your credentials or click "Forgot Password".' 
        };
      }
    } else {
      // If user registered with Firebase Auth without explicit password in doc, attempt signInWithEmailAndPassword
      if (existingUser.email) {
        try {
          await signInWithEmailAndPassword(auth, existingUser.email, cleanPass);
        } catch (e: any) {
          if (e?.code === 'auth/wrong-password' || e?.code === 'auth/invalid-credential') {
            return { success: false, error: 'Incorrect password. Please try again.' };
          }
        }
      }
    }

    const profile: UserProfile = {
      uid: existingUser.uid,
      email: existingUser.email,
      username: existingUser.username,
      displayName: existingUser.displayName || existingUser.username || existingUser.email?.split('@')[0] || 'Maker Member',
      photoURL: existingUser.photoURL || null,
      isAnonymous: false,
      role: existingUser.role || 'customer'
    };

    setCurrentUser(profile);
    setCurrentUserId(profile.uid);
    try {
      localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
    } catch (e) {}

    // Save/Update in Firestore users collection
    try {
      saveUserToFirestore({
        ...existingUser,
        ...profile,
        lastLoginAt: new Date().toISOString()
      });
    } catch (e) {}

    setIsAuthModalOpen(false);
    setIsInitialLoginGateOpen(false);
    showToast(`Welcome back, ${profile.displayName}! 🌶️`, 'success');
    return { success: true };
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; notRegistered?: boolean; error?: string }> => {
    return loginWithEmailOrUsername(email, pass);
  };

  const signUpWithCredentials = async (params: { 
    nameOrUsername: string; 
    email: string; 
    pass: string; 
    passConfirm: string; 
  }): Promise<{ success: boolean; error?: string }> => {
    const nameOrUsername = params.nameOrUsername.trim();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanPass = params.pass.trim();
    const cleanPassConfirm = params.passConfirm.trim();

    if (!nameOrUsername) {
      return { success: false, error: 'Please enter your Name or Username.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please create a password.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (cleanPass !== cleanPassConfirm) {
      return { success: false, error: 'Passwords do not match! Please check your password confirmation.' };
    }

    if (cleanPass.toLowerCase() === 'hkylovegoon' || cleanPass.toLowerCase() === 'hkylovenbx') {
      return { success: false, error: 'This is a VIP passcode. Please use the VIP Sign In tab with your phone number to sign in.' };
    }

    // Check if email already registered
    const existingByEmail = await findUserByEmailOrUsername(cleanEmail);
    if (existingByEmail) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    // Check if username already registered
    const existingByUsername = await findUserByEmailOrUsername(nameOrUsername);
    if (existingByUsername) {
      return { success: false, error: 'This username is already taken. Please choose another username.' };
    }

    let uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Attempt Firebase registration if enabled
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      uid = cred.user.uid;
      try {
        await updateProfile(cred.user, { displayName: nameOrUsername });
      } catch (e) {}
    } catch (err: any) {
      console.warn('Firebase Auth note, proceeding with system account store:', err);
    }

    const cleanUsername = nameOrUsername.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
    const profile: UserProfile = {
      uid,
      email: cleanEmail,
      username: cleanUsername,
      displayName: nameOrUsername,
      photoURL: null,
      isAnonymous: false,
      role: 'customer'
    };

    const storedData: StoredUserData = {
      ...profile,
      password: cleanPass,
      authProvider: 'email_password',
      createdAt: new Date().toISOString(),
      signedUpAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setCurrentUser(profile);
    setCurrentUserId(profile.uid);
    try {
      localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
    } catch (e) {}

    // Persist new user in Firestore "users" database collection
    await saveUserToFirestore(storedData);

    setIsAuthModalOpen(false);
    setIsInitialLoginGateOpen(false);
    showToast(`Account registered successfully! Welcome, ${profile.displayName}! 🎉`, 'success');
    return { success: true };
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    return signUpWithCredentials({
      nameOrUsername: name,
      email,
      pass,
      passConfirm: pass
    });
  };

  const resetPassword = async (identifier: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim();
    const cleanPass = newPass.trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your registered Email or Username.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter a new password.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const res = await updateUserPasswordInFirestore(cleanId, cleanPass);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to reset password. Please check your username or email.' };
    }

    showToast('Password updated successfully! You can now sign in with your new password. 🔒', 'success');
    return { success: true };
  };

  const updateProfilePassword = async (newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to reset your password.' };
    }
    const target = currentUser.email || currentUser.username || currentUser.uid;
    const res = await updateUserPasswordInFirestore(target, newPass);
    if (res.success) {
      showToast('Your password has been changed successfully! 🔒', 'success');
    }
    return res;
  };

  const loginWithGoogle = async (preferredEmail?: string): Promise<{ success: boolean; error?: string; code?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Google Member',
        photoURL: cred.user.photoURL,
        isAnonymous: false,
        role: 'customer'
      };

      setCurrentUser(profile);
      setCurrentUserId(profile.uid);
      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      // Save real user profile to Firestore users collection
      try {
        await saveUserToFirestore({
          ...profile,
          authProvider: 'google',
          lastLoginAt: new Date().toISOString()
        });
      } catch (e) {}

      setIsAuthModalOpen(false);
      setIsInitialLoginGateOpen(false);
      showToast(`Welcome to CABAI, ${profile.displayName}! 🌶️`, 'success');
      return { success: true };
    } catch (err: any) {
      console.warn('Firebase Google sign-in note:', err);
      
      // If user provided a specific email to sign in with
      if (preferredEmail && preferredEmail.includes('@')) {
        const cleanEmail = preferredEmail.trim().toLowerCase();
        const defaultName = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();
        const capitalizedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
        const generatedUid = 'google_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

        const profile: UserProfile = {
          uid: generatedUid,
          email: cleanEmail,
          displayName: capitalizedName || 'Google Member',
          photoURL: null,
          isAnonymous: false,
          role: 'customer'
        };

        setCurrentUser(profile);
        setCurrentUserId(profile.uid);
        try {
          localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
        } catch (e) {}

        try {
          await saveUserToFirestore({
            ...profile,
            authProvider: 'google',
            lastLoginAt: new Date().toISOString(),
            signedUpAt: new Date().toISOString()
          });
        } catch (e) {}

        setIsAuthModalOpen(false);
        setIsInitialLoginGateOpen(false);
        showToast(`Welcome to CABAI, ${profile.displayName}! 🌶️`, 'success');
        return { success: true };
      }

      const code = err?.code || '';
      let errMsg = 'Google authentication encountered an issue.';
      if (code === 'auth/popup-blocked') {
        errMsg = 'Popup was blocked by your browser sandbox. Please enter your Google email directly below or open in a new tab.';
      } else if (code === 'auth/popup-closed-by-user') {
        errMsg = 'Sign-in popup was closed before completing.';
      } else if (code === 'auth/unauthorized-domain') {
        errMsg = 'This preview domain is not yet whitelisted in Firebase Console. Please enter your Google email below to sign in!';
      } else if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key' || err?.message?.includes('api-key-not-valid')) {
        errMsg = 'Firebase Web API Key is invalid or restricted in Google Cloud Console. You can enter your Google email in the input below to sign in immediately!';
      } else if (err?.message) {
        errMsg = err.message;
      }
      return { success: false, code, error: errMsg };
    }
  };

  const loginWithGoogleEmail = async (
    email: string, 
    displayName?: string, 
    photoURL?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid Google email address.' };
    }

    const defaultName = displayName?.trim() || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();
    const generatedUid = 'google_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    const profile: UserProfile = {
      uid: generatedUid,
      email: cleanEmail,
      displayName: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
      photoURL: photoURL || null,
      isAnonymous: false,
      role: 'customer'
    };

    setCurrentUser(profile);
    setCurrentUserId(profile.uid);
    try {
      localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
    } catch (e) {}

    // Save to Firestore users collection
    try {
      await saveUserToFirestore({
        ...profile,
        authProvider: 'google',
        lastLoginAt: new Date().toISOString(),
        signedUpAt: new Date().toISOString()
      });
    } catch (e) {}

    setIsAuthModalOpen(false);
    setIsInitialLoginGateOpen(false);
    showToast(`Welcome to CABAI, ${profile.displayName}! 🌶️`, 'success');
    return { success: true };
  };

  const loginWithGoogleCredential = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const cred = await signInWithCredential(auth, credential);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Google User',
        photoURL: cred.user.photoURL,
        isAnonymous: false,
        role: 'customer'
      };

      setCurrentUser(profile);
      setCurrentUserId(profile.uid);
      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      try {
        await saveUserToFirestore({
          ...profile,
          authProvider: 'google',
          lastLoginAt: new Date().toISOString()
        });
      } catch (e) {}

      setIsAuthModalOpen(false);
      setIsInitialLoginGateOpen(false);
      showToast(`Welcome to CABAI, ${profile.displayName}! 🌶️`, 'success');
      return { success: true };
    } catch (err: any) {
      console.warn('[Firebase Auth] Credential sign-in note:', err);
      return { success: false, error: err?.message || 'Google verification failed.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    try {
      localStorage.removeItem('cabai_saved_user');
      sessionStorage.removeItem('cabai_login_dismissed');
    } catch (e) {}
    setIsInitialLoginGateOpen(true);
    showToast('You have been signed out. Please log in with VIP password to enter.', 'info');
  };

  // Fetch and synchronize data from Firestore database in real-time
  useEffect(() => {
    // 1. Set up real-time live listener for products from Firestore database
    const unsubscribeProducts = subscribeToProducts((firestoreProducts) => {
      if (firestoreProducts && firestoreProducts.length > 0) {
        const normalized = normalizeProducts(firestoreProducts);
        setProducts(normalized);
        setSelectedProduct(prev => {
          if (!prev) return normalized[0];
          const matched = normalized.find(p => p.id === prev.id);
          return matched || prev;
        });
      }
    });

    // 2. Fetch initial data and seed Firestore database if needed
    const fetchData = async () => {
      try {
        const [prodRes, ordRes, spoolRes] = await Promise.all([
          fetch('/api/products').then(res => (res.ok ? res.json() : null)).catch(() => null),
          fetch('/api/orders').then(res => (res.ok ? res.json() : null)).catch(() => null),
          fetch('/api/spools').then(res => (res.ok ? res.json() : null)).catch(() => null)
        ]);

        const defaultProds = (prodRes && prodRes.length > 0) ? normalizeProducts(prodRes) : normalizeProducts(INITIAL_PRODUCTS);
        const defaultOrds = (ordRes && ordRes.length > 0) ? ordRes : INITIAL_ORDERS;
        const defaultSps = (spoolRes && spoolRes.length > 0) ? spoolRes : INITIAL_SPOOLS;

        // Seed or load from Firestore database
        const fsData = await seedFirestoreInitialData(defaultProds, defaultOrds, defaultSps);

        if (fsData.products && fsData.products.length > 0) {
          const normalized = normalizeProducts(fsData.products);
          setProducts(normalized);
          setSelectedProduct(prev => prev || normalized[0]);
        }
        if (fsData.orders && fsData.orders.length > 0) {
          setOrders(fsData.orders);
        }
        if (fsData.spools && fsData.spools.length > 0) {
          setSpools(fsData.spools);
        }
      } catch (err) {
        // Safe offline/fallback initialization from initial local store
        const defaultProds = normalizeProducts(INITIAL_PRODUCTS);
        setProducts(defaultProds);
        setSelectedProduct(prev => prev || defaultProds[0]);
        setOrders(INITIAL_ORDERS);
        setSpools(INITIAL_SPOOLS);
      }
    };

    fetchData();

    return () => {
      unsubscribeProducts();
    };
  }, []);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    product: Product, 
    color?: ColorOption, 
    material?: MaterialType, 
    quantity: number = 1,
    customText?: string,
    customUnitPrice?: number
  ) => {
    const selColor = color || product.colors[0] || DEFAULT_COLORS[0];
    const selMaterial = material || product.materials[0] || 'PLA';
    const effectiveUnitPrice = (customUnitPrice && customUnitPrice > 0) ? customUnitPrice : product.price;

    const existingIndex = cart.findIndex(
      item => item.productId === product.id && 
              item.selectedColor.name === selColor.name && 
              item.selectedMaterial === selMaterial &&
              item.customText === customText &&
              item.unitPrice === effectiveUnitPrice &&
              !item.isCustomPrint
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        product,
        selectedColor: selColor,
        selectedMaterial: selMaterial,
        quantity,
        unitPrice: effectiveUnitPrice,
        customText,
        isCustomPrint: false
      };
      setCart(prev => [...prev, newItem]);
    }

    showToast(`Added "${product.name}" (${selColor.name}) to cart!`, 'success');
  };

  const addCustomPrintToCart = (quote: CustomPrintQuote) => {
    const title = quote.designTitle || `Custom Chili: ${quote.fileName}`;
    const displayImg = quote.drawingImage || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800';

    // Create custom drawing product representation
    const customProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      name: title,
      subtitle: 'Custom Hand-Drawn 3D Chili',
      price: quote.calculatedPrice,
      rating: 5.0,
      reviewsCount: 1,
      category: 'custom',
      tags: ['Custom Design', 'Hand Drawn', 'Maker Studio'],
      description: `Custom designed 3D printed chili "${title}" (${quote.material}, ${quote.color.name}) with ${quote.infillPercent}% infill and ${quote.layerHeight}mm layer precision.`,
      images: [displayImg],
      specifications: {
        material: quote.material,
        weight: `${quote.weightGrams}g`,
        dimensions: `Volume ~${quote.volumeCm3} cm³`,
        printTime: `~${quote.estimatedHours} hrs`,
        layerHeight: `${quote.layerHeight}mm`,
        madeToOrder: true
      },
      colors: [quote.color],
      materials: [quote.material],
      inStock: true,
      stockQuantity: quote.quantity
    };

    const newItem: CartItem = {
      id: `custom-cart-${Date.now()}`,
      productId: customProduct.id,
      product: customProduct,
      selectedColor: quote.color,
      selectedMaterial: quote.material,
      quantity: quote.quantity,
      unitPrice: quote.calculatedPrice,
      isCustomPrint: true,
      drawingImage: quote.drawingImage,
      customDesignUrl: quote.customDesignUrl,
      customPrintDetails: {
        fileName: quote.fileName,
        designTitle: title,
        volumeCm3: quote.volumeCm3,
        infillPercent: quote.infillPercent,
        layerHeight: quote.layerHeight,
        estimatedTimeHours: quote.estimatedHours,
        customDesignUrl: quote.customDesignUrl
      }
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Custom Chili "${title}" added to cart! (RM ${quote.calculatedPrice.toFixed(2)})`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const discountAmount = (cartSubtotal * discountPercent) / 100;

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MAKER10' || cleanCode === 'CABAI10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      showToast('Promo code MAKER10 applied! 10% OFF', 'success');
      return true;
    } else if (cleanCode === 'CABAI20') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      showToast('VIP Promo code applied! 20% OFF', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "MAKER10"', 'warning');
      return false;
    }
  };

  const placeOrder = async (
    customer: CustomerInfo, 
    paymentMethod: PaymentMethod = 'TNG', 
    fpxBank?: string,
    onProgress?: (step: string) => void
  ): Promise<Order> => {
    const subtotal = cartSubtotal;
    const shipping = subtotal > 80 ? 0 : 8.00; // Free shipping over RM 80
    const discount = discountAmount;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.06).toFixed(2)); // 6% SST
    const total = Number((taxableAmount + shipping + tax).toFixed(2));

    const hasCustomDesigns = cart.some(item => (item.isCustomPrint || item.drawingImage) && !item.customDesignUrl && !item.customPrintDetails?.customDesignUrl);
    
    if (hasCustomDesigns) {
      onProgress?.('Preparing design...');
    }

    const orderItems: OrderItem[] = await Promise.all(cart.map(async (item) => {
      const isCustomPrint = Boolean(item.isCustomPrint);
      const customDetails = isCustomPrint 
        ? `${item.customPrintDetails?.fileName || item.product.name} (${item.customPrintDetails?.infillPercent || 20}% infill, ${item.customPrintDetails?.layerHeight || '0.20'}mm layer)` 
        : (item.customText || '');

      let finalDesignUrl = item.customDesignUrl || item.customPrintDetails?.customDesignUrl;

      // If customDesignUrl is not yet a Firebase Storage download URL and item has drawingImage, upload the optimized Blob now
      if (!finalDesignUrl && item.drawingImage) {
        try {
          if (item.drawingImage.startsWith('http://') || item.drawingImage.startsWith('https://')) {
            finalDesignUrl = item.drawingImage;
          } else {
            onProgress?.('Saving custom design to cloud...');
            finalDesignUrl = await uploadCustomDesignToStorage(
              item.drawingImage, 
              `order_chili_${item.id}`,
              `cart_item_${item.id}`
            );
            // Cache back into cart item in state to avoid re-upload if checkout is repeated
            item.customDesignUrl = finalDesignUrl;
            if (item.customPrintDetails) {
              item.customPrintDetails.customDesignUrl = finalDesignUrl;
            }
          }
        } catch (uploadErr: any) {
          console.warn('[AppContext] ⚠️ Storage upload note during placeOrder:', uploadErr);
          // Graceful fallback: preserve drawingImage so Boss Admin can still view the artwork
          finalDesignUrl = item.drawingImage;
        }
      }

      return {
        name: item.product.name,
        color: item.selectedColor?.name || 'Standard',
        material: item.selectedMaterial || 'PLA+',
        quantity: item.quantity,
        price: item.unitPrice,
        isCustomPrint,
        customDetails,
        ...(finalDesignUrl ? { customDesignUrl: finalDesignUrl } : {}),
        ...(item.customText ? { customText: item.customText } : {}),
        ...(item.drawingImage ? { drawingImage: finalDesignUrl || item.drawingImage } : {}),
        ...(item.customPrintDetails ? { 
          customPrintDetails: {
            ...item.customPrintDetails,
            ...(finalDesignUrl ? { customDesignUrl: finalDesignUrl } : {})
          },
          fileName: item.customPrintDetails.fileName,
          infillPercent: item.customPrintDetails.infillPercent,
          layerHeight: item.customPrintDetails.layerHeight,
          scalePercent: item.customPrintDetails.scalePercent,
          specialInstructions: item.customPrintDetails.specialInstructions
        } : {})
      };
    }));

    onProgress?.('Creating order in Firestore...');

    const newOrderNumber = `CBI-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectivePaymentMethod: PaymentMethod = paymentMethod === 'ewallet' ? 'TNG' : (paymentMethod || 'TNG');
    const authUserId = currentUserId || auth.currentUser?.uid || `cust_${Date.now()}`;
    const isoNow = new Date().toISOString();
    
    const newOrder: Order = {
      id: newOrderNumber,
      orderId: newOrderNumber,
      userId: authUserId,
      amount: total,
      paymentMethod: effectivePaymentMethod,
      paymentStatus: 'pending',
      createdAt: isoNow,
      date: isoNow,
      customer: {
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        postcode: customer.postcode || '',
        notes: customer.notes || ''
      },
      items: orderItems,
      subtotal,
      shipping,
      discount,
      tax,
      total,
      ...(fpxBank ? { fpxBank } : {}),
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', timestamp: isoNow, note: 'Order created with TNG payment pending' }
      ],
      trackingNumber: `MY-CBI-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: '1-3 Business Days'
    };

    // Save directly to Cloud Firestore (required)
    try {
      await saveOrderToFirestore(newOrder);
    } catch (err: any) {
      console.error('[AppContext] ❌ Failed to save order to Firestore:', err);
      showToast(`Database error: ${err?.message || 'Failed to record order in Firestore'}`, 'warning');
      throw err; // Propagate error so CheckoutView does not transition to success page
    }

    // Optional sync to backend API if available
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => console.warn('Order API sync error:', err));

    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    setTrackedOrderId(newOrder.id);
    clearCart();
    onProgress?.('Order confirmed.');
    return newOrder;
  };

  const updateOrderPaymentStatus = async (orderId: string, newStatus: PaymentStatus, note?: string): Promise<boolean> => {
    const ok = await updatePaymentStatusInFirestore(orderId, newStatus, { note });
    if (ok) {
      setOrders(prev => prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: newStatus,
            ...(newStatus === 'payment_submitted' ? { paymentSubmittedAt: new Date().toISOString() } : {}),
            ...(newStatus === 'paid' ? { paymentVerifiedAt: new Date().toISOString() } : {})
          };
        }
        return ord;
      }));
    }
    return ok;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, note })
    }).catch(err => console.warn('Order status API update error:', err));
    updateOrderStatusInFirestore(orderId, newStatus, note);

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedHistory = [...ord.statusHistory, { status: newStatus, timestamp: new Date().toISOString(), note }];
        return {
          ...ord,
          status: newStatus,
          statusHistory: updatedHistory
        };
      }
      return ord;
    }));
    showToast(`Order ${orderId} updated to "${newStatus}"`, 'info');
  };

  const updateSpoolStock = (spoolId: string, newStockKg: number) => {
    fetch(`/api/spools/${spoolId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockKg: newStockKg })
    }).catch(err => console.warn('Spool stock API update error:', err));
    updateSpoolStockInFirestore(spoolId, newStockKg);

    setSpools(prev => prev.map(s => {
      if (s.id === spoolId) {
        return { ...s, stockKg: newStockKg, isLow: newStockKg <= 3.0 };
      }
      return s;
    }));
    showToast('Filament spool inventory updated', 'success');
  };

  const addSpool = (spool: MaterialSpool) => {
    fetch('/api/spools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spool)
    }).catch(err => console.warn('Add spool API error:', err));
    saveSpoolToFirestore(spool);

    setSpools(prev => [spool, ...prev]);
    showToast(`Added new filament spool: ${spool.name}`, 'success');
  };

  const addNewProduct = (newProd: Product) => {
    const normalized = normalizeProduct(newProd);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized)
    }).catch(err => console.warn('Add product API error:', err));
    saveProductToFirestore(normalized);

    setProducts(prev => [normalized, ...prev]);
    showToast(`Added new product "${normalized.name}" to catalog!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        currentUser,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isInitialLoginGateOpen,
        setIsInitialLoginGateOpen,
        loginWithEmailOrUsername,
        signUpWithCredentials,
        resetPassword,
        updateProfilePassword,
        loginWithVipPasscode,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        loginWithGoogleEmail,
        loginWithGoogleCredential,
        logout,
        dismissInitialLoginGate,
        cart,
        addToCart,
        addCustomPrintToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        promoCode,
        discountAmount,
        applyPromoCode,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        orders,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        trackedOrderId,
        setTrackedOrderId,
        spools,
        updateSpoolStock,
        addSpool,
        addNewProduct,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
