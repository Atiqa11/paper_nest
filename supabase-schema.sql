-- ============================================================================
-- PAPERNEST – AI-POWERED BOOKSTORE & ACADEMIC STORE
-- Complete Relational PostgreSQL / Supabase Schema (18 Tables)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    education_status TEXT, -- e.g. "University Student", "CSS Aspirant"
    institution TEXT,
    preferred_theme TEXT DEFAULT 'light' CHECK (preferred_theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    group_type TEXT NOT NULL, -- 'age_group', 'education_level', 'test_prep', 'subject', 'book_type', 'stationery_news'
    display_order INT DEFAULT 0
);

-- 4. SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT
);

-- 5. AUTHORS TABLE
CREATE TABLE IF NOT EXISTS public.authors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    country TEXT,
    birth_year INT,
    image_url TEXT
);

-- 6. PUBLISHERS TABLE
CREATE TABLE IF NOT EXISTS public.publishers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT DEFAULT 'Pakistan',
    website TEXT,
    address TEXT
);

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    author_id TEXT REFERENCES public.authors(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    publisher_id TEXT REFERENCES public.publishers(id) ON DELETE SET NULL,
    publisher_name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    subcategory_id TEXT REFERENCES public.subcategories(id) ON DELETE SET NULL,
    subcategory_name TEXT NOT NULL,
    subject TEXT,
    age_group TEXT,
    education_level TEXT,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    discounted_price NUMERIC(10, 2),
    paper_quality TEXT NOT NULL CHECK (paper_quality IN (
        'Standard Paper', 'Premium Paper', 'High-Quality White Paper',
        'Cream Paper', 'Glossy Paper', 'Matte Paper', 'Recycled Paper',
        'Hardbound Edition', 'Paperback Edition'
    )),
    page_count INT DEFAULT 200,
    language TEXT NOT NULL DEFAULT 'English',
    edition TEXT DEFAULT '1st Edition',
    publication_year INT DEFAULT 2026,
    isbn TEXT,
    condition TEXT DEFAULT 'New' CHECK (condition IN ('New', 'Like New', 'Collector Edition')),
    product_type TEXT NOT NULL CHECK (product_type IN ('Book', 'Newspaper', 'Magazine', 'Stationery')),
    rating NUMERIC(3, 2) DEFAULT 4.50,
    reviews_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    opening_stock INT NOT NULL DEFAULT 50,
    stock_received INT NOT NULL DEFAULT 50,
    units_sold INT NOT NULL DEFAULT 0,
    remaining_stock INT GENERATED ALWAYS AS (opening_stock + stock_received - units_sold) STORED,
    reserved_stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 50,
    reorder_level INT NOT NULL DEFAULT 10,
    stock_status TEXT NOT NULL DEFAULT 'In Stock' CHECK (stock_status IN ('In Stock', 'Low Stock', 'Out of Stock', 'Reorder Required')),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STOCK TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('received', 'sale', 'adjustment', 'return', 'cancellation')),
    quantity INT NOT NULL,
    balance_after INT NOT NULL,
    reason TEXT NOT NULL,
    performed_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'PN-2026-1042'
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    delivery_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    delivery_fee NUMERIC(10, 2) DEFAULT 150,
    final_total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN (
        'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 
        'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'
    )),
    tracking_number TEXT,
    courier_name TEXT DEFAULT 'TCS Courier',
    estimated_delivery DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    cover_image TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 12. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_reference TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY, -- coupon code e.g. 'WELCOME10', 'CSS2026'
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    expiry_date DATE,
    usage_limit INT DEFAULT 1000,
    times_used INT DEFAULT 0,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. COUPON USAGE TABLE
CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id TEXT REFERENCES public.coupons(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    discount_applied NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 17. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 18. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Home',
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subject ON public.products(subject);
CREATE INDEX IF NOT EXISTS idx_products_edu_level ON public.products(education_level);
CREATE INDEX IF NOT EXISTS idx_products_paper_quality ON public.products(paper_quality);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.inventory(stock_status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated read policies
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public authors are viewable by everyone" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Public publishers are viewable by everyone" ON public.publishers FOR SELECT USING (true);
CREATE POLICY "Public coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Inventory is viewable by all users" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Orders viewable by all in demo" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anonymous order insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous order update" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous order items" ON public.order_items FOR ALL USING (true);
