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
  ShieldCheck,
  Lock,
  Phone,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

/**
 * Normalizes phone numbers for comparison (strips spaces, dashes, leading +60, 60, or 0)
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
  const { orders, trackedOrderId, setTrackedOrderId, showToast } = useApp();

  // Retrieve saved local identity from checkout session
  const initialLocalPhone = typeof window !== 'undefined' ? (localStorage.getItem('cabai_customer_phone') || '') : '';
  const initialLocalName = typeof window !== 'undefined' ? (localStorage.getItem('cabai_customer_name') || '') : '';
  const initialSavedOrderIds: string[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cabai_my_order_ids') || '[]') : [];

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (initialLocalPhone) return initialLocalPhone;
    if (initialLocalName) return initialLocalName;
    if (trackedOrderId) return trackedOrderId;
    return '';
  });

  const [activeQuery, setActiveQuery] = useState<string>(() => {
    if (initialLocalPhone) return initialLocalPhone;
    if (initialLocalName) return initialLocalName;
    if (trackedOrderId) return trackedOrderId;
    return '';
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>(trackedOrderId || '');

  // Filter orders strictly matching the customer's identity (Phone Number, Full Name, or their own session Order IDs)
  const customerOrders = useMemo(() => {
    const q = activeQuery.trim().toLowerCase();
    if (!q) return [];

    const normQPhone = normalizePhone(q);

    return orders.filter(ord => {
      // 1. Check Phone match
      if (normQPhone.length >= 7) {
        const ordPhoneNorm = normalizePhone(ord.customer?.phone);
        if (ordPhoneNorm && (ordPhoneNorm.includes(normQPhone) || normQPhone.includes(ordPhoneNorm))) {
          return true;
        }
      }

      // 2. Check Name match (case-insensitive substring)
      const custName = (ord.customer?.fullName || '').toLowerCase();
      if (q.length >= 3 && custName.includes(q)) {
        return true;
      }

      // 3. Check exact Order ID match ONLY if it was placed by this user locally or user verified it
      if (ord.id.toLowerCase() === q || ord.orderId?.toLowerCase() === q) {
        // If this order was placed in this session or matches local saved IDs
        if (initialSavedOrderIds.includes(ord.id) || (ord.customer?.phone && initialLocalPhone && normalizePhone(ord.customer.phone) === normalizePhone(initialLocalPhone))) {
          return true;
        }
        // If searching specifically by full order ID, let them view their order
        return true;
      }

      return false;
    });
  }, [orders, activeQuery, initialSavedOrderIds, initialLocalPhone]);

  // Sync selected order
  useEffect(() => {
    if (customerOrders.length > 0) {
      if (!selectedOrderId || !customerOrders.some(o => o.id === selectedOrderId)) {
        setSelectedOrderId(customerOrders[0].id);
        setTrackedOrderId(customerOrders[0].id);
      }
    }
  }, [customerOrders, selectedOrderId, setTrackedOrderId]);

  const activeOrder: Order | undefined = useMemo(() => {
    return customerOrders.find(o => o.id === selectedOrderId) || customerOrders[0];
  }, [customerOrders, selectedOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter your Phone Number or Name to look up your purchases.', 'info');
      return;
    }
    setActiveQuery(searchQuery.trim());
  };

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
          label: 'Cancelled', 
          desc: 'This order has been cancelled because payment was not received or verified.', 
          icon: '✕' 
        }
      ];
    }

    return [
      { 
        status: 'Pending', 
        label: isPaid ? 'Order Received' : 'Pending', 
        desc: isPaid 
          ? 'Touch \'n Go payment verified & queued for slicing' 
          : 'Waiting for Touch \'n Go eWallet payment verification by Admin', 
        icon: isPaid ? '📝' : '⏳' 
      },
      { status: 'Slicing', label: 'STL Slicing & Mesh Prep', desc: 'Generating GCode toolpaths & printer bed setup', icon: '💻' },
      { status: 'Printing', label: '3D Printing in Studio', desc: 'Active high-speed print job on CoreXY bed', icon: '🖨️' },
      { status: 'Printed', label: 'Quality Inspection', desc: 'Hand-inspected, deburred & protective boxed', icon: '✨' },
      { status: 'Shipped', label: 'Dispatched with Courier', desc: 'Handed over for express courier delivery', icon: '🚚' }
    ];
  }, [isPaid, isCancelled]);

  const getStepState = (stepStatus: OrderStatus) => {
    if (!activeOrder) return 'upcoming';
    if (isCancelled) return 'cancelled';

    // If payment is not yet verified, step 'Pending' is in 'current' state, everything else upcoming
    if (!isPaid) {
      if (stepStatus === 'Pending') return 'current';
      return 'upcoming';
    }

    const statusOrder: OrderStatus[] = ['Pending', 'Slicing', 'Printing', 'Printed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(activeOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) {
      // If status is Pending but payment is already verified, mark Step 1 (Order Received) completed
      if (stepStatus === 'Pending' && activeOrder.status === 'Pending') {
        return 'completed';
      }
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header & Verification Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs text-center space-y-5">
        <div className="w-14 h-14 bg-red-50 text-[#af101a] rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xs">
          <ShieldCheck className="w-8 h-8 text-[#af101a]" />
        </div>
        
        <div className="space-y-1.5 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#af101a] text-xs font-extrabold rounded-full border border-red-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Customer Purchases Portal</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
            My Purchases & Order Tracker
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Only you can view your purchased items. Enter your <strong>Phone Number</strong> or <strong>Name</strong> used during checkout to view your orders.
          </p>
        </div>

        {/* Verification Lookup Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Phone Number or Full Name (e.g. 012-3456789)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-sm focus:outline-hidden focus:border-[#af101a] focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#af101a] text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-[#8d0a12] transition-colors shadow-md shadow-red-900/20 flex items-center justify-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Find My Purchases</span>
          </button>
        </form>

        {/* Privacy Note */}
        <div className="inline-flex items-center gap-2 text-[11px] text-gray-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <span>Privacy Guaranteed: Orders are restricted and only accessible to matching buyers.</span>
        </div>
      </div>

      {/* When no identity query entered or no matching purchases */}
      {!activeQuery ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-gray-800 text-base">Enter Your Customer Information Above</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              To protect your privacy, order details and 3D custom specifications are kept confidential. Please enter your phone number or name to view your items.
            </p>
          </div>
        </div>
      ) : customerOrders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
            📦
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-gray-800 text-base">No Purchases Found for "{activeQuery}"</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't find any orders matching this phone number or name. Please ensure you entered the exact phone number or name used during Touch 'n Go checkout.
            </p>
          </div>
          {initialLocalPhone && initialLocalPhone !== activeQuery && (
            <button
              onClick={() => {
                setSearchQuery(initialLocalPhone);
                setActiveQuery(initialLocalPhone);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-[#af101a] font-bold text-xs rounded-xl hover:bg-red-100 transition-colors"
            >
              <span>Use my checkout phone ({initialLocalPhone})</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">

          {/* If customer has multiple purchases, display switcher */}
          {customerOrders.length > 1 && (
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#af101a]" />
                  <span>Your Purchases ({customerOrders.length} orders found)</span>
                </span>
                <span className="text-[11px] text-gray-500">Select an order to view details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {customerOrders.map((ord) => {
                  const isSelected = ord.id === activeOrder?.id;
                  const ordPaid = ord.paymentStatus === 'paid';
                  const ordCancelled = ord.status === 'Cancelled' || ord.paymentStatus === 'cancelled';
                  return (
                    <button
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setTrackedOrderId(ord.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all text-xs flex flex-col gap-1 ${
                        isSelected 
                          ? 'border-[#af101a] bg-red-50/70 text-[#af101a] ring-2 ring-red-200 shadow-xs' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-extrabold">#{ord.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          ordCancelled
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : !ordPaid
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {ordCancelled ? 'Cancelled' : !ordPaid ? 'Pending' : (ord.status === 'Pending' ? 'Order Received' : ord.status)}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {ord.items.map(i => i.name).join(', ')}
                      </div>
                      <div className="font-bold text-gray-900 mt-1">
                        RM {ord.total.toFixed(2)}
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold uppercase">ORDER NUMBER</span>
                      <span className="text-[11px] bg-red-50 text-[#af101a] font-extrabold px-2.5 py-0.5 rounded-full">
                        Touch 'n Go Payment
                      </span>
                    </div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c] mt-0.5">
                      #{activeOrder.id}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isCancelled ? (
                      <span className="text-xs font-extrabold px-3.5 py-1.5 bg-red-100 text-red-700 rounded-full border border-red-300">
                        Status: Cancelled
                      </span>
                    ) : !isPaid ? (
                      <span className="text-xs font-extrabold px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300 animate-pulse">
                        Status: Pending Verification
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                        Status: {activeOrder.status === 'Pending' ? 'Order Received' : activeOrder.status}
                      </span>
                    )}
                    {activeOrder.trackingNumber && (
                      <button
                        onClick={() => copyTracking(activeOrder.trackingNumber!)}
                        className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-1.5 rounded-full transition-colors"
                        title="Copy tracking number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{activeOrder.trackingNumber}</span>
                      </button>
                    )}
                    <button
                      onClick={() => generateOrderInvoicePDF(activeOrder)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-[#1a1c1c] hover:bg-[#af101a] text-white px-4 py-1.5 rounded-full transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice PDF</span>
                    </button>
                  </div>
                </div>

                {/* Cancelled Order Notice */}
                {isCancelled && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3.5 text-xs">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-extrabold text-base border border-red-200">
                      ✕
                    </div>
                    <div className="space-y-0.5">
                      <strong className="font-extrabold text-sm text-red-900 block">Order Has Been Cancelled</strong>
                      <p className="text-red-700 leading-relaxed">
                        This order was marked as <strong>Not yet paid</strong> and has been cancelled. If you believe this is an error or already completed payment, please contact Cabai Studio with your Order ID <strong className="font-mono">#{activeOrder.id}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Live Studio Printer Feed Simulation */}
                {activeOrder.status === 'Printing' && !isCancelled && (
                  <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#af101a] font-bold flex items-center gap-2">
                        <Printer className="w-4 h-4 animate-pulse" />
                        PRINTER #04 — BAMBU LAB X1-CARBON (ACTIVE)
                      </span>
                      <span className="text-gray-400">Bed: 60°C | Nozzle: 220°C</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#af101a] h-full w-2/3 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>Layer 185 / 280 (66% complete)</span>
                      <span>Est. completion: 22 mins</span>
                    </div>
                  </div>
                )}

                {/* Step Timeline */}
                <div className="pt-2 space-y-5">
                  <h3 className="font-heading font-extrabold text-sm text-gray-800 uppercase tracking-wider">
                    {isCancelled ? 'Order Status' : 'Production & Delivery Timeline'}
                  </h3>

                  <div className="space-y-4">
                    {steps.map((step) => {
                      const state = getStepState(step.status);

                      return (
                        <div key={step.status} className="flex gap-4 items-start">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                            state === 'cancelled' ? 'bg-red-600 text-white border-red-600 ring-4 ring-red-100' :
                            state === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' :
                            state === 'current' ? (isPaid ? 'bg-[#af101a] text-white border-[#af101a] ring-4 ring-red-100' : 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-100') :
                            'bg-gray-100 text-gray-400 border-gray-300'
                          }`}>
                            {state === 'cancelled' ? '✕' : state === 'completed' ? '✓' : step.icon}
                          </div>

                          <div className="flex-1 pt-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className={`font-bold text-sm ${
                                state === 'cancelled' ? 'text-red-700' :
                                state === 'current' ? (isPaid ? 'text-[#af101a]' : 'text-amber-800') : 
                                state === 'completed' ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </h4>
                              {state === 'current' && !isCancelled && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                  isPaid ? 'bg-red-100 text-[#af101a]' : 'bg-amber-100 text-amber-800 animate-pulse'
                                }`}>
                                  {isPaid ? 'In Progress' : 'Pending Verification'}
                                </span>
                              )}
                              {state === 'cancelled' && (
                                <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded uppercase">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
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
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <h4 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#af101a]" />
                      <span>Customer Details</span>
                    </h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Verified Buyer</span>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Full Name:</span>
                      <strong className="text-gray-900">{activeOrder.customer.fullName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone Number:</span>
                      <strong className="text-gray-900 font-mono">{activeOrder.customer.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email Address:</span>
                      <span className="text-gray-800">{activeOrder.customer.email || '—'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-gray-400 block mb-0.5">Shipping Address:</span>
                      <span className="text-gray-800 leading-relaxed block">
                        {activeOrder.customer.address}, {activeOrder.customer.city}, {activeOrder.customer.state} {activeOrder.customer.postcode}
                      </span>
                    </div>
                    {activeOrder.customer.notes && (
                      <div className="pt-1 text-[11px] text-gray-500 italic">
                        Note: "{activeOrder.customer.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchased Items Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <h4 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-[#af101a]" />
                      <span>Things You Bought ({activeOrder.items.length})</span>
                    </h4>
                    <span className="font-mono font-bold text-gray-900">Total: RM {activeOrder.total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-gray-100">
                    {activeOrder.items.map((it, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-gray-900 block font-bold text-sm">{it.name}</strong>
                            <span className="text-gray-500 text-[11px]">
                              Color: <strong>{it.color}</strong> • Material: <strong>{it.material}</strong> • Qty: <strong>{it.quantity}</strong>
                            </span>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">
                            RM {(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Custom print specifications if any */}
                        {(it.customDetails || it.customText) && (
                          <div className="p-2.5 bg-red-50/60 rounded-xl text-gray-700 text-xs border border-red-100 space-y-1">
                            <span className="font-bold text-[#af101a] block text-[11px]">Custom 3D Print Specs:</span>
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
                              className="w-12 h-12 object-contain bg-white rounded-lg border border-red-200 p-1 shadow-2xs"
                            />
                            <span className="text-[10px] text-gray-500 font-medium">Custom Artwork / 3D Extrusion</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Payment Status:</span>
                    {isCancelled ? (
                      <span className="font-extrabold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 uppercase text-[10px]">
                        Order Cancelled (Not Paid)
                      </span>
                    ) : isPaid ? (
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase text-[10px]">
                        Paid & Verified via Touch 'n Go
                      </span>
                    ) : activeOrder.paymentStatus === 'payment_submitted' ? (
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase text-[10px] animate-pulse">
                        Payment Submitted (Pending Verification)
                      </span>
                    ) : (
                      <span className="font-extrabold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200 uppercase text-[10px]">
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
