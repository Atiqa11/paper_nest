import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, ShoppingCart, Heart, Search, Sun, Moon, Menu, X,
  User, ChevronDown, Newspaper, GraduationCap, PenTool,
  BookMarked, Target, LayoutGrid, MessageCircle, Settings,
  BarChart2, Package, Shield, Bell
} from 'lucide-react';
import { ViewType, User as UserType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (v: ViewType) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cartCount: number;
  wishlistCount: number;
  currentUser: UserType;
}

const NAV_LINKS = [
  { label: 'Home',       view: 'home'       as ViewType, icon: BookOpen },
  { label: 'Shop',       view: 'shop'       as ViewType, icon: LayoutGrid },
  { label: 'Library',    view: 'library'    as ViewType, icon: BookMarked },
  { label: 'Newspapers', view: 'newspapers' as ViewType, icon: Newspaper },
  { label: 'Novels',     view: 'novels'     as ViewType, icon: BookOpen },
  { label: 'Exam Prep',  view: 'exam-prep'  as ViewType, icon: Target },
  { label: 'Stationery', view: 'stationery' as ViewType, icon: PenTool },
];

const ADMIN_LINKS = [
  { label: 'Dashboard',  view: 'admin-dashboard' as ViewType, icon: BarChart2 },
  { label: 'Inventory',  view: 'inventory'       as ViewType, icon: Package },
  { label: 'Reports',    view: 'sales-reports'   as ViewType, icon: BarChart2 },
];

export default function Navbar({ currentView, setCurrentView, theme, toggleTheme, cartCount, wishlistCount, currentUser }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  function navTo(v: ViewType) {
    setCurrentView(v);
    setMenuOpen(false);
    setDropdownOpen(false);
    setAdminMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#042723]/95 backdrop-blur-md border-b border-teal-100 dark:border-teal-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button onClick={() => navTo('home')} className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-700 dark:group-hover:bg-teal-400 transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-teal-800 dark:text-teal-200 font-display">PaperNest</span>
              <span className="hidden lg:block text-[10px] text-teal-500 dark:text-teal-400 leading-none">Every Page Opens a New Possibility</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.view}
                onClick={() => navTo(link.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentView === link.view
                    ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navTo('categories')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentView === 'categories'
                  ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300'
              }`}
            >
              Categories
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2" ref={searchRef}>

            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/50 rounded-lg px-3 py-1.5 border border-teal-200 dark:border-teal-700">
                  <Search className="w-4 h-4 text-teal-500" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search books, authors…"
                    className="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 w-40 sm:w-56 placeholder:text-teal-400"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* AI Assistant */}
            <button
              onClick={() => navTo('ai-assistant')}
              className={`hidden sm:flex p-2 rounded-lg transition-colors ${
                currentView === 'ai-assistant'
                  ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300'
              }`}
              title="AI Book Assistant"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navTo('wishlist')}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navTo('cart')}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin menu */}
            {isAdmin && (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setAdminMenuOpen(o => !o)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors border border-amber-200 dark:border-amber-800"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                  <ChevronDown className={`w-3 h-3 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-800 rounded-xl shadow-xl overflow-hidden z-50">
                    {ADMIN_LINKS.map(l => (
                      <button
                        key={l.view}
                        onClick={() => navTo(l.view)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                      >
                        <l.icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="hidden lg:block text-xs font-medium max-w-[80px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-teal-50 dark:border-teal-800">
                    <p className="text-sm font-semibold text-teal-800 dark:text-teal-200 truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isAdmin ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400'
                    }`}>{currentUser.role}</span>
                  </div>
                  {[
                    { label: 'My Account',   view: 'account'       as ViewType, icon: User },
                    { label: 'My Orders',    view: 'my-orders'     as ViewType, icon: Package },
                    { label: 'My Wishlist',  view: 'wishlist'      as ViewType, icon: Heart },
                    { label: 'Settings',     view: 'settings'      as ViewType, icon: Settings },
                    { label: 'Help & Contact',view: 'contact'      as ViewType, icon: Bell },
                  ].map(item => (
                    <button
                      key={item.view}
                      onClick={() => navTo(item.view)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-teal-100 dark:border-teal-900 bg-white dark:bg-[#042723] px-4 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.view}
              onClick={() => navTo(link.view)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === link.view
                  ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </button>
          ))}
          <button onClick={() => navTo('categories')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
            <LayoutGrid className="w-4 h-4" />
            All Categories
          </button>
          <button onClick={() => navTo('ai-assistant')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
            <MessageCircle className="w-4 h-4" />
            AI Book Assistant
          </button>
          <div className="border-t border-teal-50 dark:border-teal-900 pt-2 mt-2">
            <button onClick={() => navTo('account')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
              <User className="w-4 h-4" />
              {currentUser.fullName}
            </button>
            {isAdmin && ADMIN_LINKS.map(l => (
              <button key={l.view} onClick={() => navTo(l.view)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
                <l.icon className="w-4 h-4" />
                {l.label} (Admin)
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
