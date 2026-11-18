import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart, Heart, Star, ArrowLeft, Package, BookOpen, Globe, Hash,
  Calendar, FileText, Award, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Truck
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, ViewType, Review } from '../types';
import ProductCard from './ProductCard';

interface ProductDetailPageProps {
  productId: string;
  setCurrentView: (view: ViewType, productId?: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, setCurrentView }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartMsg, setCartMsg] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [inventory, setInventory] = useState<{ availableStock: number; stockStatus: string } | null>(null);

  useEffect(() => {
    if (!productId) return;
    const p = storageService.getProductById(productId);
    if (p) {
      setProduct(p);
      setIsInWishlist(storageService.isInWishlist(productId));
      setReviews(storageService.getReviews(productId));
      const related = storageService.getProducts({ category: p.categoryId }).filter(r => r.id !== productId).slice(0, 4);
      setRelatedProducts(related);
      const inv = storageService.getInventoryItem(productId);
      if (inv) setInventory({ availableStock: inv.availableStock, stockStatus: inv.stockStatus });
    }
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const result = storageService.addToCart(product.id, quantity);
    setCartMsg(result.message);
    setTimeout(() => setCartMsg(''), 3000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const added = storageService.toggleWishlist(product.id);
    setIsInWishlist(added);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.userName.trim() || !reviewForm.comment.trim()) return;
    storageService.addReview({ productId: product.id, ...reviewForm });
    setReviews(storageService.getReviews(product.id));
    setReviewForm({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#042723] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-emerald-100 mb-2">Product not found</h2>
          <button onClick={() => setCurrentView('shop')}
            className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const discountPct = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;

  const stockStatusColor = {
    'In Stock': 'text-emerald-600 dark:text-emerald-400',
    'Low Stock': 'text-amber-600 dark:text-amber-400',
    'Out of Stock': 'text-red-600 dark:text-red-400',
    'Reorder Required': 'text-orange-600 dark:text-orange-400',
  }[inventory?.stockStatus || 'In Stock'] || 'text-emerald-600';

  const stockIcon = inventory?.stockStatus === 'Out of Stock'
    ? <AlertCircle className="w-4 h-4" />
    : <CheckCircle className="w-4 h-4" />;

  const detailRows = [
    { label: 'Author', value: product.authorName },
    { label: 'Publisher', value: product.publisherName },
    { label: 'Category', value: product.categoryName },
    { label: 'Language', value: product.language },
    { label: 'Pages', value: `${product.pageCount} pages` },
    { label: 'Edition', value: product.edition },
    { label: 'Publication Year', value: String(product.publicationYear) },
    { label: 'Paper Quality', value: product.paperQuality },
    { label: 'Condition', value: product.condition },
    { label: 'Product Type', value: product.productType },
    ...(product.isbn ? [{ label: 'ISBN', value: product.isbn }] : []),
    ...(product.subject ? [{ label: 'Subject', value: product.subject }] : []),
    ...(product.educationLevel ? [{ label: 'Education Level', value: product.educationLevel }] : []),
    ...(product.ageGroup ? [{ label: 'Age Group', value: product.ageGroup }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#042723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button onClick={() => setCurrentView('shop')}
          className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Cover Image */}
          <div>
            <div className="relative bg-white dark:bg-[#063028] rounded-2xl overflow-hidden border border-teal-100 dark:border-teal-900 shadow-sm">
              <img src={product.coverImage} alt={product.name}
                className="w-full max-h-[500px] object-contain p-6" />
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded-xl">
                  -{discountPct}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                  <Award className="w-3 h-3" /> Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.categoryName}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-emerald-50 mb-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-teal-600 dark:text-teal-400 font-medium mb-1">by {product.authorName}</p>
            <p className="text-sm text-slate-500 dark:text-teal-500 mb-4">{product.publisherName}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-emerald-100">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-slate-500 dark:text-teal-400">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-[#f4f8f5] dark:bg-[#083832] rounded-2xl p-5 mb-5 border border-teal-100 dark:border-teal-900">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                  Rs. {(product.discountedPrice || product.price).toLocaleString()}
                </span>
                {product.discountedPrice && (
                  <span className="text-lg text-slate-400 line-through">Rs. {product.price.toLocaleString()}</span>
                )}
                {discountPct > 0 && (
                  <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-sm font-bold px-2 py-0.5 rounded-lg">
                    Save {discountPct}%
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-medium ${stockStatusColor}`}>
                {stockIcon}
                {inventory?.stockStatus || 'In Stock'}
                {inventory && inventory.availableStock > 0 && inventory.availableStock <= 10 && (
                  <span className="text-amber-600 dark:text-amber-400">— Only {inventory.availableStock} left</span>
                )}
              </div>
            </div>

            {/* Paper Quality Badge */}
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-slate-600 dark:text-teal-300">
                Paper Quality: <span className="font-semibold text-teal-700 dark:text-teal-200">{product.paperQuality}</span>
              </span>
            </div>

            {/* Quantity + Cart */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center border border-teal-200 dark:border-teal-700 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 bg-[#f4f8f5] dark:bg-[#083832] text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 font-bold text-lg transition-colors">
                  −
                </button>
                <span className="px-5 py-2.5 font-semibold text-slate-800 dark:text-emerald-50 bg-white dark:bg-[#063028] min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => Math.min(inventory?.availableStock || 99, q + 1))}
                  className="px-4 py-2.5 bg-[#f4f8f5] dark:bg-[#083832] text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 font-bold text-lg transition-colors">
                  +
                </button>
              </div>
              <button onClick={handleAddToCart}
                disabled={inventory?.availableStock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors duration-200">
                <ShoppingCart className="w-5 h-5" />
                {inventory?.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleToggleWishlist}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${
                  isInWishlist
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-teal-200 dark:border-teal-700 text-slate-600 dark:text-teal-300 hover:border-rose-400 hover:text-rose-500'
                }`}>
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Buy Now */}
            <button onClick={() => { handleAddToCart(); setCurrentView('checkout'); }}
              disabled={inventory?.availableStock === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors duration-200 mb-3">
              Buy Now
            </button>

            {cartMsg && (
              <div className={`text-sm px-4 py-2 rounded-xl ${cartMsg.includes('Cannot') ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'}`}>
                {cartMsg}
              </div>
            )}

            {/* Delivery Info */}
            <div className="flex items-center gap-2 mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-sm text-teal-700 dark:text-teal-300">
              <Truck className="w-4 h-4 flex-shrink-0" />
              <span>Free delivery on orders above Rs. 2,500 • Cash on Delivery available</span>
            </div>
          </div>
        </div>

        {/* Tabs: Description + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description */}
          <div className="lg:col-span-2 bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-emerald-50 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Description
            </h2>
            <p className="text-slate-600 dark:text-teal-200 leading-relaxed text-sm">{product.description}</p>
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Book Details Table */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-emerald-50 mb-4">Book Details</h2>
            <div className="space-y-2.5">
              {detailRows.map(row => (
                <div key={row.label} className="flex justify-between text-sm gap-4">
                  <span className="text-slate-500 dark:text-teal-400 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800 dark:text-emerald-50 font-medium text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-emerald-50 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Customer Reviews ({reviews.length})
            </h2>
            <button onClick={() => setShowReviewForm(v => !v)}
              className="text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center gap-1">
              {showReviewForm ? <><ChevronUp className="w-4 h-4" /> Cancel</> : <><ChevronDown className="w-4 h-4" /> Write a Review</>}
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-[#f4f8f5] dark:bg-[#083832] rounded-xl p-5 mb-6 border border-teal-100 dark:border-teal-800">
              <h3 className="font-semibold text-slate-700 dark:text-emerald-100 mb-4">Write Your Review</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-teal-300 mb-1">Your Name *</label>
                  <input type="text" required value={reviewForm.userName} onChange={e => setReviewForm(f => ({ ...f, userName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#063028] border border-teal-200 dark:border-teal-700 text-sm text-slate-800 dark:text-emerald-50 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-teal-300 mb-1">Rating *</label>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                        <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-teal-300 mb-1">Your Review *</label>
                <textarea required value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3} placeholder="Share your experience with this book…"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#063028] border border-teal-200 dark:border-teal-700 text-sm text-slate-800 dark:text-emerald-50 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
              </div>
              <button type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Submit Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-teal-500 py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-teal-100 dark:border-teal-800 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-100 dark:bg-teal-900/60 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-700 dark:text-teal-300 font-bold text-sm">{review.userName[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-800 dark:text-emerald-50">{review.userName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.verifiedPurchase && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <span className="text-xs text-slate-400 dark:text-teal-600">
                        {new Date(review.createdAt).toLocaleDateString('en-PK')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-teal-200 ml-12">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-emerald-50 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p}
                  onAddToCart={id => storageService.addToCart(id, 1)}
                  onToggleWishlist={id => storageService.toggleWishlist(id)}
                  isInWishlist={storageService.isInWishlist(p.id)}
                  onProductClick={id => setCurrentView('product-detail', id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
