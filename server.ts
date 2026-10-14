import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db, makeDateWithStrftime, convertPrice, CURRENCY_CONFIG } from './src/data.ts';
import type { User, Product, CurrencyCode, Order } from './src/data.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'static', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage for product uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static directory serving
app.use('/static', express.static(path.join(process.cwd(), 'static')));

// Session configuration
app.use(
  session({
    secret: process.env.SECRET_KEY || 'velora-fashion-secret-key-2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Declare session types
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    currency?: CurrencyCode;
    promoCode?: string;
    giftWrapped?: boolean;
    giftMessage?: string;
    cart?: {
      [key: string]:
        | {
            productId: number;
            quantity: number;
            variantSku?: string;
            size?: string;
            color?: string;
          }
        | number;
    };
    wishlist?: number[];
    flashMessages?: string[];
  }
}

// Helper: Normalize Cart items from session
function getNormalizedCart(req: Request): {
  key: string;
  productId: number;
  quantity: number;
  variantSku?: string;
  size?: string;
  color?: string;
  product: Product;
  price: number;
  itemTotal: number;
}[] {
  const cartSession = req.session.cart || {};
  const items: {
    key: string;
    productId: number;
    quantity: number;
    variantSku?: string;
    size?: string;
    color?: string;
    product: Product;
    price: number;
    itemTotal: number;
  }[] = [];

  for (const [key, value] of Object.entries(cartSession)) {
    let productId = Number(key);
    let quantity = 0;
    let variantSku: string | undefined;
    let size: string | undefined;
    let color: string | undefined;

    if (typeof value === 'number') {
      quantity = value;
    } else if (value && typeof value === 'object') {
      productId = value.productId;
      quantity = value.quantity;
      variantSku = value.variantSku;
      size = value.size;
      color = value.color;
    }

    if (quantity > 0) {
      const prod = db.products.find((p) => p.id === productId);
      if (prod) {
        let price = prod.price;
        if (variantSku) {
          const v = prod.variants.find((v) => v.sku === variantSku);
          if (v) price += v.price_offset;
        }
        items.push({
          key,
          productId,
          quantity,
          variantSku,
          size: size || (prod.variants[0]?.size ?? 'Standard'),
          color: color || (prod.variants[0]?.color ?? 'Standard'),
          product: db.populateProduct(prod),
          price,
          itemTotal: price * quantity,
        });
      }
    }
  }

  return items;
}

// Flash messages & Request context Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.cart) req.session.cart = {};
  if (!req.session.wishlist) req.session.wishlist = [];
  if (!req.session.flashMessages) req.session.flashMessages = [];
  if (!req.session.currency) req.session.currency = 'USD';

  next();
});

// Configure Nunjucks
const env = nunjucks.configure('templates', {
  autoescape: true,
  express: app,
  watch: false,
  noCache: true,
});

// Custom Nunjucks filter: format
env.addFilter('format', (val: any, ...args: any[]) => {
  if (typeof val === 'string' && val.includes('%') && args.length > 0) {
    const num = args[0];
    if (typeof num === 'number') return num.toFixed(2);
    const parsed = parseFloat(num);
    if (!isNaN(parsed)) return parsed.toFixed(2);
    return String(num ?? '0.00');
  }

  if (typeof val === 'number') return val.toFixed(2);
  const parsed = parseFloat(val);
  if (!isNaN(parsed)) return parsed.toFixed(2);

  if (args.length > 0) {
    const num = args[0];
    if (typeof num === 'number') return num.toFixed(2);
    const p = parseFloat(num);
    if (!isNaN(p)) return p.toFixed(2);
  }

  return val ?? '0.00';
});

// Custom Nunjucks filter: money (converts to user's active session currency)
env.addFilter('money', function (this: any, amountInUSD: any) {
  const currentCurrency = this?.ctx?.current_currency || 'USD';
  const num = typeof amountInUSD === 'number' ? amountInUSD : parseFloat(amountInUSD) || 0;
  return convertPrice(num, currentCurrency).formatted;
});

// Custom Nunjucks filter: price
env.addFilter('price', (val: any) => {
  if (typeof val === 'number') return val.toFixed(2);
  const parsed = parseFloat(val);
  return !isNaN(parsed) ? parsed.toFixed(2) : '0.00';
});

// Custom Nunjucks global: range
env.addGlobal('range', (start: number, stop?: number, step: number = 1) => {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const result: number[] = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
});

// Custom Nunjucks global: url_for
env.addGlobal('url_for', (endpoint: string, kwargs?: any) => {
  if (endpoint === 'static') {
    const filename = kwargs?.filename || '';
    return `/static/${filename}`;
  }
  if (endpoint === 'index') return '/';
  if (endpoint === 'shop') {
    if (kwargs && kwargs.category) return `/shop?category=${kwargs.category}`;
    return '/shop';
  }
  if (endpoint === 'product') {
    const id = kwargs?.id ?? (typeof kwargs === 'number' ? kwargs : '');
    return `/product/${id}`;
  }
  if (endpoint === 'cart') return '/cart';
  if (endpoint === 'add_to_cart') return `/add_to_cart/${kwargs?.id ?? ''}`;
  if (endpoint === 'update_cart') return `/update_cart/${kwargs?.id ?? ''}`;
  if (endpoint === 'checkout') return '/checkout';
  if (endpoint === 'features') return '/features';
  if (endpoint === 'about') return '/about';
  if (endpoint === 'contact') return '/contact';
  if (endpoint === 'help') return '/help';
  if (endpoint === 'search') return '/search';
  if (endpoint === 'wishlist') return '/wishlist';
  if (endpoint === 'add_to_wishlist') return `/add_to_wishlist/${kwargs?.id ?? ''}`;
  if (endpoint === 'remove_from_wishlist') return `/remove_from_wishlist/${kwargs?.id ?? ''}`;
  if (endpoint === 'dashboard') return '/dashboard';
  if (endpoint === 'add_review') return `/product/${kwargs?.id ?? ''}/review`;
  if (endpoint === 'login') return '/login';
  if (endpoint === 'register') return '/register';
  if (endpoint === 'logout') return '/logout';
  if (endpoint === 'admin_dashboard') return '/admin';
  if (endpoint === 'admin_products') return '/admin/products';
  if (endpoint === 'add_product') return '/admin/products/add';
  if (endpoint === 'edit_product') return `/admin/products/edit/${kwargs?.id ?? ''}`;
  if (endpoint === 'delete_product') return `/admin/products/delete/${kwargs?.id ?? ''}`;
  if (endpoint === 'add_category') return '/admin/categories/add';
  if (endpoint === 'admin_orders') return '/admin/orders';
  if (endpoint === 'update_order_status') return `/admin/orders/update/${kwargs?.id ?? ''}`;
  if (endpoint === 'admin_customers') return '/admin/customers';
  if (endpoint === 'admin_settings') return '/admin/settings';
  return `/${endpoint}`;
});

