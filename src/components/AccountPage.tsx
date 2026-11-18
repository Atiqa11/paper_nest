import React, { useState } from 'react';
import { User, Mail, Phone, Shield, MapPin, Plus, Edit3, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { ViewType, Address } from '../types';
import { storageService, DEMO_USERS } from '../services/storage';

interface AccountPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
}

export default function AccountPage({ setCurrentView, showToast }: AccountPageProps) {
  const [tab, setTab] = useState<'profile'|'addresses'|'settings'>('profile');
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: currentUser.fullName, phone: currentUser.phone || '' });
  const [addresses, setAddresses] = useState<Address[]>(storageService.getAddresses());
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState<Partial<Address>>({ label:'Home', recipientName:'', phone:'', streetAddress:'', city:'', postalCode:'', isDefault: false });
  const [version, setVersion] = useState(0);

  function refresh() {
    setAddresses(storageService.getAddresses());
    setCurrentUser(storageService.getCurrentUser());
    setVersion(v => v + 1);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    storageService.updateProfile({ fullName: profileForm.fullName, phone: profileForm.phone });
    refresh();
    setEditingProfile(false);
    if (showToast) showToast('Profile updated successfully!', 'success');
  }

  function handleSwitchRole(role: 'admin'|'customer') {
    storageService.switchUser(role);
    refresh();
    if (showToast) showToast(`Switched to ${role} mode`, 'info');
  }

  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    storageService.saveAddress({ ...addrForm, userId: currentUser.id } as any);
    refresh();
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddrForm({ label:'Home', recipientName:'', phone:'', streetAddress:'', city:'', postalCode:'', isDefault: false });
    if (showToast) showToast('Address saved!', 'success');
  }

  function handleEditAddress(addr: Address) {
    setAddrForm(addr);
    setEditingAddress(addr);
    setShowAddressForm(true);
  }

  function handleDeleteAddress(id: string) {
    storageService.deleteAddress(id);
    refresh();
    if (showToast) showToast('Address deleted', 'info');
  }

  const isAdmin = currentUser.role === 'admin';

  const TABS = [
    { id: 'profile'   as const, label: 'Profile' },
    { id: 'addresses' as const, label: 'Addresses' },
    { id: 'settings'  as const, label: 'Settings' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setCurrentView('home')} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 font-display">My Account</h1>
      </div>

      {/* Avatar + name banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {currentUser.fullName[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{currentUser.fullName}</h2>
          <p className="text-teal-200 text-sm">{currentUser.email}</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isAdmin ? 'bg-amber-400/30 text-amber-200' : 'bg-white/20 text-white'}`}>
            {isAdmin ? '🛡 Administrator' : '👤 Customer'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-teal-50 dark:bg-teal-900/40 p-1 rounded-xl border border-teal-100 dark:border-teal-800">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t.id ? 'bg-white dark:bg-[#063028] text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-teal-800 dark:text-teal-200">Profile Information</h3>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                <input value={profileForm.fullName} onChange={e => setProfileForm(f => ({...f, fullName: e.target.value}))} required
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Phone</label>
                <input value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"><Check className="w-4 h-4" />Save</button>
                <button type="button" onClick={() => setEditingProfile(false)} className="px-5 py-2 border border-teal-200 dark:border-teal-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center gap-2"><X className="w-4 h-4" />Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {[
                { icon: User,   label: 'Full Name', value: currentUser.fullName },
                { icon: Mail,   label: 'Email',     value: currentUser.email },
                { icon: Phone,  label: 'Phone',     value: currentUser.phone || 'Not set' },
                { icon: Shield, label: 'Role',      value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                    <row.icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{row.label}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <div className="space-y-4">
          {!showAddressForm && (
            <button onClick={() => { setAddrForm({ label:'Home', recipientName:'', phone:'', streetAddress:'', city:'', postalCode:'', isDefault: false }); setEditingAddress(null); setShowAddressForm(true); }}
              className="w-full py-3 border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-2xl text-sm font-medium text-teal-600 dark:text-teal-400 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          )}

          {showAddressForm && (
            <form onSubmit={handleSaveAddress} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 space-y-4">
              <h3 className="font-bold text-teal-800 dark:text-teal-200 mb-1">{editingAddress ? 'Edit' : 'Add'} Address</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { field:'label',          label:'Label (Home/Office)',  ph:'Home' },
                  { field:'recipientName',  label:'Recipient Name',       ph:'Full Name' },
                  { field:'phone',          label:'Phone',                ph:'+92 300…' },
                  { field:'city',           label:'City',                 ph:'Lahore' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{f.label}</label>
                    <input value={(addrForm as any)[f.field] || ''} onChange={e => setAddrForm(a => ({...a, [f.field]: e.target.value}))} placeholder={f.ph} required
                      className="w-full px-3 py-2 rounded-lg border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Street Address</label>
                <input value={addrForm.streetAddress || ''} onChange={e => setAddrForm(a => ({...a, streetAddress: e.target.value}))} placeholder="House #, Street, Area" required
                  className="w-full px-3 py-2 rounded-lg border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={addrForm.isDefault || false} onChange={e => setAddrForm(a => ({...a, isDefault: e.target.checked}))} className="accent-teal-600" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Set as default address</span>
              </label>
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">Save Address</button>
                <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="px-5 py-2 border border-teal-200 dark:border-teal-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">Cancel</button>
              </div>
            </form>
          )}

          {addresses.map(addr => (
            <div key={addr.id} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-teal-800 dark:text-teal-200">{addr.label}</span>
                  {addr.isDefault && <span className="text-[10px] bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium">Default</span>}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{addr.recipientName} · {addr.phone}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{addr.streetAddress}, {addr.city}{addr.postalCode ? ` – ${addr.postalCode}` : ''}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEditAddress(addr)} className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="space-y-5">
          {/* Demo role switcher */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5">
            <h3 className="font-bold text-teal-800 dark:text-teal-200 mb-1">Demo Account Switcher</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Switch between accounts for testing. This is a demo feature.</p>
            <div className="flex gap-3 flex-wrap">
              {DEMO_USERS.map(u => (
                <button key={u.id} onClick={() => handleSwitchRole(u.role)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${currentUser.id === u.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : 'border-teal-100 dark:border-teal-800 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-600'}`}>
                  {u.role === 'admin' ? '🛡' : '👤'}
                  <div className="text-left">
                    <p className="font-semibold leading-tight">{u.fullName.split(' ')[0]}</p>
                    <p className="text-xs opacity-70 capitalize">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 p-5">
            <h3 className="font-bold text-teal-800 dark:text-teal-200 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'My Orders',      view: 'my-orders'      as ViewType },
                { label: 'Order Tracking', view: 'order-tracking' as ViewType },
                { label: 'My Wishlist',    view: 'wishlist'       as ViewType },
                { label: 'AI Assistant',   view: 'ai-assistant'   as ViewType },
                { label: 'Settings',       view: 'settings'       as ViewType },
                { label: 'Help & Contact', view: 'contact'        as ViewType },
              ].map(l => (
                <button key={l.label} onClick={() => setCurrentView(l.view)}
                  className="px-4 py-2.5 text-sm text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors font-medium text-left">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
