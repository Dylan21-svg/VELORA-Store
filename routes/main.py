from flask import render_template, request, redirect, url_for, flash, session, jsonify
from app import app, db
from models import Product, Category, Order, OrderItem, Review, Wishlist, Transaction
from services.payment_service import PaymentService
from flask_login import login_required, current_user

@app.route('/')
def index():
    products = Product.query.limit(8).all()
    return render_template('index.html', products=products)

@app.route('/shop')
def shop():
    category_id = request.args.get('category')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort')

    query = Product.query

    # Filtering
    if category_id:
        query = query.filter_by(category_id=category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.created_at.desc())
    
    products = query.all()
    categories = Category.query.all()
    
    # Track wishlist items for the current user
    wishlist_ids = set()
    if current_user.is_authenticated:
        wishlist_ids = {item.product_id for item in Wishlist.query.filter_by(user_id=current_user.id).all()}
    
    return render_template('shop.html', products=products, categories=categories, 
                         current_category=int(category_id) if category_id else None,
                         min_price=min_price, max_price=max_price, sort_by=sort_by,
                         wishlist_items=wishlist_ids)

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
    product = Product.query.get_or_404(id)
    cart = session.get('cart', {})
    current_quantity = cart.get(str(id), 0)
    
    if current_quantity + 1 > product.stock_quantity:
        return jsonify({'success': False, 'message': 'Not enough stock available'})
        
    cart[str(id)] = current_quantity + 1
    session['cart'] = cart
    return jsonify({'success': True})

@app.route('/update_cart/<int:id>', methods=['POST'])
def update_cart(id):
    quantity = int(request.form.get('quantity', 1))
    product = Product.query.get_or_404(id)
    
    if quantity > product.stock_quantity:
        flash(f'Only {product.stock_quantity} items available for {product.name}')
        quantity = product.stock_quantity

    cart = session.get('cart', {})
    if quantity > 0:
        cart[str(id)] = quantity
    else:
        cart.pop(str(id), None)
    session['cart'] = cart
    return redirect(url_for('cart'))

<<<<<<< HEAD
=======
@app.route('/remove_from_cart/<int:id>', methods=['POST'])
def remove_from_cart(id):
    product = Product.query.get_or_404(id)
    cart = session.get('cart', {})
    cart.pop(str(id), None)
    session['cart'] = cart
    flash(f'Removed {product.name} from cart')
    return redirect(url_for('cart'))

>>>>>>> a21513a (Add clean requirements.txt and Flask app)
@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        cart = session.get('cart', {})
        if not cart:
            flash('Your cart is empty')
            return redirect(url_for('cart'))
        
        # Final stock check
        for product_id, quantity in cart.items():
            product = Product.query.get(int(product_id))
            if not product or product.stock_quantity < quantity:
                flash(f'Not enough stock for {product.name if product else "item"}. Please update cart.')
                return redirect(url_for('cart'))

        payment_method = request.form.get('payment_method')
        phone_number = request.form.get('phone_number')

        total = 0
        order = Order(user_id=current_user.id, total=0, status='pending')
        db.session.add(order)
        db.session.flush()
        
        # Create items but don't deduct stock yet (wait for payment)
        temp_items = []
        for product_id, quantity in cart.items():
            product = Product.query.get(int(product_id))
            if product:
                item = OrderItem(order_id=order.id, product_id=product.id, quantity=quantity, price=product.price)
                db.session.add(item)
                total += product.price * quantity
                temp_items.append({'product': product, 'quantity': quantity})
        
        order.total = total
        
        # Process Payment
        result = PaymentService.process_payment(order, payment_method, phone_number)
        
        if result['success']:
            # Payment Successful
            transaction = Transaction(
                order_id=order.id,
                provider=payment_method,
                reference=result['reference'],
                status='paid',
                amount=total
            )
            db.session.add(transaction)
            order.status = 'paid'
            
            # Deduct stock now
            for item_data in temp_items:
                item_data['product'].stock_quantity -= item_data['quantity']
                
            db.session.commit()
            session.pop('cart', None)
            flash(f'Order placed successfully! Ref: {result["reference"]}')
            if 'message' in result and result['message']:
                 flash(result['message'])
            return redirect(url_for('dashboard'))
        else:
            # Payment Failed
            db.session.rollback()
            flash(f'Payment Failed: {result["message"]}')
            return redirect(url_for('checkout'))
    
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

@app.route('/wishlist_count')
def wishlist_count():
    if current_user.is_authenticated:
        count = Wishlist.query.filter_by(user_id=current_user.id).count()
    else:
        count = 0
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
    query_str = request.args.get('q', '').strip()
    if query_str:
        products = Product.query.filter(Product.name.ilike(f'%{query_str}%') | Product.description.ilike(f'%{query_str}%')).all()
    else:
        products = []
        
    wishlist_ids = set()
    if current_user.is_authenticated:
        wishlist_ids = {item.product_id for item in Wishlist.query.filter_by(user_id=current_user.id).all()}
        
    return render_template('search.html', products=products, query=query_str, wishlist_items=wishlist_ids)

@app.route('/wishlist')
@login_required
def wishlist():
    wishlist_items = Wishlist.query.filter_by(user_id=current_user.id).all()
    products = [item.product for item in wishlist_items]
    return render_template('wishlist.html', products=products)

@app.route('/add_to_wishlist/<int:id>')
@login_required
def add_to_wishlist(id):
    product = Product.query.get_or_404(id)
    
    existing_item = Wishlist.query.filter_by(user_id=current_user.id, product_id=id).first()
    if existing_item:
        db.session.delete(existing_item)
        flash(f'Removed {product.name} from wishlist')
    else:
        new_item = Wishlist(user_id=current_user.id, product_id=id)
        db.session.add(new_item)
        flash(f'Added {product.name} to wishlist')
    
    db.session.commit()
    return redirect(request.referrer or url_for('wishlist'))

@app.route('/remove_from_wishlist/<int:id>')
@login_required
def remove_from_wishlist(id):
    # This route might be redundant if add_to_wishlist is a toggle, but keeping for specific remove actions
    wishlist_item = Wishlist.query.filter_by(user_id=current_user.id, product_id=id).first()
    if wishlist_item:
        db.session.delete(wishlist_item)
        db.session.commit()
        flash('Item removed from wishlist')
    return redirect(url_for('wishlist'))

@app.route('/dashboard')
@login_required
def dashboard():
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('dashboard.html', orders=orders, user=current_user)
@app.route('/product/<int:id>/review', methods=['POST'])
@login_required
def add_review(id):
    rating = int(request.form.get('rating'))
    comment = request.form.get('comment')
    
    if not rating or not comment:
        flash('Please provide both a rating and a comment.')
        return redirect(url_for('product', id=id))
        
    review = Review(product_id=id, user_id=current_user.id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    
    flash('Review submitted successfully!')
    return redirect(url_for('product', id=id))