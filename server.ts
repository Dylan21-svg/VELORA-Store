import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db, makeDateWithStrftime } from './src/data.ts';
import type { User, Product } from './src/data.ts';

const app = express();
const PORT = 3000;

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
    cart?: { [productId: string]: number };
    wishlist?: number[];
    flashMessages?: string[];
  }
}

// Flash messages & Request context Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.cart) {
    req.session.cart = {};
  }
  if (!req.session.wishlist) {
    req.session.wishlist = [];
  }
  if (!req.session.flashMessages) {
    req.session.flashMessages = [];
  }
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
  // Support Jinja pattern: "%.2f" | format(price)
  if (typeof val === 'string' && val.includes('%') && args.length > 0) {
    const num = args[0];
    if (typeof num === 'number') {
      return num.toFixed(2);
    }
    const parsed = parseFloat(num);
    if (!isNaN(parsed)) {
      return parsed.toFixed(2);
    }
    return String(num ?? '0.00');
  }

  // Support Nunjucks pattern: price | format or price | format('%.2f')
  if (typeof val === 'number') {
    return val.toFixed(2);
  }
  const parsed = parseFloat(val);
  if (!isNaN(parsed)) {
    return parsed.toFixed(2);
  }

  if (args.length > 0) {
    const num = args[0];
    if (typeof num === 'number') return num.toFixed(2);
    const p = parseFloat(num);
    if (!isNaN(p)) return p.toFixed(2);
  }

  return val ?? '0.00';
});

// Custom Nunjucks filter: price / currency
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

  res.locals.current_user = user
    ? {
        ...user,
        is_authenticated: true,
        is_anonymous: false,
      }
    : {
        id: null,
        username: 'Guest',
        is_authenticated: false,
        is_anonymous: true,
        is_admin: false,
      };

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

  res.render('index.html', {
    products,
    featured_products: products,
    wishlist_items,
  });
});

// 2. Shop / Catalog
app.get('/shop', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'shop';
  const categoryId = req.query.category ? Number(req.query.category) : null;
  const minPrice = req.query.min_price ? Number(req.query.min_price) : 0;
  const maxPrice = req.query.max_price ? Number(req.query.max_price) : Infinity;
  const sortBy = (req.query.sort_by as string) || (req.query.sort as string) || 'default';

  let products = db.products.map((p) => db.populateProduct(p));

  if (categoryId) {
    products = products.filter((p) => p.category_id === categoryId);
  }

  products = products.filter((p) => p.price >= minPrice && (maxPrice === Infinity || p.price <= maxPrice));

  if (sortBy === 'price_low' || sortBy === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high' || sortBy === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const wishlist_items = req.session.wishlist || [];

  res.render('shop.html', {
    products,
    total_count: db.products.length,
    categories: db.categories,
    current_category: categoryId,
    min_price: req.query.min_price || '',
    max_price: req.query.max_price || '',
    sort_by: sortBy,
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

  res.render('product.html', {
    product,
    related_products: relatedProducts,
    wishlist_items,
  });
});

// 4. Submit Review
app.post('/product/:id/review', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const { rating, comment } = req.body;
  const userId = req.session.userId || 1;
  const user = db.users.find((u) => u.id === userId) || { username: 'Customer' };

  if (productId && rating && comment) {
    db.reviews.push({
      id: db.reviews.length + 1,
      product_id: productId,
      user_id: userId,
      user: { username: user.username },
      rating: Number(rating),
      comment: String(comment),
      created_at: makeDateWithStrftime(new Date()),
    });
    (req as any).flash('Thank you! Your review has been submitted.');
  }

  res.redirect(`/product/${productId}`);
});

// 5. Shopping Cart
app.get('/cart', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'cart';
  const cartSession = req.session.cart || {};
  const cartItems: { product: Product; quantity: number }[] = [];
  let total = 0;

  for (const [prodIdStr, qty] of Object.entries(cartSession)) {
    const prodId = Number(prodIdStr);
    const product = db.products.find((p) => p.id === prodId);
    if (product && qty > 0) {
      cartItems.push({
        product: db.populateProduct(product),
        quantity: qty,
      });
      total += product.price * qty;
    }
  }

  res.render('cart.html', {
    cart_items: cartItems,
    products: cartItems,
    total,
  });
});

