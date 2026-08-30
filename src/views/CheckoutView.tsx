import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { CustomerInfo, PaymentMethod } from '../types';
import { MALAYSIAN_BANKS, MALAYSIAN_STATES } from '../data/mockData';
import { TNG_PAYMENT_CONFIG } from '../config/paymentConfig';
import { 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  Wallet, 
  Truck, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Loader2,
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    discountAmount, 
    placeOrder, 
    setCurrentView,
    setTrackedOrderId,
    currentUser
  } = useApp();

  const [customer, setCustomer] = useState<CustomerInfo>(() => ({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || currentUser?.phoneNumber || (typeof localStorage !== 'undefined' ? localStorage.getItem('cabai_customer_phone') || '' : ''),
    address: '',
    city: '',
    state: 'Selangor',
    postcode: '',
    notes: ''
  }));

  // Strictly only Touch 'n Go eWallet is accepted
  const [paymentMethod] = useState<PaymentMethod>('TNG');
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitProgressText, setSubmitProgressText] = useState<string>('Processing Order...');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const shipping = cartSubtotal >= 80 ? 0 : 8.00;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = Number((taxableAmount * 0.06).toFixed(2));
  const finalTotal = Number((taxableAmount + shipping + tax).toFixed(2));

  const validateCustomerInfo = (): boolean => {
    if (!customer.fullName.trim()) {
      setSubmitError('Please enter your Full Name.');
      return false;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      setSubmitError('Please enter a valid Email Address.');
      return false;
    }
    if (!customer.phone.trim() || customer.phone.trim().length < 8) {
      setSubmitError('Please enter a valid Malaysian Phone Number (e.g. 012-3456789).');
      return false;
    }
    if (!customer.address.trim()) {
      setSubmitError('Please enter your Street Delivery Address.');
      return false;
    }
    if (!customer.city.trim()) {
      setSubmitError('Please enter your City.');
      return false;
    }
    if (!customer.postcode.trim()) {
      setSubmitError('Please enter your 5-digit Postcode.');
      return false;
    }
    return true;
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setSubmitError(null);

    if (!validateCustomerInfo()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitProgressText('Saving customer order in Firestore...');

    try {
      const newOrd = await placeOrder(
        customer, 
        'TNG', 
        undefined,
        (progressStep) => {
          setSubmitProgressText(progressStep);
        }
      );
      
      // Store customer session credentials locally for private order lookup
      try {
        localStorage.setItem('cabai_customer_name', customer.fullName.trim());
        localStorage.setItem('cabai_customer_phone', customer.phone.trim());
        const savedIds: string[] = JSON.parse(localStorage.getItem('cabai_my_order_ids') || '[]');
        if (!savedIds.includes(newOrd.id)) {
          savedIds.unshift(newOrd.id);
          localStorage.setItem('cabai_my_order_ids', JSON.stringify(savedIds));
        }
      } catch (e) {
        console.warn('LocalStorage save note:', e);
      }

      setTrackedOrderId(newOrd.id);
      setCompletedOrderId(newOrd.id);

      // Direct user straight to dedicated TNG QR payment page
      setCurrentView('tng_payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[CheckoutView] Failed to place order:', err);
      const errorMessage = err?.message || 'An error occurred while finalizing your order. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Order Confirmed! 🌶️
        </h1>

        <p className="text-white/70 text-sm max-w-md mx-auto">
          Thank you for ordering with <strong>CABAI ENTERPRISE™</strong>. Your order ID is <strong className="text-[#FF4D5A] font-mono-code text-base">#{completedOrderId}</strong>.
        </p>

        <div className="p-6 bg-[#111113] rounded-2xl border border-white/10 text-left max-w-md mx-auto space-y-3 text-xs shadow-xl">
          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-white/40 font-mono-code font-bold">Status:</span>
            <span className="text-amber-400 font-mono-code font-extrabold">Received • Queued for Slicing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40 font-mono-code">Customer:</span>
            <span className="font-bold text-white">{customer.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40 font-mono-code">Delivery State:</span>
            <span className="font-bold text-white">{customer.state}, Malaysia</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white/40 font-mono-code font-bold">Total Paid:</span>
            <span className="font-mono-code font-extrabold text-sm text-[#FF4D5A]">RM {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setTrackedOrderId(completedOrderId);
              setCurrentView('order_tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#AF101A] text-white font-mono-code font-extrabold text-sm rounded-xl shadow-lg hover:bg-[#E11D48] transition-colors cursor-pointer"
          >
            Track Parcel Status Live 🚚
          </button>

          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#18181B] text-white font-mono-code font-bold text-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Return to Shop Catalog
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-white">Your cart is empty</h2>
        <p className="text-xs text-white/50 font-mono-code">Please add items from the 3D shop catalog before checking out.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 bg-[#AF101A] text-white font-mono-code font-bold text-xs rounded-xl hover:bg-[#E11D48] cursor-pointer"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs font-mono-code font-bold text-white/70 hover:text-[#FF4D5A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Customer & Payment (7 cols) */}
        <form onSubmit={handleCompleteOrder} className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-[#111113] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF4D5A]" />
                <span>Delivery Details (Malaysia Express)</span>
              </h2>
              <span className="font-mono-code font-bold text-[10px] text-white/40 uppercase tracking-widest">
                STEP 01/02
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>Full Recipient Name</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Tan"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>Email Address</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>Phone Number</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                  <span className="text-[10px] text-white/40 font-normal">(Used for tracking)</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 012-3456789"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>Street Address &amp; Unit No.</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 28, Jalan Sutera 3, Taman Sutera"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>City / Town</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Petaling Jaya"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>State</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <select
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code font-bold text-white"
                >
                  {MALAYSIAN_STATES.map(s => (
                    <option key={s} value={s} className="bg-[#111113] text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white flex items-center gap-1">
                  <span>Postcode</span>
                  <span className="text-[#FF4D5A] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 47300"
                  maxLength={5}
                  value={customer.postcode}
                  onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-code font-bold text-white/80 block">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Leave parcel in shoe rack or call upon arrival"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#FF4D5A] focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Exclusively Touch 'n Go eWallet */}
          <div className="bg-[#111113] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FF4D5A]" />
                <span>Payment Method</span>
              </h2>
              <span className="text-[10px] font-mono-code font-bold bg-red-950/80 text-[#FF4D5A] px-3 py-1 rounded-full uppercase tracking-wider border border-red-800/80">
                DIRECT TOUCH 'N GO
              </span>
            </div>

            {/* Single TNG Method Selection Card */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#AF101A] bg-[#18181B] relative overflow-hidden space-y-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-black/60 border border-red-900/60 flex items-center justify-center text-[#FF4D5A] shadow-inner shrink-0">
                    <QrCode className="w-6 h-6 text-[#FF4D5A]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>Touch 'n Go eWallet (DuitNow QR)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-white/60 font-mono-code">
                      Direct verification to <strong>{TNG_PAYMENT_CONFIG.merchantName}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-[#AF101A] text-white text-[10px] font-mono-code font-bold px-2.5 py-1 rounded-lg uppercase shadow-sm">
                  Active
                </div>
              </div>

              <div className="p-3 bg-[#111113] rounded-xl border border-white/10 text-xs text-white/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 font-mono-code">Merchant Account:</span>
                  <span className="font-mono-code font-bold text-white">{TNG_PAYMENT_CONFIG.merchantName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 font-mono-code">Total to Transfer:</span>
                  <span className="font-mono-code font-black text-sm text-[#FF4D5A]">RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Customer Information Review & Verification */}
          <div className="bg-[#111113] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Information Verification</span>
              </h2>
              <span className="text-[10px] font-mono-code text-white/40 font-bold uppercase tracking-wider">
                CONFIRMATION
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-mono-code">
              Please check that your name and contact details below are accurate. 
              <strong className="text-white"> You can view your past orders using this Name and Phone Number.</strong>
            </p>

            {customer.fullName || customer.phone || customer.address ? (
              <div className="p-4 bg-[#18181B] rounded-2xl border border-white/10 text-xs space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-white/40 font-mono-code font-medium block text-[11px]">Full Name:</span>
                    <strong className="text-white text-sm">{customer.fullName || <span className="text-red-400 italic">Not entered</span>}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 font-mono-code font-medium block text-[11px]">Phone Number:</span>
                    <strong className="text-white font-mono-code text-sm">{customer.phone || <span className="text-red-400 italic">Not entered</span>}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-white/40 font-mono-code font-medium block text-[11px]">Email Address:</span>
                    <span className="text-white/80 font-mono-code">{customer.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 font-mono-code font-medium block text-[11px]">Delivery Location:</span>
                    <span className="text-white/80 font-mono-code">
                      {customer.address ? `${customer.address}, ${customer.postcode} ${customer.city}, ${customer.state}` : '—'}
                    </span>
                  </div>
                </div>

                {customer.notes && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/40 font-mono-code font-medium block text-[11px]">Instructions:</span>
                    <span className="text-white/70 italic">"{customer.notes}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono-code">Fill in your Delivery Details above to review your live summary here.</span>
              </div>
            )}
          </div>

          {submitError && (
            <div className="p-4 bg-red-950/60 border border-red-800/60 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-[#FF4D5A] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-0.5 font-mono-code">
                <span className="font-bold block text-red-100">Checkout Notice</span>
                <span className="text-red-300/90">{submitError}</span>
              </div>
            </div>
          )}

          <div className="text-[11px] text-white/50 text-center leading-relaxed font-mono-code">
            By proceeding with payment, you agree to Cabai Enterprise's{' '}
            <button
              type="button"
              onClick={() => setCurrentView('terms')}
              className="text-[#FF4D5A] font-bold underline hover:text-[#E11D48] cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            .
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#AF101A] hover:bg-[#E11D48] active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed text-white font-mono-code font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>{submitProgressText}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Proceed to Pay (RM {finalTotal.toFixed(2)})</span>
              </>
            )}
          </button>

        </form>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#111113] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white uppercase tracking-wider">
                Order Manifest ({cart.length} items)
              </h3>
              <span className="font-mono-code font-bold text-[10px] text-[#FF4D5A] bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                0.12mm PLA+
              </span>
            </div>

            {/* Cart Items list */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-white/10 scrollbar-none">
              {cart.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <ProductImage 
                    src={item.product.images[0]} 
                    productId={item.product.id}
                    alt={item.product.name} 
                    className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0 bg-[#18181B] shadow-sm" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-extrabold text-white truncate">{item.product.name}</div>
                    <div className="text-white/50 text-[11px] font-mono-code mt-0.5">{item.selectedColor.name} • {item.selectedMaterial}</div>
                    {item.customText && (
                      <div className="text-[10px] font-mono-code font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded-md border border-amber-800/80 mt-1 inline-block max-w-full truncate">
                        "{item.customText}"
                      </div>
                    )}
                    <div className="text-white/40 mt-1 font-mono-code text-[11px]">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono-code font-extrabold text-white text-right shrink-0">
                    RM {(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-white/70 font-mono-code">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">RM {cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Promo Discount</span>
                  <span>-RM {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery (Pos Laju / J&amp;T)</span>
                <span className="font-bold text-white">
                  {shipping === 0 ? <strong className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 text-[10px]">FREE</strong> : `RM ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SST (6%)</span>
                <span className="text-white/60">RM {tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center font-heading font-extrabold text-lg text-white pt-3 border-t border-white/10">
                <span>Total Payable</span>
                <span className="font-mono-code font-black text-xl text-[#FF4D5A]">RM {finalTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
