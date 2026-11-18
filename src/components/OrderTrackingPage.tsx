import React, { useState } from 'react';
import { Search, CheckCircle, Circle, Truck, MapPin, ArrowLeft, Package } from 'lucide-react';
import { ViewType, OrderStatus } from '../types';
import { storageService } from '../services/storage';

interface OrderTrackingPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  initialOrderId?: string;
}

const STATUS_STEPS: OrderStatus[] = ['Pending','Confirmed','Processing','Packed','Shipped','Out for Delivery','Delivered'];

const STATUS_ICONS: Record<string, string> = {
  'Pending':          '🕐',
  'Confirmed':        '✅',
  'Processing':       '⚙️',
  'Packed':           '📦',
  'Shipped':          '🚚',
  'Out for Delivery': '🏍️',
  'Delivered':        '🎉',
  'Cancelled':        '❌',
  'Returned':         '↩️',
};

export default function OrderTrackingPage({ setCurrentView, showToast, initialOrderId }: OrderTrackingPageProps) {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [order, setOrder] = useState(() => initialOrderId ? storageService.getOrderById(initialOrderId) : null);
  const [searched, setSearched] = useState(!!initialOrderId);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const found = storageService.getOrderById(searchInput.trim().toUpperCase());
    setOrder(found || null);
    setSearched(true);
    if (!found && showToast) showToast('Order not found. Check the order ID.', 'error');
  }

  const stepIdx = order ? STATUS_STEPS.indexOf(order.orderStatus as OrderStatus) : -1;
  const isCancelled = order?.orderStatus === 'Cancelled' || order?.orderStatus === 'Returned';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => setCurrentView('my-orders')} className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 font-display mb-2">Track Your Order</h1>
        <p className="text-slate-500 dark:text-slate-400">Enter your order ID to track the delivery status</p>
      </div>

      {/* Search box */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value.toUpperCase())}
            placeholder="e.g. PN-2026-1042"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 font-mono text-sm"
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors">
          Track
        </button>
      </form>

      {/* Quick picks for demo */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {storageService.getOrders().slice(0, 4).map(o => (
          <button key={o.id} onClick={() => { setSearchInput(o.id); const found = storageService.getOrderById(o.id); setOrder(found || null); setSearched(true); }}
            className="px-3 py-1.5 text-xs bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-100 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-800 font-mono transition-colors">
            {o.id}
          </button>
        ))}
      </div>

      {/* Not found */}
      {searched && !order && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Order Not Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Please check the order ID and try again, or visit My Orders for your order list.</p>
        </div>
      )}

      {/* Order found */}
      {order && (
        <div className="space-y-6">
          {/* Header card */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-bold text-teal-800 dark:text-teal-200 font-mono text-lg">{order.id}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl">{STATUS_ICONS[order.orderStatus] || '📋'}</span>
                <p className="font-bold text-teal-700 dark:text-teal-300 mt-1">{order.orderStatus}</p>
              </div>
            </div>

            {/* Timeline */}
            {!isCancelled ? (
              <div className="space-y-3">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= stepIdx;
                  const current = i === stepIdx;
                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-teal-600 dark:bg-teal-500' : 'bg-teal-100 dark:bg-teal-900/60'}`}>
                        {done ? <CheckCircle className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-teal-300 dark:text-teal-700" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${done ? 'text-teal-800 dark:text-teal-200' : 'text-slate-400 dark:text-slate-600'}`}>{step}</p>
                        {current && <p className="text-xs text-teal-500 dark:text-teal-400">Currently here</p>}
                      </div>
                      {current && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900 text-center">
                <span className="text-2xl mb-2 block">{STATUS_ICONS[order.orderStatus]}</span>
                <p className="font-semibold text-red-700 dark:text-red-400">This order has been {order.orderStatus.toLowerCase()}</p>
                {order.orderStatus === 'Cancelled' && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Stock has been restored to inventory</p>}
              </div>
            )}
          </div>

          {/* Courier info */}
          {order.trackingNumber && (
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="font-semibold text-sky-800 dark:text-sky-200">Courier Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-sky-500 dark:text-sky-400 text-xs mb-0.5">Courier</p>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{order.courierName}</p>
                </div>
                <div>
                  <p className="text-sky-500 dark:text-sky-400 text-xs mb-0.5">Tracking No.</p>
                  <p className="font-mono font-medium text-slate-700 dark:text-slate-200 text-xs">{order.trackingNumber}</p>
                </div>
                {order.estimatedDelivery && (
                  <div className="col-span-2">
                    <p className="text-sky-500 dark:text-sky-400 text-xs mb-0.5">Estimated Delivery</p>
                    <p className="font-semibold text-sky-700 dark:text-sky-300">{new Date(order.estimatedDelivery).toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery address */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-semibold text-teal-800 dark:text-teal-200 text-sm">Delivery Address</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{order.customerName}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{order.deliveryAddress}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{order.city}{order.postalCode ? ` – ${order.postalCode}` : ''}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{order.customerPhone}</p>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-semibold text-teal-800 dark:text-teal-200 text-sm">Order Items</h3>
            </div>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-9 h-11 rounded-lg overflow-hidden bg-teal-50 dark:bg-teal-900 flex-shrink-0">
                    <img src={item.coverImage} alt={item.productName} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=80&q=70'; }} />
                  </div>
                  <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 line-clamp-1">{item.productName}</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">×{item.quantity}</span>
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Rs. {item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-teal-50 dark:border-teal-900 flex justify-between font-bold text-teal-800 dark:text-teal-200">
              <span>Total</span>
              <span>Rs. {order.finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
