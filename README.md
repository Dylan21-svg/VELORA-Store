# Velora Store - Premium E-commerce Website

A modern, premium e-commerce website built with Flask, inspired by Coza Store but with unique features including dynamic theming and smooth animations.

## Features

- **Dynamic Theme System**: Primary colors change every 30 seconds through a predefined palette
- **Hero Section Animation**: Auto-sliding hero images with parallax effects and floating animations
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Management**: Full CRUD operations for products and categories
- **Shopping Cart**: Session-based cart functionality
- **Order Management**: Complete order processing and status tracking
- **Admin Dashboard**: Comprehensive admin panel with statistics and controls
- **User Authentication**: Secure login and registration system

## Tech Stack

- **Backend**: Python Flask
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Authentication**: Flask-Login

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Access the website at `http://localhost:5000`

## Admin Access

- Username: `admin`
- Password: `VeloraAdmin2026!@#Secure`
- URL: `http://localhost:5000/admin?key=velora2026`

## Project Structure

```
ecommerce_app/
├── app.py                 # Main Flask application
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── routes/
│   ├── main.py          # Main routes (shop, cart, etc.)
│   ├── auth.py          # Authentication routes
│   └── admin.py         # Admin panel routes
├── templates/
│   ├── base.html        # Base template
│   ├── index.html       # Home page
│   ├── shop.html        # Product listing
│   ├── product.html     # Product detail
│   ├── cart.html        # Shopping cart
│   ├── checkout.html    # Checkout page
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   └── admin/
│       ├── dashboard.html
│       ├── products.html
│       ├── add_product.html
│       ├── edit_product.html
│       └── orders.html
├── static/
│   ├── css/
│   │   └── style.css    # Custom styles and theme variables
│   ├── js/
│   │   ├── theme.js     # Dynamic theme switching
│   │   └── animations.js # Animations and interactions
│   └── images/          # Product and hero images
└── database.db          # SQLite database
```

## Key Features Implementation

### Dynamic Theming
- CSS custom properties for theme colors
- JavaScript timer to cycle through color palette every 30 seconds
- Smooth transitions using CSS transitions

### Hero Section
- Multiple background images with auto-sliding
- Parallax scrolling effect
- Floating animation for content

### Animations
- Product card hover effects
- Intersection Observer for scroll-triggered animations
- Smooth page transitions

### Admin Panel
- Product CRUD with image upload
- Category management
- Order status updates
- Dashboard statistics

## Customization

### Adding Hero Images
Place hero images in `static/images/` as `hero1.jpg`, `hero2.jpg`, `hero3.jpg`

### Modifying Color Palette
Edit the `colors` array in `static/js/theme.js`

### Adjusting Theme Timing
Change the interval in `setInterval(changeThemeColor, 30000)` (30000ms = 30 seconds)

## License

This project is for educational purposes.