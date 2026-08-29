import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
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
    <div className="fixed inset-0 z-[100] overflow-hidden animate-fadeIn">
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
          <div className="bg-gradient-to-r from-red-50 via-amber-50/40 to-red-50 p-4 border-b border-red-100/80 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
                    <span>Add <strong className="text-[#af101a] font-mono-code font-bold">RM {remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Delivery</strong></span>
                  </span>
                  <span className="font-mono-code font-bold text-[11px] text-gray-600 bg-white px-1.5 py-0.5 rounded border border-red-100 shadow-2xs">
                    {freeShippingPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-red-200/70 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-[#af101a] h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50/90 p-2 rounded-xl border border-emerald-200 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs">🎉 You unlocked FREE Express Delivery across Malaysia!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4 px-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 flex items-center justify-center text-3xl shadow-sm">
                  🌶️
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-gray-800 text-base">Your Studio Cart is Empty</h4>
                  <p className="text-gray-500 text-xs max-w-xs mx-auto">Explore our 3D printed keychains, mechanical clickers, badges, and custom print tools.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3 rounded-xl bg-[#af101a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#8d0a12] active:scale-95 transition-all shadow-sm"
                >
                  Explore 3D Shop Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3.5 bg-[#f8f7f4] border border-black/8 rounded-2xl flex gap-3 shadow-2xs hover:border-black/15 transition-all">
                  {/* Thumbnail */}
                  <ProductImage 
                    src={item.product.images[0]} 
                    productId={item.product.id}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-black/10 shrink-0 bg-white shadow-2xs"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#18181b] truncate">
                          {item.product.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors shrink-0 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Color and Material Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-gray-600">
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-black/5 shadow-2xs">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="font-medium text-[10px]">{item.selectedColor.name}</span>
                        </span>
                        <span className="font-mono-code font-bold px-1.5 py-0.5 bg-black/5 text-gray-700 rounded text-[10px]">
                          {item.selectedMaterial}
                        </span>
                      </div>

                      {item.customText && (
                        <div className="mt-1 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 inline-block font-mono-code">
                          Text: "{item.customText}"
                        </div>
                      )}
                    </div>

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5">
                      <div className="flex items-center border border-black/15 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-black/5 text-gray-600 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono-code font-bold text-gray-800 select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-black/5 text-gray-600 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono-code font-extrabold text-sm text-[#af101a]">
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
            <div className="p-4 sm:p-5 bg-white border-t border-black/10 space-y-3.5 shadow-lg">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. CABAI10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#f8f7f4] border border-black/10 rounded-xl focus:outline-hidden focus:border-[#af101a] font-mono-code uppercase font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18181b] hover:bg-black active:scale-95 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                >
                  Apply
                </button>
              </form>

              {promoCode && (
                <div className="flex justify-between items-center text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Code <strong>'{promoCode}'</strong> Applied</span>
                  </span>
                  <span className="font-mono-code font-bold">-RM {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 pt-1 border-t border-black/5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-code font-bold text-gray-900">RM {cartSubtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono-code font-bold">-RM {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Est. Shipping (Pos Laju / J&amp;T)</span>
                  <span className="font-mono-code font-bold text-gray-900">
                    {estimatedShipping === 0 ? <strong className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">FREE</strong> : `RM ${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center font-heading font-extrabold text-base text-[#18181b] pt-2.5 border-t border-black/10">
                  <span>Estimated Total</span>
                  <span className="font-mono-code font-black text-lg text-[#af101a]">RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#af101a] hover:bg-[#8e0c15] active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-950/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono-code">
                <span>🔒 Direct Touch 'n Go eWallet &amp; Pos Laju / J&amp;T Express</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
