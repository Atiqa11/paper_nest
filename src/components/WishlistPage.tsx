import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { ViewType } from '../types';
import { storageService } from '../services/storage';

interface WishlistPageProps {
  setCurrentView: (v: ViewType) => void;
  showProduct: (id: string) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
}

export default function WishlistPage({ setCurrentView, showProduct, showToast, refreshCounts }: WishlistPageProps) {
  const [version, setVersion] = useState(0);
  const wishlist = storageService.getWishlist();

  function refresh() { setVersion(v => v + 1); if (refreshCounts) refreshCounts(); }

  function handleRemove(productId: string, name: string) {
    storageService.toggleWishlist(productId);
    if (showToast) showToast(`"${name}" removed from wishlist`, 'info');
    refresh();
  }

  function handleAddToCart(productId: string, name: string) {
    const result = storageService.addToCart(productId, 1);
    if (showToast) showToast(result.message, result.success ? 'success' : 'error');
    if (result.success && refreshCounts) refreshCounts();
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">❤️</div>
        <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-3 font-display">Your Wishlist is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Save books you love by tapping the heart icon.</p>
        <button onClick={() => setCurrentView('shop')} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors">
          Explore Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setCurrentView('shop')} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 font-display">My Wishlist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlist.map(product => {
          const inv = storageService.getInventoryItem(product.id);
          const isOutOfStock = inv?.stockStatus === 'Out of Stock';
          const displayPrice = product.discountedPrice || product.price;
          const discountPct = product.discountedPrice ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;

          return (
            <div key={product.id} className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-50 dark:border-teal-900 overflow-hidden shadow-sm hover:shadow-book transition-all duration-200 group">
              {/* Image */}
              <div className="relative h-52 bg-teal-50 dark:bg-teal-900/40 cursor-pointer" onClick={() => showProduct(product.id)}>
                <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=70'; }} />
                {discountPct > 0 && <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{discountPct}%</span>}
                <button onClick={(e) => { e.stopPropagation(); handleRemove(product.id, product.name); }}
                  className="absolute top-2 left-2 w-8 h-8 bg-white/90 dark:bg-teal-900/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 px-2 py-0.5 rounded-full">{product.categoryName}</span>
                <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-teal-100 line-clamp-2 cursor-pointer hover:text-teal-700 dark:hover:text-teal-300 transition-colors" onClick={() => showProduct(product.id)}>
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">by {product.authorName}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-teal-700 dark:text-teal-300">Rs. {displayPrice.toLocaleString()}</span>
                    {product.discountedPrice && <span className="text-xs text-slate-400 line-through ml-2">Rs. {product.price.toLocaleString()}</span>}
                  </div>
                  <button onClick={() => handleAddToCart(product.id, product.name)} disabled={isOutOfStock}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
