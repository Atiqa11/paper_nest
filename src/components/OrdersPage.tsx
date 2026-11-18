import React, { useState, useMemo } from 'react';
import { CheckCircle, Circle, Package, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { ViewType, Order, OrderStatus } from '../types';
import { storageService } from '../services/storage';

interface OrdersPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending','Confirmed','Processing','Packed','Shipped','Out for Delivery','Delivered'];

const STATUS_COLORS: Record<string,string> = {
  'Pending':          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Confirmed':        'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Processing':       'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'Packed':           'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Shipped':          'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  'Out for Delivery': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  'Delivered':        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'Cancelled':        'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  'Returned':         'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
};

export default function OrdersPage({ setCurrentView, showToast }: OrdersPageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState('');

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser.role === 'admin';
  const orders = useMemo(() => {
    const all = storageService.getOrders();
    return isAdmin ? all : all.filter(o => o.userId === currentUser.id);
  }, [isAdmin, currentUser.id]);

  function handleCancel(orderId: string) {
    const ok = storageService.updateOrderStatus(orderId, 'Cancelled');
    if (showToast) showToast(ok ? `Order ${orderId} cancelled.` : 'Could not cancel order.', ok ? 'info' : 'error');
  }

  const canCancel = (status: OrderStatus) => status === 'Pending' || status === 'Confirmed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setCurrentView('home')} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 font-display">My Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>
        <button onClick={() => setCurrentView('order-tracking')} className="ml-auto px-4 py-2 text-sm bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-xl border border-teal-100 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors">
          Track an Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No orders yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Your order history will appear here.</p>
          <button onClick={() => setCurrentView('shop')} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expanded === order.id;
            const stepIdx = STATUS_STEPS.indexOf(order.orderStatus as OrderStatus);

            return (
              <div key={order.id} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 overflow-hidden shadow-sm">
                {/* Order header */}
                <button className="w-full px-5 py-4 flex flex-wrap items-center gap-4 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors text-left" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="font-bold text-teal-800 dark:text-teal-200 font-mono text-sm">{order.id}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Pending']}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-700 dark:text-teal-300">Rs. {order.finalTotal.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{order.paymentMethod}</p>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-teal-50 dark:border-teal-900 px-5 py-5 space-y-5">
                    {/* Tracking timeline */}
                    {!['Cancelled','Returned'].includes(order.orderStatus) && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Order Progress</p>
                        <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
                          {STATUS_STEPS.map((step, i) => (
                            <React.Fragment key={step}>
                              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i <= stepIdx ? 'bg-teal-600 dark:bg-teal-500' : 'bg-teal-100 dark:bg-teal-900'}`}>
                                  {i <= stepIdx ? <CheckCircle className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-teal-300 dark:text-teal-700" />}
                                </div>
                                <span className={`text-[9px] font-medium text-center max-w-[52px] leading-tight ${i <= stepIdx ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-600'}`}>{step}</span>
                              </div>
                              {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 min-w-[12px] ${i < stepIdx ? 'bg-teal-500' : 'bg-teal-100 dark:bg-teal-900'}`} />}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Items Ordered</p>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl">
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-teal-100 dark:bg-teal-900 flex-shrink-0">
                              <img src={item.coverImage} alt={item.productName} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=100&q=70'; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">{item.productName}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity} × Rs. {item.unitPrice.toLocaleString()}</p>
                            </div>
                            <span className="font-semibold text-sm text-teal-700 dark:text-teal-300">Rs. {item.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Delivery Address</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">{order.customerName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{order.deliveryAddress}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{order.city}{order.postalCode ? ` – ${order.postalCode}` : ''}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payment Summary</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
                          {order.discount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Discount</span><span>−Rs. {order.discount.toLocaleString()}</span></div>}
                          <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `Rs. ${order.deliveryFee}`}</span></div>
                          <div className="flex justify-between font-bold text-teal-800 dark:text-teal-200 border-t border-teal-50 dark:border-teal-900 pt-1"><span>Total</span><span>Rs. {order.finalTotal.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking info */}
                    {order.trackingNumber && (
                      <div className="flex items-center gap-3 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
                        <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium text-sky-700 dark:text-sky-300">{order.courierName}</span>
                          <span className="text-sky-600 dark:text-sky-400 ml-2 font-mono">{order.trackingNumber}</span>
                        </div>
                        {order.estimatedDelivery && (
                          <span className="ml-auto text-xs text-sky-500 dark:text-sky-400">Est. {new Date(order.estimatedDelivery).toLocaleDateString('en-PK', { month:'short', day:'numeric' })}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button onClick={() => { setTrackingId(order.id); setCurrentView('order-tracking'); }}
                        className="px-4 py-2 text-sm bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Track Order
                      </button>
                      {canCancel(order.orderStatus as OrderStatus) && (
                        <button onClick={() => handleCancel(order.id)}
                          className="px-4 py-2 text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
