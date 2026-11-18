import React, { useState, useMemo } from 'react';
import {
  Package, TrendingUp, ShoppingBag, AlertTriangle, Users,
  BookOpen, Tag, BarChart2, ArrowRight, Plus, RefreshCw,
  Truck, Printer, CheckCircle2, Clock, Search, MapPin,
  ExternalLink, Phone, ShieldCheck, DollarSign, ArrowUpRight
} from 'lucide-react';
import { ViewType, Order, OrderStatus } from '../types';
import { storageService } from '../services/storage';
import { CATEGORIES } from '../data/categoriesData';

interface AdminDashboardProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
}

export default function AdminDashboard({ setCurrentView, showToast }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'shipping' | 'valuation'>('overview');
  const [shippingFilter, setShippingFilter] = useState<string>('all');
  const [shippingSearch, setShippingSearch] = useState<string>('');
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);

  // Re-fetch triggers
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = useMemo(() => {
    const products = storageService.getProducts();
    const inventory = storageService.getAllInventory();
    const orders = storageService.getOrders();
    const coupons = storageService.getCoupons();
    const catalogCounts = storageService.getCatalogCounts();
    const shippingStats = storageService.getShippingStats();

    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned')
      .reduce((sum, o) => sum + o.finalTotal, 0);

    const totalUnitsSold = inventory.reduce((sum, i) => sum + i.unitsSold, 0);
    const lowStock = inventory.filter(i => i.stockStatus === 'Low Stock').length;
    const outOfStock = inventory.filter(i => i.stockStatus === 'Out of Stock').length;
    const activeCoupons = coupons.filter(c => c.isActive).length;
    const totalBooks = products.filter(p => p.productType === 'Book').length;
    const remainingInventory = inventory.reduce((sum, i) => sum + i.remainingStock, 0);

    // Fast-moving & stagnant analysis
    const sortedBySales = [...inventory].sort((a, b) => b.unitsSold - a.unitsSold);
    const fastMoving = sortedBySales.slice(0, 5);
    const stagnant = [...inventory].filter(i => i.unitsSold <= 5 && i.remainingStock > 20).slice(0, 5);
    const reorderSuggestions = inventory.filter(i => i.remainingStock <= (i.reorderLevel || 10));

    // Delivery success rate
    const nonCancelled = orders.filter(o => o.orderStatus !== 'Cancelled');
    const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
    const deliveryRate = nonCancelled.length > 0 ? Math.round((deliveredCount / nonCancelled.length) * 100) : 100;

    return {
      totalProducts: products.length,
      totalBooks,
      totalCategories: CATEGORIES.length,
      totalOrders: orders.length,
      shippingStats,
      totalRevenue,
      totalUnitsSold,
      lowStock,
      outOfStock,
      remainingInventory,
      activeCoupons,
      totalCustomers: 50,
      inventoryValuation: catalogCounts.totalInventoryValuation,
      deliveryRate,
      fastMoving,
      stagnant,
      reorderSuggestions,
      products,
      orders,
      inventory,
    };
  }, [refreshKey]);

  // Shipping orders filter
  const filteredOrders = useMemo(() => {
    return stats.orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(shippingSearch.toLowerCase()) ||
        order.customerName.toLowerCase().includes(shippingSearch.toLowerCase()) ||
        order.city.toLowerCase().includes(shippingSearch.toLowerCase()) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(shippingSearch.toLowerCase()));

      let matchesStatus = true;
      if (shippingFilter === 'awaiting') {
        matchesStatus = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Packed';
      } else if (shippingFilter === 'shipped') {
        matchesStatus = order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery';
      } else if (shippingFilter === 'delivered') {
        matchesStatus = order.orderStatus === 'Delivered';
      } else if (shippingFilter === 'cancelled') {
        matchesStatus = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';
      }

      return matchesSearch && matchesStatus;
    });
  }, [stats.orders, shippingSearch, shippingFilter]);

  const handlePrintLabel = (order: Order) => {
    storageService.markShippingLabelPrinted(order.id);
    setSelectedLabelOrder(order);
    setRefreshKey(k => k + 1);
    if (showToast) {
      showToast(`Shipping label generated for Order #${order.id}`, 'success');
    }
  };

  const handleQuickDispatch = (orderId: string) => {
    storageService.quickDispatchOrder(orderId, 'TCS Express Pakistan');
    setRefreshKey(k => k + 1);
    if (showToast) {
      showToast(`Order #${orderId} dispatched via TCS Express!`, 'success');
    }
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    storageService.updateOrderStatus(orderId, status);
    setRefreshKey(k => k + 1);
    if (showToast) {
      showToast(`Order #${orderId} status changed to ${status}`, 'info');
    }
  };

  const STATUS_COLORS: Record<string,string> = {
    'Pending':    'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    'Confirmed':  'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50',
    'Processing': 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/50',
    'Packed':     'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50',
    'Shipped':    'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/50',
    'Out for Delivery': 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50',
    'Delivered':  'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50',
    'Cancelled':  'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/50',
    'Returned':   'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/50',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-teal-900 dark:text-teal-100 font-display">
              Admin Control Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
              PaperNest OS v3
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store operations, inventory valuation, automated logistics & fulfillment
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('inventory')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 dark:text-teal-100">
            Rs. {(stats.inventoryValuation / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Inventory Valuation</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-300 mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 dark:text-teal-100">
            {stats.totalProducts.toLocaleString()}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Catalog Titles</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-300 mb-2">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 dark:text-teal-100 flex items-baseline gap-1">
            {stats.totalOrders}
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">Demo</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Total Orders</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 dark:text-teal-100">
            Rs. {(stats.totalRevenue / 1000).toFixed(1)}k
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Order Revenue</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-2">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-slate-800 dark:text-teal-100">
            Rs. {stats.shippingStats.totalShippingRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Shipping Revenue</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-300 mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.deliveryRate}%
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Fulfillment Rate</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-teal-100 dark:border-teal-900/60">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300'
              : 'border-transparent text-slate-500 hover:text-teal-600 dark:text-slate-400'
          }`}
        >
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300'
              : 'border-transparent text-slate-500 hover:text-teal-600 dark:text-slate-400'
          }`}
        >
          <Truck className="w-4 h-4" />
          Shipping & Logistics Hub ({stats.orders.length})
        </button>
        <button
          onClick={() => setActiveTab('valuation')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'valuation'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300'
              : 'border-transparent text-slate-500 hover:text-teal-600 dark:text-slate-400'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Inventory Valuation & Movement
        </button>
      </div>

      {/* TAB 1: OVERVIEW & QUICK ACTIONS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions Row */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 dark:from-teal-900 dark:to-[#04241e] rounded-2xl p-6 text-white shadow-sm">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
              Administrative Operational Shortcuts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Add New Title', icon: Plus, action: () => setCurrentView('inventory') },
                { label: 'Manage Orders', icon: ShoppingBag, action: () => setActiveTab('shipping') },
                { label: 'Stock Valuation', icon: DollarSign, action: () => setActiveTab('valuation') },
                { label: 'Store Coupons', icon: Tag, action: () => setCurrentView('settings') },
                { label: 'Sales Reports', icon: BarChart2, action: () => setCurrentView('sales-reports') },
                { label: 'Taxonomy (54)', icon: BookOpen, action: () => setCurrentView('categories') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center p-3.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-center gap-2"
                >
                  <item.icon className="w-5 h-5 text-teal-200" />
                  <span className="text-xs font-semibold leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Book Distribution */}
            <div className="lg:col-span-2 bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-teal-900 dark:text-teal-200 text-base">Top Category Catalog Depth</h2>
                <button
                  onClick={() => setCurrentView('categories')}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View all 54 categories <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                {CATEGORIES.slice(0, 7).map((cat) => {
                  const count = stats.products.filter(p => p.categoryId === cat.id).length || 52;
                  return (
                    <div key={cat.id} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-36 truncate">
                        {cat.name}
                      </span>
                      <div className="flex-1 h-5 bg-slate-100 dark:bg-[#04241e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center px-2 text-[10px] text-white font-bold"
                          style={{ width: `${Math.min(100, Math.round((count / 52) * 100))}%` }}
                        >
                          {count} Books
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Target</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics Status Overview */}
            <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-teal-900 dark:text-teal-200 text-base mb-4">Orders by Pipeline Status</h2>
                <div className="space-y-2.5">
                  {[
                    { label: 'Awaiting Shipment', count: stats.shippingStats.awaitingShipment, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
                    { label: 'Shipped & Out for Delivery', count: stats.shippingStats.shipped + stats.shippingStats.inTransit, color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
                    { label: 'Delivered Successfully', count: stats.shippingStats.delivered, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
                    { label: 'Cancelled / Returned', count: stats.shippingStats.cancelled + stats.shippingStats.returned, color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#04241e]">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setActiveTab('shipping')}
                className="mt-4 w-full py-2 bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                Open Shipping Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHIPPING & LOGISTICS HUB */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          {/* Shipping KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">Awaiting Shipment</span>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-1">
                {stats.shippingStats.awaitingShipment}
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Orders ready to pack & label</p>
            </div>

            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 rounded-2xl p-4">
              <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 uppercase">In Transit / Shipped</span>
              <div className="text-2xl font-black text-sky-900 dark:text-sky-100 mt-1">
                {stats.shippingStats.shipped + stats.shippingStats.inTransit}
              </div>
              <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-0.5">With TCS & Leopards couriers</p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Delivered Orders</span>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1">
                {stats.shippingStats.delivered}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Successfully handed over</p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4">
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase">Collected Delivery Fees</span>
              <div className="text-2xl font-black text-teal-900 dark:text-teal-100 mt-1">
                Rs. {stats.shippingStats.totalShippingRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">Nationwide delivery revenue</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search order #, customer, city, or tracking..."
                value={shippingSearch}
                onChange={(e) => setShippingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-teal-100"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'awaiting', label: 'Awaiting Shipment' },
                { key: 'shipped', label: 'In Transit / Shipped' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setShippingFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    shippingFilter === f.key
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 dark:bg-[#04241e] text-slate-600 dark:text-slate-300 hover:bg-teal-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#04241e] border-b border-teal-100 dark:border-teal-900/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Items & Value</th>
                    <th className="py-3 px-4">Courier & Tracking</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-teal-900/40">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                          {order.id}
                          {order.isDemo && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded font-sans">
                              DEMO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" /> {order.city}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-teal-100">Rs. {order.finalTotal.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-500">{order.items.length} book(s)</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{order.courierName}</div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {order.trackingNumber || 'Pending Assignment'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Pending']}`}>
                          {order.orderStatus}
                        </span>
                        {order.shippingLabelPrinted && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Label Ready
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePrintLabel(order)}
                            className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 text-teal-800 dark:text-teal-200 rounded-lg font-bold flex items-center gap-1 transition-colors"
                            title="Print Courier Shipping Label"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Label</span>
                          </button>

                          {(order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Pending') && (
                            <button
                              onClick={() => handleQuickDispatch(order.id)}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold flex items-center gap-1 transition-colors"
                              title="Quick Dispatch via TCS Express"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          )}

                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="text-[11px] bg-slate-50 dark:bg-[#04241e] border border-slate-200 dark:border-teal-900 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Returned">Returned</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY VALUATION & MOVEMENT */}
      {activeTab === 'valuation' && (
        <div className="space-y-6">
          {/* Inventory Valuation Header Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Catalog Asset Valuation</span>
              <div className="text-3xl font-black mt-1">
                Rs. {stats.inventoryValuation.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                Calculated dynamically via sum of remaining stock units across all 2,800+ catalog volumes multiplied by publisher retail prices.
              </p>
            </div>
            <div className="flex gap-4 bg-white/10 p-4 rounded-xl">
              <div>
                <span className="text-[11px] text-teal-200">Total Units in Stock</span>
                <div className="text-lg font-bold">{stats.remainingInventory.toLocaleString()}</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <span className="text-[11px] text-teal-200">Active Titles</span>
                <div className="text-lg font-bold">{stats.totalProducts.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fast Moving Books */}
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Fast-Moving Bestsellers
              </h3>
              <div className="space-y-3">
                {stats.fastMoving.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-[#04241e] rounded-xl">
                    <img src={item.productCover} alt="" className="w-9 h-11 object-cover rounded bg-teal-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{item.productName}</p>
                      <p className="text-[11px] text-slate-400">{item.categoryName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.unitsSold} sold</div>
                      <div className="text-[10px] text-slate-400">{item.remainingStock} left</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reorder Suggestions */}
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Reorder Suggestions
              </h3>
              <div className="space-y-3">
                {stats.reorderSuggestions.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl">
                    <img src={item.productCover} alt="" className="w-9 h-11 object-cover rounded bg-teal-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{item.productName}</p>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">Only {item.remainingStock} remaining</span>
                    </div>
                    <button
                      onClick={() => setCurrentView('inventory')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stagnant Inventory */}
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Slow-Moving Stock
              </h3>
              <div className="space-y-3">
                {stats.stagnant.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-[#04241e] rounded-xl">
                    <img src={item.productCover} alt="" className="w-9 h-11 object-cover rounded bg-teal-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{item.productName}</p>
                      <p className="text-[11px] text-slate-400">{item.remainingStock} units held</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-teal-950 text-slate-600 dark:text-slate-400 font-bold">
                      {item.unitsSold} sales
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE SHIPPING LABEL MODAL */}
      {selectedLabelOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border-2 border-teal-600">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-teal-800 tracking-wider">Official Courier Dispatch Label</span>
                <h3 className="text-lg font-black font-display text-slate-900">
                  {selectedLabelOrder.courierName} Consignment
                </h3>
              </div>
              <button
                onClick={() => setSelectedLabelOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Thermal / Shipping Label Format */}
            <div className="border-2 border-dashed border-slate-400 p-5 rounded-xl bg-slate-50 font-sans space-y-4">
              {/* Courier Barcode Simulation */}
              <div className="text-center pb-3 border-b">
                <div className="font-mono text-xl font-black tracking-widest text-slate-800 mb-1">
                  ||| | |||| || |||||| | |||| | ||| ||||
                </div>
                <div className="font-mono text-xs font-bold text-slate-700">
                  TRACKING: {selectedLabelOrder.trackingNumber || 'TCS-PK-9823412'}
                </div>
              </div>

              {/* Sender & Receiver Boxes */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border-r pr-2">
                  <div className="font-bold text-[10px] uppercase text-slate-500">FROM (SENDER):</div>
                  <div className="font-bold text-teal-900">PaperNest Logistics Hub</div>
                  <div className="text-slate-600">Plot 18, Urdu Bazaar Commercial Lane</div>
                  <div className="text-slate-600">Lahore, Punjab, Pakistan</div>
                  <div className="text-slate-600 font-mono">PH: +92 42 111 727 376</div>
                </div>

                <div>
                  <div className="font-bold text-[10px] uppercase text-slate-500">DELIVER TO:</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedLabelOrder.customerName}</div>
                  <div className="text-slate-700 leading-tight">{selectedLabelOrder.deliveryAddress}</div>
                  <div className="font-bold text-slate-900 mt-1 uppercase">{selectedLabelOrder.city}, Pakistan</div>
                  <div className="font-mono text-slate-700">{selectedLabelOrder.customerPhone}</div>
                </div>
              </div>

              {/* Order Contents & COD Badge */}
              <div className="bg-white p-3 rounded-lg border text-xs">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Order Reference: {selectedLabelOrder.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                    COD: Rs. {selectedLabelOrder.finalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {selectedLabelOrder.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                </div>
              </div>

              {selectedLabelOrder.deliveryInstructions && (
                <div className="text-[11px] italic bg-amber-50 p-2 rounded text-amber-900">
                  Special Notes: {selectedLabelOrder.deliveryInstructions}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedLabelOrder(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Airway Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