// View Helper Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.session.userId;
  const user = currentUserId ? db.users.find((u) => u.id === currentUserId) : null;
  const currency = req.session.currency || 'USD';

  res.locals.current_user = user
    ? {
        ...user,
        is_authenticated: true,
        is_anonymous: false,
      }
    : {
        id: null,
        username: 'Guest',
        email: '',
        is_authenticated: false,
        is_anonymous: true,
        is_admin: false,
        vip_points: 0,
      };

  res.locals.current_currency = currency;
  res.locals.currencies = Object.keys(CURRENCY_CONFIG).map((code) => ({
    code,
    symbol: CURRENCY_CONFIG[code as CurrencyCode].symbol,
    name: CURRENCY_CONFIG[code as CurrencyCode].name,
  }));

  res.locals.money = (amount: number) => convertPrice(amount, currency).formatted;

  const cartItems = getNormalizedCart(req);
  res.locals.cart_count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.wishlist_count = req.session.wishlist?.length || 0;

  res.locals.vip_info = user ? db.getUserVIP(user.id) : null;

  res.locals.request = {
    endpoint: '',
    path: req.path,
    args: req.query,
  };

  res.locals.query = (req.query.q as string) || '';

  res.locals.get_flashed_messages = () => {
    const msgs = req.session.flashMessages || [];
    req.session.flashMessages = [];
    return msgs;
  };

  (req as any).flash = (msg: string) => {
    if (!req.session.flashMessages) req.session.flashMessages = [];
    req.session.flashMessages.push(msg);
  };

  next();
});

// Admin check middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const key = req.query.key as string;
  const isKeyValid = key === 'velora2026' || process.env.ADMIN_SECRET_KEY === key;
  const isAdminUser = res.locals.current_user?.is_authenticated && res.locals.current_user?.is_admin;

  if (isKeyValid || isAdminUser) {
    next();
  } else {
    (req as any).flash('Admin access required. Please login with an admin account.');
    res.redirect('/login');
  }
}

// ----------------------------------------------------
// PUBLIC STOREFRONT ROUTES
// ----------------------------------------------------

// 1. Home / Index
app.get('/', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'index';
  const products = db.products.map((p) => db.populateProduct(p));
  const wishlist_items = req.session.wishlist || [];
  const featured_products = products.slice(0, 8);

  res.render('index.html', {
    products,
    featured_products,
    wishlist_items,
  });
});

// 2. Shop Catalog
app.get('/shop', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'shop';
  const categoryId = req.query.category ? Number(req.query.category) : null;
  const sort = (req.query.sort as string) || 'default';
  const minPrice = req.query.min_price ? Number(req.query.min_price) : 0;
  const maxPrice = req.query.max_price ? Number(req.query.max_price) : Infinity;

  let products = db.products.map((p) => db.populateProduct(p));

  if (categoryId) {
    products = products.filter((p) => p.category_id === categoryId);
  }

  products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  const wishlist_items = req.session.wishlist || [];

  res.render('shop.html', {
    products,
    categories: db.categories,
    selected_category: categoryId,
    sort,
    wishlist_items,
  });
});

// 3. Product Details
app.get('/product/:id', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'product';
  const productId = Number(req.params.id);
  const rawProduct = db.products.find((p) => p.id === productId);

  if (!rawProduct) {
    return res.status(404).render('404.html');
  }

  const product = db.populateProduct(rawProduct);
  const relatedProducts = db.products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)
    .map((p) => db.populateProduct(p));

  const wishlist_items = req.session.wishlist || [];

  // Calculate review average and distribution
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 5;
  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      starCounts[r.rating - 1]++;
    }
  });

  const klarnaInstallment = (product.price / 4).toFixed(2);
  const vipPointsEarnable = Math.round(product.price);

  res.render('product.html', {
    product,
    related_products: relatedProducts,
    wishlist_items,
    reviewCount,
    avgRating: avgRating.toFixed(1),
    starCounts: starCounts.reverse(),
    klarnaInstallment,
    vipPointsEarnable,
  });
});

// 4. Submit Review (Interactive UGC with Fit feedback & specs)
app.post('/product/:id/review', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const { rating, comment, fit_rating, customer_height, customer_weight, purchased_size } = req.body;
  const userId = req.session.userId || 1;
  const user = db.users.find((u) => u.id === userId) || { username: 'Connoisseur' };

  if (productId && rating && comment) {
    db.reviews.push({
      id: db.reviews.length + 1,
      product_id: productId,
      user_id: userId,
      user: { username: user.username },
      rating: Number(rating),
      comment: String(comment),
      created_at: makeDateWithStrftime(new Date()),
      verified_buyer: true,
      fit_rating: (fit_rating as any) || 'True to size',
      customer_height: customer_height || undefined,
      customer_weight: customer_weight || undefined,
      purchased_size: purchased_size || undefined,
      helpful_count: 0,
    });
    (req as any).flash('Thank you! Your verified review and fit feedback have been published.');
  }

  res.redirect(`/product/${productId}`);
});