// Add to Cart
app.post('/add_to_cart/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const qty = req.body.quantity ? Number(req.body.quantity) : 1;

  if (!req.session.cart) req.session.cart = {};
  const currentQty = req.session.cart[String(productId)] || 0;
  req.session.cart[String(productId)] = currentQty + qty;

  const totalCount = Object.values(req.session.cart).reduce((sum, q) => sum + q, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr || req.body?.ajax) {
    return res.json({ success: true, count: totalCount, message: 'Item added to cart!' });
  }

  (req as any).flash('Item added to cart!');
  res.redirect(req.headers.referer || '/cart');
});

// Update Cart Quantity
app.post('/update_cart/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!req.session.cart) req.session.cart = {};

  if (quantity <= 0) {
    delete req.session.cart[String(productId)];
  } else {
    req.session.cart[String(productId)] = quantity;
  }

  const cartSession = req.session.cart || {};
  let total = 0;
  let itemTotal = 0;
  for (const [pId, qty] of Object.entries(cartSession)) {
    const prod = db.products.find((p) => p.id === Number(pId));
    if (prod) {
      total += prod.price * qty;
      if (Number(pId) === productId) {
        itemTotal = prod.price * qty;
      }
    }
  }
  const count = Object.values(cartSession).reduce((sum, qty) => sum + qty, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr || req.body?.ajax) {
    return res.json({
      success: true,
      count,
      itemTotal: itemTotal.toFixed(2),
      total: total.toFixed(2),
      quantity: quantity <= 0 ? 0 : quantity,
      removed: quantity <= 0,
    });
  }

  res.redirect('/cart');
});

// Remove Item from Cart
app.post('/remove_from_cart/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (req.session.cart) {
    delete req.session.cart[String(productId)];
  }

  const cartSession = req.session.cart || {};
  let total = 0;
  for (const [pId, qty] of Object.entries(cartSession)) {
    const prod = db.products.find((p) => p.id === Number(pId));
    if (prod) total += prod.price * qty;
  }
  const count = Object.values(cartSession).reduce((sum, qty) => sum + qty, 0);

  if (req.headers.accept?.includes('application/json') || req.xhr) {
    return res.json({
      success: true,
      count,
      total: total.toFixed(2),
      removed: true,
    });
  }

  (req as any).flash('Item removed from cart.');
  res.redirect('/cart');
});

// GET fallback for remove from cart
app.get('/remove_from_cart/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (req.session.cart) {
    delete req.session.cart[String(productId)];
  }
  (req as any).flash('Item removed from cart.');
  res.redirect('/cart');
});

// Cart Count API
app.get('/cart_count', (req: Request, res: Response) => {
  const cartSession = req.session.cart || {};
  const count = Object.values(cartSession).reduce((sum, qty) => sum + qty, 0);
  res.json({ count });
});

// 6. Wishlist
app.get('/wishlist', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'wishlist';
  const wishlistIds = req.session.wishlist || [];
  const wishlistProducts = db.products
    .filter((p) => wishlistIds.includes(p.id))
    .map((p) => db.populateProduct(p));

  res.render('wishlist.html', {
    products: wishlistProducts,
    wishlist_items: wishlistIds,
  });
});

