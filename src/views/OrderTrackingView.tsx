import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';
import { 
  Search, 
  Truck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PackageCheck, 
  Copy,
  Printer,
  FileText,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

/**
 * Normalizes phone numbers for search matching
 */
function normalizePhone(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.startsWith('60')) {
    return digits.slice(2);
  }
  if (digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export const OrderTrackingView: React.FC = () => {
  const { orders, trackedOrderId, setTrackedOrderId, showToast, setCurrentView, currentUser, setIsAuthModalOpen } = useApp();

  // Search input state for quick filtering
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(trackedOrderId || '');

  // Calculate authorized base orders for this user session
  const isPrivileged = currentUser?.role === 'boss' || currentUser?.role === 'admin';

  const userBaseOrders = useMemo(() => {
    if (isPrivileged) {
      return orders;
    }
    if (currentUser) {
      const userPhoneNorm = normalizePhone(currentUser.phone || currentUser.phoneNumber);
      return orders.filter(ord => {
        if (currentUser.uid && ord.userId === currentUser.uid) return true;
        if (currentUser.email && ord.customer?.email?.toLowerCase() === currentUser.email.toLowerCase()) return true;
        if (userPhoneNorm && userPhoneNorm.length >= 7) {
          const ordPhoneNorm = normalizePhone(ord.customer?.phone);
          if (ordPhoneNorm === userPhoneNorm) return true;
        }
        return false;
      });
    }
    // For non-logged-in guest: only show the order they just created in this session (trackedOrderId)
    if (trackedOrderId) {
      return orders.filter(ord => ord.id === trackedOrderId);
    }
    return [];
  }, [orders, currentUser, isPrivileged, trackedOrderId]);

  // Filter orders based on user query
  const displayedOrders = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();

    // If query is empty, return user's authorized base orders
    if (!q) {
      return userBaseOrders;
    }

    const normQPhone = normalizePhone(q);
    const userPhoneNorm = normalizePhone(currentUser?.phone || currentUser?.phoneNumber);

    // If user is logged in or privileged, filter within their orders (or allow exact order ID lookup)
    if (currentUser) {
      return orders.filter(ord => {
        const isUserOrder = isPrivileged || 
          (currentUser.uid && ord.userId === currentUser.uid) ||
          (currentUser.email && ord.customer?.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (userPhoneNorm && userPhoneNorm.length >= 7 && normalizePhone(ord.customer?.phone) === userPhoneNorm);

        // 1. Check within user's own orders
        if (isUserOrder) {
          if (ord.id.toLowerCase().includes(q) || (ord.orderId && ord.orderId.toLowerCase().includes(q))) {
            return true;
          }
          if (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(q)) {
            return true;
          }
          if (normQPhone.length >= 3) {
            const ordPhoneNorm = normalizePhone(ord.customer?.phone);
            if (ordPhoneNorm && ordPhoneNorm.includes(normQPhone)) {
              return true;
            }
          }
          if (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(q)) {
            return true;
          }
        }

        // 2. Allow looking up a specific order by exact ID if it matches
        if (ord.id.toLowerCase() === q || (ord.orderId && ord.orderId.toLowerCase() === q)) {
          return true;
        }

        return false;
      });
    }

    // If guest (not logged in), ONLY allow exact Order ID or exact Phone Number lookup
    return orders.filter(ord => {
      // Exact or direct Order ID match
      if (ord.id.toLowerCase() === q || (ord.orderId && ord.orderId.toLowerCase() === q)) {
        return true;
      }
      // Exact Phone match (minimum 7 digits for security)
      if (normQPhone.length >= 7) {
        const ordPhoneNorm = normalizePhone(ord.customer?.phone);
        if (ordPhoneNorm === normQPhone) {
          return true;
        }
      }
      return false;
    });
  }, [orders, userBaseOrders, filterQuery, currentUser, isPrivileged]);

  // Keep selected order in sync
  useEffect(() => {
    if (displayedOrders.length > 0) {
      if (!selectedOrderId || !displayedOrders.some(o => o.id === selectedOrderId)) {
        setSelectedOrderId(displayedOrders[0].id);
        setTrackedOrderId(displayedOrders[0].id);
      }
    }
  }, [displayedOrders, selectedOrderId, setTrackedOrderId]);

  const activeOrder: Order | undefined = useMemo(() => {
    return displayedOrders.find(o => o.id === selectedOrderId) || displayedOrders[0];
  }, [displayedOrders, selectedOrderId]);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied tracking code ${code} to clipboard!`, 'success');
  };

  const isPaid = activeOrder?.paymentStatus === 'paid';
  const isCancelled = activeOrder?.status === 'Cancelled' || activeOrder?.paymentStatus === 'cancelled';

  const steps: { status: OrderStatus; label: string; desc: string; icon: string }[] = useMemo(() => {
    if (isCancelled) {
      return [
        { 
          status: 'Cancelled' as OrderStatus, 
          label: 'Order Cancelled', 
          desc: 'This order was cancelled because payment was not completed or verified.', 
          icon: '✕' 
        }
      ];
    }

    return [
      { 
        status: 'Pending', 
        label: isPaid ? 'Order Received & Verified' : 'Pending Payment Verification', 
        desc: isPaid 
          ? 'Touch \'n Go payment verified & queued for slicing' 
          : 'Waiting for Touch \'n Go eWallet payment verification by Admin', 
        icon: isPaid ? '📝' : '⏳' 
      },
      { status: 'Slicing', label: 'STL Slicing & Bed Setup', desc: 'Generating GCode toolpaths & calibrating nozzle', icon: '💻' },
      { status: 'Printing', label: '3D Printing on Bambu Lab Fleet', desc: 'Active high-speed print job on CoreXY bed', icon: '🖨️' },
      { status: 'Printed', label: 'Deburring & Quality Inspection', desc: 'Hand-inspected, deburred & protective boxed', icon: '✨' },
      { status: 'Shipped', label: 'Courier Handover & Dispatch', desc: 'Handed over for express courier delivery', icon: '🚚' }
    ];
  }, [isPaid, isCancelled]);

  const getStepState = (stepStatus: OrderStatus) => {
    if (!activeOrder) return 'upcoming';
    if (isCancelled) return 'cancelled';

    if (!isPaid) {
      if (stepStatus === 'Pending') return 'current';
      return 'upcoming';
    }

    const statusOrder: OrderStatus[] = ['Pending', 'Slicing', 'Printing', 'Printed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(activeOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) {
      if (stepStatus === 'Pending' && activeOrder.status === 'Pending') {
        return 'completed';
      }
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#111113] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-950/80 text-[#FF4D5A] border border-red-800/80 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">
            <PackageCheck className="w-8 h-8 text-[#FF4D5A]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-950/80 text-[#FF4D5A] text-[11px] font-mono-code font-extrabold rounded-full border border-red-900/60 mb-1">
              <span>Cabai Live Production Hub</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Purchases &amp; Order Tracker
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-0.5 font-mono-code">
              Track your 3D print queue, slicing progress, and courier delivery live.
            </p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search Order #, Name, Phone..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#18181B] border border-white/10 rounded-xl font-mono-code text-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#AF101A] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders List / Empty State / Guest Tracker */}
      {displayedOrders.length === 0 ? (
        <div className="bg-[#111113] p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl">
          {!currentUser ? (
            /* Guest Not Logged In & No Order Query */
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-red-950/80 text-[#FF4D5A] border border-red-900/60 flex items-center justify-center mx-auto text-3xl shadow-inner">
                🔍
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-extrabold text-white text-xl">
                  {filterQuery ? 'Order Not Found' : 'Track Your 3D Print Order'}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-mono-code">
                  {filterQuery 
                    ? `No order found matching "${filterQuery}". Please verify your Order ID (e.g. CBI-1001) or phone number.`
                    : 'Enter your specific Order ID or Phone Number to check your 3D print progress, or sign in with your Google account.'}
                </p>
              </div>

              {/* Quick Lookup Input for Guest */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. CBI-1001) or Phone..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-xs font-mono-code text-white placeholder:text-white/30 focus:border-[#AF101A] outline-hidden"
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    className="px-4 py-3 bg-[#18181B] hover:bg-white/10 text-white/80 text-xs font-mono-code font-bold rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sign In Callout */}
              <div className="p-4 bg-[#18181B] rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="text-xs font-mono-code">
                  <div className="font-bold text-white">Signed in before?</div>
                  <div className="text-white/50 text-[11px]">Sign in with your Google account to automatically view all your orders.</div>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-[#AF101A] hover:bg-[#E11D48] text-white text-xs font-mono-code font-extrabold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Sign In with Google
                </button>
              </div>
            </div>
          ) : userBaseOrders.length === 0 ? (
            /* Logged in user with 0 orders */
            <div className="space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-900/60 text-[#FF4D5A] flex items-center justify-center mx-auto text-3xl">
                📦
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading font-bold text-white text-lg">No Orders Placed Yet</h3>
                <p className="text-xs text-white/60 leading-relaxed font-mono-code">
                  You haven't placed any 3D print orders on this account yet. Browse our shop catalog or design your own custom item!
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#AF101A] hover:bg-[#E11D48] text-white font-mono-code font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Shop</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged in user with filter query that didn't match their orders */
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-white text-base">No Orders Match "{filterQuery}"</h3>
                <p className="text-xs text-white/50 leading-relaxed font-mono-code">
                  We couldn't find any orders in your account matching this query.
                </p>
              </div>
              <button
                onClick={() => setFilterQuery('')}
                className="px-4 py-2 bg-[#18181B] hover:bg-white/10 text-white font-mono-code font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                Show My Orders ({userBaseOrders.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Orders Switcher / Tabs if multiple orders */}
          {displayedOrders.length > 1 && (
            <div className="bg-[#111113] p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-extrabold text-white flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#FF4D5A]" />
                  <span>Select an Order to View ({displayedOrders.length} Available)</span>
                </span>
                <span className="text-[11px] text-white/40 font-mono-code">Click to inspect status</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {displayedOrders.map((ord) => {
                  const isSel = ord.id === activeOrder?.id;
                  const itemSummary = ord.items.map(i => i.name).join(', ');
                  return (
                    <button
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setTrackedOrderId(ord.id);
                      }}
                      className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                        isSel
                          ? 'border-[#AF101A] bg-red-950/60 shadow-md ring-1 ring-[#AF101A]'
                          : 'border-white/10 bg-[#18181B] hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono-code font-extrabold text-xs text-white">{ord.id}</span>
                        <span className={`text-[10px] font-mono-code font-extrabold px-2 py-0.5 rounded-full border ${
                          ord.status === 'Cancelled' ? 'bg-red-950 text-red-400 border-red-800' :
                          ord.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                          ord.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                          'bg-amber-950 text-amber-400 border-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate max-w-[200px] mt-1 font-mono-code">
                        {itemSummary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-white/40 mt-1.5 font-mono-code">
                        <span>RM {ord.total.toFixed(2)}</span>
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Order Details Card */}
          {activeOrder && (
            <>
              <div className="bg-[#111113] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40 font-mono-code font-bold uppercase tracking-wider">Order Reference:</span>
                      <span className="font-mono-code font-extrabold text-xl text-white">{activeOrder.id}</span>
                      <span className={`text-[11px] font-mono-code font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isCancelled ? 'bg-red-950 text-red-400 border-red-800' :
                        activeOrder.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        isPaid ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        'bg-amber-950 text-amber-400 border-amber-800'
                      }`}>
                        {activeOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-1 font-mono-code">
                      Placed on: {new Date(activeOrder.createdAt).toLocaleDateString('en-MY', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Invoice Download Button */}
                    <button
                      onClick={() => {
                        try {
                          generateOrderInvoicePDF(activeOrder);
                          showToast(`Generated official invoice for ${activeOrder.id}! 📄`, 'success');
                        } catch (err: any) {
                          showToast('Could not generate invoice PDF', 'warning');
                        }
                      }}
                      className="px-3.5 py-2 bg-[#18181B] hover:bg-white/10 text-white font-mono-code font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-white/70" />
                      <span>Download Invoice PDF</span>
                    </button>

                    {/* Copy Tracking */}
                    <button
                      onClick={() => copyTracking(activeOrder.trackingNumber || activeOrder.id)}
                      className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900/80 text-[#FF4D5A] font-mono-code font-bold text-xs rounded-xl border border-red-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Tracking #{activeOrder.trackingNumber?.slice(-6) || 'CODE'}</span>
                    </button>
                  </div>
                </div>

                {/* Tracking & Courier Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#18181B] p-4 rounded-2xl border border-white/10 text-xs font-mono-code">
                  <div>
                    <span className="text-white/40 block font-bold mb-0.5">Courier Partner</span>
                    <strong className="text-white flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#FF4D5A]" />
                      J&amp;T Express / Pos Laju Malaysia
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/40 block font-bold mb-0.5">Tracking Number</span>
                    <strong className="text-white font-mono-code flex items-center gap-1">
                      {activeOrder.trackingNumber || 'MY-CBI-982103'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/40 block font-bold mb-0.5">Estimated Delivery</span>
                    <strong className="text-emerald-400 font-bold">
                      {activeOrder.estimatedDelivery || '1–3 Business Days'}
                    </strong>
                  </div>
                </div>

                {/* Bambu Lab Live Printing Status Preview if in Printing state */}
                {activeOrder.status === 'Printing' && (
                  <div className="p-4 bg-black/60 border border-white/10 text-white rounded-2xl space-y-3 font-mono-code">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-[#FF4D5A]">
                        <Printer className="w-4 h-4 animate-pulse" />
                        PRINTER #02 — BAMBU LAB X1-CARBON (ACTIVE PRINTING)
                      </span>
                      <span className="text-white/40">Bed: 60°C | Nozzle: 220°C</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#AF101A] h-full w-2/3 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40 font-mono-code">
                      <span>Layer 185 / 280 (66% complete)</span>
                      <span>Est. completion: 22 mins</span>
                    </div>
                  </div>
                )}

                {/* Step Timeline */}
                <div className="pt-2 space-y-5">
                  <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
                    {isCancelled ? 'Order Status' : 'Production & Delivery Timeline'}
                  </h3>

                  <div className="space-y-4">
                    {steps.map((step) => {
                      const state = getStepState(step.status);

                      return (
                        <div key={step.status} className="flex gap-4 items-start font-mono-code">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border transition-all ${
                            state === 'cancelled' ? 'bg-red-950 text-red-400 border-red-700' :
                            state === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-700' :
                            state === 'current' ? (isPaid ? 'bg-[#AF101A] text-white border-[#FF4D5A] shadow-lg shadow-red-950/80' : 'bg-amber-950 text-amber-400 border-amber-600') :
                            'bg-[#18181B] text-white/30 border-white/10'
                          }`}>
                            {state === 'cancelled' ? '✕' : state === 'completed' ? '✓' : step.icon}
                          </div>

                          <div className="flex-1 pt-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className={`font-bold text-sm ${
                                state === 'cancelled' ? 'text-red-400' :
                                state === 'current' ? (isPaid ? 'text-[#FF4D5A]' : 'text-amber-400') : 
                                state === 'completed' ? 'text-white' : 'text-white/40'
                              }`}>
                                {step.label}
                              </h4>
                              {state === 'current' && !isCancelled && (
                                <span className={`text-[10px] font-mono-code font-extrabold px-2 py-0.5 rounded border uppercase ${
                                  isPaid ? 'bg-red-950 text-[#FF4D5A] border-red-800' : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                                }`}>
                                  {isPaid ? 'In Progress' : 'Pending Verification'}
                                </span>
                              )}
                              {state === 'cancelled' && (
                                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 font-extrabold px-2 py-0.5 rounded uppercase">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/50 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Customer Information & Purchased Items Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Information Card */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3.5 text-xs font-mono-code">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#FF4D5A]" />
                      <span>Customer &amp; Delivery Details</span>
                    </h4>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold border border-emerald-800">
                      Active Order
                    </span>
                  </div>

                  <div className="space-y-2 text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">Full Name:</span>
                      <strong className="text-white">{activeOrder.customer.fullName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Phone Number:</span>
                      <strong className="text-white font-mono-code">{activeOrder.customer.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Email Address:</span>
                      <span className="text-white">{activeOrder.customer.email || '—'}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-white/40 block mb-0.5">Shipping Address:</span>
                      <span className="text-white leading-relaxed block">
                        {activeOrder.customer.address}, {activeOrder.customer.city}, {activeOrder.customer.state} {activeOrder.customer.postcode}
                      </span>
                    </div>
                    {activeOrder.customer.notes && (
                      <div className="pt-1 text-[11px] text-white/50 italic">
                        Note: "{activeOrder.customer.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchased Items Card */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3.5 text-xs font-mono-code">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-[#FF4D5A]" />
                      <span>Things You Bought ({activeOrder.items.length})</span>
                    </h4>
                    <span className="font-mono-code font-bold text-[#FF4D5A]">Total: RM {activeOrder.total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-white/10">
                    {activeOrder.items.map((it, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-white block font-bold text-sm">{it.name}</strong>
                            <span className="text-white/50 text-[11px]">
                              Color: <strong className="text-white">{it.color}</strong> • Material: <strong className="text-white">{it.material}</strong> • Qty: <strong className="text-white">{it.quantity}</strong>
                            </span>
                          </div>
                          <span className="font-bold text-white text-sm">
                            RM {(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Custom print specifications if any */}
                        {(it.customDetails || it.customText) && (
                          <div className="p-2.5 bg-[#18181B] rounded-xl text-white/80 text-xs border border-white/10 space-y-1">
                            <span className="font-bold text-[#FF4D5A] block text-[11px]">Custom 3D Print Specs:</span>
                            <p className="whitespace-pre-wrap break-words text-[11px] leading-relaxed">
                              {it.customDetails || it.customText}
                            </p>
                          </div>
                        )}

                        {/* Custom Drawing / Artwork thumbnail if present */}
                        {(it.drawingImage || it.customDesignUrl) && (
                          <div className="pt-1 flex items-center gap-2">
                            <img 
                              src={it.customDesignUrl || it.drawingImage} 
                              alt="Custom Chili Artwork" 
                              className="w-12 h-12 object-contain bg-black/60 rounded-lg border border-white/10 p-1 shadow-inner"
                            />
                            <span className="text-[10px] text-white/50 font-mono-code">Custom Artwork / 3D Extrusion</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-white/50 font-medium">Payment Status:</span>
                    {isCancelled ? (
                      <span className="font-extrabold text-red-400 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-800 uppercase text-[10px]">
                        Order Cancelled (Not Paid)
                      </span>
                    ) : isPaid ? (
                      <span className="font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 uppercase text-[10px]">
                        Paid &amp; Verified via Touch 'n Go
                      </span>
                    ) : activeOrder.paymentStatus === 'payment_submitted' ? (
                      <span className="font-extrabold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 uppercase text-[10px] animate-pulse">
                        Payment Submitted (Pending Verification)
                      </span>
                    ) : (
                      <span className="font-extrabold text-white/70 bg-[#18181B] px-2.5 py-0.5 rounded-full border border-white/10 uppercase text-[10px]">
                        Pending Touch 'n Go Payment
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};