// 5. Shopping Cart
app.get('/cart', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'cart';
  const cartItems = getNormalizedCart(req);
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  // Promo code
  const promoCode = req.session.promoCode;
  const promo = promoCode ? db.promos.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.is_active) : null;
  let discount = 0;
  if (promo && subtotal >= promo.min_spend) {
    discount = promo.type === 'percentage' ? (subtotal * promo.value) / 100 : Math.min(subtotal, promo.value);
  }

  const isFreeShipping = subtotal >= 150 || promo?.type === 'free_shipping';
  const shippingCost = isFreeShipping ? 0 : 25;
  const giftWrapCost = req.session.giftWrapped ? 15 : 0;
  const total = Math.max(0, subtotal - discount + shippingCost + giftWrapCost);

  res.render('cart.html', {
    cart_items: cartItems,
    products: cartItems,
    subtotal,
    discount,
    promo,
    isFreeShipping,
    shippingCost,
    giftWrapCost,
    giftWrapped: req.session.giftWrapped,
    giftMessage: req.session.giftMessage,
    total,
  });
});

// Add to Cart (Supports Variant SKU, Size, Color, and AJAX)
app.post('/add_to_cart/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const qty = req.body.quantity ? Number(req.body.quantity) : 1;
  const variantSku = req.body.variant_sku || req.body.variantSku;
  const size = req.body.size;
  const color = req.body.color;

  if (!req.session.cart) req.session.cart = {};

  const key = variantSku ? `${productId}_${variantSku}` : `${productId}`;
  const existing = req.session.cart[key];

  let currentQty = 0;
  if (typeof existing === 'number') {
    currentQty = existing;
  } else if (existing && typeof existing === 'object') {
    currentQty = existing.quantity;
  }

  req.session.cart[key] = {
    productId,
    quantity: currentQty + qty,
    variantSku,
    size,
    color,
  };

  const cartItems = getNormalizedCart(req);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr || req.body?.ajax) {
    return res.json({ success: true, count: totalCount, message: 'Item added to luxury cart!' });
  }

  (req as any).flash('Item added to your shopping bag!');
  res.redirect(req.headers.referer || '/cart');
});

// Update Cart Quantity
app.post('/update_cart/:id', (req: Request, res: Response) => {
  const itemKey = String(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!req.session.cart) req.session.cart = {};

  if (quantity <= 0) {
    delete req.session.cart[itemKey];
  } else {
    const existing = req.session.cart[itemKey];
    if (typeof existing === 'object' && existing !== null) {
      existing.quantity = quantity;
    } else {
      req.session.cart[itemKey] = quantity;
    }
  }

  const cartItems = getNormalizedCart(req);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr || req.body?.ajax) {
    return res.json({
      success: true,
      count,
      subtotal: subtotal.toFixed(2),
      quantity: Math.max(0, quantity),
      removed: quantity <= 0,
    });
  }

  res.redirect('/cart');
});

// Remove Item from Cart
app.post('/remove_from_cart/:id', (req: Request, res: Response) => {
  const itemKey = String(req.params.id);
  if (req.session.cart) {
    delete req.session.cart[itemKey];
  }

  const cartItems = getNormalizedCart(req);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr) {
    return res.json({
      success: true,
      count,
      subtotal: subtotal.toFixed(2),
      removed: true,
    });
  }

  (req as any).flash('Item removed from shopping bag.');
  res.redirect('/cart');
});

// GET fallback for remove from cart
app.get('/remove_from_cart/:id', (req: Request, res: Response) => {
  const itemKey = String(req.params.id);
  if (req.session.cart) {
    delete req.session.cart[itemKey];
  }
  (req as any).flash('Item removed from shopping bag.');
  res.redirect('/cart');
});

// Cart Count API
app.get('/cart_count', (req: Request, res: Response) => {
  const cartItems = getNormalizedCart(req);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ count });
});

// 6. Wishlist
app.get('/wishlist', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'wishlist';
  const wishlistIds = req.session.wishlist || [];
  const wishlistProducts = db.products
    .filter((p) => wishlistIds.includes(p.id))
    .map((p) => db.populateProduct(p));

  const isRegistry = req.query.registry === 'true';
  const shareToken = Buffer.from(`velora-wishlist-${req.session.userId || 0}`).toString('base64');

  res.render('wishlist.html', {
    products: wishlistProducts,
    wishlist_items: wishlistIds,
    is_registry: isRegistry,
    share_url: `${req.protocol}://${req.get('host')}/wishlist?shared=1&ref=${shareToken}`,
  });
});

// Add to Wishlist Toggle
app.get('/add_to_wishlist/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (!req.session.wishlist) req.session.wishlist = [];

  const index = req.session.wishlist.indexOf(productId);
  if (index === -1) {
    req.session.wishlist.push(productId);
    (req as any).flash('Product added to your private wishlist!');
  } else {
    req.session.wishlist.splice(index, 1);
    (req as any).flash('Product removed from your wishlist.');
  }

  if (req.headers.accept?.includes('application/json') || req.xhr) {
    return res.json({ success: true, count: req.session.wishlist.length });
  }

  res.redirect(req.headers.referer || '/wishlist');
});

// Remove from Wishlist
app.get('/remove_from_wishlist/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (req.session.wishlist) {
    req.session.wishlist = req.session.wishlist.filter((id) => id !== productId);
  }
  res.redirect('/wishlist');
});

