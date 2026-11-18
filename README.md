# PaperNest – AI-Powered Bookstore & Academic Store 📚✨

> **Tagline:** *"Every Page Opens a New Possibility."*

PaperNest is a full-featured, responsive, full-stack e-commerce marketplace and academic bookstore. It offers an organized catalog of **1,000+ realistic sample products**, a dedicated **AI Book Assistant**, real **inventory management** with automated stock deduction, coupon validation, Pakistani Cash on Delivery checkout, order lifecycle tracking across 9 statuses, and a role-based **Admin Dashboard**.

---

## 🎨 1. Brand Identity & Design System

### Color Palette
- **Teal:** Primary navigation, action buttons, branding badges (`#0d9488`, `#0f766e`, `#14b8a6`)
- **Mint Green:** Fresh accents, success indicators, light backgrounds (`#ecfdf5`, `#10b981`, `#6ee7b7`)
- **Soft Sage:** Soft card containers, delicate borders (`#f4f8f5`, `#d1fae5`, `#e6f4ea`)
- **Light Aqua:** Buttons, secondary badges, glowing hover states (`#22d3ee`, `#06b6d4`, `#cffafe`)
- **Dark Emerald & Deep Teal:** Immersive dark theme backgrounds (`#042723`, `#063028`, `#021a17`)

### Working Theme Toggle
- Toggle between **Light Mode** and **Dark Mode** via the navbar icon.
- User theme preference is saved in `localStorage` and applied consistently across all 22 pages, modals, forms, and cards.

---

## 🧭 2. Complete 22 Dedicated Interfaces

