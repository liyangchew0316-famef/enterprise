import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, PaymentStatus } from '../types';
import { TNG_PAYMENT_CONFIG } from '../config/paymentConfig';
import { subscribeToOrderById, updatePaymentStatusInFirestore } from '../lib/firestoreService';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  QrCode, 
  Sparkles, 
  Loader2, 
  Download, 
  ExternalLink,
  PhoneCall,
  FileText,
  Truck,
  RotateCcw,
  BadgeCheck,
  Zap
} from 'lucide-react';

interface TngPaymentViewProps {
  orderId?: string;
  onBackToShop?: () => void;
}

export const TngPaymentView: React.FC<TngPaymentViewProps> = ({ orderId: propOrderId, onBackToShop }) => {
  const { 
    orders, 
    trackedOrderId, 
    setTrackedOrderId, 
    setCurrentView, 
    showToast 
  } = useApp();

  // Determine active order ID to view
  const activeOrderId = propOrderId || trackedOrderId || (orders.length > 0 ? orders[0].id : '');
  
  // Local state for the live order
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    return orders.find(o => o.id === activeOrderId) || null;
  });

  // Flow step: 1 = Scan QR, 2 = Confirm & Done Payment warning screen
  const [flowStep, setFlowStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [copiedMerchant, setCopiedMerchant] = useState<boolean>(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(!currentOrder);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Set up real-time Firestore listener using onSnapshot()
  useEffect(() => {
    if (!activeOrderId) {
      setIsLoadingOrder(false);
      return;
    }

    console.log('[TngPaymentView] Setting up real-time onSnapshot listener for Order:', activeOrderId);
    setIsLiveConnected(true);

    const unsubscribe = subscribeToOrderById(
      activeOrderId,
      (updatedOrder) => {
        if (updatedOrder) {
          console.log('[TngPaymentView] 🔔 Real-time order update received:', updatedOrder.id, 'paymentStatus:', updatedOrder.paymentStatus);
          setCurrentOrder(updatedOrder);
          setIsLoadingOrder(false);

          // If Admin marked as paid in real-time, trigger notification
          if (updatedOrder.paymentStatus === 'paid' && currentOrder?.paymentStatus !== 'paid') {
            showToast('🎉 Payment verified by Admin! Your order is confirmed.', 'success');
          }
        } else {
          // If not in firestore yet, fallback to context orders
          const localMatch = orders.find(o => o.id === activeOrderId);
          if (localMatch) {
            setCurrentOrder(localMatch);
          }
          setIsLoadingOrder(false);
        }
      },
      (err) => {
        console.warn('[TngPaymentView] Firestore listener error:', err);
        setIsLiveConnected(false);
      }
    );

    return () => {
      console.log('[TngPaymentView] Unsubscribing onSnapshot for Order:', activeOrderId);
      unsubscribe();
    };
  }, [activeOrderId, orders]);

  // Copy helper
  const handleCopy = (text: string, type: 'amount' | 'order' | 'merchant') => {
    navigator.clipboard.writeText(text);
    if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
      showToast(`Copied amount RM ${text} to clipboard!`, 'info');
    } else if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
      showToast(`Copied Order ID ${text} to clipboard!`, 'info');
    } else {
      setCopiedMerchant(true);
      setTimeout(() => setCopiedMerchant(false), 2000);
      showToast(`Copied recipient ${text} to clipboard!`, 'info');
    }
  };

  // Step 10 & 12: Customer clicks "Done Payment"
  // DO NOT set paymentStatus to "paid" -> update Firestore paymentStatus: "payment_submitted"
  const handleDonePayment = async () => {
    if (!currentOrder || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await updatePaymentStatusInFirestore(
        currentOrder.id,
        'payment_submitted',
        {
          paymentSubmittedAt: new Date().toISOString(),
          note: 'Customer confirmed manual Touch \'n Go eWallet transfer.'
        }
      );

      if (success) {
        showToast('Payment submitted! We will verify your payment shortly.', 'success');
        // Update local state immediately for instant feedback
        setCurrentOrder(prev => prev ? {
          ...prev,
          paymentStatus: 'payment_submitted',
          paymentSubmittedAt: new Date().toISOString()
        } : null);
        setFlowStep(1);
      } else {
        showToast('Failed to update payment status. Please check your connection.', 'warning');
      }
    } catch (err: any) {
      console.error('[TngPaymentView] Error submitting payment:', err);
      showToast(`Error: ${err?.message || 'Could not submit payment status'}`, 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoadingOrder && !currentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF4D5A] mx-auto" />
        <h2 className="font-heading font-extrabold text-xl text-white">Loading Order Details...</h2>
        <p className="text-xs text-white/50 font-mono-code">Connecting securely to Cloud Firestore database</p>
      </div>
    );
  }

  // If no order is found
  if (!currentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 text-white">
        <div className="w-16 h-16 bg-red-950/80 text-[#FF4D5A] border border-red-800/80 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xl">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-white">No Active Order Found</h1>
        <p className="text-xs text-white/60 max-w-md mx-auto">
          Please select an order from your history or checkout your cart to make a Touch 'n Go payment.
        </p>
        <button
          onClick={() => {
            if (onBackToShop) onBackToShop();
            else setCurrentView('shop');
          }}
          className="px-6 py-3 bg-[#AF101A] hover:bg-[#E11D48] text-white font-mono-code font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const orderAmount = currentOrder.total || currentOrder.amount || 0;
  const currentPaymentStatus: PaymentStatus = currentOrder.paymentStatus || 'pending';

  // =========================================================================
  // VIEW 0: PAYMENT CANCELLED (paymentStatus === 'cancelled' or status === 'Cancelled')
  // =========================================================================
  if (currentPaymentStatus === 'cancelled' || currentOrder.status === 'Cancelled') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-fadeIn text-white">
        <div className="bg-[#111113] rounded-3xl border border-red-800/60 p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-red-950 text-red-400 border border-red-800 rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ring-red-950/50">
            <span className="text-3xl font-extrabold">✕</span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 text-red-300 text-xs font-mono-code font-extrabold rounded-full border border-red-800 uppercase tracking-wider">
              <span>Order Cancelled</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Payment Not Received — Order Cancelled
            </h1>
            
            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              Order <strong className="text-[#FF4D5A] font-mono-code">#{currentOrder.id}</strong> has been cancelled because payment was not received or verified.
            </p>
          </div>

          <div className="bg-[#18181B] rounded-2xl p-5 border border-white/10 text-left max-w-md mx-auto space-y-2 text-xs font-mono-code">
            <div className="flex justify-between">
              <span className="text-white/50">Order ID:</span>
              <strong className="text-white">#{currentOrder.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Customer:</span>
              <strong className="text-white">{currentOrder.customer.fullName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Order Total:</span>
              <strong className="text-white">RM {orderAmount.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white/50 font-bold">Status:</span>
              <span className="text-red-300 font-extrabold bg-red-950/80 border border-red-800 px-2 py-0.5 rounded">Cancelled</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono-code">
            <button
              onClick={() => {
                setTrackedOrderId(currentOrder.id);
                setCurrentView('order_tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Check Order Tracker</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#AF101A] hover:bg-[#E11D48] text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Return to Catalog & Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: PAYMENT SUCCESS (paymentStatus === 'paid')
  // Automatically displayed when Admin verifies the transfer in Firestore!
  // =========================================================================
  if (currentPaymentStatus === 'paid') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn text-white">
        
        {/* Success Card */}
        <div className="bg-[#111113] rounded-3xl border border-emerald-500/40 p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {/* Top subtle decorative banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Animated check icon */}
          <div className="w-20 h-20 bg-emerald-950/80 text-emerald-400 border border-emerald-700/80 rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-950/50 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 text-emerald-300 text-xs font-mono-code font-extrabold rounded-full border border-emerald-800 uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Payment Verified &amp; Confirmed</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Payment Successful!
            </h1>
            
            <p className="text-sm font-medium text-white/60 max-w-md mx-auto">
              Your Touch 'n Go payment has been verified by the studio team. Order received and queued for 3D printing! 🌶️
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="bg-[#18181B] rounded-2xl p-6 border border-white/10 text-left max-w-lg mx-auto space-y-3.5 text-xs font-mono-code">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-white/40 font-bold uppercase text-[11px]">Order ID</span>
              <span className="font-extrabold text-base text-[#FF4D5A]">#{currentOrder.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Exact Amount Paid:</span>
              <span className="font-extrabold text-base text-emerald-400">RM {orderAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Payment Method:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Touch 'n Go eWallet (DuitNow QR)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Recipient Merchant:</span>
              <span className="font-bold text-white">{TNG_PAYMENT_CONFIG.merchantName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Customer:</span>
              <span className="font-bold text-white">{currentOrder.customer.fullName}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/50 font-bold">Studio Status:</span>
              <span className="font-extrabold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2.5 py-0.5 rounded-md">
                {currentOrder.status || 'Pending (Queued for Slicing)'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono-code">
            <button
              onClick={() => {
                setTrackedOrderId(currentOrder.id);
                setCurrentView('order_tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#AF101A] hover:bg-[#E11D48] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Parcel Status Live 🚚</span>
            </button>

            <button
              onClick={() => generateOrderInvoicePDF(currentOrder)}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Invoice PDF</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white/80 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PAYMENT SUBMITTED - WAITING FOR VERIFICATION
  // (paymentStatus === 'payment_submitted')
  // =========================================================================
  if (currentPaymentStatus === 'payment_submitted') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-fadeIn text-white">
        
        <div className="bg-[#111113] rounded-3xl border border-amber-700/60 p-8 sm:p-10 shadow-2xl text-center space-y-6">
          
          {/* Pulsing clock / radar indicator */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-amber-500 opacity-20 animate-ping" />
            <div className="relative w-20 h-20 bg-amber-950/80 text-amber-400 border border-amber-700 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-10 h-10 animate-spin-slow text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 text-amber-300 text-xs font-mono-code font-extrabold rounded-full border border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Waiting for payment verification</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Payment Submitted!
            </h1>

            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              We have received your payment notice for Order <strong className="text-[#FF4D5A] font-mono-code">#{currentOrder.id}</strong>. We will verify your payment shortly against our Touch 'n Go transaction logs.
            </p>
          </div>

          {/* Real-time Status Card */}
          <div className="p-5 bg-[#18181B] rounded-2xl border border-white/10 text-left space-y-3 text-xs font-mono-code">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-white/40 font-bold uppercase text-[10px]">Order Number:</span>
              <span className="font-extrabold text-sm text-[#FF4D5A]">#{currentOrder.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Submitted Amount:</span>
              <span className="font-extrabold text-sm text-white">RM {orderAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Payment Target:</span>
              <span className="font-bold text-white">{TNG_PAYMENT_CONFIG.merchantName} (TNG QR)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Current Status:</span>
              <span className="font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span>Verification In Progress</span>
              </span>
            </div>
          </div>

          {/* Real-time Live Notice */}
          <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-3 text-left">
            <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <strong className="block font-bold text-white">Auto-Updating Screen</strong>
              <p className="text-white/60 text-[11px]">
                You do NOT need to refresh this page. As soon as our admin confirms your payment in Firestore, this screen will instantly transition to <strong>Payment Success</strong>.
              </p>
            </div>
          </div>

          {/* Helper buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono-code">
            <button
              onClick={() => {
                setTrackedOrderId(currentOrder.id);
                setCurrentView('order_tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>View In Order Tracking</span>
            </button>

            <button
              onClick={() => setFlowStep(1)}
              className="w-full sm:w-auto px-5 py-3 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white/80 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>View QR Code Again</span>
            </button>
          </div>

          <div className="text-center pt-2 font-mono-code">
            <p className="text-[11px] text-white/40">
              Need urgent verification? WhatsApp us at <span className="text-white font-bold">{TNG_PAYMENT_CONFIG.supportContact}</span> with your order ID #{currentOrder.id}.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 3 - STEP 2: CONFIRMATION STEP
  // "Please make sure you have completed the payment before continuing."
  // =========================================================================
  if (flowStep === 2) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-fadeIn text-white">
        
        <div className="bg-[#111113] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <button
              onClick={() => setFlowStep(1)}
              className="p-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white transition-colors cursor-pointer"
              title="Back to QR Code"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-mono-code font-extrabold text-[#FF4D5A] uppercase tracking-wider">Step 2 of 2</span>
              <h2 className="font-heading font-extrabold text-lg text-white">Confirm Payment Submission</h2>
            </div>
          </div>

          {/* Attention Banner */}
          <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <strong className="block text-xs font-bold text-white">
                Please make sure you have completed the payment before continuing.
              </strong>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Ensure you have transferred the exact amount of <strong className="text-white font-mono-code">RM {orderAmount.toFixed(2)}</strong> to <strong className="text-white">{TNG_PAYMENT_CONFIG.merchantName}</strong> via your Touch 'n Go eWallet app.
              </p>
            </div>
          </div>

          {/* Transfer Details Verification Summary */}
          <div className="bg-[#18181B] rounded-2xl p-5 border border-white/10 space-y-3 text-xs font-mono-code">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
              <span className="text-white/40 font-bold">Order ID Reference:</span>
              <span className="font-extrabold text-sm text-[#FF4D5A]">#{currentOrder.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Customer Full Name:</span>
              <span className="font-bold text-white">{currentOrder.customer?.fullName || '—'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Contact Phone:</span>
              <span className="font-bold text-white">{currentOrder.customer?.phone || '—'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Delivery Address:</span>
              <span className="font-medium text-white/80 text-right max-w-[200px] truncate">
                {currentOrder.customer?.address ? `${currentOrder.customer.address}, ${currentOrder.customer.city}` : '—'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/50 font-medium">Exact Amount to Pay:</span>
              <span className="font-extrabold text-base text-[#FF4D5A]">RM {orderAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Recipient Account:</span>
              <span className="font-bold text-white">{TNG_PAYMENT_CONFIG.merchantName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/50 font-medium">Payment Channel:</span>
              <span className="font-bold text-white">Touch 'n Go / DuitNow QR</span>
            </div>
          </div>

          {/* Customer Confirmation Action */}
          <div className="space-y-3 pt-2 font-mono-code">
            <button
              onClick={handleDonePayment}
              disabled={isSubmitting}
              className="w-full py-4 bg-[#AF101A] hover:bg-[#E11D48] disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Submitting Payment Notice...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Done Payment (Submit for Verification)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFlowStep(1)}
              className="w-full py-3 bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white/70 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              ← Haven't paid yet? Back to Scan QR
            </button>
          </div>

          <p className="text-[11px] text-white/40 text-center font-mono-code">
            * Submitting payment will set your order status to <em>payment_submitted</em>. Our admin will verify your payment before dispatching your 3D print job.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 4 - STEP 1: DEDICATED TNG QR PAYMENT PAGE (paymentStatus === 'pending')
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-white">
      
      {/* Top Banner */}
      <div className="bg-[#111113] text-white p-6 sm:p-8 rounded-3xl border border-white/10 border-b-4 border-b-[#AF101A] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#FF4D5A] font-mono-code font-bold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#FF4D5A]" />
            <span>DIRECT TNG EWALLET GATEWAY</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Scan &amp; Pay with Touch 'n Go
          </h1>
          <p className="text-xs text-white/60">
            Manual QR payment verified directly by <strong className="text-white">CABAI ENTERPRISE™</strong> maker desk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#18181B] border border-white/10 px-4 py-2.5 rounded-2xl text-right shadow-inner">
            <span className="text-[10px] font-mono-code text-white/40 uppercase font-bold block">ORDER REFERENCE</span>
            <span className="font-mono-code font-black text-lg text-[#FF4D5A]">#{currentOrder.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: QR Card & Merchant Visual */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main QR Card */}
          <div className="bg-[#111113] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden">
            
            {/* Top TNG Header */}
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-blue-950/80 text-blue-300 text-[10px] font-mono-code font-bold rounded-full border border-blue-800/80 uppercase tracking-widest">
                {TNG_PAYMENT_CONFIG.walletName}
              </div>
              <h2 className="font-heading font-extrabold text-xl text-white tracking-wide">
                {TNG_PAYMENT_CONFIG.merchantName}
              </h2>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] bg-white p-3 rounded-3xl border-2 border-[#AF101A] shadow-xl">
              <img
                src={TNG_PAYMENT_CONFIG.qrImageUrl}
                alt="Touch 'n Go eWallet Malaysia National QR"
                className="w-full h-auto object-contain rounded-2xl mx-auto"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.warn('QR image load fallback triggered');
                  (e.target as HTMLImageElement).src = '/tng_qr_chew_li_yang.jpg';
                }}
              />
              
              <div className="pt-2 text-center">
                <span className="text-[10px] font-mono-code font-bold text-gray-700 uppercase tracking-widest block">
                  {TNG_PAYMENT_CONFIG.qrStandardName}
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-white/60 max-w-xs mx-auto font-medium leading-relaxed">
              Scan this QR with <strong className="text-white">TNG eWallet</strong> or any Malaysian banking app (MAE, CIMB, GrabPay, Public Bank).
            </p>

            {/* Quick Actions for QR */}
            <div className="flex items-center justify-center gap-3 pt-1 font-mono-code">
              <button
                type="button"
                onClick={() => handleCopy(TNG_PAYMENT_CONFIG.merchantName, 'merchant')}
                className="px-3.5 py-2 text-xs font-bold bg-[#18181B] hover:bg-[#27272A] text-white/80 hover:text-white rounded-xl transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                {copiedMerchant ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Merchant Name</span>
              </button>

              <a
                href={TNG_PAYMENT_CONFIG.qrImageUrl}
                download={`TNG_QR_${currentOrder.id}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-bold bg-red-950/80 hover:bg-red-900 text-[#FF4D5A] rounded-xl transition-colors flex items-center gap-1.5 border border-red-800/80 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>
            </div>

          </div>

        </div>

        {/* Right Column: Exact Amount, Instructions, and Action Button */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Amount Card */}
          <div className="bg-[#111113] rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-mono-code font-bold text-white/40 uppercase tracking-wider">Exact Amount to Pay</span>
              <span className="text-[10px] font-mono-code font-bold bg-red-950/80 text-[#FF4D5A] px-2.5 py-0.5 rounded-full border border-red-800/80">
                SST &amp; Shipping Included
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#FF4D5A] font-mono-code tracking-tight block">
                  RM {orderAmount.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono-code text-white/40">Order ID #{currentOrder.id}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(orderAmount.toFixed(2), 'amount')}
                className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-[#FF4D5A] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-red-800/80 cursor-pointer font-mono-code"
                title="Copy Exact Amount"
              >
                {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="font-mono-code font-bold">{copiedAmount ? 'Copied' : 'Copy RM'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-[#18181B] rounded-xl border border-white/10 text-xs space-y-2 font-mono-code">
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-medium">Order Reference:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-code font-bold text-white">#{currentOrder.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentOrder.id, 'order')}
                    className="text-white/40 hover:text-white cursor-pointer"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                <span className="text-white/50 font-medium">Customer:</span>
                <span className="font-bold text-white">{currentOrder.customer?.fullName || '—'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/50 font-medium">Phone Number:</span>
                <span className="font-mono-code font-bold text-white">{currentOrder.customer?.phone || '—'}</span>
              </div>
            </div>

          </div>

          {/* 5-Step Instructions Card */}
          <div className="bg-[#111113] rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4D5A]" />
              <span>How to Pay (Step-by-Step)</span>
            </h3>

            <ol className="space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#AF101A] text-white flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Open your <strong className="text-white">Touch 'n Go eWallet</strong> or banking app.</span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#AF101A] text-white flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Tap <strong className="text-white">Scan</strong> and point camera at the Malaysia National QR.</span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#AF101A] text-white flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>Confirm recipient name: <strong className="text-white">{TNG_PAYMENT_CONFIG.merchantName}</strong>.</span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#AF101A] text-white flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <span>Enter exact amount <strong className="text-[#FF4D5A] font-mono-code">RM {orderAmount.toFixed(2)}</strong> and transfer.</span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#AF101A] text-white flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  5
                </span>
                <span>Click the <strong className="text-white">Next</strong> button below to confirm your payment.</span>
              </li>
            </ol>
          </div>

          {/* Primary Action Button: Next (Moves to Step 2) */}
          <div className="space-y-3 font-mono-code">
            <button
              type="button"
              onClick={() => setFlowStep(2)}
              className="w-full py-4 bg-[#AF101A] hover:bg-[#E11D48] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>I Have Transferred &amp; Paid → Next</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onBackToShop) onBackToShop();
                else setCurrentView('shop');
              }}
              className="w-full py-2.5 text-xs text-white/40 hover:text-white font-bold transition-colors text-center cursor-pointer"
            >
              Cancel or Return to Shop Catalog
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
