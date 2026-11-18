import React, { useState } from 'react';
import {
  Settings, Tag, Moon, Sun, RefreshCw, Plus, Trash2,
  Check, X, Shield, Store, Truck, ArrowLeft
} from 'lucide-react';
import { ViewType, Coupon } from '../types';
import { storageService, DEMO_USERS } from '../services/storage';
import { CATEGORIES } from '../data/categoriesData';

interface StoreSettingsType {
  storeName: string;
  tagline: string;
  currency: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  officeAddress: string;
}

interface SettingsPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function SettingsPage({ setCurrentView, showToast, theme, toggleTheme }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'store' | 'coupons' | 'system'>('store');

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettingsType>(() => storageService.getStoreSettings());

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => storageService.getCoupons());
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscount: 1000,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    categoryId: '',
    isActive: true,
  });

  const currentUser = storageService.getCurrentUser();

  function handleSaveStoreSettings(e: React.FormEvent) {
    e.preventDefault();
    storageService.updateStoreSettings(storeSettings);
    if (showToast) showToast('Store settings saved successfully!', 'success');
  }

  function handleToggleCoupon(id: string) {
    storageService.toggleCoupon(id);
    setCoupons([...storageService.getCoupons()]);
    if (showToast) showToast('Coupon status updated', 'info');
  }

  function handleDeleteCoupon(id: string) {
    storageService.deleteCoupon(id);
    setCoupons([...storageService.getCoupons()]);
    if (showToast) showToast('Coupon deleted', 'info');
  }

  function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponForm.code?.trim()) return;

    storageService.addCoupon({
      code: couponForm.code.trim().toUpperCase(),
      description: couponForm.description || `${couponForm.discountValue}% discount code`,
      discountType: couponForm.discountType || 'percentage',
      discountValue: Number(couponForm.discountValue) || 10,
      minOrderAmount: Number(couponForm.minOrderAmount) || 0,
      maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : undefined,
      expiryDate: couponForm.expiryDate || '2026-12-31',
      usageLimit: Number(couponForm.usageLimit) || 1000,
      categoryId: couponForm.categoryId || undefined,
      isActive: true,
    });

    setCoupons([...storageService.getCoupons()]);
    setShowCouponModal(false);
    setCouponForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscount: 1000,
      expiryDate: '2026-12-31',
      usageLimit: 500,
      categoryId: '',
      isActive: true,
    });
    if (showToast) showToast(`Promo code created!`, 'success');
  }

  function handleResetData() {
    if (window.confirm("Are you sure you want to reset all catalog, inventory, and orders to pristine 1,000+ sample seed data?")) {
      storageService.resetToSampleData();
      setCoupons(storageService.getCoupons());
      setStoreSettings(storageService.getStoreSettings());
      if (showToast) showToast('Database reset to fresh catalog seed!', 'info');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 font-display">Store Settings & Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure store parameters, coupons, theme, and data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-teal-100 dark:border-teal-900 pb-3">
        {[
          { id: 'store', label: 'Store Parameters', icon: Store },
          { id: 'coupons', label: 'Promo Codes & Coupons', icon: Tag },
          { id: 'system', label: 'System & Theme', icon: Settings },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === t.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Store Parameters Tab */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveStoreSettings} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">General Store Configuration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Store Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={e => setStoreSettings(s => ({ ...s, storeName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Tagline</label>
              <input
                type="text"
                value={storeSettings.tagline}
                onChange={e => setStoreSettings(s => ({ ...s, tagline: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Support Hotline</label>
              <input
                type="text"
                value={storeSettings.supportPhone}
                onChange={e => setStoreSettings(s => ({ ...s, supportPhone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Support Email</label>
              <input
                type="email"
                value={storeSettings.supportEmail}
                onChange={e => setStoreSettings(s => ({ ...s, supportEmail: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={storeSettings.standardDeliveryFee}
                onChange={e => setStoreSettings(s => ({ ...s, standardDeliveryFee: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                value={storeSettings.freeDeliveryThreshold}
                onChange={e => setStoreSettings(s => ({ ...s, freeDeliveryThreshold: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Physical Store Address</label>
            <input
              type="text"
              value={storeSettings.officeAddress}
              onChange={e => setStoreSettings(s => ({ ...s, officeAddress: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-teal-50 dark:border-teal-900">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Save Store Settings
            </button>
          </div>
        </form>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">Active Coupons & Promo Discounts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage promotional discounts applied at checkout</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map(c => (
              <div
                key={c.id}
                className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {c.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCoupon(c.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                        c.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{c.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-teal-50 dark:border-teal-900 pt-3">
                  <div>
                    <span className="text-slate-400">Discount:</span>{' '}
                    <strong className="text-teal-700 dark:text-teal-300">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Order:</span> Rs. {c.minOrderAmount}
                  </div>
                  <div>
                    <span className="text-slate-400">Used:</span> {c.timesUsed} / {c.usageLimit}
                  </div>
                  <div>
                    <span className="text-slate-400">Expires:</span> {c.expiryDate || 'No Expiry'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System & Theme Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Theme setting */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200 mb-2">Display Theme</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Select your preferred color theme. PaperNest features Mint Green + Teal (Light) and Deep Emerald + Aqua (Dark).
            </p>
            <div className="flex gap-4">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  theme === 'light'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-teal-800 text-slate-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" /> Light Mint & Sage
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-teal-400 bg-teal-900/60 text-teal-200'
                    : 'border-teal-200 text-slate-700'
                }`}
              >
                <Moon className="w-5 h-5 text-teal-400" /> Dark Emerald & Deep Teal
              </button>
            </div>
          </div>

          {/* Catalog Database Reset */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-rose-100 dark:border-rose-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-rose-700 dark:text-rose-400 mb-2">Reset Catalog Database</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Re-seed all 1,000+ sample products, stock formulas, demo orders, and reviews back to default initial state.
            </p>
            <button
              onClick={handleResetData}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Catalog Seed Data
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Coupon */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-teal-800 dark:text-teal-200">Create New Promo Code</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Coupon Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. FLASH25"
                  value={couponForm.code || ''}
                  onChange={e => setCouponForm(c => ({ ...c, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm uppercase font-mono font-bold text-teal-800 dark:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 25% discount on all books"
                  value={couponForm.description || ''}
                  onChange={e => setCouponForm(c => ({ ...c, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={e => setCouponForm(c => ({ ...c, discountType: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Value</label>
                  <input
                    required
                    type="number"
                    value={couponForm.discountValue || 10}
                    onChange={e => setCouponForm(c => ({ ...c, discountValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Min Order (PKR)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderAmount || 0}
                    onChange={e => setCouponForm(c => ({ ...c, minOrderAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Max Discount (PKR)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={couponForm.maxDiscount || ''}
                    onChange={e => setCouponForm(c => ({ ...c, maxDiscount: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={couponForm.expiryDate || '2026-12-31'}
                  onChange={e => setCouponForm(c => ({ ...c, expiryDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 py-2.5 border border-teal-200 dark:border-teal-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
