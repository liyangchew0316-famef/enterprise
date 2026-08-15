import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { CustomerInfo } from '../types';
import { MALAYSIAN_BANKS, MALAYSIAN_STATES } from '../data/mockData';
import { 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  Wallet, 
  Truck, 
  CheckCircle2, 
  ArrowLeft,
  Lock
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

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: 'Mohd Amirul',
    email: 'amirul.maker@gmail.com',
    phone: '+60 12-883 4910',
    address: 'No. 18, Jalan USJ 10/1E',
    city: 'Subang Jaya',
    state: 'Selangor',
    postcode: '47620',
    notes: 'Please call before delivery.'
  });

  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'credit_card' | 'ewallet'>('fpx');
  const [fpxBank, setFpxBank] = useState<string>(MALAYSIAN_BANKS[0].name);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const shipping = cartSubtotal >= 80 ? 0 : 8.00;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = Number((taxableAmount * 0.06).toFixed(2));
  const finalTotal = Number((taxableAmount + shipping + tax).toFixed(2));

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newOrd = await placeOrder(customer, paymentMethod, paymentMethod === 'fpx' ? fpxBank : undefined);
      setCompletedOrderId(newOrd.id);
      setIsOrderComplete(true);
    } catch (err) {
      console.error('[CheckoutView] Failed to place order:', err);
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
                <label className="font-bold text-gray-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Phone Number (+60)</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-700 block">Street Address</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">City</label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">State</label>
                <select
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                >
                  {MALAYSIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Postcode</label>
                <input
                  type="text"
                  required
                  value={customer.postcode}
                  onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#af101a]" />
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('fpx')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'fpx'
                    ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Landmark className="w-6 h-6" />
                <span className="font-extrabold text-xs">FPX Online Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ewallet')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'ewallet'
                    ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-6 h-6" />
                <span className="font-extrabold text-xs">Touch 'n Go / eWallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="font-extrabold text-xs">Credit / Debit Card</span>
              </button>

            </div>

            {/* FPX Bank Selector */}
            {paymentMethod === 'fpx' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <label className="font-bold text-gray-800 block">Select Your Bank:</label>
                <select
                  value={fpxBank}
                  onChange={(e) => setFpxBank(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-900"
                >
                  {MALAYSIAN_BANKS.map(b => (
                    <option key={b.id} value={b.name}>{b.logo} {b.name}</option>
                  ))}
                </select>
              </div>
            )}

            {paymentMethod === 'ewallet' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
                <strong className="text-gray-900 block font-bold">Touch 'n Go / GrabPay Instant QR</strong>
                <p className="text-gray-500">Scan and authorize payment upon order submission.</p>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <input type="text" placeholder="Card Number (4000 0000 0000 0000)" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" className="px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono" />
                  <input type="text" placeholder="CVV" className="px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono" />
                </div>
              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#af101a] hover:bg-[#8d0a12] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Processing Order...' : `Complete Order & Pay (RM ${finalTotal.toFixed(2)})`}</span>
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