// Wishlist Count API
app.get('/wishlist_count', (req: Request, res: Response) => {
  const count = req.session.wishlist?.length || 0;
  res.json({ count });
});

// 7. Search
app.get('/search', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'search';
  const query = (req.query.q as string) || '';
  let products: Product[] = [];

  if (query.trim()) {
    const qLower = query.toLowerCase();
    products = db.products
      .filter((p) => p.name.toLowerCase().includes(qLower) || p.description.toLowerCase().includes(qLower))
      .map((p) => db.populateProduct(p));
  }

  res.render('search.html', {
    products,
    query,
    wishlist_items: req.session.wishlist || [],
  });
});

// 8. Checkout (Supports Guest Checkout, BNPL, Gateways, Multi-currency, Auto-fill)
app.get('/checkout', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'checkout';
  const cartItems = getNormalizedCart(req);

  if (cartItems.length === 0) {
    (req as any).flash('Your shopping bag is empty. Please select some pieces first.');
    return res.redirect('/cart');
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  // Check promo
  const promoCode = req.session.promoCode;
  const promo = promoCode ? db.promos.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.is_active) : null;
  let discount = 0;
  if (promo && subtotal >= promo.min_spend) {
    discount = promo.type === 'percentage' ? (subtotal * promo.value) / 100 : Math.min(subtotal, promo.value);
  }

  const isFreeShipping = subtotal >= 150 || promo?.type === 'free_shipping';
  const shippingCost = isFreeShipping ? 0 : 25.0;
  const giftWrapCost = req.session.giftWrapped ? 15.0 : 0.0;
  const taxRate = 0.08;
  const taxAmount = (subtotal - discount) * taxRate;
  const total = Math.max(0, subtotal - discount + shippingCost + giftWrapCost + taxAmount);

  const currency = req.session.currency || 'USD';
  const convertedTotal = convertPrice(total, currency);
  const klarnaInstallment = (convertedTotal.amount / 4).toFixed(currency === 'JPY' ? 0 : 2);

  res.render('checkout.html', {
    cart_items: cartItems,
    subtotal,
    discount,
    promo,
    shippingCost,
    isFreeShipping,
    giftWrapCost,
    giftWrapped: req.session.giftWrapped,
    giftMessage: req.session.giftMessage,
    taxAmount,
    total,
    convertedTotal,
    klarnaInstallment,
  });
});

// Process Checkout & Payment
app.post('/checkout', (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    country,
    postal_code,
    payment_method,
    mobile_money_provider,
    mobile_money_phone,
    card_number,
    gift_wrapped,
    gift_message,
    create_vip_account,
    vip_password,
  } = req.body;

  const cartItems = getNormalizedCart(req);

  if (cartItems.length === 0) {
    (req as any).flash('Your shopping bag is empty.');
    return res.redirect('/cart');
  }

  // Handle automatic guest account creation if requested
  let userId = req.session.userId;
  if (!userId && create_vip_account && email && vip_password) {
    const existing = db.users.find((u) => u.email === email || u.username === email);
    if (!existing) {
      const newUser: User = {
        id: db.users.length + 1,
        username: email.split('@')[0],
        email,
        password: bcrypt.hashSync(vip_password, 10),
        is_admin: false,
        vip_points: 100, // 100 bonus signup points
        created_at: makeDateWithStrftime(new Date()),
      };
      db.users.push(newUser);
      req.session.userId = newUser.id;
      userId = newUser.id;
    } else {
      userId = existing.id;
      req.session.userId = existing.id;
    }
  }

  // If still no user, assign to guest/primary user
  if (!userId) {
    userId = 2; // Default to Elena VIP customer or guest
  }

  const items = cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    variantSku: item.variantSku,
    size: item.size,
    color: item.color,
  }));

  const customerName = `${first_name || ''} ${last_name || ''}`.trim() || 'Valued Client';
  const currency = req.session.currency || 'USD';

  const { order } = db.createOrder(userId, items, {
    customerName,
    customerEmail: email || 'guest@velora-couture.com',
    customerPhone: phone || mobile_money_phone || '+1 (555) 234-5678',
    shippingAddress: {
      street: address || '10 Place Vendôme',
      city: city || 'Paris',
      country: country || 'France',
      postal: postal_code || '75001',
    },
    promoCode: req.session.promoCode,
    giftWrapped: Boolean(gift_wrapped || req.session.giftWrapped),
    giftMessage: gift_message || req.session.giftMessage,
    paymentMethod: payment_method || 'Stripe Luxury Card',
    currency,
  });

  // Process payment authorization
  const chosenProvider = payment_method === 'mobile_money' ? mobile_money_provider || 'mtn' : payment_method || 'stripe';
  const paymentResult = db.processPayment(order.id, chosenProvider, {
    phone: mobile_money_phone || phone,
    cardLast4: card_number ? card_number.slice(-4) : '4242',
  });

  if (paymentResult.success) {
    // Clear cart and checkout session flags
    req.session.cart = {};
    req.session.promoCode = undefined;
    req.session.giftWrapped = undefined;
    req.session.giftMessage = undefined;

    (req as any).flash(`Order #${order.id} confirmed! Tracking: ${order.tracking_number}. ${paymentResult.message}`);
    res.redirect(`/dashboard?order_id=${order.id}`);
  } else {
    (req as any).flash(paymentResult.message || 'Payment processing failed. Please verify credentials.');
    res.redirect('/checkout');
  }
});

