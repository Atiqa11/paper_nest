import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Heart,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { Product, ViewType } from '../types';
import { storageService } from '../services/storage';
import ProductCard from './ProductCard';

interface TurkishBooksPageProps {
  setCurrentView: (view: ViewType, productId?: string) => void;
  showProduct?: (productId: string) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
}

const AUTHORS_LIST = [
  'All Authors',
  'Orhan Pamuk',
  'Elif Shafak',
  'Sabahattin Ali',
  'Yaşar Kemal',
  'Nazım Hikmet',
  'Ahmet Hamdi Tanpınar',
  'Reşat Nuri Güntekin',
  'Aziz Nesin',
  'Halide Edip Adıvar',
  'Oğuz Atay',
  'Sait Faik Abasıyanık',
  'Peyami Safa'
];

const LANGUAGES_LIST = [
  'All Languages',
  'Turkish',
  'English Translation',
  'Urdu Translation'
];

const GENRES_LIST = [
  { id: 'all', label: 'All Genres' },
  { id: 'sub-turkish-novels', label: 'Novels & Fiction' },
  { id: 'sub-turkish-romance', label: 'Romance & Classics' },
  { id: 'sub-turkish-poetry', label: 'Poetry & Verse' },
  { id: 'sub-turkish-satire', label: 'Satire & Humor' },
  { id: 'sub-turkish-history', label: 'History & Society' },
];

