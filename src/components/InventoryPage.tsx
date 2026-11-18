import React, { useState, useMemo } from 'react';
import {
  Search, Package, Plus, Edit3, Trash2, RefreshCw, History,
  AlertTriangle, ChevronDown, ChevronUp, X, Check, ArrowLeft
} from 'lucide-react';
import { ViewType, InventoryItem, StockTransaction } from '../types';
import { storageService } from '../services/storage';

interface InventoryPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
}

const STATUS_BADGES: Record<string, string> = {
  'In Stock':         'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  'Low Stock':        'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  'Out of Stock':     'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  'Reorder Required': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
};

type ModalType = 'restock' | 'adjust' | 'history' | 'delete' | null;

export default function InventoryPage({ setCurrentView, showToast }: InventoryPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name'|'stock'|'sold'>('name');
  const [modal, setModal] = useState<{ type: ModalType; item?: InventoryItem }>({ type: null });
  const [restockQty, setRestockQty] = useState(10);
  const [restockReason, setRestockReason] = useState('Regular restock');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Stock audit');
  const [version, setVersion] = useState(0);

  const inventory = useMemo(() => {
    let items = storageService.getAllInventory();
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.productName?.toLowerCase().includes(q) || i.categoryName?.toLowerCase().includes(q));
    }
    if (statusFilter) items = items.filter(i => i.stockStatus === statusFilter);
    if (categoryFilter) items = items.filter(i => i.categoryName === categoryFilter);
    if (sortBy === 'stock') items = [...items].sort((a, b) => a.remainingStock - b.remainingStock);
    else if (sortBy === 'sold') items = [...items].sort((a, b) => b.unitsSold - a.unitsSold);
    else items = [...items].sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
    return items;
  }, [search, statusFilter, categoryFilter, sortBy, version]);

  const categories = useMemo(() => [...new Set(storageService.getAllInventory().map(i => i.categoryName || '').filter(Boolean))].sort(), []);
  const transactions = useMemo(() => modal.item ? storageService.getStockTransactions(modal.item.productId) : [], [modal]);

  function handleRestock() {
    if (!modal.item) return;
    storageService.restockProduct(modal.item.productId, restockQty, restockReason);
    setModal({ type: null });
    setVersion(v => v + 1);
    if (showToast) showToast(`Restocked +${restockQty} units`, 'success');
  }

  function handleAdjust() {
    if (!modal.item) return;
    storageService.adjustStock(modal.item.productId, adjustQty, adjustReason);
    setModal({ type: null });
    setVersion(v => v + 1);
    if (showToast) showToast(`Stock adjusted to ${adjustQty} units`, 'success');
  }

  function handleDelete() {
    if (!modal.item) return;
    storageService.deleteProduct(modal.item.productId);
    setModal({ type: null });
    setVersion(v => v + 1);
    if (showToast) showToast('Product deleted from catalog', 'info');
  }

  const alertCount = inventory.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => setCurrentView('admin-dashboard')} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 font-display">Inventory Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{inventory.length.toLocaleString()} products tracked</p>
        </div>
        {alertCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            {alertCount} stock alert{alertCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Reorder Required">Reorder Required</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option value="name">Sort: Name</option>
          <option value="stock">Sort: Lowest Stock</option>
          <option value="sold">Sort: Most Sold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-teal-50 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30">
                {['Product','Category','Opening','Received','Sold','Remaining','Available','Reorder','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50 dark:divide-teal-900">
              {inventory.slice(0, 50).map(item => (
                <tr key={item.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-9 rounded-lg overflow-hidden bg-teal-50 dark:bg-teal-900 flex-shrink-0">
                        <img src={item.productCover} alt={item.productName} className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=80&q=70'; }} />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-teal-100 line-clamp-2 max-w-[160px] leading-tight text-xs">{item.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.categoryName}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-slate-700 dark:text-slate-300">{item.openingStock}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-emerald-600 dark:text-emerald-400">{item.stockReceived}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-sky-600 dark:text-sky-400">{item.unitsSold}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{item.remainingStock}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-slate-700 dark:text-slate-300">{item.availableStock}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-slate-500 dark:text-slate-400">{item.reorderLevel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_BADGES[item.stockStatus] || STATUS_BADGES['In Stock']}`}>
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setRestockQty(10); setRestockReason('Regular restock'); setModal({ type: 'restock', item }); }}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Restock">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setAdjustQty(item.remainingStock); setAdjustReason('Stock audit'); setModal({ type: 'adjust', item }); }}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Adjust">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setModal({ type: 'history', item })}
                        className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors" title="History">
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setModal({ type: 'delete', item })}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inventory.length > 50 && (
          <div className="px-4 py-3 border-t border-teal-50 dark:border-teal-900 text-sm text-slate-500 dark:text-slate-400 text-center">
            Showing 50 of {inventory.length} products. Use search/filter to narrow results.
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal({ type: null })} />
          <div className="relative bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto">
            <button onClick={() => setModal({ type: null })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>

            {modal.type === 'restock' && modal.item && (
              <div className="space-y-4">
                <h3 className="font-bold text-teal-800 dark:text-teal-200">Restock: {modal.item.productName}</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Quantity to Add</label>
                  <input type="number" min={1} value={restockQty} onChange={e => setRestockQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Reason</label>
                  <input value={restockReason} onChange={e => setRestockReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/40 rounded-xl text-sm">
                  <p className="text-slate-600 dark:text-slate-300">Current stock: <strong className="text-teal-700 dark:text-teal-300">{modal.item.remainingStock}</strong></p>
                  <p className="text-slate-600 dark:text-slate-300">After restock: <strong className="text-emerald-600 dark:text-emerald-400">{modal.item.remainingStock + restockQty}</strong></p>
                </div>
                <button onClick={handleRestock} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Confirm Restock
                </button>
              </div>
            )}

            {modal.type === 'adjust' && modal.item && (
              <div className="space-y-4">
                <h3 className="font-bold text-teal-800 dark:text-teal-200">Stock Adjustment: {modal.item.productName}</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">New Stock Quantity</label>
                  <input type="number" min={0} value={adjustQty} onChange={e => setAdjustQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Reason</label>
                  <input value={adjustReason} onChange={e => setAdjustReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <button onClick={handleAdjust} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Confirm Adjustment</button>
              </div>
            )}

            {modal.type === 'history' && modal.item && (
              <div>
                <h3 className="font-bold text-teal-800 dark:text-teal-200 mb-4">Stock History: {modal.item.productName}</h3>
                {transactions.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No transactions recorded yet.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {transactions.map(tx => (
                      <div key={tx.id} className="flex items-center gap-3 p-2.5 bg-teal-50 dark:bg-teal-950/30 rounded-xl">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          tx.transactionType === 'received' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                          tx.transactionType === 'sale' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400' :
                          tx.transactionType === 'adjustment' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
                        }`}>{tx.transactionType}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-1">{tx.reason}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-bold ${tx.transactionType === 'received' ? 'text-emerald-600 dark:text-emerald-400' : tx.transactionType === 'sale' ? 'text-red-500' : 'text-blue-600'}`}>
                            {tx.transactionType === 'received' ? '+' : tx.transactionType === 'sale' ? '−' : '='}{Math.abs(tx.quantity)}
                          </span>
                          <p className="text-[10px] text-slate-400">{tx.balanceAfter} left</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {modal.type === 'delete' && modal.item && (
              <div className="text-center space-y-4">
                <div className="text-5xl">⚠️</div>
                <h3 className="font-bold text-red-700 dark:text-red-400">Delete Product?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to permanently delete <strong>"{modal.item.productName}"</strong>? This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setModal({ type: null })} className="flex-1 py-2.5 border border-teal-200 dark:border-teal-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30">Cancel</button>
                  <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
