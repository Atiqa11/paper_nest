import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, ArrowRight, BookOpen, Newspaper, GraduationCap, PenTool, Target,
  Book, Star, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Award,
  ShieldCheck, Truck, RefreshCw, Headphones, Mail, Clock, Zap, Flame,
  CheckCircle, Plus, Minus, Heart
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, ViewType } from '../types';
import ProductCard from './ProductCard';

interface HomePageProps {
  setCurrentView: (view: ViewType, productId?: string) => void;
  showProduct?: (productId: string) => void;
}

const CATEGORY_CARDS = [
  { id: 'css-prep', label: 'CSS Exam Prep', count: '52+ Books', icon: Target, color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300', view: 'exam-prep' as ViewType },
  { id: 'novels', label: 'Urdu & English Novels', count: '52+ Books', icon: Book, color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300', view: 'novels' as ViewType },
  { id: 'school', label: 'School & College', count: '52+ Books', icon: GraduationCap, color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300', view: 'library' as ViewType },
  { id: 'ideological-political', label: 'Ideological & Politics', count: '52+ Books', icon: BookOpen, color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300', view: 'ideological' as ViewType },
  { id: 'newspapers', label: 'Daily Newspapers', count: '52+ Periodicals', icon: Newspaper, color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300', view: 'newspapers' as ViewType },
  { id: 'stationery', label: 'Stationery & Study', count: '52+ Items', icon: PenTool, color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300', view: 'stationery' as ViewType },
];

const FEATURES = [
  { icon: Truck, title: 'Express Delivery', desc: 'Across 150+ Pakistani cities', color: 'text-teal-600 dark:text-teal-400' },
  { icon: ShieldCheck, title: '100% Authentic', desc: 'Direct from authorized publishers', color: 'text-blue-600 dark:text-blue-400' },
  { icon: RefreshCw, title: 'Hassle-Free Returns', desc: '7-day replacement guarantee', color: 'text-green-600 dark:text-green-400' },
  { icon: Headphones, title: 'Academic Support', desc: 'Syllabus & book guidance', color: 'text-purple-600 dark:text-purple-400' },
];

const HomePage: React.FC<HomePageProps> = ({ setCurrentView, showProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [featuredNovels, setFeaturedNovels] = useState<Product[]>([]);
  const [examPrepBooks, setExamPrepBooks] = useState<Product[]>([]);
  const [stationeryItems, setStationeryItems] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [email, setEmail] = useState('');

  // Daily Reading Challenge State (local storage backed)
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    return parseInt(localStorage.getItem('papernest_daily_goal') || '30', 10);
  });
  const [pagesRead, setPagesRead] = useState<number>(() => {
    return parseInt(localStorage.getItem('papernest_daily_pages') || '18', 10);
  });
  const [streakDays, setStreakDays] = useState<number>(7);

  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const all = storageService.getProducts();
    setBestsellers(all.filter(p => p.isBestseller).slice(0, 12));
    setFeaturedNovels(all.filter(p => p.categoryId === 'novels').slice(0, 6));
    setExamPrepBooks(all.filter(p => ['css-prep', 'mdcat-prep', 'ecat-prep'].includes(p.categoryId)).slice(0, 4));
    setStationeryItems(all.filter(p => p.categoryId === 'stationery').slice(0, 4));
    setRecentlyViewed(storageService.getRecentlyViewed());
  }, []);

  const handleProductSelect = useCallback((productId: string) => {
    storageService.addRecentlyViewed(productId);
    if (showProduct) {
      showProduct(productId);
    } else {
      setCurrentView('product-detail', productId);
    }
  }, [setCurrentView, showProduct]);

  // Autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    const all = storageService.getProducts();
    return all.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.authorName.toLowerCase().includes(q) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery]);

  const flashSaleItems = useMemo(() => {
    const all = storageService.getProducts();
    return all
      .filter(p => p.discountedPrice && p.discountedPrice < p.price)
      .slice(0, 4);
  }, []);

  const bookOfTheDay = useMemo(() => {
    const all = storageService.getProducts();
    return all.find(p => p.id === 'pn-prod-00001') || all[0];
  }, []);

  const addToCart = useCallback((productId: string) => {
    storageService.addToCart(productId, 1);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    storageService.toggleWishlist(productId);
  }, []);

  const handleLogPage = (delta: number) => {
    const newVal = Math.max(0, pagesRead + delta);
    setPagesRead(newVal);
    localStorage.setItem('papernest_daily_pages', newVal.toString());
  };

  const visibleBestsellers = bestsellers.slice(carouselIdx, carouselIdx + 4);

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#042723] text-slate-800 dark:text-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 dark:from-[#021c19] dark:via-teal-950 dark:to-emerald-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 text-teal-100 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Pakistan's Premier Academic & Literature Bookstore
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight font-display mb-6">
              Every Page Opens<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">
                a New Possibility
              </span>
            </h1>
            <p className="text-teal-100 text-base md:text-lg mb-8 leading-relaxed max-w-2xl">
              Discover 2,800+ authentic books across 54 academic and literature categories. From CSS, MDCAT, and Law to Urdu fiction, philosophy, and premium stationery.
            </p>

            {/* Search Autocomplete Hero Bar */}
            <div className="relative max-w-xl mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                    placeholder="Search by title, author, CSS, or syllabus..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#063028] text-slate-800 dark:text-emerald-50 placeholder-slate-400 dark:placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm shadow-xl"
                  />
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl transition-colors shadow-lg flex items-center gap-2 flex-shrink-0 text-sm"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Autocomplete live suggestions dropdown */}
              {searchFocused && autocompleteSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900 rounded-2xl shadow-2xl overflow-hidden z-40">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-[#04241e] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-teal-900/40">
                    Top Catalog Matches
                  </div>
                  {autocompleteSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleProductSelect(item.id)}
                      className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-teal-950 last:border-b-0"
                    >
                      <img src={item.coverImage} alt="" className="w-9 h-12 object-cover rounded bg-teal-50 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-teal-100 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.authorName} · <span className="text-teal-600 dark:text-teal-300">{item.categoryName}</span></div>
                      </div>
                      <div className="text-xs font-black text-teal-700 dark:text-teal-300 flex-shrink-0">
                        Rs. {(item.discountedPrice || item.price).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('shop')}
                className="px-6 py-3 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-md text-sm"
              >
                Explore Bookstore
              </button>
              <button
                onClick={() => setCurrentView('categories')}
                className="px-6 py-3 bg-teal-500/20 border border-teal-300/30 text-white font-bold rounded-xl hover:bg-teal-500/40 transition-colors text-sm"
              >
                View 54 Categories (50+ Books Each)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white dark:bg-[#063028] border-b border-teal-100 dark:border-teal-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#083832] flex items-center justify-center flex-shrink-0">
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-emerald-50">{f.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-teal-400">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH SALE WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Limited Time Promo</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/40 font-bold">Up to 35% OFF</span>
                </div>
                <h2 className="text-2xl font-black font-display text-white">PaperNest Flash Sale</h2>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-black/40 border border-teal-500/40 px-4 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-semibold text-teal-200">Sale Ends In:</span>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-300">
                <span className="bg-teal-950 px-2 py-1 rounded-md">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-teal-950 px-2 py-1 rounded-md">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-teal-950 px-2 py-1 rounded-md">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {flashSaleItems.map(book => {
              const savings = book.price - (book.discountedPrice || book.price);
              return (
                <div
                  key={book.id}
                  onClick={() => handleProductSelect(book.id)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 cursor-pointer transition-all border border-white/10 group"
                >
                  <div className="relative mb-3 aspect-[3/4] rounded-xl overflow-hidden bg-teal-950/60">
                    <img src={book.coverImage} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-teal-950 text-[10px] font-black uppercase">
                      Save Rs. {savings}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {book.name}
                  </h4>
                  <p className="text-[11px] text-teal-200 truncate">{book.authorName}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-extrabold text-amber-300">
                      Rs. {(book.discountedPrice || book.price).toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-teal-300/60">
                      Rs. {book.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOK OF THE DAY & DAILY READING CHALLENGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spotlight: Book of the Day */}
          {bookOfTheDay && (
            <div className="lg:col-span-2 bg-white dark:bg-[#063028] rounded-3xl border border-teal-100 dark:border-teal-900/60 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-teal-50 flex-shrink-0">
                <img src={bookOfTheDay.coverImage} alt={bookOfTheDay.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold mb-3">
                  <Star className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  Editor's Book of the Day
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-teal-900 dark:text-teal-100 font-display mb-2 leading-tight">
                  {bookOfTheDay.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-400 font-medium mb-3">
                  By <strong className="text-slate-800 dark:text-slate-200">{bookOfTheDay.authorName}</strong> · Publisher: {bookOfTheDay.publisherName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {bookOfTheDay.description}
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <span className="text-xl font-black text-teal-800 dark:text-teal-200">
                      Rs. {(bookOfTheDay.discountedPrice || bookOfTheDay.price).toLocaleString()}
                    </span>
                    {bookOfTheDay.discountedPrice && (
                      <span className="text-xs line-through text-slate-400 ml-2">Rs. {bookOfTheDay.price}</span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {bookOfTheDay.paperQuality}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleProductSelect(bookOfTheDay.id)}
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow transition-colors"
                  >
                    View Details & Synopsis
                  </button>
                  <button
                    onClick={() => addToCart(bookOfTheDay.id)}
                    className="px-5 py-2.5 bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Daily Reading Challenge Widget */}
          <div className="bg-white dark:bg-[#063028] rounded-3xl border border-teal-100 dark:border-teal-900/60 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                    <Flame className="w-5 h-5 fill-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-teal-100">Daily Reading Goal</h3>
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold">{streakDays} Day Reading Streak! 🔥</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-50 dark:bg-[#04241e] rounded-2xl p-4 border border-teal-50 dark:border-teal-900/30 mb-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600 dark:text-slate-300">Today's Progress</span>
                  <span className="text-teal-700 dark:text-teal-300 font-black">
                    {pagesRead} / {dailyGoal} Pages ({Math.min(100, Math.round((pagesRead / dailyGoal) * 100))}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-teal-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((pagesRead / dailyGoal) * 100))}%` }}
                  />
                </div>
                {pagesRead >= dailyGoal && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Goal achieved for today! Keep it up!
                  </div>
                )}
              </div>

              {/* Log pages buttons */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Log Pages Read:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLogPage(-5)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#04241e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleLogPage(5)}
                    className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 flex items-center justify-center text-xs font-bold"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleLogPage(15)}
                    className="px-3 h-8 rounded-lg bg-teal-700 text-white hover:bg-teal-800 flex items-center justify-center text-xs font-bold"
                  >
                    +15
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="mt-4 w-full py-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Assistant for a Custom Reading Plan
            </button>
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED BOOKS */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-emerald-50">Recently Viewed</h2>
              <p className="text-xs text-slate-500 dark:text-teal-400">Pick up right where you left off</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recentlyViewed.slice(0, 6).map(product => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-xl p-3 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-teal-50">
                  <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-teal-100 truncate">{product.name}</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-300 font-extrabold mt-1">
                  Rs. {(product.discountedPrice || product.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid with Counts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-emerald-50">Browse Major Collections</h2>
            <p className="text-slate-500 dark:text-teal-400 text-xs mt-1">50+ authentic volumes stocked in every major section</p>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all"
          >
            All 54 Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CARDS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCurrentView(cat.view)}
              className="group flex flex-col items-center gap-2 p-5 bg-white dark:bg-[#083832] rounded-2xl border border-teal-100 dark:border-teal-900 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-emerald-100 text-center leading-tight">
                {cat.label}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Bestsellers Carousel */}
      <section className="bg-white/50 dark:bg-[#063028]/60 py-12 border-y border-teal-100 dark:border-teal-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Top Reader Favorites</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-emerald-50">Bestselling Books</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 4))}
                disabled={carouselIdx === 0}
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#083832] border border-teal-200 dark:border-teal-800 flex items-center justify-center hover:bg-teal-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>
              <button
                onClick={() => setCarouselIdx(Math.min(bestsellers.length - 4, carouselIdx + 4))}
                disabled={carouselIdx + 4 >= bestsellers.length}
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#083832] border border-teal-200 dark:border-teal-800 flex items-center justify-center hover:bg-teal-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleBestsellers.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                isInWishlist={storageService.isInWishlist(product.id)}
                onProductClick={(id) => handleProductSelect(id)}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2 text-xs"
            >
              Explore All 2,800+ Titles <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-teal-700 dark:bg-teal-950 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-8 h-8 text-teal-200 mx-auto mb-3" />
          <h2 className="text-2xl font-bold font-display mb-2">Join the PaperNest Readers Club</h2>
          <p className="text-teal-100 text-sm mb-6 max-w-lg mx-auto">
            Receive weekly curated reading lists, CSS exam prep alerts, and exclusive student discounts.
          </p>
          <form onSubmit={e => { e.preventDefault(); setEmail(''); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/20 border border-teal-400 text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-white text-xs"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors text-xs"
            >
              Subscribe Free
            </button>
          </form>
          <p className="text-teal-200 text-[11px] mt-3">Zero spam. Pure literature & scholarship. 📚</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
