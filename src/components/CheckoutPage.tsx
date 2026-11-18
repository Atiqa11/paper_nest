import React, { useState } from 'react';
import { ViewType } from '../types';
import { storageService } from '../services/storage';

interface CheckoutPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
  showProduct?: (id: string) => void;
}

const PAKISTAN_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta',
  'Sialkot','Gujranwala','Hyderabad','Abbottabad','Murree','Sukkur','Larkana','Mardan',
  'Bahawalpur','Sargodha','Sahiwal','Gujrat','Sheikhupura','Dera Ghazi Khan','Jhelum',
  'Kasur','Hafizabad','Chiniot','Kamoke','Mandi Bahauddin','Nowshera','Mingora','Kohat',
];

type Step = 'delivery' | 'payment' | 'confirmed';

export default function CheckoutPage({ setCurrentView, showToast, refreshCounts }: CheckoutPageProps) {
  const [step, setStep] = useState<Step>('delivery');
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{ valid: boolean; message: string; discount: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    deliveryAddress: '', city: '', postalCode: '', deliveryInstructions: '',
  });

  const cart = storageService.getCart();
  const subtotal = cart.reduce((sum, { product, quantity }) => sum + (product.discountedPrice || product.price) * quantity, 0);
  const discount = couponResult?.discount || 0;
  const settings = storageService.getStoreSettings();
  const deliveryFee = subtotal - discount >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (cart.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-3">Your cart is empty</h2>
        <button onClick={() => setCurrentView('shop')} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
          Go to Shop
        </button>
      </div>
    );
  }

  function setF(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }));
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

  function handlePlaceOrder() {
    setSubmitting(true);
    setTimeout(() => {
      const result = storageService.createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        deliveryAddress: form.deliveryAddress,
        city: form.city,
        postalCode: form.postalCode,
        deliveryInstructions: form.deliveryInstructions,
        paymentMethod: 'Cash on Delivery',
        couponCode: couponResult?.valid ? couponCode : undefined,
        items: cart.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      });
      setSubmitting(false);
      if (result.success && result.order) {
        setConfirmedOrder(result.order);
        setStep('confirmed');
        if (refreshCounts) refreshCounts();
      } else {
        if (showToast) showToast(result.error || 'Order failed. Please try again.', 'error');
      }
    }, 1000);
  }

  const InputField = ({ label, field, type = 'text', placeholder, required = true, hint }: any) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{label} {required && <span className="text-rose-500">*</span>}</label>
      <input type={type} value={(form as any)[field]} onChange={e => setF(field, e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  );

  const OrderSummary = () => (
    <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5">
      <h3 className="font-bold text-teal-800 dark:text-teal-200 mb-4 text-sm">Order Summary ({cart.length} items)</h3>
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {cart.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-2 items-center">
            <div className="w-8 h-10 rounded-lg overflow-hidden bg-teal-50 dark:bg-teal-900 flex-shrink-0">
              <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=80&q=70'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-1">{product.name}</p>
              <p className="text-xs text-slate-400">×{quantity}</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 flex-shrink-0">Rs. {((product.discountedPrice || product.price) * quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mb-4 border-t border-teal-50 dark:border-teal-900 pt-4">
        <div className="flex gap-2">
          <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Promo code"
            className="flex-1 px-3 py-2 rounded-lg border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={handleApplyCoupon} disabled={applyingCoupon} className="px-3 py-2 bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors disabled:opacity-50">
            {applyingCoupon ? '…' : 'Apply'}
          </button>
        </div>
        {couponResult && <p className={`text-xs mt-1.5 ${couponResult.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>{couponResult.message}</p>}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {['WELCOME15','CSS2026','STUDENT10'].map(c => (
            <button key={c} onClick={() => setCouponCode(c)} className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 px-1.5 py-0.5 rounded hover:bg-teal-100 dark:hover:bg-teal-800">{c}</button>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-1.5 border-t border-teal-50 dark:border-teal-900 pt-4 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
        {discount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Coupon Discount</span><span>−Rs. {discount.toLocaleString()}</span></div>}
        <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">FREE</span> : `Rs. ${deliveryFee}`}</span></div>
        <div className="flex justify-between font-bold text-teal-800 dark:text-teal-200 border-t border-teal-100 dark:border-teal-800 pt-2 text-base"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
      </div>
    </div>
  );

  // ─── Confirmed ────────────────────────────────────────────────────────────────
  if (step === 'confirmed' && confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-2 font-display">Order Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 text-left mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Order ID</p>
              <p className="font-bold text-teal-800 dark:text-teal-200 font-mono text-lg">{confirmedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Amount</p>
              <p className="font-bold text-teal-700 dark:text-teal-300 text-xl">Rs. {confirmedOrder.finalTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div><p className="text-xs text-slate-400 dark:text-slate-500">Payment</p><p className="font-medium text-slate-700 dark:text-slate-200">{confirmedOrder.paymentMethod}</p></div>
            <div><p className="text-xs text-slate-400 dark:text-slate-500">Status</p><p className="font-medium text-emerald-600 dark:text-emerald-400">{confirmedOrder.orderStatus}</p></div>
            <div><p className="text-xs text-slate-400 dark:text-slate-500">Courier</p><p className="font-medium text-slate-700 dark:text-slate-200">{confirmedOrder.courierName}</p></div>
            <div><p className="text-xs text-slate-400 dark:text-slate-500">Est. Delivery</p><p className="font-medium text-slate-700 dark:text-slate-200">{new Date(confirmedOrder.estimatedDelivery).toLocaleDateString('en-PK', { weekday:'short', month:'short', day:'numeric' })}</p></div>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
            <p className="text-xs text-sky-500 dark:text-sky-400 mb-0.5">Tracking Number</p>
            <p className="font-mono font-bold text-sky-700 dark:text-sky-300 text-sm">{confirmedOrder.trackingNumber}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setCurrentView('my-orders')} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors">View My Orders</button>
          <button onClick={() => setCurrentView('order-tracking')} className="px-6 py-3 border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">Track Order</button>
          <button onClick={() => setCurrentView('shop')} className="px-6 py-3 border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-6 font-display">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['delivery','payment'] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step === s || (step === 'payment' && s === 'delivery') ? '' : 'opacity-40'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${(step === 'payment' && s === 'delivery') || step === s ? 'bg-teal-600 text-white' : 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400'}`}>{i + 1}</div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize hidden sm:block">{s}</span>
            </div>
            {i < 1 && <div className="flex-1 h-px bg-teal-100 dark:bg-teal-900" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main form */}
        <div className="flex-1">
          {step === 'delivery' && (
            <form onSubmit={e => { e.preventDefault(); setStep('payment'); }} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-6 space-y-4">
              <h2 className="font-bold text-teal-800 dark:text-teal-200 mb-1">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" field="customerName" placeholder="Muhammad Ali" />
                <InputField label="Email Address" field="customerEmail" type="email" placeholder="ali@example.com" />
                <InputField label="Phone Number" field="customerPhone" type="tel" placeholder="+92 300 1234567" hint="For delivery coordination" />
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">City <span className="text-rose-500">*</span></label>
                  <select value={form.city} onChange={e => setF('city', e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400">
                    <option value="">Select City</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <InputField label="Street Address" field="deliveryAddress" placeholder="House #, Street, Block, Area" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Postal Code" field="postalCode" placeholder="54000" required={false} />
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Delivery Instructions</label>
                  <input value={form.deliveryInstructions} onChange={e => setF('deliveryInstructions', e.target.value)} placeholder="e.g. Call before delivery"
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors">
                Continue to Payment →
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-6 space-y-5">
              <h2 className="font-bold text-teal-800 dark:text-teal-200">Payment Method</h2>

              {/* COD option */}
              <div className="flex items-center gap-4 p-4 border-2 border-teal-500 bg-teal-50 dark:bg-teal-900/40 rounded-xl">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">💵</div>
                <div>
                  <p className="font-bold text-teal-800 dark:text-teal-200">Cash on Delivery</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pay when your order arrives</p>
                </div>
                <div className="ml-auto w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Online payment (coming soon) */}
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl opacity-50">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-lg flex-shrink-0">💳</div>
                <div>
                  <p className="font-bold text-slate-600 dark:text-slate-400">Online Payment</p>
                  <p className="text-sm text-slate-400">JazzCash, EasyPaisa, Card – Coming Soon</p>
                </div>
                <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Soon</span>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>📋 Order Review:</strong> {form.customerName} · {form.city} · Rs. {total.toLocaleString()}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">By placing this order you agree to our return and refund policy.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('delivery')} className="px-5 py-3 border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} disabled={submitting} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Processing…</>
                  ) : (
                    <>Place Order · Rs. {total.toLocaleString()}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
