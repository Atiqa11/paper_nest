// ============================================================================
// PAPERNEST – PERSISTENT RELATIONAL STORAGE ENGINE
// Full in-browser relational store with dual Supabase synchronization support
// ============================================================================

import {
  Product,
  InventoryItem,
  StockTransaction,
  Order,
  OrderItem,
  OrderStatus,
  Coupon,
  Review,
  Address,
  User,
  FilterState,
  ViewType,
  ReadingProgress,
  NotificationItem,
  OnboardingState
} from '../types';
import { generateCatalog, generateDemoOrders, AUTHORS, PUBLISHERS, INITIAL_REVIEWS } from '../data/seedGenerator';
import { CATEGORIES, SUBCATEGORIES } from '../data/categoriesData';

const STORAGE_KEYS = {
  PRODUCTS: 'papernest_products_v4',
  INVENTORY: 'papernest_inventory_v4',
  TRANSACTIONS: 'papernest_transactions_v4',
  ORDERS: 'papernest_orders_v4',
  COUPONS: 'papernest_coupons_v4',
  REVIEWS: 'papernest_reviews_v4',
  WISHLIST: 'papernest_wishlist_v4',
  CART: 'papernest_cart_v4',
  ADDRESSES: 'papernest_addresses_v4',
  CURRENT_USER: 'papernest_current_user_v4',
  THEME: 'papernest_theme',
  SETTINGS: 'papernest_store_settings_v4',
  READING_PROGRESS: 'papernest_reading_progress_v4',
  RECENTLY_VIEWED: 'papernest_recently_viewed_v4',
  NOTIFICATIONS: 'papernest_notifications_v4',
  ONBOARDING: 'papernest_onboarding_v4',
};

// Initial Demo Users
export const DEMO_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@papernest.pk',
    fullName: 'Hamza Khan (Store Administrator)',
    role: 'admin',
    phone: '+92 300 1234567',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-customer-1',
    email: 'ahmed@student.pk',
    fullName: 'Ahmed Raza',
    role: 'customer',
    phone: '+92 321 9876543',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'WELCOME15',
    code: 'WELCOME15',
    description: '15% Off on your first order across all categories!',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscount: 1500,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 42,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'CSS2026',
    code: 'CSS2026',
    description: 'Rs. 500 flat discount on CSS & Competitive Exam preparation books',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2500,
    expiryDate: '2026-08-31',
    usageLimit: 500,
    timesUsed: 128,
    categoryId: 'css-prep',
    isActive: true,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'STUDENT10',
    code: 'STUDENT10',
    description: '10% student discount on school, college, and university textbooks',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 800,
    maxDiscount: 800,
    expiryDate: '2026-12-31',
    usageLimit: 2000,
    timesUsed: 89,
    isActive: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'STATIONERY20',
    code: 'STATIONERY20',
    description: '20% off on all registers, notebooks, pens, and art supplies',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1200,
    maxDiscount: 1000,
    expiryDate: '2026-09-30',
    usageLimit: 400,
    timesUsed: 35,
    categoryId: 'stationery',
    isActive: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = generateDemoOrders();

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    userId: 'usr-customer-1',
    label: 'Home (Default)',
    recipientName: 'Ahmed Raza',
    phone: '+92 321 9876543',
    streetAddress: 'House 42, Sector F-8/2, Margalla Road',
    city: 'Islamabad',
    postalCode: '44000',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'usr-customer-1',
    label: 'University Hostel',
    recipientName: 'Ahmed Raza',
    phone: '+92 321 9876543',
    streetAddress: 'Room 214, Jinnah Hostel, Quaid-i-Azam University Campus',
    city: 'Islamabad',
    postalCode: '45320',
    isDefault: false,
  }
];

export const DEFAULT_STORE_SETTINGS = {
  storeName: 'PaperNest',
  tagline: 'Every Page Opens a New Possibility.',
  currency: 'PKR (Rs.)',
  supportPhone: '+92 42 111 727 376',
  supportEmail: 'support@papernest.pk',
  whatsappNumber: '+92 300 7273761',
  standardDeliveryFee: 150,
  freeDeliveryThreshold: 2500,
  officeAddress: 'Urdu Bazaar & Gulberg III, Lahore, Pakistan',
};

// ============================================================================
// STORAGE SERVICE IMPLEMENTATION
// ============================================================================