// 9. User Dashboard / Orders / VIP Loyalty / Order Tracking / Returns
app.get('/dashboard', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'dashboard';
  const userId = req.session.userId || 2;
  const user = db.users.find((u) => u.id === userId) || db.users[1];
  const userOrders = db.orders.filter((o) => o.user_id === user.id).map((o) => db.populateOrder(o));
  const userReturns = db.returns.filter((r) => r.user_id === user.id);
  const vipInfo = db.getUserVIP(user.id);

  // Active tracking order if query parameter or latest
  const focusOrderId = req.query.order_id ? Number(req.query.order_id) : userOrders[0]?.id;
  const activeOrder = userOrders.find((o) => o.id === focusOrderId) || userOrders[0];

  res.render('dashboard.html', {
    user,
    orders: userOrders,
    returns: userReturns,
    vip: vipInfo,
    active_order: activeOrder,
  });
});

// 10. Information Pages
app.get('/features', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'features';
  res.render('features.html');
});

app.get('/about', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'about';
  res.render('about.html');
});

app.get('/contact', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'contact';
  if (req.method === 'POST') {
    (req as any).flash('Thank you! Your inquiry has been dispatched to your dedicated concierge.');
  }
  res.render('contact.html');
});
app.post('/contact', (req: Request, res: Response) => {
  (req as any).flash('Thank you! Your inquiry has been dispatched to your dedicated concierge.');
  res.redirect('/contact');
});

app.get('/help', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'help';
  res.render('help.html');
});

// ----------------------------------------------------
// COMMERCIAL REST APIS
// ----------------------------------------------------

// Slide-Out Mini Cart Drawer API
app.get('/api/cart/drawer', (req: Request, res: Response) => {
  const cartItems = getNormalizedCart(req);
  const currency = req.session.currency || 'USD';
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  const promoCode = req.session.promoCode;
  const promo = promoCode ? db.promos.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.is_active) : null;
  let discount = 0;
  if (promo && subtotal >= promo.min_spend) {
    discount = promo.type === 'percentage' ? (subtotal * promo.value) / 100 : Math.min(subtotal, promo.value);
  }

  const isFreeShipping = subtotal >= 150 || promo?.type === 'free_shipping';
  const shippingFee = isFreeShipping ? 0 : 25;
  const giftWrapFee = req.session.giftWrapped ? 15 : 0;
  const total = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);

  const freeShippingThreshold = 150;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Curated in-cart cross-sells
  const crossSells = db.products
    .filter((p) => !cartItems.some((ci) => ci.productId === p.id))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: convertPrice(p.price, currency).formatted,
      image_url: p.image_url,
    }));

  res.json({
    items: cartItems.map((ci) => ({
      key: ci.key,
      productId: ci.productId,
      name: ci.product.name,
      image_url: ci.product.image_url,
      size: ci.size,
      color: ci.color,
      variantSku: ci.variantSku,
      quantity: ci.quantity,
      price: convertPrice(ci.price, currency).formatted,
      itemTotal: convertPrice(ci.itemTotal, currency).formatted,
    })),
    count: cartItems.reduce((sum, ci) => sum + ci.quantity, 0),
    subtotal: convertPrice(subtotal, currency).formatted,
    subtotalRaw: subtotal,
    discount: convertPrice(discount, currency).formatted,
    promoCode: promo?.code,
    shippingFee: isFreeShipping ? 'COMPLIMENTARY' : convertPrice(shippingFee, currency).formatted,
    giftWrapped: req.session.giftWrapped || false,
    giftWrapFee: convertPrice(giftWrapFee, currency).formatted,
    total: convertPrice(total, currency).formatted,
    freeShippingThreshold: convertPrice(freeShippingThreshold, currency).formatted,
    freeShippingRemaining: convertPrice(freeShippingRemaining, currency).formatted,
    freeShippingRemainingRaw: freeShippingRemaining,
    freeShippingProgress,
    isFreeShipping,
    crossSells,
  });
});

// Currency Switcher API
app.post('/api/currency/set', (req: Request, res: Response) => {
  const { currency } = req.body;
  if (currency && CURRENCY_CONFIG[currency as CurrencyCode]) {
    req.session.currency = currency as CurrencyCode;
    return res.json({ success: true, currency, symbol: CURRENCY_CONFIG[currency as CurrencyCode].symbol });
  }
  res.status(400).json({ success: false, message: 'Unsupported currency' });
});

// Apply Promo Code
app.post('/api/cart/apply-promo', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Please provide a promo code.' });
  }

  const promo = db.promos.find((p) => p.code.toUpperCase() === String(code).trim().toUpperCase() && p.is_active);
  if (!promo) {
    return res.status(404).json({ success: false, message: 'Invalid or expired promotional code.' });
  }

  const cartItems = getNormalizedCart(req);
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  if (subtotal < promo.min_spend) {
    return res.status(400).json({
      success: false,
      message: `Code ${promo.code} requires a minimum order of $${promo.min_spend.toFixed(2)}.`,
    });
  }

  req.session.promoCode = promo.code;
  res.json({
    success: true,
    message: `Promo code ${promo.code} applied! (${promo.description})`,
    code: promo.code,
  });
});

// Remove Promo Code
app.post('/api/cart/remove-promo', (req: Request, res: Response) => {
  req.session.promoCode = undefined;
  res.json({ success: true, message: 'Promo code removed.' });
});

// Toggle Gift Wrap
app.post('/api/cart/gift-wrap', (req: Request, res: Response) => {
  const { gift_wrapped, gift_message } = req.body;
  req.session.giftWrapped = Boolean(gift_wrapped);
  if (gift_message !== undefined) req.session.giftMessage = String(gift_message);
  res.json({ success: true, giftWrapped: req.session.giftWrapped, giftMessage: req.session.giftMessage });
});

