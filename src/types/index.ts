// ============================================================================
// PAPERNEST – TYPE DEFINITIONS
// ============================================================================

export type PaperQuality =
  | 'Standard Paper'
  | 'Premium Paper'
  | 'High-Quality White Paper'
  | 'Cream Paper'
  | 'Glossy Paper'
  | 'Matte Paper'
  | 'Recycled Paper'
  | 'Hardbound Edition'
  | 'Paperback Edition';

export type ProductCondition = 'New' | 'Like New' | 'Collector Edition';

export type ProductType = 'Book' | 'Newspaper' | 'Magazine' | 'Stationery';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Reorder Required';

export type TransactionType = 'received' | 'sale' | 'adjustment' | 'return' | 'cancellation';

export type UserRole = 'customer' | 'admin';

export type ViewType =
  | 'home'
  | 'shop'
  | 'library'
  | 'newspapers'
  | 'novels'
  | 'ideological'
  | 'academic'
  | 'stationery'
  | 'exam-prep'
  | 'turkish-books'
  | 'categories'
  | 'cart'
  | 'checkout'
  | 'my-orders'
  | 'order-tracking'
  | 'wishlist'
  | 'ai-assistant'
  | 'account'
  | 'admin-dashboard'
  | 'inventory'
  | 'sales-reports'
  | 'settings'
  | 'contact'
  | 'product-detail';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl?: string;
  bio?: string;
  educationStatus?: string;
  institution?: string;
  preferredTheme: 'light' | 'dark';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  groupType: 'age_group' | 'education_level' | 'test_prep' | 'subject' | 'book_type' | 'stationery_news';
  displayOrder: number;
  itemCount?: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  country: string;
  birthYear?: number;
  imageUrl?: string;
}

export interface Publisher {
  id: string;
  name: string;
  slug: string;
  country: string;
  website?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  authorId?: string;
  authorName: string;
  publisherId?: string;
  publisherName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  subject?: string;
  ageGroup?: string;
  educationLevel?: string;
  description: string;
  price: number;
  discountedPrice?: number;
  paperQuality: PaperQuality;
  pageCount: number;
  language: string;
  originalTitle?: string;
  englishTitle?: string;
  translator?: string;
  edition: string;
  publicationYear: number;
  isbn?: string;
  condition: ProductCondition;
  productType: ProductType;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'arrival' | 'stock' | 'system';
  read: boolean;
  createdAt: string;
  linkView?: ViewType;
}

export interface OnboardingState {
  visitCount: number;
  completed: boolean;
  currentStep: number;
  lastVisitTimestamp: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName?: string;
  productCover?: string;
  categoryName?: string;
  openingStock: number;
  stockReceived: number;
  unitsSold: number;
  remainingStock: number; // opening + received - sold
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  stockStatus: StockStatus;
  lastUpdated: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName?: string;
  transactionType: TransactionType;
  quantity: number;
  balanceAfter: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  coverImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  paperQuality?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode?: string;
  deliveryInstructions?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber: string;
  courierName: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  isDemo?: boolean; // Clearly identifies 50+ sample/demo historical records
  shippingLabelPrinted?: boolean;
}

export interface ReadingProgress {
  id: string;
  productId: string;
  productName: string;
  coverImage?: string;
  authorName?: string;
  totalPages: number;
  currentPage: number;
  status: 'want-to-read' | 'reading' | 'completed';
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit: number;
  timesUsed: number;
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  userId?: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  actionLinks?: { label: string; view: ViewType; filter?: string }[];
}

export interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  subject: string;
  ageGroup: string;
  educationLevel: string;
  bookType: string;
  paperQuality: string;
  priceRange: [number, number];
  language: string;
  edition: string;
  condition: string;
  productType: string;
  stockStatus: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity';
}
