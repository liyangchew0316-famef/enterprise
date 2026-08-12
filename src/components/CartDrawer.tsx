import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartCount,
    setCurrentView,
    promoCode,
    discountAmount,
    applyPromoCode
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 80;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const estimatedShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 8.00;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount) + estimatedShipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-[#1a1c1c] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#af101a]" />
              <h3 className="font-heading font-bold text-lg">Your Cart ({cartCount})</h3>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-red-50 p-3.5 border-b border-red-100 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div>
                <div className="flex justify-between font-medium text-gray-800 mb-1.5">
                  <span>Add <strong className="text-[#af101a]">RM {remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Delivery</strong></span>
                  <span>{freeShippingPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#af101a] h-full transition-all duration-300"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>🎉 You unlocked FREE Express Delivery across Malaysia!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  🌶️
                </div>
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#af101a] text-white font-bold text-sm hover:bg-[#8d0a12] transition-colors"
                >
                  Explore 3D Shop Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  {/* Thumbnail */}
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-50"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-[#1a1c1c] truncate">
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Color and Material Badges */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>•</span>
                      <span className="font-semibold px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded text-[10px]">
                        {item.selectedMaterial}
                      </span>
                    </div>

                    {item.customText && (
                      <div className="mt-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        Text: "{item.customText}"
                      </div>
                    )}

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-heading font-bold text-sm text-[#1a1c1c]">
                        RM {(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. MAKER10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#af101a] font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-gray-800 text-white font-bold text-xs rounded-lg hover:bg-[#1a1c1c] transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoCode && (
                <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-semibold">
                  <span>Code '{promoCode}' Active</span>
                  <span>-RM {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">RM {cartSubtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-RM {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Est. Shipping (Malaysia)</span>
                  <span className="font-semibold text-gray-900">
                    {estimatedShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `RM ${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between font-heading font-extrabold text-base text-[#1a1c1c] pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#af101a]">RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#af101a] text-white font-bold text-sm rounded-xl hover:bg-[#8d0a12] transition-colors shadow-md shadow-red-900/20 flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-gray-400">
                Secure 256-bit SSL Payment • FPX Online Banking, Touch 'n Go, Visa & MasterCard
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
