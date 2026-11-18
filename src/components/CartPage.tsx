import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { ViewType } from '../types';
import { storageService } from '../services/storage';

interface CartPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
  showProduct?: (id: string) => void;
}

export default function CartPage({ setCurrentView, showToast, refreshCounts, showProduct }: CartPageProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{ valid: boolean; message: string; discount: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const cartItems = useMemo(() => storageService.getCart(), [cartVersion]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.discountedPrice || item.product.price) * item.quantity, 0);
  const discount = couponResult?.discount || 0;
  const freeDeliveryThreshold = storageService.getStoreSettings().freeDeliveryThreshold;
  const standardDelivery = storageService.getStoreSettings().standardDeliveryFee;
  const deliveryFee = subtotal - discount >= freeDeliveryThreshold ? 0 : standardDelivery;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const freeDeliveryProgress = Math.min(100, ((subtotal - discount) / freeDeliveryThreshold) * 100);

  function refreshCart() {
    setCartVersion(v => v + 1);
    if (refreshCounts) refreshCounts();
  }

  function handleQtyChange(productId: string, qty: number) {
    storageService.updateCartQuantity(productId, qty);
    refreshCart();
  }

  function handleRemove(productId: string, name: string) {
    storageService.removeFromCart(productId);
    if (showToast) showToast(`"${name}" removed from cart`, 'info');
    refreshCart();
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setTimeout(() => {
      const result = storageService.validateCoupon(couponCode, subtotal);
      setCouponResult(result);
      if (showToast) showToast(result.message, result.valid ? 'success' : 'error');
      setApplyingCoupon(false);
    }, 400);
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-3 font-display">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Explore thousands of books, newspapers, and stationery items waiting for you.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setCurrentView('shop')} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors">Browse Shop</button>
          <button onClick={() => setCurrentView('library')} className="px-6 py-3 border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">Books Library</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => setCurrentView('shop')} className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 mb-6 font-display">Shopping Cart <span className="text-lg font-normal text-slate-500 dark:text-slate-400">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span></h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 space-y-3">
          {cartItems.map(({ product, quantity }) => {
            const displayPrice = product.discountedPrice || product.price;
            const inv = storageService.getInventoryItem(product.id);
            return (
              <div key={product.id} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-4 flex gap-4 items-start">
                {/* Image */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-teal-50 dark:bg-teal-900/40 cursor-pointer" onClick={() => showProduct && showProduct(product.id)}>
                  <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=70'; }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">{product.categoryName}</span>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-teal-100 mb-1 cursor-pointer hover:text-teal-700 dark:hover:text-teal-300 transition-colors line-clamp-2" onClick={() => showProduct && showProduct(product.id)}>{product.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">by {product.authorName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{product.paperQuality}</p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-teal-200 dark:border-teal-800 rounded-lg overflow-hidden">
                      <button onClick={() => handleQtyChange(product.id, quantity - 1)} className="px-2.5 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-teal-100 min-w-[2rem] text-center">{quantity}</span>
                      <button onClick={() => handleQtyChange(product.id, quantity + 1)} disabled={inv ? quantity >= inv.availableStock : false} className="px-2.5 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 transition-colors disabled:opacity-30">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-teal-700 dark:text-teal-300">Rs. {(displayPrice * quantity).toLocaleString()}</p>
                      {quantity > 1 && <p className="text-xs text-slate-400">Rs. {displayPrice.toLocaleString()} each</p>}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => handleRemove(product.id, product.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 sticky top-24">
            <h2 className="font-bold text-teal-800 dark:text-teal-200 mb-5">Order Summary</h2>

            {/* Free delivery progress */}
            {freeDeliveryProgress < 100 && (
              <div className="mb-5 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-xl border border-teal-100 dark:border-teal-800">
                <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">
                  Add <strong>Rs. {(freeDeliveryThreshold - (subtotal - discount)).toLocaleString()}</strong> more for free delivery!
                </p>
                <div className="h-2 bg-teal-100 dark:bg-teal-900 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${freeDeliveryProgress}%` }} />
                </div>
              </div>
            )}
            {freeDeliveryProgress >= 100 && (
              <div className="mb-5 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">🎉 You qualify for free delivery!</p>
              </div>
            )}

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 uppercase"
                  />
                </div>
                <button onClick={handleApplyCoupon} disabled={applyingCoupon} className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap">
                  {applyingCoupon ? '…' : 'Apply'}
                </button>
              </div>
              {couponResult && (
                <p className={`text-xs mt-2 ${couponResult.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {couponResult.message}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {['WELCOME15','CSS2026','STUDENT10','STATIONERY20'].map(code => (
                  <button key={code} onClick={() => { setCouponCode(code); }} className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors">
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 border-t border-teal-50 dark:border-teal-900 pt-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>−Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">FREE</span> : `Rs. ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-teal-800 dark:text-teal-200 border-t border-teal-100 dark:border-teal-800 pt-3">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => setCurrentView('checkout')} className="w-full mt-5 py-3.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md">
              Proceed to Checkout
              <ChevronRight className="w-4 h-4" />
            </button>

            <button onClick={() => setCurrentView('shop')} className="w-full mt-2 py-2.5 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 font-medium transition-colors flex items-center justify-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
