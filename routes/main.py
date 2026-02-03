from flask import render_template, request, redirect, url_for, flash, session, jsonify
from app import app, db
from models import Product, Category, Order, OrderItem
from flask_login import login_required, current_user

@app.route('/')
def index():
    products = Product.query.limit(8).all()
    return render_template('index.html', products=products)

@app.route('/shop')
def shop():
    category = request.args.get('category')
    if category:
        products = Product.query.filter_by(category_id=category).all()
    else:
        products = Product.query.all()
    categories = Category.query.all()
    return render_template('shop.html', products=products, categories=categories)

@app.route('/product/<int:id>')
def product(id):
    product = Product.query.get_or_404(id)
    return render_template('product.html', product=product)

@app.route('/cart')
def cart():
    cart_items = session.get('cart', {})
    products = []
    total = 0
    for product_id, quantity in cart_items.items():
        product = Product.query.get(int(product_id))
        if product:
            products.append({'product': product, 'quantity': quantity})
            total += product.price * quantity
    return render_template('cart.html', products=products, total=total)

@app.route('/add_to_cart/<int:id>', methods=['POST'])
def add_to_cart(id):
    cart = session.get('cart', {})
    cart[str(id)] = cart.get(str(id), 0) + 1
    session['cart'] = cart
    return jsonify({'success': True})

@app.route('/update_cart/<int:id>', methods=['POST'])
def update_cart(id):
    quantity = int(request.form.get('quantity', 1))
    cart = session.get('cart', {})
    if quantity > 0:
        cart[str(id)] = quantity
    else:
        cart.pop(str(id), None)
    session['cart'] = cart
    return redirect(url_for('cart'))

@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        cart = session.get('cart', {})
        if not cart:
            flash('Your cart is empty')
            return redirect(url_for('cart'))
        
        total = 0
        order = Order(user_id=current_user.id, total=0)
        db.session.add(order)
        db.session.flush()
        
        for product_id, quantity in cart.items():
            product = Product.query.get(int(product_id))
            if product:
                item = OrderItem(order_id=order.id, product_id=product.id, quantity=quantity, price=product.price)
                db.session.add(item)
                total += product.price * quantity
        
        order.total = total
        db.session.commit()
        session.pop('cart', None)
        flash('Order placed successfully!')
        return redirect(url_for('index'))
    
    cart_items = session.get('cart', {})
    products = []
    total = 0
    for product_id, quantity in cart_items.items():
        product = Product.query.get(int(product_id))
        if product:
            products.append({'product': product, 'quantity': quantity})
            total += product.price * quantity
    return render_template('checkout.html', products=products, total=total)

@app.route('/cart_count')
def cart_count():
    cart = session.get('cart', {})
    count = sum(cart.values())
    return jsonify({'count': count})

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/search')
def search():
    query = request.args.get('q', '')
    if query:
        products = Product.query.filter(Product.name.contains(query) | Product.description.contains(query)).all()
    else:
        products = []
    return render_template('search.html', products=products, query=query)

@app.route('/wishlist')
@login_required
def wishlist():
    # For now, use session-based wishlist
    wishlist_items = session.get('wishlist', [])
    products = []
    for product_id in wishlist_items:
        product = Product.query.get(int(product_id))
        if product:
            products.append(product)
    return render_template('wishlist.html', products=products)

@app.route('/add_to_wishlist/<int:id>')
@login_required
def add_to_wishlist(id):
    wishlist = session.get('wishlist', [])
    if str(id) not in wishlist:
        wishlist.append(str(id))
        session['wishlist'] = wishlist
    return redirect(request.referrer or url_for('index'))

@app.route('/remove_from_wishlist/<int:id>')
@login_required
def remove_from_wishlist(id):
    wishlist = session.get('wishlist', [])
    if str(id) in wishlist:
        wishlist.remove(str(id))
        session['wishlist'] = wishlist
    return redirect(request.referrer or url_for('wishlist'))