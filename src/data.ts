import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password: string; // bcrypt hash
  is_admin: boolean;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user: { username: string };
  rating: number;
  comment: string;
  created_at: Date;
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
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
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

  private nextUserId = 1;
  private nextCategoryId = 1;
  private nextProductId = 1;
  private nextReviewId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;
  private nextWishlistId = 1;
  private nextTransactionId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    // Admin user
    const adminPassHash = bcrypt.hashSync('VeloraAdmin2026!@#Secure', 10);
    this.users.push({
      id: this.nextUserId++,
      username: 'admin',
      password: adminPassHash,
      is_admin: true,
      created_at: makeDateWithStrftime(new Date(2026, 0, 1)),
    });

    // Sample categories
    const catClothing = { id: this.nextCategoryId++, name: 'Clothing' };
    const catShoes = { id: this.nextCategoryId++, name: 'Shoes' };
    const catAccessories = { id: this.nextCategoryId++, name: 'Accessories' };
    const catBags = { id: this.nextCategoryId++, name: 'Bags' };

    this.categories.push(catClothing, catShoes, catAccessories, catBags);

    // Sample products
    const initialProducts = [
      {
        name: 'Elegant Dress',
        description: 'A beautiful evening dress crafted with fine attention to detail, perfect for special occasions.',
        price: 89.99,
        image_url: '/static/images/product-01.jpg',
        category_id: catClothing.id,
        stock_quantity: 10,
      },
      {
        name: 'Casual T-Shirt',
        description: 'Comfortable 100% organic cotton t-shirt with modern tailoring for everyday wear.',
        price: 29.99,
        image_url: '/static/images/product-02.jpg',
        category_id: catClothing.id,
        stock_quantity: 50,
      },
      {
        name: 'Running Shoes',
        description: 'High-performance running shoes designed for ultimate comfort, cushioning, and responsive energy return.',
        price: 129.99,
        image_url: '/static/images/product-03.jpg',
        category_id: catShoes.id,
        stock_quantity: 15,
      },
      {
        name: 'Leather Boots',
        description: 'Classic leather boots with durable lug soles, waterproof treatment, and premium craftsmanship.',
        price: 199.99,
        image_url: '/static/images/product-04.jpg',
        category_id: catShoes.id,
        stock_quantity: 8,
      },
      {
        name: 'Gold Necklace',
        description: 'Elegant gold necklace with minimalist chain design and 18K luster.',
        price: 149.99,
        image_url: '/static/images/product-05.jpg',
        category_id: catAccessories.id,
        stock_quantity: 5,
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish sunglasses with UV400 polarized protective lenses and sleek frameless accents.',
        price: 79.99,
        image_url: '/static/images/product-06.jpg',
        category_id: catAccessories.id,
        stock_quantity: 20,
      },
      {
        name: 'Leather Handbag',
        description: 'Premium Italian full-grain leather handbag with gold hardware and multiple storage compartments.',
        price: 249.99,
        image_url: '/static/images/product-07.jpg',
        category_id: catBags.id,
        stock_quantity: 3,
      },
      {
        name: 'Backpack',
        description: 'Durable canvas backpack with padded laptop sleeve, water-resistant exterior, and ergonomic straps.',
        price: 59.99,
        image_url: '/static/images/product-08.jpg',
        category_id: catBags.id,
        stock_quantity: 25,
      },
      {
        name: 'Leather Motorcycle Jacket',
        description: 'Timeless retro leather motorcycle jacket with metallic zips and quilted shoulders.',
        price: 289.99,
        image_url: '/static/images/retro_jacket.jpeg',
        category_id: catClothing.id,
        stock_quantity: 7,
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Next-generation fitness watch with high-definition AMOLED display and heart rate tracking.',
        price: 119.99,
        image_url: '/static/images/oraimoWatch.jpg',
        category_id: catAccessories.id,
        stock_quantity: 18,
      },
      {
        name: 'Retro Athletic Sneakers',
        description: 'Iconic heritage street sneakers with lightweight foam and breathable textile upper.',
        price: 139.99,
        image_url: '/static/images/Mens_Adidas_Ultra_Boost_Light_White_Sneakers_in_Core_Black_Crystal_White.jpeg',
        category_id: catShoes.id,
        stock_quantity: 12,
      },
      {
        name: 'Vintage Tinted Shades',
        description: 'Classic vintage square frame shades with gradient lenses suitable for daily wear.',
        price: 49.99,
        image_url: '/static/images/Trendy Men Square Frame Tinted Lens Fashion Glasses Shades Fit For Outdoor, Vacation Vintage Shades Accessories.jpeg',
        category_id: catAccessories.id,
        stock_quantity: 14,
      },
    ];

    for (const p of initialProducts) {
      this.products.push({
        id: this.nextProductId++,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.image_url,
        stock_quantity: p.stock_quantity,
        category_id: p.category_id,
        created_at: makeDateWithStrftime(new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000))),
      });
    }

    // Sample reviews
    this.reviews.push({
      id: this.nextReviewId++,
      product_id: 1,
      user_id: 1,
      user: { username: 'Sophia L.' },
      rating: 5,
      comment: 'Absolutely stunning dress! Fits true to size and the quality is extraordinary.',
      created_at: makeDateWithStrftime(new Date(2026, 1, 10)),
    });
    this.reviews.push({
      id: this.nextReviewId++,
      product_id: 3,
      user_id: 1,
      user: { username: 'Marcus K.' },
      rating: 5,
      comment: 'Super lightweight and great support for long runs. Very pleased!',
      created_at: makeDateWithStrftime(new Date(2026, 1, 12)),
    });

    // Sample order
    const sampleOrder: Order = {
      id: this.nextOrderId++,
      user_id: 1,
      total: 119.98,
      status: 'paid',
      created_at: makeDateWithStrftime(new Date(2026, 1, 14, 14, 30)),
    };
    this.orders.push(sampleOrder);
    this.orderItems.push({
      id: this.nextOrderItemId++,
      order_id: sampleOrder.id,
      product_id: 1,
      quantity: 1,
      price: 89.99,
    });
    this.orderItems.push({
      id: this.nextOrderItemId++,
      order_id: sampleOrder.id,
      product_id: 2,
      quantity: 1,
      price: 29.99,
    });
  }

  // Populate helper
  populateProduct(product: Product): Product {
    const category = this.categories.find((c) => c.id === product.category_id);
    const reviews = this.reviews.filter((r) => r.product_id === product.id);
    return {
      ...product,
      category,
      reviews,
      created_at: makeDateWithStrftime(new Date(product.created_at)),
    };
  }

  populateOrder(order: Order): Order {
    const items = this.orderItems
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        ...item,
        product: this.products.find((p) => p.id === item.product_id),
      }));
    return {
      ...order,
      items,
      created_at: makeDateWithStrftime(new Date(order.created_at)),
    };
  }

  addProduct(data: Omit<Product, 'id' | 'created_at'>): Product {
    const newProduct: Product = {
      id: this.nextProductId++,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image_url: data.image_url,
      stock_quantity: Number(data.stock_quantity),
      category_id: Number(data.category_id),
      created_at: makeDateWithStrftime(new Date()),
    };
    this.products.push(newProduct);
    return this.populateProduct(newProduct);
  }

  updateProduct(id: number, data: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...data,
      price: data.price !== undefined ? Number(data.price) : this.products[index].price,
      stock_quantity: data.stock_quantity !== undefined ? Number(data.stock_quantity) : this.products[index].stock_quantity,
      category_id: data.category_id !== undefined ? Number(data.category_id) : this.products[index].category_id,
    };
    return this.populateProduct(this.products[index]);
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  addCategory(name: string): Category {
    const cat = { id: this.nextCategoryId++, name };
    this.categories.push(cat);
    return cat;
  }

  createOrder(userId: number, items: { productId: number; quantity: number }[]): { order: Order; items: OrderItem[]; total: number } {
    let total = 0;
    const createdOrder: Order = {
      id: this.nextOrderId++,
      user_id: userId,
      total: 0,
      status: 'pending',
      created_at: makeDateWithStrftime(new Date()),
    };
    this.orders.push(createdOrder);

    const orderItemsList: OrderItem[] = [];
    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      if (product) {
        const orderItem: OrderItem = {
          id: this.nextOrderItemId++,
          order_id: createdOrder.id,
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
        };
        this.orderItems.push(orderItem);
        orderItemsList.push(orderItem);
        total += product.price * item.quantity;
      }
    }
    createdOrder.total = total;
    return { order: this.populateOrder(createdOrder), items: orderItemsList, total };
  }

  processPayment(orderId: number, provider: string, phone?: string): { success: boolean; reference: string; message: string } {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, reference: '', message: 'Order not found' };

    const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();

    if (provider === 'paypal') {
      const reference = `PAYPAL-${transactionId}`;
      order.status = 'paid';
      this.transactions.push({
        id: this.nextTransactionId++,
        order_id: order.id,
        provider: 'paypal',
        reference,
        status: 'paid',
        amount: order.total,
        currency: 'USD',
        created_at: makeDateWithStrftime(new Date()),
      });
      // Deduct stock
      const items = this.orderItems.filter((i) => i.order_id === order.id);
      for (const it of items) {
        const prod = this.products.find((p) => p.id === it.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - it.quantity);
        }
      }
      return { success: true, reference, message: 'Payment processed successfully via PayPal!' };
    } else if (provider === 'mtn' || provider === 'orange') {
      if (!phone) {
        return { success: false, reference: '', message: 'Phone number is required for Mobile Money' };
      }
      const prefix = provider === 'mtn' ? 'MTN' : 'OM';
      const reference = `${prefix}-${transactionId}`;
      order.status = 'paid';
      this.transactions.push({
        id: this.nextTransactionId++,
        order_id: order.id,
        provider,
        reference,
        status: 'paid',
        amount: order.total,
        currency: 'XAF',
        created_at: makeDateWithStrftime(new Date()),
      });
      // Deduct stock
      const items = this.orderItems.filter((i) => i.order_id === order.id);
      for (const it of items) {
        const prod = this.products.find((p) => p.id === it.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - it.quantity);
        }
      }
      return {
        success: true,
        reference,
        message: `Payment request verified for ${phone}. Order confirmed!`,
      };
    }

    return { success: false, reference: '', message: 'Invalid payment provider' };
  }
}

export const db = new StoreDB();
