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
  const { orders, trackedOrderId, setTrackedOrderId, showToast, setCurrentView } = useApp();

  // Search input state for quick filtering
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(trackedOrderId || '');

  // Filter orders based on user filter query (if typed), otherwise show all user orders
  const displayedOrders = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return orders;

    const normQPhone = normalizePhone(q);

    return orders.filter(ord => {
      // 1. Check Order ID
      if (ord.id.toLowerCase().includes(q) || (ord.orderId && ord.orderId.toLowerCase().includes(q))) {
        return true;
      }

      // 2. Check Customer Name
      if (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(q)) {
        return true;
      }

      // 3. Check Phone
      if (normQPhone.length >= 3) {
        const ordPhoneNorm = normalizePhone(ord.customer?.phone);
        if (ordPhoneNorm && ordPhoneNorm.includes(normQPhone)) {
          return true;
        }
      }

      // 4. Check Tracking code
      if (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(q)) {
        return true;
      }

      return false;
    });
  }, [orders, filterQuery]);

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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 text-[#af101a] rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0">
            <PackageCheck className="w-8 h-8 text-[#af101a]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100/70 text-[#af101a] text-[11px] font-extrabold rounded-full mb-1">
              <span>Cabai Live Production Hub</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
              Purchases & Order Tracker
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Track your 3D print queue, slicing progress, and courier delivery live.
            </p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order #, Name, Phone..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-xs focus:outline-hidden focus:border-[#af101a] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders List / Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#af101a] flex items-center justify-center mx-auto text-3xl">
            📦
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-gray-900 text-lg">No Orders Made Yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              You haven't placed any 3D print orders yet. Browse our signature products like the Keyboard Clicker or design a custom Name Tag!
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore 3D Products</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all"
            >
              <span>Custom Draw Lab</span>
            </button>
          </div>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-gray-800 text-base">No Orders Match "{filterQuery}"</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't find any orders matching your search query. Try searching by Order ID (e.g. CBI-1001) or clearing the search box.
            </p>
          </div>
          <button
            onClick={() => setFilterQuery('')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
          >
            Show All Orders ({orders.length})
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Orders Switcher / Tabs if multiple orders */}
          {displayedOrders.length > 1 && (
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#af101a]" />
                  <span>Select an Order to View ({displayedOrders.length} Available)</span>
                </span>
                <span className="text-[11px] text-gray-400 font-medium">Click to inspect status</span>
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
                      className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all ${
                        isSel
                          ? 'border-[#af101a] bg-red-50/80 shadow-xs ring-2 ring-red-200'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono font-extrabold text-xs text-gray-900">{ord.id}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ord.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-[200px] mt-1">
                        {itemSummary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Reference:</span>
                      <span className="font-mono font-extrabold text-xl text-gray-900">{activeOrder.id}</span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isCancelled ? 'bg-red-100 text-red-700' :
                        activeOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        isPaid ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {activeOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
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
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>Download Invoice PDF</span>
                    </button>

                    {/* Copy Tracking */}
                    <button
                      onClick={() => copyTracking(activeOrder.trackingNumber || activeOrder.id)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#af101a] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Tracking #{activeOrder.trackingNumber?.slice(-6) || 'CODE'}</span>
                    </button>
                  </div>
                </div>

                {/* Tracking & Courier Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block font-bold mb-0.5">Courier Partner</span>
                    <strong className="text-gray-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#af101a]" />
                      J&T Express / Pos Laju Malaysia
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold mb-0.5">Tracking Number</span>
                    <strong className="text-gray-900 font-mono flex items-center gap-1">
                      {activeOrder.trackingNumber || 'MY-CBI-982103'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold mb-0.5">Estimated Delivery</span>
                    <strong className="text-emerald-700 font-bold">
                      {activeOrder.estimatedDelivery || '1–3 Business Days'}
                    </strong>
                  </div>
                </div>

                {/* Bambu Lab Live Printing Status Preview if in Printing state */}
                {activeOrder.status === 'Printing' && (
                  <div className="p-4 bg-gray-900 text-white rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-red-400">
                        <Printer className="w-4 h-4 animate-pulse" />
                        PRINTER #02 — BAMBU LAB X1-CARBON (ACTIVE PRINTING)
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
                      <span>Customer & Delivery Details</span>
                    </h4>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      Active Order
                    </span>
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