// Order Tracking Search API
app.get('/api/tracking/search', (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Tracking number or order ID required' });

  const order = db.orders.find((o) => o.tracking_number.toLowerCase() === q.toLowerCase() || String(o.id) === q);

  if (!order) {
    return res.status(404).json({ error: `No dispatch record located for "${q}". Please verify with customer concierge.` });
  }

  res.json({
    order_id: order.id,
    tracking_number: order.tracking_number,
    carrier: order.shipping_carrier,
    status: order.status,
    customer_name: order.customer_name,
    milestones: order.tracking_milestones,
    destination: `${order.shipping_address?.city || ''}, ${order.shipping_address?.country || ''}`,
  });
});

// Submit Return & Exchange Request
app.post('/api/returns/request', (req: Request, res: Response) => {
  const { order_id, product_name, reason, type } = req.body;
  const userId = req.session.userId || 2;

  const returnLabel = `RET-VEL-${Math.floor(100000 + Math.random() * 900000)}-DHL`;
  const newReturn = {
    id: db.returns.length + 1,
    order_id: Number(order_id) || 1,
    user_id: userId,
    product_name: String(product_name || 'Luxury Garment'),
    reason: String(reason || 'Size Exchange'),
    type: (type as any) || 'size_exchange',
    status: 'Approved' as const,
    return_label_code: returnLabel,
    created_at: makeDateWithStrftime(new Date()),
  };

  db.returns.push(newReturn);

  res.json({
    success: true,
    message: 'Complimentary return authorized. Your prepaid DHL courier label is generated.',
    return_label: returnLabel,
  });
});

// Pre-Order & Back-in-Stock Alert Subscription
app.post('/api/preorder/notify', (req: Request, res: Response) => {
  const { product_id, email, phone, variant_sku } = req.body;
  if (!email || !product_id) {
    return res.status(400).json({ error: 'Email and product are required.' });
  }

  const prod = db.products.find((p) => p.id === Number(product_id));
  db.preorders.push({
    id: db.preorders.length + 1,
    product_id: Number(product_id),
    product_name: prod ? prod.name : 'Exclusive Piece',
    email: String(email),
    phone: phone ? String(phone) : undefined,
    variant_sku: variant_sku ? String(variant_sku) : undefined,
    created_at: makeDateWithStrftime(new Date()),
  });

  res.json({
    success: true,
    message: `Thank you! You are confirmed for VIP notification when ${prod?.name || 'this piece'} becomes available.`,
  });
});

// Helpful Review Vote
app.post('/api/reviews/helpful', (req: Request, res: Response) => {
  const { review_id } = req.body;
  const review = db.reviews.find((r) => r.id === Number(review_id));
  if (review) {
    review.helpful_count++;
    return res.json({ success: true, count: review.helpful_count });
  }
  res.status(404).json({ error: 'Review not found' });
});

