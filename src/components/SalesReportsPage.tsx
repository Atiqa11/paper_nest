import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Download, Calendar, DollarSign, ShoppingBag,
  Award, ArrowLeft, BarChart2, PieChart, Users, FileText
} from 'lucide-react';
import { ViewType } from '../types';
import { storageService } from '../services/storage';
import { CATEGORIES } from '../data/categoriesData';

interface SalesReportsPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function SalesReportsPage({ setCurrentView, showToast }: SalesReportsPageProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const orders = useMemo(() => storageService.getOrders(), []);
  const inventory = useMemo(() => storageService.getAllInventory(), []);
  const products = useMemo(() => storageService.getProducts(), []);

  // Filtered orders (non-cancelled)
  const validOrders = useMemo(() => {
    return orders.filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned');
  }, [orders]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    return validOrders.reduce((sum, o) => sum + o.finalTotal, 0);
  }, [validOrders]);

  const totalUnitsSold = useMemo(() => {
    return inventory.reduce((sum, i) => sum + i.unitsSold, 0);
  }, [inventory]);

  const averageOrderValue = useMemo(() => {
    return validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  }, [validOrders, totalRevenue]);

  // Category Revenue breakdown
  const categoryRevenue = useMemo(() => {
    const map = new Map<string, { name: string; count: number; revenue: number }>();
    CATEGORIES.forEach(c => map.set(c.id, { name: c.name, count: 0, revenue: 0 }));

    validOrders.forEach(o => {
      o.items.forEach(it => {
        const prod = products.find(p => p.id === it.productId);
        const catId = prod?.categoryId || 'other';
        const entry = map.get(catId) || { name: prod?.categoryName || 'General', count: 0, revenue: 0 };
        entry.count += it.quantity;
        entry.revenue += it.subtotal;
        map.set(catId, entry);
      });
    });

    return Array.from(map.values())
      .filter(c => c.count > 0 || c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [validOrders, products]);

  // Top Authors
  const topAuthors = useMemo(() => {
    const authorMap = new Map<string, { name: string; unitsSold: number; revenue: number }>();
    products.forEach(p => {
      const inv = inventory.find(i => i.productId === p.id);
      const sold = inv ? inv.unitsSold : 0;
      const rev = sold * (p.discountedPrice || p.price);
      const existing = authorMap.get(p.authorName) || { name: p.authorName, unitsSold: 0, revenue: 0 };
      existing.unitsSold += sold;
      existing.revenue += rev;
      authorMap.set(p.authorName, existing);
    });

    return Array.from(authorMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 7);
  }, [products, inventory]);

  // Bestselling Products
  const bestsellers = useMemo(() => {
    return [...products]
      .map(p => {
        const inv = inventory.find(i => i.productId === p.id);
        const units = inv ? inv.unitsSold : 0;
        return {
          id: p.id,
          name: p.name,
          categoryName: p.categoryName,
          authorName: p.authorName,
          coverImage: p.coverImage,
          price: p.discountedPrice || p.price,
          unitsSold: units,
          revenue: units * (p.discountedPrice || p.price),
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 8);
  }, [products, inventory]);

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    validOrders.forEach(o => {
      counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + o.finalTotal;
    });
    return Object.entries(counts).map(([method, total]) => ({ method, total }));
  }, [validOrders]);

  function exportCSV() {
    let csv = "Product Name,Category,Author,Price,Units Sold,Revenue\n";
    bestsellers.forEach(b => {
      csv += `"${b.name}","${b.categoryName}","${b.authorName}",${b.price},${b.unitsSold},${b.revenue}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaperNest-Sales-Report-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    if (showToast) showToast('Sales Report exported as CSV!', 'success');
  }

  const maxCatRev = Math.max(...categoryRevenue.map(c => c.revenue), 1000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin-dashboard')}
            className="p-2 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 font-display">Sales & Analytics Reports</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Database-driven financial overview and product movement</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-teal-50 dark:bg-teal-900/40 p-1 border border-teal-100 dark:border-teal-800">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Sales</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-800 dark:text-teal-100">Rs. {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">From {validOrders.length} processed orders</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Units Sold</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-teal-100">{totalUnitsSold.toLocaleString()}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across 1,000+ catalog titles</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg. Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-teal-100">Rs. {averageOrderValue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standard student cart size</p>
        </div>

        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock Turnover</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-teal-100">
            {((totalUnitsSold / Math.max(1, totalUnitsSold + 5000)) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">Inventory efficiency index</p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Revenue Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">Revenue Contribution by Category</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time revenue computed from completed customer orders</p>
            </div>
            <PieChart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>

          <div className="space-y-4">
            {categoryRevenue.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No category revenue recorded yet.</p>
            ) : (
              categoryRevenue.map(cat => {
                const pct = Math.min(100, (cat.revenue / maxCatRev) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{cat.count} units</span>
                        <span className="font-bold text-teal-700 dark:text-teal-300">Rs. {cat.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-teal-50 dark:bg-teal-950/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-mint-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Authors */}
        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">Top-Selling Authors</h2>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topAuthors.map((author, idx) => (
              <div key={author.name} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-teal-100 truncate">{author.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{author.unitsSold} units sold</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                  Rs. {author.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bestselling Products Table */}
      <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 overflow-hidden shadow-sm mb-8">
        <div className="p-5 border-b border-teal-50 dark:border-teal-900 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-teal-800 dark:text-teal-200">Bestselling Products Movement</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Highest volume items based on confirmed purchases</p>
          </div>
          <button
            onClick={() => setCurrentView('inventory')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
          >
            Manage Inventory →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-50/50 dark:bg-teal-950/30 border-b border-teal-50 dark:border-teal-900">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Book / Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Author</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Price</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Units Sold</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50 dark:divide-teal-900">
              {bestsellers.map(b => (
                <tr key={b.id} className="hover:bg-teal-50/40 dark:hover:bg-teal-900/20 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img
                      src={b.coverImage}
                      alt={b.name}
                      className="w-8 h-10 object-cover rounded shadow-sm flex-shrink-0"
                      onError={e => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&q=70';
                      }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-teal-100 line-clamp-1 max-w-xs">{b.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{b.categoryName}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">{b.authorName}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-700 dark:text-slate-200">Rs. {b.price.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-teal-700 dark:text-teal-300">{b.unitsSold}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300">Rs. {b.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
