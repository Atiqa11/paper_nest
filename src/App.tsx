import React, { useState, useEffect, useCallback } from 'react';
import { ViewType } from './types';
import { storageService } from './services/storage';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './components/HomePage';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import WishlistPage from './components/WishlistPage';
import AccountPage from './components/AccountPage';
import LibraryPage from './components/LibraryPage';
import NewspapersPage from './components/NewspapersPage';
import NovelsPage from './components/NovelsPage';
import IdeologicalPage from './components/IdeologicalPage';
import AcademicPage from './components/AcademicPage';
import StationeryPage from './components/StationeryPage';
import ExamPrepPage from './components/ExamPrepPage';
import CategoriesPage from './components/CategoriesPage';
import AIAssistantPage from './components/AIAssistantPage';
import AdminDashboard from './components/AdminDashboard';
import InventoryPage from './components/InventoryPage';
import SalesReportsPage from './components/SalesReportsPage';
import SettingsPage from './components/SettingsPage';
import ContactPage from './components/ContactPage';

// ─── Toast ───────────────────────────────────────────────────────────────────
interface ToastMsg { message: string; type: 'success' | 'error' | 'info' }

function Toast({ toast, onClose }: { toast: ToastMsg; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  const bg = toast.type === 'success'
    ? 'bg-teal-600'
    : toast.type === 'error'
    ? 'bg-red-600'
    : 'bg-sky-600';

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm animate-[slideUp_0.3s_ease]`}>
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-auto text-white/70 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}

// ─── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied({ setCurrentView }: { setCurrentView: (v: ViewType) => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-6xl">🔒</div>
      <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200">Admin Access Required</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        This section is restricted to administrators. Please switch to an admin account in Account Settings.
      </p>
      <div className="flex gap-3">
        <button onClick={() => setCurrentView('home')} className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Go Home
        </button>
        <button onClick={() => setCurrentView('account')} className="px-5 py-2 border border-teal-600 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
          Account Settings
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('papernest_theme') as 'light' | 'dark') || 'light';
  });
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [toast, setToast] = useState<ToastMsg | null>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('papernest_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  const refreshCounts = useCallback(() => {
    const cart = storageService.getCart();
    const wish = storageService.getWishlist();
    setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
    setWishlistCount(wish.length);
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [currentView, refreshCounts]);

  const showToast = useCallback((message: string, type: ToastMsg['type'] = 'success') => {
    setToast({ message, type });
  }, []);

  const showProduct = useCallback((id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser.role === 'admin';
  const adminViews: ViewType[] = ['admin-dashboard', 'inventory', 'sales-reports'];

  // Shared props
  const navProps = { currentView, setCurrentView: navigate, theme, toggleTheme, cartCount, wishlistCount, currentUser };
  const pageProps = { setCurrentView: navigate, showProduct, showToast, refreshCounts };

  function renderPage() {
    // Admin guard
    if (adminViews.includes(currentView) && !isAdmin) {
      return <AccessDenied setCurrentView={navigate} />;
    }

    switch (currentView) {
      case 'home':          return <HomePage {...pageProps} />;
      case 'shop':          return <ShopPage {...pageProps} />;
      case 'library':       return <LibraryPage {...pageProps} />;
      case 'newspapers':    return <NewspapersPage {...pageProps} />;
      case 'novels':        return <NovelsPage {...pageProps} />;
      case 'ideological':   return <IdeologicalPage {...pageProps} />;
      case 'academic':      return <AcademicPage {...pageProps} />;
      case 'stationery':    return <StationeryPage {...pageProps} />;
      case 'exam-prep':     return <ExamPrepPage {...pageProps} />;
      case 'categories':    return <CategoriesPage {...pageProps} />;
      case 'cart':          return <CartPage {...pageProps} />;
      case 'checkout':      return <CheckoutPage {...pageProps} />;
      case 'my-orders':     return <OrdersPage {...pageProps} />;
      case 'order-tracking':return <OrderTrackingPage {...pageProps} />;
      case 'wishlist':      return <WishlistPage {...pageProps} />;
      case 'ai-assistant':  return <AIAssistantPage {...pageProps} />;
      case 'account':       return <AccountPage {...pageProps} />;
      case 'admin-dashboard': return <AdminDashboard {...pageProps} />;
      case 'inventory':     return <InventoryPage {...pageProps} />;
      case 'sales-reports': return <SalesReportsPage {...pageProps} />;
      case 'settings':      return <SettingsPage {...pageProps} theme={theme} toggleTheme={toggleTheme} />;
      case 'contact':       return <ContactPage {...pageProps} />;
      case 'product-detail':
        return selectedProductId
          ? <ProductDetailPage {...pageProps} productId={selectedProductId} />
          : <HomePage {...pageProps} />;
      default:
        return <HomePage {...pageProps} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#042723] text-slate-800 dark:text-emerald-50 transition-colors duration-200 flex flex-col">
      <Navbar {...navProps} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer setCurrentView={navigate} />
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