// VIP Luxury Concierge Chat API
app.post('/api/concierge/chat', (req: Request, res: Response) => {
  const message = String(req.body.message || '').toLowerCase();

  let reply = 'Welcome to the Velora Haute Couture Concierge. How may our styling atelier assist you today?';

  if (message.includes('size') || message.includes('fit') || message.includes('measure')) {
    reply =
      'Our garments are sculpted according to Parisian luxury proportions. Most tailored pieces fit true to size. For outerwear layering, we advise sizing up one bracket. You can also view exact centimeter and inch specs in the interactive Size Guide.';
  } else if (message.includes('shipping') || message.includes('delivery') || message.includes('express')) {
    reply =
      'We provide complimentary White-Glove Courier delivery on orders over $150. Global deliveries are fulfilled via FedEx Priority and DHL Express with tamper-sealed cedar packaging within 2-4 business days.';
  } else if (message.includes('return') || message.includes('exchange')) {
    reply =
      'Velora provides a seamless 30-day complimentary return and size exchange service. Prepaid DHL airway bills are issued instantly via your Account Dashboard.';
  } else if (message.includes('track') || message.includes('order')) {
    reply =
      'You can monitor real-time air transit and customs clearance in your Account Dashboard or by providing your order tracking code to our concierge.';
  } else if (message.includes('discount') || message.includes('promo') || message.includes('code')) {
    reply =
      'Use code VELORA15 for 15% off orders over $100, or LUXE50 for $50 off orders over $250. VIP members also receive complimentary gift wrapping.';
  } else if (message.includes('dress') || message.includes('evening') || message.includes('aria')) {
    reply =
      'The Aria Silk Pleated Evening Gown is our signature centerpiece, draped from pure Mulberry silk. We recommend pairing it with the Aurelia 18K Venetian Chain and Vittorio boots for black-tie resonance.';
  } else {
    reply =
      'Thank you for contacting Velora Atelier. Your inquiry has been prioritized with our senior styling team in Paris. Can we assist with sizing, garment care, or private appointments?';
  }

  res.json({ reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
});

// Instant 1-Click Social Sign-In Simulation
app.post('/api/social-login', (req: Request, res: Response) => {
  const { provider } = req.body;
  const vipUser = db.users.find((u) => u.username === 'elena_vogue') || db.users[1];
  req.session.userId = vipUser.id;

  (req as any).flash(`Signed in seamlessly via ${provider === 'apple' ? 'Apple ID' : 'Google'}. Welcome back, ${vipUser.username}!`);
  req.session.save((err) => {
    if (err) console.error('Session save error on social login:', err);
    res.json({ success: true, redirect: '/' });
  });
});

// Luxury Address Autocomplete Simulator
app.get('/api/address/suggest', (req: Request, res: Response) => {
  const q = String(req.query.q || '').toLowerCase();
  const addresses = [
    { street: '740 Park Avenue', city: 'New York', state: 'NY', country: 'United States', postal: '10021' },
    { street: '14 Berkeley Square', city: 'London', state: 'Greater London', country: 'United Kingdom', postal: 'W1J 6BL' },
    { street: '10 Place Vendôme', city: 'Paris', state: 'Île-de-France', country: 'France', postal: '75001' },
    { street: 'Via Monte Napoleone 8', city: 'Milan', state: 'Lombardy', country: 'Italy', postal: '20121' },
    { street: 'Bahnhofstrasse 44', city: 'Zurich', state: 'Zurich', country: 'Switzerland', postal: '8001' },
    { street: 'Ginza 6-10-1, Chuo-ku', city: 'Tokyo', state: 'Tokyo', country: 'Japan', postal: '104-0061' },
    { street: 'Sheikh Zayed Road, Downtown', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', postal: '00000' },
  ];

  const matched = addresses.filter(
    (a) => a.street.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
  );

  res.json(matched.length > 0 ? matched : addresses.slice(0, 4));
});

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

app.get('/login', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'login';
  res.render('login.html', {
    error: null,
    username_val: '',
  });
});

app.post('/login', (req: Request, res: Response) => {
  const rawUsername = String(req.body.username || '').trim();
  const rawPassword = String(req.body.password || '');

  if (!rawUsername || !rawPassword) {
    res.locals.request.endpoint = 'login';
    return res.render('login.html', {
      error: 'Please enter both your username/email and password.',
      username_val: rawUsername,
    });
  }

  const user = db.users.find(
    (u) =>
      u.username.toLowerCase() === rawUsername.toLowerCase() ||
      (u.email && u.email.toLowerCase() === rawUsername.toLowerCase())
  );

  if (user && bcrypt.compareSync(rawPassword, user.password)) {
    req.session.userId = user.id;
    (req as any).flash(`Welcome back to Velora, ${user.username}!`);
    return req.session.save((err) => {
      if (err) console.error('Session save error on login:', err);
      if (user.is_admin) {
        return res.redirect('/admin?key=velora2026');
      }
      return res.redirect('/');
    });
  }

  res.locals.request.endpoint = 'login';
  return res.render('login.html', {
    error: 'Incorrect username/email or password. Please verify and try again.',
    username_val: rawUsername,
  });
});

app.get('/register', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'register';
  res.render('register.html', {
    error: null,
    username_val: '',
    email_val: '',
  });
});

app.post('/register', (req: Request, res: Response) => {
  const rawUsername = String(req.body.username || '').trim();
  const rawEmail = String(req.body.email || '').trim().toLowerCase();
  const rawPassword = String(req.body.password || '');
  const rawConfirmPassword = String(req.body.confirm_password || '');

  if (!rawUsername || !rawPassword) {
    res.locals.request.endpoint = 'register';
    return res.render('register.html', {
      error: 'Username and password are required.',
      username_val: rawUsername,
      email_val: rawEmail,
    });
  }

  if (rawPassword.length < 6) {
    res.locals.request.endpoint = 'register';
    return res.render('register.html', {
      error: 'Password must be at least 6 characters long.',
      username_val: rawUsername,
      email_val: rawEmail,
    });
  }

  if (rawConfirmPassword && rawPassword !== rawConfirmPassword) {
    res.locals.request.endpoint = 'register';
    return res.render('register.html', {
      error: 'Passwords do not match.',
      username_val: rawUsername,
      email_val: rawEmail,
    });
  }

  const existing = db.users.find(
    (u) =>
      u.username.toLowerCase() === rawUsername.toLowerCase() ||
      (rawEmail && u.email && u.email.toLowerCase() === rawEmail)
  );

  if (existing) {
    res.locals.request.endpoint = 'register';
    return res.render('register.html', {
      error: 'An account already exists with this username or email.',
      username_val: rawUsername,
      email_val: rawEmail,
    });
  }

  const maxId = db.users.reduce((max, u) => Math.max(max, u.id), 0);
  const newUser: User = {
    id: maxId + 1,
    username: rawUsername,
    email: rawEmail || `${rawUsername}@velora-couture.com`,
    password: bcrypt.hashSync(rawPassword, 10),
    is_admin: false,
    vip_points: 200, // 200 welcome reward points
    created_at: makeDateWithStrftime(new Date()),
  };
  db.users.push(newUser);
  req.session.userId = newUser.id;

  (req as any).flash('Welcome to the House of Velora! 200 VIP Privilège Points added to your account.');
  req.session.save((err) => {
    if (err) console.error('Session save error on register:', err);
    res.redirect('/');
  });
});

app.get('/logout', (req: Request, res: Response) => {
  req.session.userId = undefined;
  (req as any).flash('You have been signed out from your Velora account.');
  req.session.save((err) => {
    if (err) console.error('Session save error on logout:', err);
    res.redirect('/');
  });
});

// ----------------------------------------------------
// ADMIN DASHBOARD & BACK-OFFICE ROUTES
// ----------------------------------------------------

app.get('/admin', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_dashboard';

  const paidOrders = db.orders.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const netMargin = totalRevenue * 0.62; // 62% luxury margin
  const aov = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const recentOrders = db.orders.slice(-10).reverse().map((o) => db.populateOrder(o));

  // Low stock products alert (< 5 units)
  const lowStockProducts = db.products.filter((p) => p.stock_quantity <= 5);

  // Return rate
  const returnRate = paidOrders.length > 0 ? ((db.returns.length / paidOrders.length) * 100).toFixed(1) : '0.0';

  res.render('admin/dashboard.html', {
    total_revenue: totalRevenue,
    net_margin: netMargin,
    average_order_value: aov,
    return_rate: returnRate,
    total_orders: totalOrders,
    total_products: totalProducts,
    recent_orders: recentOrders,
    low_stock_products: lowStockProducts,
    abandoned_carts: db.abandonedCarts,
    promos: db.promos,
  });
});

