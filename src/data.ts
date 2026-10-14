import bcrypt from 'bcryptjs';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'CAD';

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: '$', rate: 1.0, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 152.0, name: 'Japanese Yen' },
  AED: { symbol: 'AED ', rate: 3.67, name: 'UAE Dirham' },
  CAD: { symbol: 'CA$', rate: 1.36, name: 'Canadian Dollar' },
};

export function convertPrice(amountInUSD: number, currency: CurrencyCode = 'USD'): { amount: number; formatted: string; symbol: string } {
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const converted = amountInUSD * cfg.rate;
  const decimals = currency === 'JPY' ? 0 : 2;
  const formatted = `${cfg.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  return { amount: converted, formatted, symbol: cfg.symbol };
}

export interface User {
  id: number;
  username: string;
  email?: string;
  password: string; // bcrypt hash
  is_admin: boolean;
  vip_points: number;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user: { username: string };
  rating: number;
  comment: string;
  created_at: Date;
  verified_buyer: boolean;
  fit_rating: 'Runs Small' | 'True to size' | 'Runs Large';
  customer_height?: string;
  customer_weight?: string;
  purchased_size?: string;
  photos?: string[];
  helpful_count: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: string;
  color: string;
  color_hex: string;
  material: string;
  stock: number;
  price_offset: number;
  image_url: string;
}

export interface SizeGuideRow {
  size: string;
  us: string;
  uk: string;
  eu: string;
  chest_cm: number;
  chest_in: number;
  waist_cm: number;
  waist_in: number;
  hip_cm: number;
  hip_in: number;
}

export interface WarehouseInventory {
  warehouse: 'Paris Atelier' | 'New York Flagship' | 'Tokyo Vault';
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  reviews?: Review[];
  created_at: Date;
  badge?: string;
  is_preorder?: boolean;
  preorder_date?: string;
  fit_prediction: string;
  fit_breakdown: { runs_small: number; true_to_size: number; runs_large: number };
  variants: ProductVariant[];
  gallery_images: string[];
  spin_images: string[];
  zoom_image_url: string;
  size_guide: SizeGuideRow[];
  complete_the_look_ids: number[];
  complete_the_look_products?: Product[];
  warehouses: WarehouseInventory[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  variant_sku?: string;
  selected_size?: string;
  selected_color?: string;
  product?: Product;
}

export interface TrackingMilestone {
  status: string;
  location: string;
  timestamp: string;
  done: boolean;
}

export interface Order {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total: number;
  subtotal: number;
  discount_amount: number;
  promo_code?: string;
  gift_wrapped: boolean;
  gift_message?: string;
  tax_amount: number;
  shipping_cost: number;
  shipping_carrier: 'FedEx Priority' | 'DHL Express' | 'UPS Worldwide';
  tracking_number: string;
  tracking_milestones: TrackingMilestone[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  shipping_address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postal: string;
  };
  currency: CurrencyCode;
  created_at: Date;
  items?: OrderItem[];
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: Date;
}

export interface Transaction {
  id: number;
  order_id: number;
  provider: string;
  reference: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  currency: string;
  created_at: Date;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 15 for 15% or 50 for $50
  min_spend: number;
  description: string;
  is_active: boolean;
  usage_count: number;
}

export interface ReturnRequest {
  id: number;
  order_id: number;
  user_id: number;
  product_name: string;
  reason: string;
  type: 'refund' | 'size_exchange';
  status: 'Approved' | 'In Transit' | 'Processed';
  return_label_code: string;
  created_at: Date;
}

export interface PreorderAlert {
  id: number;
  product_id: number;
  product_name: string;
  email: string;
  phone?: string;
  variant_sku?: string;
  created_at: Date;
}

export interface AbandonedCart {
  id: number;
  email: string;
  items_summary: string;
  cart_total: number;
  time_ago: string;
  recovered: boolean;
}

// Extend Date prototype to support Jinja strftime
export function makeDateWithStrftime(d: Date = new Date()): Date {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  (d as any).strftime = function (fmt: string) {
    const day = String(this.getDate()).padStart(2, '0');
    const monthIndex = this.getMonth();
    const monthNum = String(monthIndex + 1).padStart(2, '0');
    const year = String(this.getFullYear());
    const hours = String(this.getHours()).padStart(2, '0');
    const minutes = String(this.getMinutes()).padStart(2, '0');

    return fmt
      .replace('%d', day)
      .replace('%B', months[monthIndex])
      .replace('%b', shortMonths[monthIndex])
      .replace('%Y', year)
      .replace('%m', monthNum)
      .replace('%H', hours)
      .replace('%M', minutes);
  };
  return d;
}

// Extend String prototype with .upper() for Jinja compatibility
if (!String.prototype.hasOwnProperty('upper')) {
  Object.defineProperty(String.prototype, 'upper', {
    value: function () {
      return this.toUpperCase();
    },
    writable: true,
    configurable: true,
  });
}

class StoreDB {
  users: User[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  reviews: Review[] = [];
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  wishlist: WishlistItem[] = [];
  transactions: Transaction[] = [];
  promos: PromoCode[] = [];
  returns: ReturnRequest[] = [];
  preorders: PreorderAlert[] = [];
  abandonedCarts: AbandonedCart[] = [];

  private nextUserId = 1;
  private nextCategoryId = 1;
  private nextProductId = 1;
  private nextReviewId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;
  private nextTransactionId = 1;
  private nextReturnId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    // Admin user & VIP customer
    const adminPassHash = bcrypt.hashSync('VeloraAdmin2026!@#Secure', 10);
    this.users.push({
      id: this.nextUserId++,
      username: 'admin',
      email: 'concierge@velora-couture.com',
      password: adminPassHash,
      is_admin: true,
      vip_points: 4200,
      created_at: makeDateWithStrftime(new Date(2026, 0, 1)),
    });

    const vipUserHash = bcrypt.hashSync('luxury123', 10);
    this.users.push({
      id: this.nextUserId++,
      username: 'elena_vogue',
      email: 'elena.rostova@paris-style.fr',
      password: vipUserHash,
      is_admin: false,
      vip_points: 1850,
      created_at: makeDateWithStrftime(new Date(2026, 1, 15)),
    });

    // Categories
    const catClothing: Category = { id: this.nextCategoryId++, name: 'Clothing', slug: 'clothing' };
    const catShoes: Category = { id: this.nextCategoryId++, name: 'Shoes', slug: 'shoes' };
    const catAccessories: Category = { id: this.nextCategoryId++, name: 'Accessories', slug: 'accessories' };
    const catBags: Category = { id: this.nextCategoryId++, name: 'Bags', slug: 'bags' };
    this.categories.push(catClothing, catShoes, catAccessories, catBags);

    // Active Promos
    this.promos.push(
      {
        code: 'VELORA15',
        type: 'percentage',
        value: 15,
        min_spend: 100,
        description: '15% Off Orders Over $100',
        is_active: true,
        usage_count: 84,
      },
      {
        code: 'LUXE50',
        type: 'fixed',
        value: 50,
        min_spend: 250,
        description: '$50 Off Orders Over $250',
        is_active: true,
        usage_count: 42,
      },
      {
        code: 'FREESHIP',
        type: 'free_shipping',
        value: 0,
        min_spend: 50,
        description: 'Complimentary Express White-Glove Shipping',
        is_active: true,
        usage_count: 129,
      },
      {
        code: 'VIP2026',
        type: 'percentage',
        value: 20,
        min_spend: 200,
        description: 'Private Salon 20% Privilège Discount',
        is_active: true,
        usage_count: 19,
      }
    );

    // Standard Luxury Size Guides
    const standardSizeGuide: SizeGuideRow[] = [
      { size: 'XS', us: '0-2', uk: '4-6', eu: '32-34', chest_cm: 82, chest_in: 32.3, waist_cm: 64, waist_in: 25.2, hip_cm: 88, hip_in: 34.6 },
      { size: 'S', us: '4-6', uk: '8-10', eu: '36-38', chest_cm: 87, chest_in: 34.3, waist_cm: 69, waist_in: 27.2, hip_cm: 93, hip_in: 36.6 },
      { size: 'M', us: '8-10', uk: '12-14', eu: '40-42', chest_cm: 92, chest_in: 36.2, waist_cm: 74, waist_in: 29.1, hip_cm: 98, hip_in: 38.6 },
      { size: 'L', us: '12-14', uk: '16-18', eu: '44-46', chest_cm: 98, chest_in: 38.6, waist_cm: 80, waist_in: 31.5, hip_cm: 104, hip_in: 40.9 },
      { size: 'XL', us: '16', uk: '20', eu: '48', chest_cm: 104, chest_in: 40.9, waist_cm: 86, waist_in: 33.9, hip_cm: 110, hip_in: 43.3 },
    ];

    const shoeSizeGuide: SizeGuideRow[] = [
      { size: '37 EU', us: '6.5', uk: '4.5', eu: '37', chest_cm: 23.5, chest_in: 9.2, waist_cm: 0, waist_in: 0, hip_cm: 0, hip_in: 0 },
      { size: '38 EU', us: '7.5', uk: '5.5', eu: '38', chest_cm: 24.2, chest_in: 9.5, waist_cm: 0, waist_in: 0, hip_cm: 0, hip_in: 0 },
      { size: '39 EU', us: '8.5', uk: '6.5', eu: '39', chest_cm: 25.0, chest_in: 9.8, waist_cm: 0, waist_in: 0, hip_cm: 0, hip_in: 0 },
      { size: '40 EU', us: '9.0', uk: '7.0', eu: '40', chest_cm: 25.7, chest_in: 10.1, waist_cm: 0, waist_in: 0, hip_cm: 0, hip_in: 0 },
      { size: '41 EU', us: '10.0', uk: '8.0', eu: '41', chest_cm: 26.4, chest_in: 10.4, waist_cm: 0, waist_in: 0, hip_cm: 0, hip_in: 0 },
    ];

    // Seed Luxury Products with Variants, Gallery, 360 Spin Frames, and Fit Recommenders
    this.products = [
      {
        id: this.nextProductId++,
        name: 'Aria Silk Pleated Evening Gown',
        description: 'Hand-draped from 100% pure Mulberry silk charmeuse with delicate micro-pleated bodice, corset boning, and flowing godet train. Created in limited atelier batches in Milan.',
        price: 389.0,
        image_url: '/static/images/product-01.jpg',
        stock_quantity: 14,
        category_id: catClothing.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 10)),
        badge: 'ATELIER EXCLUSIVE',
        fit_prediction: 'True to luxury size (tailored bodice with fluid drape through hips)',
        fit_breakdown: { runs_small: 10, true_to_size: 85, runs_large: 5 },
        variants: [
          { id: 101, sku: 'ARIA-PL-BLK-XS', size: 'XS', color: 'Noir Onyx', color_hex: '#111111', material: '100% Mulberry Silk', stock: 3, price_offset: 0, image_url: '/static/images/product-01.jpg' },
          { id: 102, sku: 'ARIA-PL-BLK-S', size: 'S', color: 'Noir Onyx', color_hex: '#111111', material: '100% Mulberry Silk', stock: 4, price_offset: 0, image_url: '/static/images/product-01.jpg' },
          { id: 103, sku: 'ARIA-PL-BLK-M', size: 'M', color: 'Noir Onyx', color_hex: '#111111', material: '100% Mulberry Silk', stock: 3, price_offset: 0, image_url: '/static/images/product-01.jpg' },
          { id: 104, sku: 'ARIA-PL-IVR-S', size: 'S', color: 'Ivory Crème', color_hex: '#f5f0ea', material: '100% Mulberry Silk', stock: 2, price_offset: 20, image_url: '/static/images/product-detail-01.jpg' },
          { id: 105, sku: 'ARIA-PL-IVR-M', size: 'M', color: 'Ivory Crème', color_hex: '#f5f0ea', material: '100% Mulberry Silk', stock: 2, price_offset: 20, image_url: '/static/images/product-detail-01.jpg' },
        ],
        gallery_images: [
          '/static/images/product-01.jpg',
          '/static/images/product-detail-01.jpg',
          '/static/images/product-detail-02.jpg',
          '/static/images/product-detail-03.jpg',
        ],
        spin_images: [
          '/static/images/product-01.jpg',
          '/static/images/product-detail-01.jpg',
          '/static/images/product-detail-02.jpg',
          '/static/images/product-detail-03.jpg',
          '/static/images/product-01.jpg',
        ],
        zoom_image_url: '/static/images/product-01.jpg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [5, 6, 7],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 8 },
          { warehouse: 'New York Flagship', stock: 4 },
          { warehouse: 'Tokyo Vault', stock: 2 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Milano Tailored Organic Cashmere Tee',
        description: 'Featherweight 16-gauge knit fashioned from Grade-A Mongolian cashmere. Features French flatlock stitching and ribbed tubular collar tailored for under-blazer wear or standalone poise.',
        price: 185.0,
        image_url: '/static/images/product-02.jpg',
        stock_quantity: 26,
        category_id: catClothing.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 14)),
        badge: 'BESTSELLER',
        fit_prediction: 'True to size (subtly relaxed luxury silhouette)',
        fit_breakdown: { runs_small: 5, true_to_size: 90, runs_large: 5 },
        variants: [
          { id: 201, sku: 'MLN-CSH-CRM-S', size: 'S', color: 'Warm Alabaster', color_hex: '#ede8df', material: 'Mongolian Cashmere', stock: 8, price_offset: 0, image_url: '/static/images/product-02.jpg' },
          { id: 202, sku: 'MLN-CSH-CRM-M', size: 'M', color: 'Warm Alabaster', color_hex: '#ede8df', material: 'Mongolian Cashmere', stock: 10, price_offset: 0, image_url: '/static/images/product-02.jpg' },
          { id: 203, sku: 'MLN-CSH-CRM-L', size: 'L', color: 'Warm Alabaster', color_hex: '#ede8df', material: 'Mongolian Cashmere', stock: 5, price_offset: 0, image_url: '/static/images/product-02.jpg' },
          { id: 204, sku: 'MLN-CSH-NVY-M', size: 'M', color: 'Midnight Navy', color_hex: '#17223b', material: 'Mongolian Cashmere', stock: 3, price_offset: 15, image_url: '/static/images/product-08.jpg' },
        ],
        gallery_images: [
          '/static/images/product-02.jpg',
          '/static/images/thumb-01.jpg',
          '/static/images/thumb-02.jpg',
        ],
        spin_images: [
          '/static/images/product-02.jpg',
          '/static/images/thumb-01.jpg',
          '/static/images/thumb-02.jpg',
          '/static/images/product-02.jpg',
        ],
        zoom_image_url: '/static/images/product-02.jpg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [4, 9, 7],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 14 },
          { warehouse: 'New York Flagship', stock: 8 },
          { warehouse: 'Tokyo Vault', stock: 4 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Monza Ultra-Light Carbon Running Sneaker',
        description: 'Engineered with aerodynamic carbon propulsion plate and Italian dual-density supercritical foam. Microfiber upper accented with reflective heat-welded seams.',
        price: 295.0,
        image_url: '/static/images/product-03.jpg',
        stock_quantity: 18,
        category_id: catShoes.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 18)),
        badge: 'NEW SEASON',
        fit_prediction: 'Runs slightly small — recommend sizing up one half size',
        fit_breakdown: { runs_small: 35, true_to_size: 60, runs_large: 5 },
        variants: [
          { id: 301, sku: 'MNZ-SNK-38', size: '38 EU', color: 'Chalk White / Obsidian', color_hex: '#f8f8f8', material: 'Carbon Composite & Knit', stock: 4, price_offset: 0, image_url: '/static/images/product-03.jpg' },
          { id: 302, sku: 'MNZ-SNK-39', size: '39 EU', color: 'Chalk White / Obsidian', color_hex: '#f8f8f8', material: 'Carbon Composite & Knit', stock: 5, price_offset: 0, image_url: '/static/images/product-03.jpg' },
          { id: 303, sku: 'MNZ-SNK-40', size: '40 EU', color: 'Chalk White / Obsidian', color_hex: '#f8f8f8', material: 'Carbon Composite & Knit', stock: 5, price_offset: 0, image_url: '/static/images/product-03.jpg' },
          { id: 304, sku: 'MNZ-SNK-41', size: '41 EU', color: 'Chalk White / Obsidian', color_hex: '#f8f8f8', material: 'Carbon Composite & Knit', stock: 4, price_offset: 0, image_url: '/static/images/product-03.jpg' },
        ],
        gallery_images: [
          '/static/images/product-03.jpg',
          '/static/images/s1.jpeg',
          '/static/images/s2.jpeg',
        ],
        spin_images: [
          '/static/images/product-03.jpg',
          '/static/images/s1.jpeg',
          '/static/images/s2.jpeg',
          '/static/images/product-03.jpg',
        ],
        zoom_image_url: '/static/images/product-03.jpg',
        size_guide: shoeSizeGuide,
        complete_the_look_ids: [2, 10, 8],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 10 },
          { warehouse: 'New York Flagship', stock: 5 },
          { warehouse: 'Tokyo Vault', stock: 3 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Vittorio Hand-Burnished Lug Chelsea Boots',
        description: 'Tuscan calfskin leather boot, double-tanned and hand-finished with artisan antique patina. Goodyear-welted construction with Vibram lug sole for wet-weather command.',
        price: 440.0,
        image_url: '/static/images/product-04.jpg',
        stock_quantity: 6,
        category_id: catShoes.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 20)),
        badge: 'LIMITED EDITION',
        fit_prediction: 'True to size (molds to foot contours over initial wears)',
        fit_breakdown: { runs_small: 10, true_to_size: 80, runs_large: 10 },
        variants: [
          { id: 401, sku: 'VIT-BT-BRN-39', size: '39 EU', color: 'Espresso Patina', color_hex: '#3e2723', material: 'Tuscan Calfskin', stock: 2, price_offset: 0, image_url: '/static/images/product-04.jpg' },
          { id: 402, sku: 'VIT-BT-BRN-40', size: '40 EU', color: 'Espresso Patina', color_hex: '#3e2723', material: 'Tuscan Calfskin', stock: 2, price_offset: 0, image_url: '/static/images/product-04.jpg' },
          { id: 403, sku: 'VIT-BT-BRN-41', size: '41 EU', color: 'Espresso Patina', color_hex: '#3e2723', material: 'Tuscan Calfskin', stock: 2, price_offset: 0, image_url: '/static/images/product-04.jpg' },
        ],
        gallery_images: [
          '/static/images/product-04.jpg',
          '/static/images/gallery-02.jpg',
          '/static/images/gallery-03.jpg',
        ],
        spin_images: [
          '/static/images/product-04.jpg',
          '/static/images/gallery-02.jpg',
          '/static/images/gallery-03.jpg',
          '/static/images/product-04.jpg',
        ],
        zoom_image_url: '/static/images/product-04.jpg',
        size_guide: shoeSizeGuide,
        complete_the_look_ids: [9, 7, 5],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 3 },
          { warehouse: 'New York Flagship', stock: 2 },
          { warehouse: 'Tokyo Vault', stock: 1 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Aurelia 18K Solid Gold Venetian Chain',
        description: 'Impeccable 2.2mm Venetian box chain struck in certified 18-karat solid yellow gold. Designed in Florence with signature concealed lobster clasp and micro-engraved serial seal.',
        price: 890.0,
        image_url: '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg',
        stock_quantity: 4,
        category_id: catAccessories.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 22)),
        badge: 'FINE JEWELRY',
        fit_prediction: 'Standard 22-inch drape (sits comfortably at collarbone)',
        fit_breakdown: { runs_small: 0, true_to_size: 100, runs_large: 0 },
        variants: [
          { id: 501, sku: 'AUR-GLD-20IN', size: '20 Inch', color: '18K Yellow Gold', color_hex: '#d4af37', material: 'Solid 18K Gold', stock: 2, price_offset: -50, image_url: '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg' },
          { id: 502, sku: 'AUR-GLD-22IN', size: '22 Inch', color: '18K Yellow Gold', color_hex: '#d4af37', material: 'Solid 18K Gold', stock: 2, price_offset: 0, image_url: '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg' },
        ],
        gallery_images: [
          '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg',
          '/static/images/product-05.jpg',
        ],
        spin_images: [
          '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg',
          '/static/images/product-05.jpg',
        ],
        zoom_image_url: '/static/images/David_Yurman_Mens_Box_Chain_Necklace_in_18K_Gold_1_7mm_in_Yellow_Gold_at_Nordstrom_Size_24.jpeg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [1, 7, 6],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 2 },
          { warehouse: 'New York Flagship', stock: 1 },
          { warehouse: 'Tokyo Vault', stock: 1 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Palermo Titanium Frameless Polarized Shades',
        description: 'Ultralight Japanese titanium frame with 24K gold flash temple accents and Carl Zeiss polarized nylon lenses offering 100% UVA/UVB shield and oleophobic smudge resistance.',
        price: 320.0,
        image_url: '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg',
        stock_quantity: 11,
        category_id: catAccessories.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 25)),
        badge: 'NEW ARRIVAL',
        fit_prediction: 'Universal medium fit with adjustable silicone nose pads',
        fit_breakdown: { runs_small: 5, true_to_size: 90, runs_large: 5 },
        variants: [
          { id: 601, sku: 'PLR-SHD-GLD', size: 'One Size (54-18-145)', color: 'Brushed Gold / Smoke', color_hex: '#c5a059', material: 'Titanium & Nylon', stock: 6, price_offset: 0, image_url: '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg' },
          { id: 602, sku: 'PLR-SHD-SLV', size: 'One Size (54-18-145)', color: 'Rhodium Silver / Blue', color_hex: '#c0c0c0', material: 'Titanium & Nylon', stock: 5, price_offset: 0, image_url: '/static/images/Rimless Ombre Lens Fashion Glasses.jpeg' },
        ],
        gallery_images: [
          '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg',
          '/static/images/Rimless Ombre Lens Fashion Glasses.jpeg',
          '/static/images/Square Frame Fashion Glasses.jpeg',
        ],
        spin_images: [
          '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg',
          '/static/images/Rimless Ombre Lens Fashion Glasses.jpeg',
          '/static/images/Square Frame Fashion Glasses.jpeg',
          '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg',
        ],
        zoom_image_url: '/static/images/1pc Metal Frameless Square Clear Lens Glasses For Men, Suitable For Study, Office, Daily Wear.jpeg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [9, 1, 7],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 6 },
          { warehouse: 'New York Flagship', stock: 3 },
          { warehouse: 'Tokyo Vault', stock: 2 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'The Sovereign Calfskin Structured Satchel',
        description: 'Structured trapezoid silhouette sculpted from French box calfskin with signature turn-lock clasp in hand-polished palladium. Suede-lined with dual compartments and detachable shoulder strap.',
        price: 1250.0,
        image_url: '/static/images/product-07.jpg',
        stock_quantity: 3,
        category_id: catBags.id,
        created_at: makeDateWithStrftime(new Date(2026, 0, 28)),
        badge: 'ICONIC HEIRLOOM',
        fit_prediction: 'Dimensions: 28cm W x 22cm H x 12cm D (Fits iPad Pro & Essentials)',
        fit_breakdown: { runs_small: 0, true_to_size: 100, runs_large: 0 },
        variants: [
          { id: 701, sku: 'SOV-BAG-BLK', size: 'Medium (28cm)', color: 'Noir Caviar', color_hex: '#0a0a0a', material: 'French Box Calfskin', stock: 2, price_offset: 0, image_url: '/static/images/product-07.jpg' },
          { id: 702, sku: 'SOV-BAG-BUR', size: 'Medium (28cm)', color: 'Burgundy Grand Cru', color_hex: '#58111a', material: 'French Box Calfskin', stock: 1, price_offset: 75, image_url: '/static/images/product-07.jpg' },
        ],
        gallery_images: [
          '/static/images/product-07.jpg',
          '/static/images/item-cart-01.jpg',
          '/static/images/item-cart-02.jpg',
        ],
        spin_images: [
          '/static/images/product-07.jpg',
          '/static/images/item-cart-01.jpg',
          '/static/images/item-cart-02.jpg',
          '/static/images/product-07.jpg',
        ],
        zoom_image_url: '/static/images/product-07.jpg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [1, 5, 4],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 2 },
          { warehouse: 'New York Flagship', stock: 1 },
          { warehouse: 'Tokyo Vault', stock: 0 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Voyageur Waxed Canvas & Bridle Weekender',
        description: 'Rugged elegance crafted from 20oz Scottish paraffin-waxed cotton canvas trimmed with English vegetable-tanned bridle leather. Solid brass YKK Excella zippers and reinforced base feet.',
        price: 490.0,
        image_url: '/static/images/product-08.jpg',
        stock_quantity: 8,
        category_id: catBags.id,
        created_at: makeDateWithStrftime(new Date(2026, 1, 2)),
        badge: 'HERITAGE VOYAGE',
        fit_prediction: 'Cabin carry-on compliant: 52cm x 30cm x 26cm (42L volume)',
        fit_breakdown: { runs_small: 0, true_to_size: 95, runs_large: 5 },
        variants: [
          { id: 801, sku: 'VYG-WKD-OLV', size: '42L Travel Size', color: 'Savile Olive / Tan', color_hex: '#4b5320', material: 'Waxed Canvas & Bridle Leather', stock: 5, price_offset: 0, image_url: '/static/images/product-08.jpg' },
          { id: 802, sku: 'VYG-WKD-NVY', size: '42L Travel Size', color: 'Maritime Navy / Chestnut', color_hex: '#1a2436', material: 'Waxed Canvas & Bridle Leather', stock: 3, price_offset: 0, image_url: '/static/images/product-08.jpg' },
        ],
        gallery_images: [
          '/static/images/product-08.jpg',
          '/static/images/banner-03.jpg',
          '/static/images/banner-04.jpg',
        ],
        spin_images: [
          '/static/images/product-08.jpg',
          '/static/images/banner-03.jpg',
          '/static/images/banner-04.jpg',
          '/static/images/product-08.jpg',
        ],
        zoom_image_url: '/static/images/product-08.jpg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [9, 3, 10],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 4 },
          { warehouse: 'New York Flagship', stock: 3 },
          { warehouse: 'Tokyo Vault', stock: 1 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'San Lorenzo Heritage Lambskin Biker Jacket',
        description: 'Supple full-grain Italian nappa lambskin with heavy gauge asymmetric nickel hardware, quilted kidney protection, and cupro silk lining. Built to develop a singular patina.',
        price: 890.0,
        image_url: '/static/images/retro_jacket.jpeg',
        stock_quantity: 0, // SOLD OUT / PRE-ORDER
        category_id: catClothing.id,
        created_at: makeDateWithStrftime(new Date(2026, 1, 5)),
        badge: 'PRE-ORDER DROP',
        is_preorder: true,
        preorder_date: 'November 28, 2026',
        fit_prediction: 'Slim tailored biker fit (order one size up if layering heavy knitwear)',
        fit_breakdown: { runs_small: 30, true_to_size: 70, runs_large: 0 },
        variants: [
          { id: 901, sku: 'SLZ-BKR-BLK-S', size: 'S', color: 'Deep Vintage Black', color_hex: '#141414', material: 'Italian Nappa Lambskin', stock: 0, price_offset: 0, image_url: '/static/images/retro_jacket.jpeg' },
          { id: 902, sku: 'SLZ-BKR-BLK-M', size: 'M', color: 'Deep Vintage Black', color_hex: '#141414', material: 'Italian Nappa Lambskin', stock: 0, price_offset: 0, image_url: '/static/images/retro_jacket.jpeg' },
          { id: 903, sku: 'SLZ-BKR-BLK-L', size: 'L', color: 'Deep Vintage Black', color_hex: '#141414', material: 'Italian Nappa Lambskin', stock: 0, price_offset: 0, image_url: '/static/images/retro_jacket.jpeg' },
        ],
        gallery_images: [
          '/static/images/retro_jacket.jpeg',
          '/static/images/Landscap_Men Leather Motorcycle Jacket Hoodie Zipper Fashion.jpeg',
        ],
        spin_images: [
          '/static/images/retro_jacket.jpeg',
          '/static/images/Landscap_Men Leather Motorcycle Jacket Hoodie Zipper Fashion.jpeg',
          '/static/images/retro_jacket.jpeg',
        ],
        zoom_image_url: '/static/images/retro_jacket.jpeg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [4, 6, 8],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 0 },
          { warehouse: 'New York Flagship', stock: 0 },
          { warehouse: 'Tokyo Vault', stock: 0 },
        ],
      },
      {
        id: this.nextProductId++,
        name: 'Chrono-Atelier Horizon GMT Connected Watch',
        description: 'High-grade 316L aerospace steel case housing a sapphire crystal touch interface. Dual Swiss mechanical hands paired with micro-OLED world time zone and biometrics.',
        price: 580.0,
        image_url: '/static/images/oraimoWatch.jpg',
        stock_quantity: 9,
        category_id: catAccessories.id,
        created_at: makeDateWithStrftime(new Date(2026, 1, 8)),
        badge: 'HAUTE HORLOGERIE',
        fit_prediction: '41mm case diameter, 20mm interchangeable Horween leather strap',
        fit_breakdown: { runs_small: 0, true_to_size: 95, runs_large: 5 },
        variants: [
          { id: 1001, sku: 'CHR-GMT-STL', size: '41mm Case', color: 'Brushed Steel / Midnight', color_hex: '#708090', material: '316L Stainless Steel & Horween Leather', stock: 5, price_offset: 0, image_url: '/static/images/oraimoWatch.jpg' },
          { id: 1002, sku: 'CHR-GMT-GLD', size: '41mm Case', color: 'Rose Gold PVD / Espresso', color_hex: '#b76e79', material: 'Rose Gold PVD & Crocodile-Embossed Leather', stock: 4, price_offset: 60, image_url: '/static/images/oraimoWatch.jpg' },
        ],
        gallery_images: [
          '/static/images/oraimoWatch.jpg',
          '/static/images/gallery-05.jpg',
          '/static/images/gallery-06.jpg',
        ],
        spin_images: [
          '/static/images/oraimoWatch.jpg',
          '/static/images/gallery-05.jpg',
          '/static/images/gallery-06.jpg',
          '/static/images/oraimoWatch.jpg',
        ],
        zoom_image_url: '/static/images/oraimoWatch.jpg',
        size_guide: standardSizeGuide,
        complete_the_look_ids: [5, 6, 8],
        warehouses: [
          { warehouse: 'Paris Atelier', stock: 4 },
          { warehouse: 'New York Flagship', stock: 3 },
          { warehouse: 'Tokyo Vault', stock: 2 },
        ],
      },
    ];

    // Seed Reviews with Rich Customer UGC, Fit specs, and verified marks
    this.reviews = [
      {
        id: this.nextReviewId++,
        product_id: 1,
        user_id: 2,
        user: { username: 'Elena Rostova' },
        rating: 5,
        comment: 'Wore this to the Vienna Philharmonic Gala. The drape of the Mulberry silk is heavenly and caught every reflection in the ballroom. Exceptional haute couture level craftsmanship.',
        created_at: makeDateWithStrftime(new Date(2026, 1, 18)),
        verified_buyer: true,
        fit_rating: 'True to size',
        customer_height: '5 ft 8 in (173 cm)',
        customer_weight: '128 lbs (58 kg)',
        purchased_size: 'S · Noir Onyx',
        photos: ['/static/images/product-detail-01.jpg', '/static/images/product-detail-02.jpg'],
        helpful_count: 38,
      },
      {
        id: this.nextReviewId++,
        product_id: 1,
        user_id: 1,
        user: { username: 'Camille Dubois' },
        rating: 5,
        comment: 'Worth every penny. The boning in the corset holds securely without constricting. Packaging arrived with an embossed velvet garment bag and cedar hanger.',
        created_at: makeDateWithStrftime(new Date(2026, 1, 24)),
        verified_buyer: true,
        fit_rating: 'True to size',
        customer_height: '5 ft 6 in (168 cm)',
        customer_weight: '122 lbs (55 kg)',
        purchased_size: 'XS · Noir Onyx',
        helpful_count: 19,
      },
      {
        id: this.nextReviewId++,
        product_id: 4,
        user_id: 2,
        user: { username: 'Julian Sterling' },
        rating: 5,
        comment: 'The patina on these Vittorio boots looks even richer in natural sunlight. Took about two days to break in and now they feel like custom bespoke footwear.',
        created_at: makeDateWithStrftime(new Date(2026, 2, 2)),
        verified_buyer: true,
        fit_rating: 'True to size',
        customer_height: '6 ft 1 in (185 cm)',
        customer_weight: '175 lbs (79 kg)',
        purchased_size: '41 EU · Espresso Patina',
        photos: ['/static/images/gallery-02.jpg'],
        helpful_count: 24,
      },
      {
        id: this.nextReviewId++,
        product_id: 7,
        user_id: 2,
        user: { username: 'Sophie Van Der Bilt' },
        rating: 5,
        comment: 'A true investment piece comparable to premier houses on Rue du Faubourg Saint-Honoré. The box calfskin has zero imperfections and the turn-lock action is buttery smooth.',
        created_at: makeDateWithStrftime(new Date(2026, 2, 8)),
        verified_buyer: true,
        fit_rating: 'True to size',
        purchased_size: 'Medium (28cm) · Noir Caviar',
        photos: ['/static/images/item-cart-01.jpg'],
        helpful_count: 41,
      },
    ];

    // Seed Past Orders with Tracking Milestones & Multi-Carrier Data
    const order1: Order = {
      id: this.nextOrderId++,
      user_id: 2,
      customer_name: 'Elena Rostova',
      customer_email: 'elena.rostova@paris-style.fr',
      customer_phone: '+33 6 42 19 88 01',
      total: 1250.0,
      subtotal: 1250.0,
      discount_amount: 0,
      gift_wrapped: true,
      gift_message: 'To Elena, with love from Zurich.',
      tax_amount: 0,
      shipping_cost: 0,
      shipping_carrier: 'FedEx Priority',
      tracking_number: 'VEL-882910-FX',
      tracking_milestones: [
        { status: 'Order Confirmed & Payment Verified', location: 'Atelier Velora Paris', timestamp: 'Oct 08, 09:15 AM', done: true },
        { status: 'White-Glove Inspection & Gift Packaging', location: 'Central Vault, Paris', timestamp: 'Oct 08, 02:40 PM', done: true },
        { status: 'Dispatched with Carrier', location: 'Charles de Gaulle Hub, France', timestamp: 'Oct 09, 06:10 AM', done: true },
        { status: 'In Transit — Customs Cleared', location: 'Zurich Airport Logistics Centre', timestamp: 'Oct 10, 11:30 AM', done: true },
        { status: 'Out for Courier Delivery', location: 'Zurich Post 8001', timestamp: 'Oct 11, 08:20 AM', done: true },
        { status: 'Delivered — Signed by Recipient', location: 'Bahnhofstrasse 44, Zurich', timestamp: 'Oct 11, 01:14 PM', done: true },
      ],
      status: 'delivered',
      payment_method: 'Stripe Luxury Card (•••• 4242)',
      shipping_address: {
        street: 'Bahnhofstrasse 44',
        city: 'Zurich',
        country: 'Switzerland',
        postal: '8001',
      },
      currency: 'EUR',
      created_at: makeDateWithStrftime(new Date(2026, 9, 8)),
    };
    this.orders.push(order1);

    this.orderItems.push({
      id: this.nextOrderItemId++,
      order_id: order1.id,
      product_id: 7,
      quantity: 1,
      price: 1250.0,
      variant_sku: 'SOV-BAG-BLK',
      selected_size: 'Medium (28cm)',
      selected_color: 'Noir Caviar',
    });

    const order2: Order = {
      id: this.nextOrderId++,
      user_id: 2,
      customer_name: 'Elena Rostova',
      customer_email: 'elena.rostova@paris-style.fr',
      customer_phone: '+33 6 42 19 88 01',
      total: 389.0,
      subtotal: 389.0,
      discount_amount: 58.35,
      promo_code: 'VELORA15',
      gift_wrapped: false,
      tax_amount: 28.1,
      shipping_cost: 0,
      shipping_carrier: 'DHL Express',
      tracking_number: 'VEL-994321-DHL',
      tracking_milestones: [
        { status: 'Order Confirmed', location: 'Atelier Velora Paris', timestamp: 'Oct 12, 10:20 AM', done: true },
        { status: 'Handcrafted & Packed', location: 'Central Vault, Paris', timestamp: 'Oct 12, 03:00 PM', done: true },
        { status: 'Dispatched via DHL Air Hub', location: 'Paris Roissy Hub', timestamp: 'Oct 13, 07:45 AM', done: true },
        { status: 'In Transit — Inbound Flight', location: 'London Heathrow Gateway', timestamp: 'Oct 13, 04:15 PM', done: false },
        { status: 'Out for White-Glove Delivery', location: 'Mayfair Delivery Depot, London', timestamp: 'Scheduled Oct 14', done: false },
      ],
      status: 'shipped',
      payment_method: 'Apple Pay',
      shipping_address: {
        street: '14 Berkeley Square',
        city: 'London',
        country: 'United Kingdom',
        postal: 'W1J 6BL',
      },
      currency: 'GBP',
      created_at: makeDateWithStrftime(new Date(2026, 9, 12)),
    };
    this.orders.push(order2);

    this.orderItems.push({
      id: this.nextOrderItemId++,
      order_id: order2.id,
      product_id: 1,
      quantity: 1,
      price: 389.0,
      variant_sku: 'ARIA-PL-BLK-S',
      selected_size: 'S',
      selected_color: 'Noir Onyx',
    });

    // Seed Wishlist for User 2
    this.wishlist.push({ id: 1, user_id: 2, product_id: 4, created_at: makeDateWithStrftime(new Date()) });
    this.wishlist.push({ id: 2, user_id: 2, product_id: 5, created_at: makeDateWithStrftime(new Date()) });

    // Seed Return Requests
    this.returns.push({
      id: this.nextReturnId++,
      order_id: order1.id,
      user_id: 2,
      product_name: 'The Sovereign Calfskin Structured Satchel',
      reason: 'Exchange for Noir Caviar with Gold Hardware',
      type: 'size_exchange',
      status: 'Approved',
      return_label_code: 'RET-VEL-882910-DHL',
      created_at: makeDateWithStrftime(new Date(2026, 9, 12)),
    });

    // Seed Abandoned Carts for Admin Recovery
    this.abandonedCarts.push(
      {
        id: 1,
        email: 'marcus.vane@manhattan-cap.com',
        items_summary: 'San Lorenzo Heritage Lambskin Biker Jacket (M)',
        cart_total: 890.0,
        time_ago: '4 hours ago',
        recovered: false,
      },
      {
        id: 2,
        email: 'isabella.fontana@milano-moda.it',
        items_summary: 'Aurelia 18K Venetian Chain (22") + Palermo Shades',
        cart_total: 1210.0,
        time_ago: '18 hours ago',
        recovered: false,
      },
      {
        id: 3,
        email: 'hannah.schmidt@berlin-gallery.de',
        items_summary: 'Aria Silk Pleated Evening Gown (Ivory / S)',
        cart_total: 409.0,
        time_ago: '1 day ago',
        recovered: true,
      }
    );
  }

  // Populate Helpers
  populateProduct(product: Product): Product {
    const category = this.categories.find((c) => c.id === product.category_id);
    const reviews = this.reviews.filter((r) => r.product_id === product.id);
    const complete_the_look_products = (product.complete_the_look_ids || [])
      .map((id) => this.products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    return {
      ...product,
      category,
      reviews,
      complete_the_look_products,
    };
  }

  populateOrder(order: Order): Order {
    const rawItems = this.orderItems.filter((item) => item.order_id === order.id);
    const items = rawItems.map((item) => {
      const product = this.products.find((p) => p.id === item.product_id);
      return {
        ...item,
        product: product ? this.populateProduct(product) : undefined,
      };
    });
    return {
      ...order,
      items,
    };
  }

  getUserVIP(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    const points = user ? user.vip_points : 0;

    let tier: 'Bronze' | 'Silver' | 'Gold' | 'Noir' = 'Bronze';
    let nextTierPoints = 500;
    let perks: string[] = ['Complimentary Standard Shipping', 'Points accrual on all luxury pieces'];

    if (points >= 3500) {
      tier = 'Noir';
      nextTierPoints = 5000;
      perks = [
        'Private Salon & Runway Pre-Order Access',
        'Personal Atelier Stylist Concierge 24/7',
        'Complimentary Global White-Glove Hand Courier',
        'Bespoke Monogramming & Custom Alterations',
        '20% Annual Birthday Privilège Voucher',
      ];
    } else if (points >= 1500) {
      tier = 'Gold';
      nextTierPoints = 3500;
      perks = [
        'Complimentary Express Priority Shipping',
        'Early 48-Hour Seasonal Drop Previews',
        'Priority Concierge Response Queue',
        'Complimentary Luxury Gift Wrapping on All Orders',
      ];
    } else if (points >= 500) {
      tier = 'Silver';
      nextTierPoints = 1500;
      perks = [
        'Complimentary Express Shipping on Orders > $150',
        '10% Welcome Bonus on Next Purchase',
        'Extended 45-Day Atelier Returns',
      ];
    }

    const tierMin = tier === 'Noir' ? 3500 : tier === 'Gold' ? 1500 : tier === 'Silver' ? 500 : 0;
    const progressPercent = Math.min(100, Math.round(((points - tierMin) / (nextTierPoints - tierMin)) * 100));

    return {
      points,
      tier,
      nextTierPoints,
      progressPercent,
      perks,
    };
  }

  createOrder(
    userId: number,
    items: { productId: number; quantity: number; variantSku?: string; size?: string; color?: string }[],
    options: {
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      shippingAddress?: { street: string; city: string; state?: string; country: string; postal: string };
      promoCode?: string;
      giftWrapped?: boolean;
      giftMessage?: string;
      paymentMethod?: string;
      currency?: CurrencyCode;
    } = {}
  ): { order: Order; items: OrderItem[]; total: number } {
    let subtotal = 0;
    const currency = options.currency || 'USD';

    // Calculate subtotal
    for (const item of items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        let price = prod.price;
        if (item.variantSku) {
          const v = prod.variants.find((v) => v.sku === item.variantSku);
          if (v) price += v.price_offset;
        }
        subtotal += price * item.quantity;
      }
    }

    // Apply promo code
    let discountAmount = 0;
    if (options.promoCode) {
      const promo = this.promos.find((p) => p.code.toUpperCase() === options.promoCode?.toUpperCase() && p.is_active);
      if (promo && subtotal >= promo.min_spend) {
        if (promo.type === 'percentage') {
          discountAmount = (subtotal * promo.value) / 100;
        } else if (promo.type === 'fixed') {
          discountAmount = Math.min(subtotal, promo.value);
        }
        promo.usage_count++;
      }
    }

    // Gift wrap fee
    const giftWrapFee = options.giftWrapped ? 15.0 : 0;

    // Shipping calculation (free over $150 or if promo applies)
    const isFreeShipping = subtotal >= 150 || options.promoCode?.toUpperCase() === 'FREESHIP';
    const shippingCost = isFreeShipping ? 0 : 25.0;

    // Tax calculation
    const taxRate = options.shippingAddress?.country?.toLowerCase() === 'united kingdom' ? 0.2 : 0.08;
    const taxAmount = (subtotal - discountAmount) * taxRate;

    const total = Math.max(0, subtotal - discountAmount + giftWrapFee + shippingCost + taxAmount);

    // Random carrier and tracking
    const carriers: ('FedEx Priority' | 'DHL Express' | 'UPS Worldwide')[] = ['FedEx Priority', 'DHL Express', 'UPS Worldwide'];
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const trackingCode = `VEL-${Math.floor(100000 + Math.random() * 900000)}-${carrier.substring(0, 3).toUpperCase()}`;

    const newOrder: Order = {
      id: this.nextOrderId++,
      user_id: userId,
      customer_name: options.customerName || (userId === 1 ? 'Administrator' : 'Luxury Client'),
      customer_email: options.customerEmail || 'client@velora-couture.com',
      customer_phone: options.customerPhone || '+1 (555) 019-2834',
      subtotal,
      discount_amount: discountAmount,
      promo_code: options.promoCode,
      gift_wrapped: Boolean(options.giftWrapped),
      gift_message: options.giftMessage,
      tax_amount: taxAmount,
      shipping_cost: shippingCost,
      shipping_carrier: carrier,
      tracking_number: trackingCode,
      tracking_milestones: [
        { status: 'Order Placed & Payment Authorized', location: 'Atelier Velora', timestamp: 'Just now', done: true },
        { status: 'Atelier Packaging & Quality Certificate Preparation', location: 'Central Vault', timestamp: 'In progress', done: true },
        { status: 'Handed to Express Courier Dispatch', location: 'Paris Hub', timestamp: 'Estimated in 24 hours', done: false },
        { status: 'Air Transit & Regional Clearance', location: 'International Gateway', timestamp: 'Estimated in 48 hours', done: false },
        { status: 'Final Delivery to Destination', location: options.shippingAddress?.city || 'Local Atelier', timestamp: 'Estimated 2-3 business days', done: false },
      ],
      total,
      status: 'paid',
      payment_method: options.paymentMethod || 'Credit / Debit Card (Stripe Secured)',
      shipping_address: options.shippingAddress || {
        street: '740 Park Avenue',
        city: 'New York',
        country: 'United States',
        postal: '10021',
      },
      currency,
      created_at: makeDateWithStrftime(new Date()),
    };

    this.orders.push(newOrder);

    // Award VIP Points (1 point per dollar spent)
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.vip_points += Math.round(total);
    }

    const orderItemsList: OrderItem[] = [];
    for (const item of items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        let price = prod.price;
        if (item.variantSku) {
          const v = prod.variants.find((v) => v.sku === item.variantSku);
          if (v) price += v.price_offset;
        }
        const oi: OrderItem = {
          id: this.nextOrderItemId++,
          order_id: newOrder.id,
          product_id: prod.id,
          quantity: item.quantity,
          price,
          variant_sku: item.variantSku,
          selected_size: item.size || 'Standard',
          selected_color: item.color || 'Standard',
        };
        this.orderItems.push(oi);
        orderItemsList.push(oi);

        // Deduct inventory
        prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
      }
    }

    return {
      order: this.populateOrder(newOrder),
      items: orderItemsList,
      total,
    };
  }

  processPayment(
    orderId: number,
    provider: string,
    details?: { phone?: string; cardLast4?: string; bnplPlan?: string }
  ): { success: boolean; reference: string; message: string } {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, reference: '', message: 'Order not found' };

    const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const reference = `${provider.toUpperCase()}-${transactionId}`;

    order.status = 'paid';
    this.transactions.push({
      id: this.nextTransactionId++,
      order_id: order.id,
      provider,
      reference,
      status: 'paid',
      amount: order.total,
      currency: order.currency,
      created_at: makeDateWithStrftime(new Date()),
    });

    return {
      success: true,
      reference,
      message: `Payment authorized via ${provider.toUpperCase()}. Order confirmed with White-Glove delivery.`,
    };
  }

  addProduct(data: Partial<Product>) {
    const standardSizeGuide: SizeGuideRow[] = [
      { size: 'XS', us: '0-2', uk: '4-6', eu: '32-34', chest_cm: 82, chest_in: 32.3, waist_cm: 64, waist_in: 25.2, hip_cm: 88, hip_in: 34.6 },
      { size: 'S', us: '4-6', uk: '8-10', eu: '36-38', chest_cm: 87, chest_in: 34.3, waist_cm: 69, waist_in: 27.2, hip_cm: 93, hip_in: 36.6 },
      { size: 'M', us: '8-10', uk: '12-14', eu: '40-42', chest_cm: 92, chest_in: 36.2, waist_cm: 74, waist_in: 29.1, hip_cm: 98, hip_in: 38.6 },
      { size: 'L', us: '12-14', uk: '16-18', eu: '44-46', chest_cm: 98, chest_in: 38.6, waist_cm: 80, waist_in: 31.5, hip_cm: 104, hip_in: 40.9 },
      { size: 'XL', us: '16', uk: '20', eu: '48', chest_cm: 104, chest_in: 40.9, waist_cm: 86, waist_in: 33.9, hip_cm: 110, hip_in: 43.3 },
    ];

    const newProd: Product = {
      id: this.nextProductId++,
      name: data.name || 'Untitled Piece',
      description: data.description || '',
      price: data.price || 0,
      image_url: data.image_url || '/static/images/product-01.jpg',
      stock_quantity: data.stock_quantity ?? 10,
      category_id: data.category_id || 1,
      created_at: makeDateWithStrftime(new Date()),
      badge: data.badge || 'NEW SEASON',
      fit_prediction: data.fit_prediction || 'True to luxury size',
      fit_breakdown: { runs_small: 10, true_to_size: 85, runs_large: 5 },
      variants: [
        {
          id: Date.now(),
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          size: 'M',
          color: 'Noir Atelier',
          color_hex: '#111111',
          material: 'Artisan Finish',
          stock: data.stock_quantity ?? 10,
          price_offset: 0,
          image_url: data.image_url || '/static/images/product-01.jpg',
        },
      ],
      gallery_images: [data.image_url || '/static/images/product-01.jpg'],
      spin_images: [data.image_url || '/static/images/product-01.jpg'],
      zoom_image_url: data.image_url || '/static/images/product-01.jpg',
      size_guide: standardSizeGuide,
      complete_the_look_ids: [1, 2],
      warehouses: [
        { warehouse: 'Paris Atelier', stock: data.stock_quantity ?? 10 },
        { warehouse: 'New York Flagship', stock: 0 },
        { warehouse: 'Tokyo Vault', stock: 0 },
      ],
    };
    this.products.push(newProd);
    return newProd;
  }

  updateProduct(id: number, data: Partial<Product>) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...data };
      return this.products[idx];
    }
    return null;
  }

  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  addCategory(name: string) {
    const newCat = {
      id: this.nextCategoryId++,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    };
    this.categories.push(newCat);
    return newCat;
  }
}

export const db = new StoreDB();
