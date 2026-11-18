import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Filter, Grid3X3, List } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, ViewType, FilterState } from '../types';
import ProductCard from './ProductCard';

export interface ShopPageProps {
  setCurrentView: (view: ViewType, productId?: string) => void;
  showProduct?: (productId: string) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  refreshCounts?: () => void;
  initialCategory?: string;
  pageTitle?: string;
  pageDescription?: string;
}

const PAPER_QUALITIES = [
  'Standard Paper',
  'Premium Paper',
  'High-Quality White Paper',
  'Cream Paper',
  'Glossy Paper',
  'Matte Paper',
  'Recycled Paper',
  'Hardbound Edition',
  'Paperback Edition'
];

const LANGUAGES = ['Urdu', 'English', 'Bilingual'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const DEFAULT_FILTER: FilterState = {
  search: '',
  category: 'all',
  subcategory: 'all',
  subject: 'all',
  ageGroup: 'all',
  educationLevel: 'all',
  bookType: 'all',
  paperQuality: 'all',
  priceRange: [0, 10000],
  language: 'all',
  edition: 'all',
  condition: 'all',
  productType: 'all',
  stockStatus: 'all',
  sortBy: 'featured',
};

const ShopPage: React.FC<ShopPageProps> = ({
  setCurrentView,
  showProduct,
  showToast,
  refreshCounts,
  initialCategory,
  pageTitle = 'Shop All Books & Stationery',
  pageDescription = 'Explore our collection of over 1,000+ authentic books, academic textbooks, newspapers, and stationery supplies.'
}) => {
  const [filter, setFilter] = useState<FilterState>(() => ({
    ...DEFAULT_FILTER,
    category: initialCategory || 'all'
  }));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    if (initialCategory) {
      setFilter(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const categories = useMemo(() => {
    const all = storageService.getProducts();
    const catMap = new Map<string, { id: string; name: string; count: number }>();
    all.forEach(p => {
      const existing = catMap.get(p.categoryId);
      if (existing) existing.count++;
      else catMap.set(p.categoryId, { id: p.categoryId, name: p.categoryName, count: 1 });
    });
    return Array.from(catMap.values()).sort((a, b) => b.count - a.count);
  }, []);

  useEffect(() => {
    setLoading(true);
    const results = storageService.getProducts(filter);
    setProducts(results);
    setCurrentPage(1);
    setLoading(false);
  }, [filter]);

  const updateFilter = useCallback((key: keyof FilterState, value: unknown) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = (key: keyof FilterState) => {
    setFilter(prev => ({ ...prev, [key]: DEFAULT_FILTER[key] }));
  };

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const activeFilters: { key: keyof FilterState; label: string; value: string }[] = [];
  if (filter.search) activeFilters.push({ key: 'search', label: `"${filter.search}"`, value: filter.search });
  if (filter.category !== 'all') activeFilters.push({ key: 'category', label: categories.find(c => c.id === filter.category)?.name || filter.category, value: filter.category });
  if (filter.language !== 'all') activeFilters.push({ key: 'language', label: `Language: ${filter.language}`, value: filter.language });
  if (filter.paperQuality !== 'all') activeFilters.push({ key: 'paperQuality', label: filter.paperQuality, value: filter.paperQuality });
  if (filter.priceRange[1] !== 10000) activeFilters.push({ key: 'priceRange', label: `Up to Rs. ${filter.priceRange[1]}`, value: '' });

  const SidebarSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-teal-100 dark:border-teal-800 pb-4 mb-4">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-slate-700 dark:text-emerald-100"
        >
          {title}
          {open ? <ChevronUp className="w-4 h-4 text-teal-500" /> : <ChevronDown className="w-4 h-4 text-teal-500" />}
        </button>
        {open && children}
      </div>
    );
  };

  const sidebarContent = (
    <div className="bg-white dark:bg-[#083832] rounded-2xl border border-teal-100 dark:border-teal-900 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 dark:text-emerald-50 flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Filters
        </h3>
        <button
          onClick={() => setFilter({ ...DEFAULT_FILTER })}
          className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <SidebarSection title="Category">
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-teal-300 cursor-pointer hover:text-teal-600">
            <input
              type="radio"
              name="cat"
              checked={filter.category === 'all'}
              onChange={() => updateFilter('category', 'all')}
              className="accent-teal-600"
            />
            All Categories ({products.length})
          </label>
          {categories.map(cat => (
            <label
              key={cat.id}
              className="flex items-center justify-between text-sm text-slate-600 dark:text-teal-300 cursor-pointer hover:text-teal-600"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="cat"
                  checked={filter.category === cat.id}
                  onChange={() => updateFilter('category', cat.id)}
                  className="accent-teal-600"
                />
                <span className="truncate max-w-[150px]">{cat.name}</span>
              </div>
              <span className="text-xs text-slate-400">({cat.count})</span>
            </label>
          ))}
        </div>
      </SidebarSection>

      {/* Price Range */}
      <SidebarSection title="Price Range">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={filter.priceRange[1]}
            onChange={e => updateFilter('priceRange', [0, Number(e.target.value)])}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-teal-400">
            <span>Rs. 0</span>
            <span className="font-semibold text-teal-700 dark:text-teal-300">Up to Rs. {filter.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </SidebarSection>

      {/* Paper Quality */}
      <SidebarSection title="Paper Quality">
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-teal-300 cursor-pointer hover:text-teal-600">
            <input
              type="radio"
              name="pq"
              checked={filter.paperQuality === 'all'}
              onChange={() => updateFilter('paperQuality', 'all')}
              className="accent-teal-600"
            />
            All Qualities
          </label>
          {PAPER_QUALITIES.map(q => (
            <label key={q} className="flex items-center gap-2 text-sm text-slate-600 dark:text-teal-300 cursor-pointer hover:text-teal-600">
              <input
                type="radio"
                name="pq"
                checked={filter.paperQuality === q}
                onChange={() => updateFilter('paperQuality', q)}
                className="accent-teal-600"
              />
              {q}
            </label>
          ))}
        </div>
      </SidebarSection>

      {/* Language */}
      <SidebarSection title="Language">
        <div className="flex flex-wrap gap-2">
          {['all', ...LANGUAGES].map(lang => (
            <button
              key={lang}
              onClick={() => updateFilter('language', lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filter.language === lang
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-teal-50 dark:bg-teal-900/40 text-slate-600 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Product Type */}
      <SidebarSection title="Product Type">
        <div className="space-y-1.5">
          {['all', 'Book', 'Newspaper', 'Magazine', 'Stationery'].map(pt => (
            <label key={pt} className="flex items-center gap-2 text-sm text-slate-600 dark:text-teal-300 cursor-pointer hover:text-teal-600">
              <input
                type="radio"
                name="pt"
                checked={filter.productType === pt}
                onChange={() => updateFilter('productType', pt)}
                className="accent-teal-600"
              />
              {pt === 'all' ? 'All Product Types' : pt}
            </label>
          ))}
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 font-display">{pageTitle}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{pageDescription}</p>
      </div>

      {/* Search and Sort Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
          <input
            type="text"
            value={filter.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="Search books, authors, subjects, ISBN…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-800 dark:text-teal-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#063028] border border-teal-200 dark:border-teal-800 rounded-xl text-sm font-semibold text-teal-700 dark:text-teal-300"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <select
            value={filter.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-[#063028] text-sm text-slate-700 dark:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="hidden sm:flex border border-teal-200 dark:border-teal-800 rounded-xl overflow-hidden bg-white dark:bg-[#063028]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'text-slate-400 hover:text-slate-600'}`}
              title="Compact View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-teal-400">Active Filters:</span>
          {activeFilters.map(af => (
            <span
              key={af.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium"
            >
              {af.label}
              <button onClick={() => removeFilter(af.key)} className="hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setFilter({ ...DEFAULT_FILTER })}
            className="text-xs text-rose-500 hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Layout Grid */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-80 max-w-full bg-white dark:bg-[#063028] h-full p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-teal-800 dark:text-teal-200">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              {sidebarContent}
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full mt-4 py-2.5 bg-teal-600 text-white rounded-xl font-semibold text-sm"
              >
                Apply Filters ({products.length} items)
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            Showing <strong className="text-teal-700 dark:text-teal-300">{products.length.toLocaleString()}</strong> results
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#083832] rounded-2xl border border-teal-100 dark:border-teal-900 h-80 animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-teal-100 mb-2">No matching items found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-5">Try relaxing your filter criteria or search keyword.</p>
              <button
                onClick={() => setFilter({ ...DEFAULT_FILTER })}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(id) => {
                      const res = storageService.addToCart(id, 1);
                      if (showToast) showToast(res.message, res.success ? 'success' : 'error');
                      if (refreshCounts) refreshCounts();
                    }}
                    onToggleWishlist={(id) => {
                      const added = storageService.toggleWishlist(id);
                      if (showToast) showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', 'info');
                      if (refreshCounts) refreshCounts();
                    }}
                    isInWishlist={storageService.isInWishlist(product.id)}
                    onProductClick={(id) => {
                      if (showProduct) showProduct(id);
                      else setCurrentView('product-detail', id);
                    }}
                    showProduct={showProduct}
                    showToast={showToast}
                    refreshCounts={refreshCounts}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#083832] border border-teal-200 dark:border-teal-800 text-sm text-slate-700 dark:text-emerald-100 disabled:opacity-40 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-teal-600 text-white'
                            : 'bg-white dark:bg-[#083832] border border-teal-200 dark:border-teal-800 text-slate-700 dark:text-emerald-100 hover:bg-teal-50 dark:hover:bg-teal-900/40'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#083832] border border-teal-200 dark:border-teal-800 text-sm text-slate-700 dark:text-emerald-100 disabled:opacity-40 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
