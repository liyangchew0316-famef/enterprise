import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  MaterialSpool, 
  ViewMode, 
  ProductCategory, 
  ColorOption, 
  MaterialType,
  CustomPrintQuote,
  CustomerInfo
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SPOOLS, DEFAULT_COLORS } from '../data/mockData';
import {
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveSpoolToFirestore,
  updateSpoolStockInFirestore,
  saveProductToFirestore,
  seedFirestoreInitialData
} from '../lib/firestoreService';

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
  placeOrder: (customer: CustomerInfo, paymentMethod: 'fpx' | 'credit_card' | 'ewallet', fpxBank?: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
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

  // Spools / Admin state
  const [spools, setSpools] = useState<MaterialSpool[]>(INITIAL_SPOOLS);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // Fetch initial data from Firestore database & Express API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordRes, spoolRes] = await Promise.all([
          fetch('/api/products').then(res => res.ok ? res.json() : null),
          fetch('/api/orders').then(res => res.ok ? res.json() : null),
          fetch('/api/spools').then(res => res.ok ? res.json() : null)
        ]);

        const defaultProds = (prodRes && prodRes.length > 0) ? prodRes : INITIAL_PRODUCTS;
        const defaultOrds = (ordRes && ordRes.length > 0) ? ordRes : INITIAL_ORDERS;
        const defaultSps = (spoolRes && spoolRes.length > 0) ? spoolRes : INITIAL_SPOOLS;

        // Seed or load from Firestore database
        const fsData = await seedFirestoreInitialData(defaultProds, defaultOrds, defaultSps);

        if (fsData.products && fsData.products.length > 0) {
          setProducts(fsData.products);
          setSelectedProduct(fsData.products[0]);
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
    // Create dummy custom product
    const customProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      name: `Custom 3D Print: ${quote.fileName}`,
      subtitle: 'Uploaded STL Order',
      price: quote.calculatedPrice,
      rating: 5.0,
      reviewsCount: 1,
      category: 'custom',
      tags: ['Custom STL', 'Maker Service'],
      description: `Custom model file ${quote.fileName} with ${quote.infillPercent}% infill and ${quote.layerHeight}mm layer height.`,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
      ],
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
      customPrintDetails: {
        fileName: quote.fileName,
        volumeCm3: quote.volumeCm3,
        infillPercent: quote.infillPercent,
        layerHeight: quote.layerHeight,
        estimatedTimeHours: quote.estimatedHours
      }
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Custom 3D Print request added to cart! (RM ${quote.calculatedPrice.toFixed(2)})`, 'success');
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

  const placeOrder = (
    customer: CustomerInfo, 
    paymentMethod: 'fpx' | 'credit_card' | 'ewallet', 
    fpxBank?: string
  ): Order => {
    const subtotal = cartSubtotal;
    const shipping = subtotal > 80 ? 0 : 8.00; // Free shipping over RM 80
    const discount = discountAmount;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.06).toFixed(2)); // 6% SST
    const total = Number((taxableAmount + shipping + tax).toFixed(2));

    const orderItems = cart.map(item => ({
      name: item.product.name,
      color: item.selectedColor.name,
      material: item.selectedMaterial,
      quantity: item.quantity,
      price: item.unitPrice,
      isCustomPrint: item.isCustomPrint,
      customDetails: item.isCustomPrint ? `${item.customPrintDetails?.fileName} (${item.customPrintDetails?.infillPercent}% infill)` : item.customText
    }));

    const newOrderNumber = `CBI-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newOrder: Order = {
      id: newOrderNumber,
      date: new Date().toISOString(),
      customer,
      items: orderItems,
      subtotal,
      shipping,
      discount,
      tax,
      total,
      paymentMethod,
      fpxBank,
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed & payment authorized' }
      ],
      trackingNumber: `MY-CBI-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: '1-3 Business Days'
    };

    // Post to backend API & Firestore database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => console.warn('Order API sync error:', err));
    saveOrderToFirestore(newOrder);

    setOrders(prev => [newOrder, ...prev]);
    setTrackedOrderId(newOrder.id);
    clearCart();
    showToast(`Order #${newOrder.id} confirmed! Thank you!`, 'success');
    return newOrder;
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
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    }).catch(err => console.warn('Add product API error:', err));
    saveProductToFirestore(newProd);

    setProducts(prev => [newProd, ...prev]);
    showToast(`Added new product "${newProd.name}" to catalog!`, 'success');
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
        trackedOrderId,
        setTrackedOrderId,
        spools,
        updateSpoolStock,
        addSpool,
        addNewProduct,
        toast,
        showToast
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