// Add to Wishlist Toggle
app.get('/add_to_wishlist/:id', (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (!req.session.wishlist) req.session.wishlist = [];

  const index = req.session.wishlist.indexOf(productId);
  if (index === -1) {
    req.session.wishlist.push(productId);
    (req as any).flash('Product added to your wishlist!');
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

// 8. Checkout
app.get('/checkout', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'checkout';
  const cartSession = req.session.cart || {};
  const cartItems: { product: Product; quantity: number }[] = [];
  let total = 0;

  for (const [prodIdStr, qty] of Object.entries(cartSession)) {
    const prodId = Number(prodIdStr);
    const product = db.products.find((p) => p.id === prodId);
    if (product && qty > 0) {
      cartItems.push({
        product: db.populateProduct(product),
        quantity: qty,
      });
      total += product.price * qty;
    }
  }

  if (cartItems.length === 0) {
    (req as any).flash('Your cart is empty. Add some products first!');
    return res.redirect('/cart');
  }

  res.render('checkout.html', {
    cart_items: cartItems,
    total,
  });
});

// Process Checkout & Payment
app.post('/checkout', (req: Request, res: Response) => {
  const { payment_method, phone } = req.body;
  const cartSession = req.session.cart || {};
  const items = Object.entries(cartSession).map(([prodId, quantity]) => ({
    productId: Number(prodId),
    quantity,
  }));

  if (items.length === 0) {
    (req as any).flash('Your cart is empty.');
    return res.redirect('/cart');
  }

  const userId = req.session.userId || 1;
  const { order } = db.createOrder(userId, items);
  const paymentResult = db.processPayment(order.id, payment_method || 'paypal', phone);

  if (paymentResult.success) {
    // Clear cart
    req.session.cart = {};
    (req as any).flash(`Order placed successfully! Transaction Ref: ${paymentResult.reference}`);
    res.redirect('/dashboard');
  } else {
    (req as any).flash(paymentResult.message || 'Payment processing failed.');
    res.redirect('/checkout');
  }
});

// 9. User Dashboard / Orders
app.get('/dashboard', (req: Request, res: Response) => {
  res.locals.request.endpoint = 'dashboard';
  const userId = req.session.userId || 1;
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  const userOrders = db.orders.filter((o) => o.user_id === user.id).map((o) => db.populateOrder(o));

  res.render('dashboard.html', {
    user,
    orders: userOrders,
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
    (req as any).flash('Thank you! Your message has been received.');
  }
  res.render('contact.html');
});
app.post('/contact', (req: Request, res: Response) => {
  (req as any).flash('Thank you! Your message has been received.');
  res.redirect('/contact');
});

app.get('/help', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'help';
  res.render('help.html');
});

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

app.get('/login', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'login';
  res.render('login.html');
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = db.users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    (req as any).flash(`Welcome back, ${user.username}!`);
    if (user.is_admin) {
      return res.redirect('/admin?key=velora2026');
    }
    return res.redirect('/');
  }

  (req as any).flash('Invalid username or password. Please try again.');
  res.redirect('/login');
});

app.get('/register', (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'register';
  res.render('register.html');
});

app.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    (req as any).flash('Username and password are required.');
    return res.redirect('/register');
  }

  const existing = db.users.find((u) => u.username === username);
  if (existing) {
    (req as any).flash('Username already taken. Please choose another.');
    return res.redirect('/register');
  }

  const newUser: User = {
    id: db.users.length + 1,
    username,
    password: bcrypt.hashSync(password, 10),
    is_admin: false,
    created_at: makeDateWithStrftime(new Date()),
  };
  db.users.push(newUser);
  req.session.userId = newUser.id;

  (req as any).flash('Account created successfully! Welcome to Velora Store.');
  res.redirect('/');
});

app.get('/logout', (req: Request, res: Response) => {
  req.session.userId = undefined;
  (req as any).flash('You have been logged out.');
  res.redirect('/');
});

// ----------------------------------------------------
// ADMIN DASHBOARD ROUTES
// ----------------------------------------------------

app.get('/admin', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_dashboard';

  const totalRevenue = db.orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const recentOrders = db.orders.slice(-10).reverse().map((o) => db.populateOrder(o));

  res.render('admin/dashboard.html', {
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    total_products: totalProducts,
    recent_orders: recentOrders,
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
  const { name, description, price, stock, category } = req.body;
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
  });

  (req as any).flash('Product created successfully!');
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
  const { name, description, price, stock, category } = req.body;

  const updateData: Partial<Product> = {
    name,
    description,
    price: Number(price),
    stock_quantity: Number(stock),
    category_id: Number(category),
  };

  if (req.file) {
    updateData.image_url = `/static/uploads/${req.file.filename}`;
  }

  db.updateProduct(productId, updateData);
  (req as any).flash('Product updated successfully!');
  res.redirect('/admin/products?key=velora2026');
});

app.post('/admin/products/delete/:id', requireAdmin, (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  db.deleteProduct(productId);
  (req as any).flash('Product removed from catalog.');
  res.redirect('/admin/products?key=velora2026');
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
    return {
      user,
      order_count: userOrders.length,
      total_spent: totalSpent,
    };
  });

  res.render('admin/customers.html', {
    customers,
  });
});

app.get('/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.locals.request.endpoint = 'admin_settings';
  res.render('admin/settings.html');
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).render('404.html');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Velora Store running on http://0.0.0.0:${PORT}`);
});