class StorageService {
  private products: Product[] = [];
  private inventory: InventoryItem[] = [];
  private transactions: StockTransaction[] = [];
  private orders: Order[] = [];
  private coupons: Coupon[] = [];
  private reviews: Review[] = [];
  private wishlist: string[] = []; // product IDs for current user
  private cart: { productId: string; quantity: number }[] = [];
  private addresses: Address[] = [];
  private currentUser: User = DEMO_USERS[0]; // Admin by default for testing, quick switcher available
  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.initialized) return;

    try {
      // 1. Products & Inventory
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const storedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);

      if (storedProducts && storedInventory) {
        try {
          const parsed = JSON.parse(storedProducts);
          const hasTurkish = parsed && parsed.some((p: any) => p.categoryId === 'turkish-books');
          if (parsed && parsed.length >= 2500 && hasTurkish) {
            this.products = parsed;
            this.inventory = JSON.parse(storedInventory);
          } else {
            const { products, inventory } = generateCatalog();
            this.products = products;
            this.inventory = inventory;
            this.saveProducts();
            this.saveInventory();
          }
        } catch {
          const { products, inventory } = generateCatalog();
          this.products = products;
          this.inventory = inventory;
          this.saveProducts();
          this.saveInventory();
        }
      } else {
        const { products, inventory } = generateCatalog();
        this.products = products;
        this.inventory = inventory;
        this.saveProducts();
        this.saveInventory();
      }

      // 2. Transactions
      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTx) {
        this.transactions = JSON.parse(storedTx);
      } else {
        this.transactions = [
          {
            id: 'tx-init-1',
            productId: 'pn-prod-00001',
            productName: 'Caravan Comprehensive Manual for CSS Compulsory Subjects',
            transactionType: 'received',
            quantity: 50,
            balanceAfter: 50,
            reason: 'Opening shipment stock',
            performedBy: 'System Admin',
            createdAt: '2026-01-01T08:00:00Z',
          }
        ];
        this.saveTransactions();
      }

      // 3. Orders
      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        try {
          const parsed = JSON.parse(storedOrders);
          if (parsed && parsed.length >= 50) {
            this.orders = parsed;
          } else {
            this.orders = INITIAL_ORDERS;
            this.saveOrders();
          }
        } catch {
          this.orders = INITIAL_ORDERS;
          this.saveOrders();
        }
      } else {
        this.orders = INITIAL_ORDERS;
        this.saveOrders();
      }

      // 4. Coupons
      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (storedCoupons) {
        this.coupons = JSON.parse(storedCoupons);
      } else {
        this.coupons = INITIAL_COUPONS;
        this.saveCoupons();
      }

      // 5. Reviews
      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (storedReviews) {
        this.reviews = JSON.parse(storedReviews);
      } else {
        this.reviews = INITIAL_REVIEWS;
        this.saveReviews();
      }

      // 6. Wishlist & Cart
      const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : ['pn-prod-00001', 'pn-prod-00501'];

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      this.cart = storedCart ? JSON.parse(storedCart) : [
        { productId: 'pn-prod-00501', quantity: 1 }
      ];

      // 7. Addresses
      const storedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      this.addresses = storedAddresses ? JSON.parse(storedAddresses) : INITIAL_ADDRESSES;

      // 8. Current User
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        this.currentUser = DEMO_USERS[0];
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      }

      this.initialized = true;
    } catch (e) {
      console.error('PaperNest storage initialization error:', e);
      const { products, inventory } = generateCatalog();
      this.products = products;
      this.inventory = inventory;
      this.orders = INITIAL_ORDERS;
      this.coupons = INITIAL_COUPONS;
      this.reviews = INITIAL_REVIEWS;
      this.addresses = INITIAL_ADDRESSES;
      this.currentUser = DEMO_USERS[0];
      this.initialized = true;
    }
  }

  // --- Persistence Savers ---
  private saveProducts() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    } catch (e) {
      console.warn('LocalStorage limit reached for products', e);
    }
  }

  private saveInventory() {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(this.inventory));
    } catch (e) {
      console.warn('LocalStorage limit reached for inventory', e);
    }
  }

  private saveOrders() {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
  }

  private saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
  }

  private saveCoupons() {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(this.coupons));
  }

  private saveReviews() {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
  }

  private saveWishlist() {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
  }

  private saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
  }

  private saveAddresses() {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(this.addresses));
  }

  // ============================================================================
  // PRODUCT OPERATIONS
  // ============================================================================

  public getProducts(filter?: Partial<FilterState>): Product[] {
    let result = [...this.products];

    if (!filter) return result;

    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.publisherName.toLowerCase().includes(q) ||
          (p.subject && p.subject.toLowerCase().includes(q)) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          (p.isbn && p.isbn.toLowerCase().includes(q))
      );
    }

    if (filter.category && filter.category !== 'all') {
      result = result.filter(p => p.categoryId === filter.category);
    }

    if (filter.subcategory && filter.subcategory !== 'all') {
      result = result.filter(p => p.subcategoryName === filter.subcategory);
    }

    if (filter.subject && filter.subject !== 'all') {
      result = result.filter(p => p.subject === filter.subject);
    }

    if (filter.ageGroup && filter.ageGroup !== 'all') {
      result = result.filter(p => p.ageGroup?.includes(filter.ageGroup!) || p.ageGroup === 'All Age Groups');
    }

    if (filter.educationLevel && filter.educationLevel !== 'all') {
      result = result.filter(p => p.educationLevel?.includes(filter.educationLevel!));
    }

    if (filter.paperQuality && filter.paperQuality !== 'all') {
      result = result.filter(p => p.paperQuality === filter.paperQuality);
    }

    if (filter.language && filter.language !== 'all') {
      result = result.filter(p => p.language.toLowerCase() === filter.language!.toLowerCase());
    }

    if (filter.condition && filter.condition !== 'all') {
      result = result.filter(p => p.condition === filter.condition);
    }

    if (filter.productType && filter.productType !== 'all') {
      result = result.filter(p => p.productType === filter.productType);
    }

    if (filter.priceRange) {
      result = result.filter(
        p => (p.discountedPrice || p.price) >= filter.priceRange![0] && (p.discountedPrice || p.price) <= filter.priceRange![1]
      );
    }

    if (filter.stockStatus && filter.stockStatus !== 'all') {
      const invMap = new Map(this.inventory.map(i => [i.productId, i.stockStatus]));
      result = result.filter(p => invMap.get(p.id) === filter.stockStatus);
    }

    // Sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-low':
          result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case 'price-high':
          result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.publicationYear - a.publicationYear);
          break;
        case 'popularity':
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public getInventoryItem(productId: string): InventoryItem | undefined {
    return this.inventory.find(i => i.productId === productId);
  }

  public addProduct(p: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>, stockConfig: { opening: number; received: number; reorder: number }): Product {
    const id = `pn-prod-${Date.now()}`;
    const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newProduct: Product = {
      ...p,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const remainingStock = stockConfig.opening + stockConfig.received;
    const inv: InventoryItem = {
      id: `inv-${id}`,
      productId: id,
      productName: newProduct.name,
      productCover: newProduct.coverImage,
      categoryName: newProduct.categoryName,
      openingStock: stockConfig.opening,
      stockReceived: stockConfig.received,
      unitsSold: 0,
      remainingStock,
      reservedStock: 0,
      availableStock: remainingStock,
      reorderLevel: stockConfig.reorder,
      stockStatus: remainingStock <= stockConfig.reorder ? 'Low Stock' : 'In Stock',
      lastUpdated: now,
    };

    this.products.unshift(newProduct);
    this.inventory.unshift(inv);
    this.saveProducts();
    this.saveInventory();

    this.logTransaction(id, 'received', stockConfig.opening + stockConfig.received, remainingStock, 'Initial product creation & opening stock', this.currentUser.fullName);

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveProducts();

    // Sync inventory product name/cover if changed
    const invIdx = this.inventory.findIndex(i => i.productId === id);
    if (invIdx !== -1) {
      if (updates.name) this.inventory[invIdx].productName = updates.name;
      if (updates.coverImage) this.inventory[invIdx].productCover = updates.coverImage;
      if (updates.categoryName) this.inventory[invIdx].categoryName = updates.categoryName;
      this.saveInventory();
    }

    return this.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const pIdx = this.products.findIndex(p => p.id === id);
    if (pIdx === -1) return false;

    this.products.splice(pIdx, 1);
    this.inventory = this.inventory.filter(i => i.productId !== id);
    this.saveProducts();
    this.saveInventory();
    return true;
  }

  // ============================================================================
  // ADVANCED INVENTORY MANAGEMENT
  // Formula: Remaining Stock = Opening Stock + Stock Received - Units Sold
  // ============================================================================

  public getAllInventory(): InventoryItem[] {
    return this.inventory;
  }

  public restockProduct(productId: string, quantityReceived: number, reason: string): InventoryItem | undefined {
    const idx = this.inventory.findIndex(i => i.productId === productId);
    if (idx === -1) return undefined;

    const item = this.inventory[idx];
    item.stockReceived += quantityReceived;
    item.remainingStock = item.openingStock + item.stockReceived - item.unitsSold;
    item.availableStock = Math.max(0, item.remainingStock - item.reservedStock);
    item.lastUpdated = new Date().toISOString();

    if (item.remainingStock <= 0) {
      item.stockStatus = 'Out of Stock';
    } else if (item.remainingStock <= item.reorderLevel) {
      item.stockStatus = 'Low Stock';
    } else {
      item.stockStatus = 'In Stock';
    }

    this.saveInventory();
    this.logTransaction(productId, 'received', quantityReceived, item.remainingStock, reason || 'Restock received batch', this.currentUser.fullName);

    return item;
  }

  public adjustStock(productId: string, newRemaining: number, reason: string): InventoryItem | undefined {
    const idx = this.inventory.findIndex(i => i.productId === productId);
    if (idx === -1) return undefined;

    const item = this.inventory[idx];
    const diff = newRemaining - item.remainingStock;
    // Adjust via stockReceived to keep formula: Remaining = Opening + Received - Sold
    item.stockReceived += diff;
    item.remainingStock = newRemaining;
    item.availableStock = Math.max(0, item.remainingStock - item.reservedStock);
    item.lastUpdated = new Date().toISOString();

    if (item.remainingStock <= 0) {
      item.stockStatus = 'Out of Stock';
    } else if (item.remainingStock <= item.reorderLevel) {
      item.stockStatus = 'Low Stock';
    } else {
      item.stockStatus = 'In Stock';
    }

    this.saveInventory();
    this.logTransaction(productId, 'adjustment', diff, item.remainingStock, reason || 'Manual stock audit adjustment', this.currentUser.fullName);

    return item;
  }

  public getStockTransactions(productId?: string): StockTransaction[] {
    if (productId) {
      return this.transactions.filter(t => t.productId === productId);
    }
    return this.transactions;
  }

  private logTransaction(
    productId: string,
    transactionType: StockTransaction['transactionType'],
    quantity: number,
    balanceAfter: number,
    reason: string,
    performedBy: string
  ) {
    const product = this.getProductById(productId);
    const tx: StockTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName: product?.name || 'Product',
      transactionType,
      quantity,
      balanceAfter,
      reason,
      performedBy,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(tx);
    this.saveTransactions();
  }

  // ============================================================================
  // ORDERS & CHECKOUT ENGINE
  // ============================================================================

  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.orders.filter(o => o.userId === userId);
    }
    return this.orders;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find(o => o.id === orderId);
  }

  public createOrder(orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    city: string;
    postalCode?: string;
    deliveryInstructions?: string;
    paymentMethod: string;
    couponCode?: string;
    items: { productId: string; quantity: number }[];
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Stock check & items assembly
    const assembledItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of orderPayload.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        return { success: false, error: `Product ID ${item.productId} not found.` };
      }

      const inv = this.getInventoryItem(item.productId);
      if (!inv || inv.availableStock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${inv?.availableStock || 0}, requested: ${item.quantity}.`
        };
      }

      const unitPrice = product.discountedPrice || product.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      assembledItems.push({
        id: `oi-${Date.now()}-${item.productId}`,
        orderId: '', // populated below
        productId: item.productId,
        productName: product.name,
        coverImage: product.coverImage,
        unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        paperQuality: product.paperQuality,
      });
    }

    // 2. Validate and apply coupon
    let discount = 0;
    if (orderPayload.couponCode) {
      const couponValidation = this.validateCoupon(orderPayload.couponCode, subtotal);
      if (couponValidation.valid && couponValidation.discount) {
        discount = couponValidation.discount;
        this.incrementCouponUsage(orderPayload.couponCode);
      }
    }

    const settings = this.getStoreSettings();
    const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
    const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

    const orderId = `PN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TCS-PK-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: this.currentUser?.id,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      deliveryAddress: orderPayload.deliveryAddress,
      city: orderPayload.city,
      postalCode: orderPayload.postalCode,
      deliveryInstructions: orderPayload.deliveryInstructions,
      subtotal,
      discount,
      deliveryFee,
      finalTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed', // Confirmed directly affects inventory
      trackingNumber,
      courierName: 'TCS Express Pakistan',
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: assembledItems.map(it => ({ ...it, orderId })),
    };

    // 3. Atomically decrement stock and record transaction
    for (const item of assembledItems) {
      const inv = this.getInventoryItem(item.productId);
      if (inv) {
        inv.unitsSold += item.quantity;
        inv.remainingStock = inv.openingStock + inv.stockReceived - inv.unitsSold;
        inv.availableStock = Math.max(0, inv.remainingStock - inv.reservedStock);
        inv.lastUpdated = new Date().toISOString();

        if (inv.remainingStock <= 0) {
          inv.stockStatus = 'Out of Stock';
        } else if (inv.remainingStock <= inv.reorderLevel) {
          inv.stockStatus = 'Low Stock';
        } else {
          inv.stockStatus = 'In Stock';
        }

        this.logTransaction(
          item.productId,
          'sale',
          item.quantity,
          inv.remainingStock,
          `Sale in confirmed order ${orderId}`,
          'System Checkout'
        );
      }
    }

    this.saveInventory();

    // 4. Record Order
    this.orders.unshift(newOrder);
    this.saveOrders();

    // 5. Clear cart
    this.clearCart();

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): boolean {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return false;

    const order = this.orders[idx];
    const prevStatus = order.orderStatus;

    if (prevStatus === newStatus) return true;

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    // If cancelled or returned, refund inventory units
    if ((newStatus === 'Cancelled' || newStatus === 'Returned') && prevStatus !== 'Cancelled' && prevStatus !== 'Returned') {
      for (const item of order.items) {
        const inv = this.getInventoryItem(item.productId);
        if (inv) {
          inv.unitsSold = Math.max(0, inv.unitsSold - item.quantity);
          inv.remainingStock = inv.openingStock + inv.stockReceived - inv.unitsSold;
          inv.availableStock = Math.max(0, inv.remainingStock - inv.reservedStock);
          inv.lastUpdated = new Date().toISOString();

          if (inv.remainingStock <= 0) {
            inv.stockStatus = 'Out of Stock';
          } else if (inv.remainingStock <= inv.reorderLevel) {
            inv.stockStatus = 'Low Stock';
          } else {
            inv.stockStatus = 'In Stock';
          }

          this.logTransaction(
            item.productId,
            newStatus === 'Cancelled' ? 'cancellation' : 'return',
            item.quantity,
            inv.remainingStock,
            `Stock reversal due to order ${orderId} marked as ${newStatus}`,
            this.currentUser.fullName
          );
        }
      }
      this.saveInventory();
    }

    // If changing from cancelled back to active, re-deduct units
    if ((prevStatus === 'Cancelled' || prevStatus === 'Returned') && (newStatus !== 'Cancelled' && newStatus !== 'Returned')) {
      for (const item of order.items) {
        const inv = this.getInventoryItem(item.productId);
        if (inv) {
          inv.unitsSold += item.quantity;
          inv.remainingStock = inv.openingStock + inv.stockReceived - inv.unitsSold;
          inv.availableStock = Math.max(0, inv.remainingStock - inv.reservedStock);
          inv.lastUpdated = new Date().toISOString();
          this.logTransaction(item.productId, 'sale', item.quantity, inv.remainingStock, `Reinstated sale for order ${orderId}`, this.currentUser.fullName);
        }
      }
      this.saveInventory();
    }

    this.saveOrders();
    return true;
  }

  // ============================================================================
  // COUPON & DISCOUNT ENGINE
  // ============================================================================

  public getCoupons(): Coupon[] {
    return this.coupons;
  }

  public validateCoupon(code: string, subtotal: number, categoryId?: string): { valid: boolean; message: string; discount: number; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, message: 'Invalid promo code. Please verify spelling.', discount: 0 };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'This promo code is currently inactive.', discount: 0 };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This promo code has expired.', discount: 0 };
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, message: 'This promo code has reached its maximum usage limit.', discount: 0 };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required for this code. Current: Rs. ${subtotal}.`,
        discount: 0
      };
    }

    let calculatedDiscount = 0;
    if (coupon.discountType === 'percentage') {
      calculatedDiscount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
        calculatedDiscount = coupon.maxDiscount;
      }
    } else {
      calculatedDiscount = coupon.discountValue;
    }

    return {
      valid: true,
      message: `Coupon "${coupon.code}" applied! You saved Rs. ${calculatedDiscount}.`,
      discount: calculatedDiscount,
      coupon,
    };
  }

  private incrementCouponUsage(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const c = this.coupons.find(cp => cp.code.toUpperCase() === cleanCode);
    if (c) {
      c.timesUsed += 1;
      this.saveCoupons();
    }
  }

  public addCoupon(c: Omit<Coupon, 'id' | 'timesUsed' | 'createdAt'>): Coupon {
    const newCoupon: Coupon = {
      ...c,
      id: c.code.toUpperCase(),
      code: c.code.toUpperCase(),
      timesUsed: 0,
      createdAt: new Date().toISOString(),
    };
    this.coupons.unshift(newCoupon);
    this.saveCoupons();
    return newCoupon;
  }

  public toggleCoupon(id: string): boolean {
    const c = this.coupons.find(cp => cp.id === id);
    if (c) {
      c.isActive = !c.isActive;
      this.saveCoupons();
      return true;
    }
    return false;
  }

  public deleteCoupon(id: string): boolean {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.coupons.splice(idx, 1);
      this.saveCoupons();
      return true;
    }
    return false;
  }

  // ============================================================================
  // REVIEWS ENGINE
  // ============================================================================

  public getReviews(productId: string): Review[] {
    return this.reviews.filter(r => r.productId === productId);
  }

  public addReview(reviewData: { productId: string; userName: string; rating: number; comment: string }): Review {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      userId: this.currentUser?.id,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);
    this.saveReviews();

    // Recalculate product rating
    const pReviews = this.reviews.filter(r => r.productId === reviewData.productId);
    const avgRating = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;

    const prod = this.getProductById(reviewData.productId);
    if (prod) {
      prod.rating = Number(avgRating.toFixed(1));
      prod.reviewsCount = pReviews.length;
      this.saveProducts();
    }

    return newReview;
  }

  // ============================================================================
  // WISHLIST & CART ENGINE
  // ============================================================================

  public getWishlist(): Product[] {
    return this.wishlist.map(id => this.getProductById(id)).filter((p): p is Product => Boolean(p));
  }

  public isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  public toggleWishlist(productId: string): boolean {
    if (this.wishlist.includes(productId)) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
      this.saveWishlist();
      return false;
    } else {
      this.wishlist.unshift(productId);
      this.saveWishlist();
      return true;
    }
  }

  public getCart(): { product: Product; quantity: number }[] {
    return this.cart
      .map(item => {
        const product = this.getProductById(item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((item): item is { product: Product; quantity: number } => Boolean(item));
  }

  public addToCart(productId: string, quantity = 1): { success: boolean; message: string } {
    const product = this.getProductById(productId);
    if (!product) return { success: false, message: 'Product not found' };

    const inv = this.getInventoryItem(productId);
    const existing = this.cart.find(c => c.productId === productId);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + quantity;

    if (inv && requestedTotal > inv.availableStock) {
      return {
        success: false,
        message: `Cannot add ${quantity} more. Only ${inv.availableStock} in stock (${currentQty} already in cart).`
      };
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ productId, quantity });
    }

    this.saveCart();
    return { success: true, message: `Added "${product.name}" to cart!` };
  }

  public updateCartQuantity(productId: string, quantity: number): boolean {
    const inv = this.getInventoryItem(productId);
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return true;
    }

    if (inv && quantity > inv.availableStock) {
      return false;
    }

    const item = this.cart.find(c => c.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
      return true;
    }
    return false;
  }

  public removeFromCart(productId: string) {
    this.cart = this.cart.filter(c => c.productId !== productId);
    this.saveCart();
  }

  public clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // ============================================================================
  // ADDRESSES ENGINE
  // ============================================================================

  public getAddresses(): Address[] {
    return this.addresses;
  }

  public saveAddress(addr: Omit<Address, 'id'> & { id?: string }): Address {
    if (addr.isDefault) {
      this.addresses.forEach(a => (a.isDefault = false));
    }

    if (addr.id) {
      const idx = this.addresses.findIndex(a => a.id === addr.id);
      if (idx !== -1) {
        this.addresses[idx] = { ...addr, id: addr.id };
        this.saveAddresses();
        return this.addresses[idx];
      }
    }

    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    this.addresses.unshift(newAddr);
    this.saveAddresses();
    return newAddr;
  }

  public deleteAddress(id: string) {
    this.addresses = this.addresses.filter(a => a.id !== id);
    this.saveAddresses();
  }

  // ============================================================================
  // USER AUTHENTICATION & ROLE SWITCHING
  // ============================================================================

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public switchUser(role: 'admin' | 'customer'): User {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  public updateProfile(updates: Partial<User>): User {
    this.currentUser = {
      ...this.currentUser,
      ...updates,
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  // ============================================================================
  // STORE SETTINGS
  // ============================================================================

  public getStoreSettings() {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_STORE_SETTINGS;
  }

  public updateStoreSettings(settings: Partial<typeof DEFAULT_STORE_SETTINGS>) {
    const current = this.getStoreSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // ============================================================================
  // LIVE CATALOG COUNTING & INVENTORY VALUATION
  // ============================================================================

  public getCatalogCounts() {
    const products = this.products;
    const inventory = this.inventory;

    const totalBooks = products.length;
    let totalAvailableUnits = 0;
    let totalSoldUnits = 0;
    let totalRemainingUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalInventoryValuation = 0;

    const invMap = new Map<string, InventoryItem>();
    for (const inv of inventory) {
      invMap.set(inv.productId, inv);
    }

    const categoryCounts: Record<string, {
      total: number;
      availableUnits: number;
      soldUnits: number;
      remainingUnits: number;
      target: number;
      isTargetMet: boolean;
      subcategories: Record<string, number>;
    }> = {};

    for (const product of products) {
      const inv = invMap.get(product.id) || {
        productId: product.id,
        openingStock: 50,
        stockReceived: 0,
        unitsSold: 0,
        remainingStock: 50,
        availableStock: 50,
        reservedStock: 0,
        reorderLevel: 10,
        stockStatus: 'In Stock' as const,
        lastUpdated: new Date().toISOString()
      };

      totalAvailableUnits += inv.availableStock;
      totalSoldUnits += inv.unitsSold;
      totalRemainingUnits += inv.remainingStock;
      totalInventoryValuation += (inv.remainingStock * product.price);

      if (inv.remainingStock <= 0) {
        outOfStockCount++;
      } else if (inv.remainingStock <= (inv.reorderLevel || 10)) {
        lowStockCount++;
      }

      // Category breakdown
      const catKey = product.categoryId || 'other';
      if (!categoryCounts[catKey]) {
        categoryCounts[catKey] = {
          total: 0,
          availableUnits: 0,
          soldUnits: 0,
          remainingUnits: 0,
          target: 50,
          isTargetMet: false,
          subcategories: {}
        };
      }

      categoryCounts[catKey].total += 1;
      categoryCounts[catKey].availableUnits += inv.availableStock;
      categoryCounts[catKey].soldUnits += inv.unitsSold;
      categoryCounts[catKey].remainingUnits += inv.remainingStock;
      categoryCounts[catKey].isTargetMet = categoryCounts[catKey].total >= 50;

      const subKey = product.subcategoryId || 'general';
      categoryCounts[catKey].subcategories[subKey] = (categoryCounts[catKey].subcategories[subKey] || 0) + 1;
    }

    return {
      totalBooks,
      totalAvailableUnits,
      totalSoldUnits,
      totalRemainingUnits,
      lowStockCount,
      outOfStockCount,
      totalInventoryValuation,
      categoryCounts
    };
  }

  // ============================================================================
  // SHIPPING & LOGISTICS ENGINE
  // ============================================================================

  public getShippingStats() {
    const orders = this.orders;
    let awaitingShipment = 0;
    let shipped = 0;
    let delivered = 0;
    let inTransit = 0;
    let pending = 0;
    let cancelled = 0;
    let returned = 0;
    let totalShippingRevenue = 0;
    let totalOrderValue = 0;

    for (const order of orders) {
      totalOrderValue += order.finalTotal;
      totalShippingRevenue += order.deliveryFee;

      switch (order.orderStatus) {
        case 'Confirmed':
        case 'Processing':
        case 'Packed':
          awaitingShipment++;
          break;
        case 'Shipped':
          shipped++;
          break;
        case 'Out for Delivery':
          inTransit++;
          break;
        case 'Delivered':
          delivered++;
          break;
        case 'Pending':
          pending++;
          break;
        case 'Cancelled':
          cancelled++;
          break;
        case 'Returned':
          returned++;
          break;
      }
    }

    return {
      totalOrders: orders.length,
      awaitingShipment,
      shipped,
      delivered,
      inTransit,
      pending,
      cancelled,
      returned,
      totalShippingRevenue,
      totalOrderValue
    };
  }

  public markShippingLabelPrinted(orderId: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    order.shippingLabelPrinted = true;
    order.updatedAt = new Date().toISOString();
    this.saveOrders();
    return true;
  }

  public quickDispatchOrder(orderId: string, courier = 'TCS Express Pakistan'): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    order.orderStatus = 'Shipped';
    order.courierName = courier;
    order.shippingLabelPrinted = true;
    if (!order.trackingNumber || order.trackingNumber === 'Pending') {
      order.trackingNumber = `TCS-PK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
    order.updatedAt = new Date().toISOString();
    this.saveOrders();
    return true;
  }

  // ============================================================================
  // READING PROGRESS & TRACKER
  // ============================================================================

  public getReadingProgress(): ReadingProgress[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    const sample: ReadingProgress[] = [
      {
        id: 'rp-1',
        productId: 'pn-prod-00001',
        productName: 'Caravan Comprehensive Manual for CSS Compulsory Subjects',
        authorName: 'Caravan Research Panel',
        totalPages: 780,
        currentPage: 245,
        status: 'reading',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rp-2',
        productId: 'pn-prod-00501',
        productName: 'Peer-e-Kamil (S.A.W) – Special Hardbound Edition',
        authorName: 'Umera Ahmed',
        totalPages: 520,
        currentPage: 520,
        status: 'completed',
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'rp-3',
        productId: 'pn-prod-00801',
        productName: 'Introduction to Algorithms (CLRS 4th Edition)',
        authorName: 'Thomas H. Cormen',
        totalPages: 1312,
        currentPage: 150,
        status: 'reading',
        updatedAt: new Date().toISOString()
      }
    ];
    this.saveReadingProgress(sample);
    return sample;
  }

  public saveReadingProgress(items: ReadingProgress[]) {
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(items));
  }

  public updateBookReadingProgress(progress: ReadingProgress): ReadingProgress[] {
    const list = this.getReadingProgress();
    const idx = list.findIndex(p => p.productId === progress.productId || p.id === progress.id);
    if (idx >= 0) {
      list[idx] = { ...progress, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...progress, updatedAt: new Date().toISOString() });
    }
    this.saveReadingProgress(list);
    return list;
  }

  // ============================================================================
  // RECENTLY VIEWED BOOKS
  // ============================================================================

  public getRecentlyViewed(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const list = ids.map(id => this.getProductById(id)).filter((p): p is Product => !!p);
        if (list.length > 0) return list;
      }
    } catch {
      // fallback
    }
    return this.products.slice(0, 6);
  }

  public addRecentlyViewed(productId: string): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      let ids: string[] = raw ? JSON.parse(raw) : [];
      ids = [productId, ...ids.filter(id => id !== productId)].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }

  // ============================================================================
  // NOTIFICATIONS ENGINE
  // ============================================================================

  public getNotifications(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    const initials: NotificationItem[] = [
      {
        id: 'notif-1',
        title: '🇹🇷 Turkish Books Collection Live!',
        message: '54 authentic masterpieces by Orhan Pamuk, Elif Shafak, and Sabahattin Ali are now in stock in Turkish, English, and Urdu.',
        type: 'arrival',
        read: false,
        createdAt: new Date().toISOString(),
        linkView: 'turkish-books'
      },
      {
        id: 'notif-2',
        title: 'Welcome Discount: WELCOME15',
        message: 'Get 15% off your first bookstore purchase with code WELCOME15 at checkout.',
        type: 'promo',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        linkView: 'shop'
      },
      {
        id: 'notif-3',
        title: 'Order Dispatched: #PN-2026-1042',
        message: 'Consignment handed over to TCS Express with tracking #TCS-PK-9823412.',
        type: 'order',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        linkView: 'order-tracking'
      },
      {
        id: 'notif-4',
        title: 'Daily Reading Challenge Active',
        message: 'Log today\'s reading pages to keep your 7-day reading streak glowing!',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        linkView: 'home'
      }
    ];
    this.saveNotifications(initials);
    return initials;
  }

  public saveNotifications(items: NotificationItem[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
  }

  public markNotificationRead(id: string) {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.saveNotifications(list);
    }
    return list;
  }

  public markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
    return list;
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.saveNotifications(list);
    return newNotif;
  }

  // ============================================================================
  // VISIT COUNTING & GUIDED TOUR ENGINE (FIRST 20 VISITS)
  // ============================================================================

  public getOnboardingState(): OnboardingState {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return {
      visitCount: 1,
      completed: false,
      currentStep: 0,
      lastVisitTimestamp: new Date().toISOString()
    };
  }

  public registerVisit(): OnboardingState {
    const state = this.getOnboardingState();
    const sessionMark = sessionStorage.getItem('papernest_session_registered');
    if (!sessionMark) {
      sessionStorage.setItem('papernest_session_registered', 'true');
      state.visitCount = (state.visitCount || 0) + 1;
      state.lastVisitTimestamp = new Date().toISOString();
      if (state.visitCount > 20) {
        state.completed = true;
      }
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
    }
    return state;
  }

  public completeGuidedTour() {
    const state = this.getOnboardingState();
    state.completed = true;
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
  }

  public resetGuidedTour() {
    const state = this.getOnboardingState();
    state.completed = false;
    state.currentStep = 0;
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
  }

  // Reset database to pristine sample catalog
  public resetToSampleData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    this.initialized = false;
    this.init();
  }
}

export const storageService = new StorageService();