app.get('/admin/products', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_products';
  const products = db.products.map((p) => db.populateProduct(p));
  res.render('admin/products.html', {
    products,
    categories: db.categories,
  });
});

app.get('/admin/products/add', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'add_product';
  res.render('admin/add_product.html', {
    categories: db.categories,
  });
});

app.post('/admin/products/add', requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  const { name, description, price, stock, category, badge } = req.body;
  let imageUrl = '/static/images/product-01.jpg';

  if (req.file) {
    imageUrl = `/static/uploads/${req.file.filename}`;
  }

  db.addProduct({
    name,
    description,
    price: Number(price),
    image_url: imageUrl,
    stock_quantity: Number(stock),
    category_id: Number(category),
    badge: badge || 'NEW SEASON',
  });

  (req as any).flash('Product added to atelier catalog!');
  res.redirect('/admin/products?key=velora2026');
});

app.get('/admin/products/edit/:id', requireAdmin, (req: Request, res: Response) => {
  res.locals.request.endpoint = 'edit_product';
  const productId = Number(req.params.id);
  const rawProduct = db.products.find((p) => p.id === productId);

  if (!rawProduct) {
    return res.status(404).render('404.html');
  }

  res.render('admin/edit_product.html', {
    product: db.populateProduct(rawProduct),
    categories: db.categories,
  });
});

app.post('/admin/products/edit/:id', requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const { name, description, price, stock, category, badge } = req.body;

  const updateData: Partial<Product> = {
    name,
    description,
    price: Number(price),
    stock_quantity: Number(stock),
    category_id: Number(category),
    badge,
  };

  if (req.file) {
    updateData.image_url = `/static/uploads/${req.file.filename}`;
  }

  db.updateProduct(productId, updateData);
  (req as any).flash('Product details updated successfully!');
  res.redirect('/admin/products?key=velora2026');
});

app.post('/admin/products/delete/:id', requireAdmin, (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  db.deleteProduct(productId);
  (req as any).flash('Product removed from catalog.');
  res.redirect('/admin/products?key=velora2026');
});

// Admin Warehouse Restock
app.post('/admin/inventory/restock/:id', requireAdmin, (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const addUnits = Number(req.body.units) || 20;
  const prod = db.products.find((p) => p.id === productId);

  if (prod) {
    prod.stock_quantity += addUnits;
    if (prod.warehouses && prod.warehouses.length > 0) {
      prod.warehouses[0].stock += addUnits;
    }
    (req as any).flash(`Restocked ${addUnits} units for "${prod.name}".`);
  }

  res.redirect(req.headers.referer || '/admin?key=velora2026');
});

// Admin Order Fulfillment
app.post('/admin/orders/fulfill/:id', requireAdmin, (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { carrier, tracking_number } = req.body;
  const order = db.orders.find((o) => o.id === orderId);

  if (order) {
    order.status = 'shipped';
    if (carrier) order.shipping_carrier = carrier;
    if (tracking_number) order.tracking_number = tracking_number;
    order.tracking_milestones.push({
      status: 'Dispatched via Courier Airport Logistics Centre',
      location: 'Roissy Charles de Gaulle Hub',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      done: true,
    });
    (req as any).flash(`Order #${orderId} fulfilled and marked as Shipped via ${order.shipping_carrier}.`);
  }

  res.redirect(req.headers.referer || '/admin/orders?key=velora2026');
});

// Admin Abandoned Cart Recovery Trigger
app.post('/admin/abandoned/recover/:id', requireAdmin, (req: Request, res: Response) => {
  const cartId = Number(req.params.id);
  const cart = db.abandonedCarts.find((c) => c.id === cartId);
  if (cart) {
    cart.recovered = true;
    (req as any).flash(`Automated VIP recovery email with complimentary 10% coupon dispatched to ${cart.email}!`);
  }
  res.redirect('/admin?key=velora2026');
});

// Admin Promo Code Creation
app.post('/admin/promos/create', requireAdmin, (req: Request, res: Response) => {
  const { code, type, value, min_spend, description } = req.body;
  if (code && value) {
    db.promos.push({
      code: String(code).toUpperCase().trim(),
      type: type || 'percentage',
      value: Number(value),
      min_spend: Number(min_spend) || 0,
      description: description || 'Promotional Campaign',
      is_active: true,
      usage_count: 0,
    });
    (req as any).flash(`Promo code "${code}" created and activated.`);
  }
  res.redirect('/admin?key=velora2026');
});

app.post('/admin/categories/add', requireAdmin, (req: Request, res: Response) => {
  const { name } = req.body;
  if (name) {
    db.addCategory(name);
    (req as any).flash(`Category "${name}" added!`);
  }
  res.redirect('/admin/products?key=velora2026');
});

app.get('/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_orders';
  const orders = db.orders.slice().reverse().map((o) => db.populateOrder(o));
  res.render('admin/orders.html', {
    orders,
  });
});

app.post('/admin/orders/update/:id', requireAdmin, (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;
  const order = db.orders.find((o) => o.id === orderId);

  if (order && status) {
    order.status = status;
    (req as any).flash(`Order #${orderId} status updated to ${status}.`);
  }
  res.redirect('/admin/orders?key=velora2026');
});

app.get('/admin/customers', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_customers';
  const customers = db.users.map((user) => {
    const userOrders = db.orders.filter((o) => o.user_id === user.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    const vip = db.getUserVIP(user.id);
    return {
      user,
      order_count: userOrders.length,
      total_spent: totalSpent,
      vip,
    };
  });

  res.render('admin/customers.html', {
    customers,
  });
});

app.get('/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_settings';
  res.render('admin/settings.html', {
    promos: db.promos,
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).render('404.html');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Velora Store running on http://0.0.0.0:${PORT}`);
});
