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
    setTrackedOrderId
  } = useApp();

  // Initial customer info MUST be blank (no dummy/prefilled data)
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Selangor',
    postcode: '',
    notes: ''
  });

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
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900">
          Order Confirmed! 🌶️
        </h1>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Thank you for ordering with <strong>CABAI ENTERPRISE™</strong>. Your order ID is <strong className="text-[#af101a] font-mono text-base">#{completedOrderId}</strong>.
        </p>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 text-left max-w-md mx-auto space-y-3 text-xs">
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500 font-bold">Status:</span>
            <span className="text-amber-600 font-extrabold">Received • Queued for Slicing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span className="font-bold text-gray-800">{customer.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery State:</span>
            <span className="font-bold text-gray-800">{customer.state}, Malaysia</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="text-gray-500 font-bold">Total Paid:</span>
            <span className="font-extrabold text-sm text-[#af101a]">RM {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setTrackedOrderId(completedOrderId);
              setCurrentView('order_tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#af101a] text-white font-extrabold text-sm rounded-xl shadow-md hover:bg-[#8d0a12] transition-colors"
          >
            Track Parcel Status Live 🚚
          </button>

          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 text-gray-800 font-extrabold text-sm rounded-xl hover:bg-gray-200 transition-colors"
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
        <h2 className="font-heading font-bold text-2xl text-gray-800">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items from the 3D shop catalog before checking out.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 bg-[#af101a] text-white font-bold text-xs rounded-xl"
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
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#af101a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Customer & Payment (7 cols) */}
        <form onSubmit={handleCompleteOrder} className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#af101a]" />
              <span>Delivery Details (Malaysia)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>Full Name</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Tan"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>Email Address</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>Phone Number</span>
                  <span className="text-[#af101a] font-bold">*</span>
                  <span className="text-[10px] text-gray-400 font-normal">(Used to view your purchases)</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 012-3456789"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>Street Address</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 28, Jalan Sutera 3, Taman Sutera"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>City</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Petaling Jaya"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>State</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <select
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-bold text-gray-800"
                >
                  {MALAYSIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 flex items-center gap-1">
                  <span>Postcode</span>
                  <span className="text-[#af101a] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 47300"
                  maxLength={5}
                  value={customer.postcode}
                  onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800 block">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Leave parcel in shoe rack or call upon arrival"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-100 focus:border-[#af101a] font-medium"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Exclusively Touch 'n Go eWallet */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#af101a]" />
                <span>Payment Method</span>
              </h2>
              <span className="text-[11px] font-extrabold bg-red-100 text-[#af101a] px-3 py-1 rounded-full uppercase tracking-wider">
                Exclusively Touch 'n Go
              </span>
            </div>

            {/* Single TNG Method Selection Card */}
            <div className="p-4 rounded-2xl border-2 border-[#af101a] bg-red-50/70 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-red-200 flex items-center justify-center text-[#af101a] shadow-xs">
                    <QrCode className="w-6 h-6 text-[#af101a]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                      <span>Touch 'n Go eWallet (DuitNow QR)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Official direct payment to <strong>{TNG_PAYMENT_CONFIG.merchantName}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-[#af101a] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase shadow-2xs">
                  Active
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-red-100 text-xs text-gray-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Merchant Account:</span>
                  <span className="font-bold text-gray-900">{TNG_PAYMENT_CONFIG.merchantName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Total to Transfer:</span>
                  <span className="font-mono font-extrabold text-sm text-[#af101a]">RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Customer Information Review & Verification */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-heading font-extrabold text-base text-[#1a1c1c] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Check Your Information Before Payment</span>
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Verification
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Please check and verify that your name and contact details below are accurate. 
              <strong className="text-gray-800"> Only you can view your purchases using this Name and Phone Number.</strong>
            </p>

            {customer.fullName || customer.phone || customer.address ? (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 font-medium block text-[11px]">Full Name:</span>
                    <strong className="text-gray-900 text-sm">{customer.fullName || <span className="text-red-400 italic">Not entered</span>}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block text-[11px]">Phone Number:</span>
                    <strong className="text-gray-900 font-mono text-sm">{customer.phone || <span className="text-red-400 italic">Not entered</span>}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-gray-400 font-medium block text-[11px]">Email Address:</span>
                    <span className="text-gray-800 font-medium">{customer.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block text-[11px]">Delivery Location:</span>
                    <span className="text-gray-800 font-medium">
                      {customer.address ? `${customer.address}, ${customer.postcode} ${customer.city}, ${customer.state}` : '—'}
                    </span>
                  </div>
                </div>

                {customer.notes && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-400 font-medium block text-[11px]">Instructions:</span>
                    <span className="text-gray-700 italic">"{customer.notes}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Please fill in your Delivery Details above to review your information here.</span>
              </div>
            )}
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-[#af101a] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-0.5">
                <span className="font-bold block">Checkout Notice</span>
                <span className="text-gray-700">{submitError}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#af101a] hover:bg-[#8d0a12] disabled:opacity-75 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>{submitProgressText}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Pay Now (RM {finalTotal.toFixed(2)})</span>
              </>
            )}
          </button>

        </form>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
            <h3 className="font-heading font-extrabold text-base text-[#1a1c1c] uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Cart Items list */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-gray-100">
              {cart.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <ProductImage 
                    src={item.product.images[0]} 
                    productId={item.product.id}
                    alt={item.product.name} 
                    className="w-14 h-14 object-cover rounded-lg border shrink-0 bg-gray-50" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-gray-500">{item.selectedColor.name} • {item.selectedMaterial}</div>
                    <div className="text-gray-400 mt-1">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-900 text-right shrink-0">
                    RM {(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">RM {cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-RM {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery (Malaysia)</span>
                <span className="font-bold text-gray-900">
                  {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `RM ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SST (6%)</span>
                <span>RM {tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-heading font-extrabold text-xl text-[#1a1c1c] pt-3 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-[#af101a]">RM {finalTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
