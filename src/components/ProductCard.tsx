import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { storageService } from '../services/storage';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  onProductClick?: (productId: string) => void;
  showProduct?: (productId: string) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  refreshCounts?: () => void;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onProductClick,
  showProduct,
  showToast,
  refreshCounts,
  compact = false
}) => {
  const discountPct = product.price > 0 && product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist !== undefined ? isInWishlist : storageService.isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProductClick) onProductClick(product.id);
    else if (showProduct) showProduct(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      const res = storageService.addToCart(product.id, 1);
      if (showToast) showToast(res.message, res.success ? 'success' : 'error');
      if (refreshCounts) refreshCounts();
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      const added = storageService.toggleWishlist(product.id);
      if (showToast) showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', 'info');
      if (refreshCounts) refreshCounts();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  if (compact) {
    return (
      <div className="group bg-white dark:bg-[#083832] rounded-xl border border-teal-100 dark:border-teal-900 overflow-hidden hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200">
        <button onClick={handleClick} className="w-full">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f8f5] dark:bg-[#042723]">
            <img
              src={product.coverImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=70';
              }}
            />
            {discountPct > 0 && (
              <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                -{discountPct}%
              </span>
            )}
          </div>
        </button>
        <div className="p-3">
          <button onClick={handleClick} className="w-full text-left">
            <h3 className="font-medium text-xs text-slate-800 dark:text-emerald-50 line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-xs text-slate-500 dark:text-teal-400 truncate mb-2">{product.authorName}</p>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-teal-700 dark:text-teal-300">
                Rs. {(product.discountedPrice || product.price).toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-lg transition-colors duration-200 ${inWishlist ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-[#083832] rounded-2xl border border-teal-100 dark:border-teal-900 overflow-hidden hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200 flex flex-col">
      {/* Cover Image */}
      <div className="relative overflow-hidden bg-[#f4f8f5] dark:bg-[#042723]">
        <button onClick={handleClick} className="block w-full">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.coverImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=70';
              }}
            />
          </div>
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPct > 0 && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              -{discountPct}%
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-[#042723]/80 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category Badge */}
        <span className="inline-block text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full mb-2 self-start truncate max-w-full">
          {product.categoryName}
        </span>

        <button onClick={handleClick} className="text-left flex-1">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-emerald-50 line-clamp-2 mb-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-teal-400 truncate mb-2">{product.authorName}</p>
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-slate-500 dark:text-teal-500">({product.reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-base text-teal-700 dark:text-teal-300">
            Rs. {(product.discountedPrice || product.price).toLocaleString()}
          </span>
          {product.discountedPrice && product.price > product.discountedPrice && (
            <span className="text-xs text-slate-400 line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200 mt-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
