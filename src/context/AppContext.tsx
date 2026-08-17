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
  CustomerInfo
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
  seedFirestoreInitialData
} from '../lib/firestoreService';
import { uploadCustomDesignToStorage } from '../lib/storageService';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

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
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: ColorOption, material?: MaterialType, quantity?: number, customText?: string) => void;
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

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        signInAnonymously(auth)
          .then((cred) => {
            setCurrentUserId(cred.user.uid);
          })
          .catch((err) => {
            console.warn('Anonymous auth note:', err);
            setCurrentUserId(`cust_${Math.random().toString(36).substring(2, 9)}`);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch initial data from Firestore database & Express API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordRes, spoolRes] = await Promise.all([
          fetch('/api/products').then(res => res.ok ? res.json() : null),
          fetch('/api/orders').then(res => res.ok ? res.json() : null),
          fetch('/api/spools').then(res => res.ok ? res.json() : null)
        ]);

        const defaultProds = (prodRes && prodRes.length > 0) ? normalizeProducts(prodRes) : normalizeProducts(INITIAL_PRODUCTS);
        const defaultOrds = (ordRes && ordRes.length > 0) ? ordRes : INITIAL_ORDERS;
        const defaultSps = (spoolRes && spoolRes.length > 0) ? spoolRes : INITIAL_SPOOLS;

        // Seed or load from Firestore database
        const fsData = await seedFirestoreInitialData(defaultProds, defaultOrds, defaultSps);

        if (fsData.products && fsData.products.length > 0) {
          const normalized = normalizeProducts(fsData.products);
          setProducts(normalized);
          setSelectedProduct(normalized[0]);
        }
        if (fsData.orders && fsData.orders.length > 0) {
          setOrders(fsData.orders);
        }
        if (fsData.spools && fsData.spools.length > 0) {
          setSpools(fsData.spools);
        }
      } catch (err) {
        console.warn('Backend API or Firestore database connection note:', err);
      }
    };

    fetchData();
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
    customText?: string
  ) => {
    const selColor = color || product.colors[0] || DEFAULT_COLORS[0];
    const selMaterial = material || product.materials[0] || 'PLA';

    const existingIndex = cart.findIndex(
      item => item.productId === product.id && 
              item.selectedColor.name === selColor.name && 
              item.selectedMaterial === selMaterial &&
              item.customText === customText &&
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
        unitPrice: product.price,
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