export default function TurkishBooksPage({ 
  setCurrentView, 
  showProduct, 
  showToast, 
  refreshCounts 
}: TurkishBooksPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Fetch all Turkish books from storage
  const allTurkishBooks = useMemo(() => {
    const products = storageService.getProducts();
    return products.filter(p => p.categoryId === 'turkish-books');
  }, []);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return allTurkishBooks.filter(book => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        book.name.toLowerCase().includes(q) ||
        book.authorName.toLowerCase().includes(q) ||
        (book.originalTitle && book.originalTitle.toLowerCase().includes(q)) ||
        (book.englishTitle && book.englishTitle.toLowerCase().includes(q));

      const matchesAuthor = selectedAuthor === 'All Authors' || book.authorName === selectedAuthor;
      
      let matchesLanguage = true;
      if (selectedLanguage !== 'All Languages') {
        matchesLanguage = book.language?.toLowerCase().includes(selectedLanguage.toLowerCase()) || false;
      }

      let matchesGenre = true;
      if (selectedGenre !== 'all') {
        matchesGenre = book.subcategoryId === selectedGenre;
      }

      const matchesPrice = (book.discountedPrice || book.price) <= maxPrice;

      return matchesSearch && matchesAuthor && matchesLanguage && matchesGenre && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
      }
      if (sortBy === 'price-high') {
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [allTurkishBooks, searchQuery, selectedAuthor, selectedLanguage, selectedGenre, maxPrice, sortBy]);

  const handleProductClick = (id: string) => {
    storageService.addRecentlyViewed(id);
    if (showProduct) {
      showProduct(id);
    } else {
      setCurrentView('product-detail', id);
    }
  };

  const handleAddToCart = (id: string) => {
    storageService.addToCart(id, 1);
    if (refreshCounts) refreshCounts();
    if (showToast) showToast('Book added to your cart!', 'success');
  };

  const handleToggleWishlist = (id: string) => {
    storageService.toggleWishlist(id);
    if (refreshCounts) refreshCounts();
    if (showToast) showToast('Wishlist updated', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cultural Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-rose-950 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-rose-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-200 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="text-base">🇹🇷</span>
            Exclusive Turkish Literature & Ottoman Classics
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mb-4">
            The Turkish Book Collection
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed mb-6">
            Immerse yourself in Nobel laureate Orhan Pamuk, Elif Shafak, Sabahattin Ali, and classical Ottoman poetry. Available in original Turkish, authentic English literary translations, and specialized Urdu editions published for Pakistani readers.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{allTurkishBooks.length} Verified Masterpieces</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Turkish · English · Urdu Editions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>12 Legendary Authors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Turkish title (Kürk Mantolu Madonna), author, or English title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-teal-100"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong className="text-teal-800 dark:text-teal-200">{filteredBooks.length}</strong> of {allTurkishBooks.length} volumes
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 dark:bg-[#04241e] border border-slate-200 dark:border-teal-900 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 font-semibold"
            >
              <option value="featured">Sort: Featured & Bestsellers</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Pills: Genres */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-teal-900/40">
          <span className="text-xs font-bold text-slate-500 dark:text-teal-400 flex items-center gap-1 mr-2">
            <Tag className="w-3.5 h-3.5" /> Genre:
          </span>
          {GENRES_LIST.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedGenre === g.id
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#04241e] text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns: Author & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Filter by Author:
            </label>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-[#04241e] border border-slate-200 dark:border-teal-900 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              {AUTHORS_LIST.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Language Edition:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-[#04241e] border border-slate-200 dark:border-teal-900 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              {LANGUAGES_LIST.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Max Price:
              </label>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                Rs. {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="3500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-700 h-2 bg-slate-200 dark:bg-[#04241e] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-[#063028] rounded-3xl p-12 text-center border border-teal-100 dark:border-teal-900/60">
          <BookMarked className="w-12 h-12 text-slate-300 dark:text-teal-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">No Turkish books match your filter</h3>
          <p className="text-xs text-slate-400 mb-4">Try clearing your author or genre filters to view all 54 titles.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedAuthor('All Authors');
              setSelectedLanguage('All Languages');
              setSelectedGenre('all');
              setMaxPrice(3500);
            }}
            className="px-5 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => {
            const isWish = storageService.isInWishlist(book.id);
            return (
              <div
                key={book.id}
                className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900/60 p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover & Badges */}
                  <div 
                    onClick={() => handleProductClick(book.id)}
                    className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-teal-950/20 relative cursor-pointer"
                  >
                    <img 
                      src={book.coverImage} 
                      alt={book.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Language Badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {book.language?.includes('Turkish') ? '🇹🇷 Turkish' : book.language?.includes('Urdu') ? '🇵🇰 Urdu Edition' : '🇬🇧 English'}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(book.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 transition-transform shadow-xs"
                      title={isWish ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Titles */}
                  <h3 
                    onClick={() => handleProductClick(book.id)}
                    className="font-bold text-sm text-slate-800 dark:text-teal-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {book.originalTitle || book.name}
                  </h3>
                  
                  {book.englishTitle && book.englishTitle !== book.originalTitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                      {book.englishTitle}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs mt-1 mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{book.authorName}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{book.rating}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {book.description}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-teal-900/40">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-teal-900 dark:text-teal-100">
                        Rs. {(book.discountedPrice || book.price).toLocaleString()}
                      </span>
                      {book.discountedPrice && (
                        <span className="text-[10px] line-through text-slate-400">
                          Rs. {book.price}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Author Spotlight Section: Orhan Pamuk & Elif Shafak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="bg-gradient-to-br from-teal-900 to-[#03201a] text-white p-6 rounded-3xl shadow-md border border-teal-800">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏅</span>
            <div>
              <h4 className="font-bold text-base">Orhan Pamuk (Nobel Laureate)</h4>
              <p className="text-xs text-teal-300">Turkey's first Nobel laureate in Literature (2006)</p>
            </div>
          </div>
          <p className="text-xs text-teal-100/80 leading-relaxed mb-4">
            Master of the intersection between East and West. Discover *My Name is Red*, *Snow*, *The Museum of Innocence*, and *A Strangeness in My Mind* in complete unabridged editions.
          </p>
          <button
            onClick={() => {
              setSelectedAuthor('Orhan Pamuk');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
          >
            View Orhan Pamuk Titles →
          </button>
        </div>

        <div className="bg-gradient-to-br from-rose-950 to-[#22070c] text-white p-6 rounded-3xl shadow-md border border-rose-900">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📖</span>
            <div>
              <h4 className="font-bold text-base">Elif Shafak (World Bestseller)</h4>
              <p className="text-xs text-rose-300">Author of *The Forty Rules of Love*</p>
            </div>
          </div>
          <p className="text-xs text-rose-100/80 leading-relaxed mb-4">
            Celebrated storyteller bridging Sufi philosophy, history, and human empathy. Explore *The Island of Missing Trees*, *The Bastard of Istanbul*, and *10 Minutes 38 Seconds*.
          </p>
          <button
            onClick={() => {
              setSelectedAuthor('Elif Shafak');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
          >
            View Elif Shafak Titles →
          </button>
        </div>
      </div>
    </div>
  );
}