1. **Home (`/`)**: Hero banner, search bar, category shortcuts, flash deals, bestselling books, exam prep spotlight, newspapers & stationery racks, testimonials, and newsletter signup.
2. **Shop (`/shop`)**: Complete catalog search with autocomplete, multi-filters (Category, Paper Quality, Language, Product Type, Price Slider, Stock Status), sorting, and Grid/List views.
3. **Books Library (`/library`)**: Browsing interface organized by education tier (School, College, University, Graduation, Postgraduate).
4. **Newspapers (`/newspapers`)**: Daily national newspapers (Dawn, The News, Jang, Express, Kawish), weekly gazettes, monthly current affairs magazines (Jahangir's World Times, Herald), and subscription packages with morning home delivery.
5. **Novels (`/novels`)**: Urdu and English literature, social drama, romance, crime thrillers, and epics (Umera Ahmed, Nimra Ahmed, Bapsi Sidhwa, George Orwell).
6. **Ideological & Political Books (`/ideological`)**: Constitutional law, political theory, geopolitics, statecraft, and biographies of historical leaders (Jinnah, Iqbal, Mandela).
7. **Academic Books (`/academic`)**: School (Class 1-10, O-Levels), College (FSc, ICS, FA, I.Com, A-Levels), University BS/MS syllabi, and board textbooks.
8. **Stationery (`/stationery`)**: Student registers, spiral notebooks, fountain pens, ballpoints, pastel highlighters, geometry sets, and artist sketchpads.
9. **Exam Preparation (`/exam-prep`)**: Dedicated preparation hubs for CSS, MDCAT, ECAT, LAT, LLB, NTS/GAT, and PMS/FPSC competitive exams.
10. **Categories (`/categories`)**: Visual taxonomy directory across all 5 major groups with product counters and quick navigation.
11. **Shopping Cart (`/cart`)**: Real-time cart calculations, quantity adjustment with live stock limits, promo code applicator, and free delivery progress indicator.
12. **Checkout (`/checkout`)**: Pakistani address form (150+ cities dropdown, postal codes, delivery instructions), Cash on Delivery (COD) payment, promo code discount deduction, and instant order generation.
13. **My Orders (`/my-orders`)**: Customer order history with unique IDs (e.g. `PN-2026-1042`), item breakdown, status badges, and order cancellation.
14. **Order Tracking (`/order-tracking`)**: Visual stepper tracking orders across 9 statuses (`Pending`, `Confirmed`, `Processing`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`, `Returned`), courier details (TCS / Leopards), and tracking numbers.
15. **My Wishlist (`/wishlist`)**: Saved favorite products with one-click "Move to Cart" and stock status badges.
16. **AI Book Assistant (`/ai-assistant`)**: Intelligent conversational assistant (`PaperNest AI`) with catalog-based queries, examination prep advice, paper quality comparisons, and direct "Add to Cart" recommendations.
17. **Customer Account (`/account`)**: User profile editor, saved addresses manager (Add, Edit, Set Default, Delete), quick links, and demo role switcher.
18. **Admin Dashboard (`/admin-dashboard`)**: Executive KPI cards, real-time sales revenue, products by category visual chart, order status distribution, stock alerts, and quick actions.
19. **Inventory Management (`/inventory`)**: Dedicated inventory grid showing Opening Stock, Stock Received, Units Sold, Remaining Stock (`Opening + Received - Sold`), Reserved, Available, Reorder Level, and Status badges. Restock modal, stock adjustment modal, and audit trail transaction log.
20. **Sales & Reports (`/sales-reports`)**: Financial analytics, revenue contribution by category, bestselling product velocity, top-selling authors, payment breakdown, and CSV report export.
21. **Settings (`/settings`)**: Store configuration (hotline, free delivery threshold, standard delivery fee), Promo Code & Coupon manager (Create, toggle active/disabled, delete, discount %, fixed PKR), and database reset button.
22. **Contact & Help (`/contact`)**: Customer care hotline (+92 42 111 727 376), WhatsApp direct ordering link (+92 300 7273761), interactive FAQ accordion, and store policy documentation (Shipping, 7-Day Returns, Privacy).

---

## 🗄️ 3. Database Architecture & Schema

The relational database architecture is formalized in [`supabase-schema.sql`](./supabase-schema.sql) with **18 normalized tables**:
1. `users` (id, email, full_name, role 'admin' | 'customer', phone, created_at)
2. `profiles` (id, user_id, avatar_url, bio, education_status, institution, preferred_theme)
3. `categories` (id, name, slug, description, icon, group_type, display_order)
4. `subcategories` (id, category_id, name, slug, description)
5. `authors` (id, name, slug, bio, country, birth_year, image_url)
6. `publishers` (id, name, slug, country, website, address)
7. `products` (id, name, slug, cover_image, author_name, publisher_name, category_id, subcategory_name, subject, age_group, education_level, description, price, discounted_price, paper_quality, page_count, language, edition, publication_year, isbn, condition, product_type, rating, reviews_count, is_featured, is_bestseller)
8. `inventory` (id, product_id, opening_stock, stock_received, units_sold, remaining_stock, reserved_stock, available_stock, reorder_level, stock_status, last_updated)
9. `stock_transactions` (id, product_id, transaction_type, quantity, balance_after, reason, performed_by, created_at)
10. `orders` (id, user_id, customer_name, customer_email, customer_phone, delivery_address, city, postal_code, subtotal, discount, delivery_fee, final_total, payment_method, order_status, tracking_number, courier_name, estimated_delivery)
11. `order_items` (id, order_id, product_id, product_name, cover_image, unit_price, quantity, subtotal)
12. `payments` (id, order_id, user_id, amount, payment_method, transaction_reference, status)
13. `coupons` (id, code, description, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, times_used, is_active)
14. `coupon_usage` (id, coupon_id, order_id, user_id, discount_applied)
15. `reviews` (id, product_id, user_id, user_name, rating, comment, verified_purchase)
16. `wishlists` (id, user_id, product_id, added_at)
17. `cart_items` (id, user_id, product_id, quantity, added_at)
18. `addresses` (id, user_id, label, recipient_name, phone, street_address, city, postal_code, is_default)

### Persistent In-Browser Engine
The frontend uses `storageService` ([`src/services/storage.ts`](./src/services/storage.ts)), an ACID-like in-browser relational store backed by `localStorage` that initializes all 18 tables and automatically calculates:
$$\text{Remaining Stock} = \text{Opening Stock} + \text{Stock Received} - \text{Units Sold}$$

Whenever orders are placed, stock is atomically updated and transactions logged. When orders are cancelled or returned, stock is automatically refunded.

---

## 🚀 4. Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd "c:\My first website"

# Install dependencies (already installed)
npm install
```

### Development Server
```bash
# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173/` to explore the live website.

### Production Build
```bash
# Type-check and compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 5. Demo Accounts

Quickly test different roles using the account menu or Account Settings demo switcher:
- **Admin Role:** `admin@papernest.pk` (Hamza Khan) – Full access to Admin Dashboard, Inventory Management, Sales Analytics, and Store Settings.
- **Customer Role:** `ahmed@student.pk` (Ahmed Raza) – Customer ordering experience, My Orders, Wishlist, Addresses, and Order Tracking.

---

## 🏷️ 6. Pre-Configured Promo Codes

Test these promo codes during checkout:
- `WELCOME15`: 15% discount on orders above Rs. 1,000 (Max discount Rs. 1,500)
- `CSS2026`: Flat Rs. 500 off on CSS & Competitive Exam books
- `STUDENT10`: 10% discount for school and university students
- `STATIONERY20`: 20% discount on registers, notebooks, pens, and art supplies

---

© 2026 PaperNest Pakistan. Built for readers, students, and scholars across Pakistan.
