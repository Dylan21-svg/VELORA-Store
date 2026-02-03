from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app, db
from models import Product, Category, Order, OrderItem
from flask_login import login_required, current_user
import os
from werkzeug.utils import secure_filename

@app.route('/admin')
@login_required
def admin_dashboard():
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    total_products = Product.query.count()
    total_orders = Order.query.count()
    return render_template('admin/dashboard.html', total_products=total_products, total_orders=total_orders)

@app.route('/admin/products')
@login_required
def admin_products():
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    products = Product.query.all()
    categories = Category.query.all()
    return render_template('admin/products.html', products=products, categories=categories)

@app.route('/admin/products/add', methods=['GET', 'POST'])
@login_required
def add_product():
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        price = float(request.form.get('price'))
        category_id = int(request.form.get('category'))
        image = request.files.get('image')
        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_url = f'/static/images/{filename}'
        else:
            image_url = '/static/images/default.jpg'
        product = Product(name=name, description=description, price=price, image_url=image_url, category_id=category_id)
        db.session.add(product)
        db.session.commit()
        flash('Product added successfully')
        return redirect(url_for('admin_products'))
    categories = Category.query.all()
    return render_template('admin/add_product.html', categories=categories)

@app.route('/admin/products/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_product(id):
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    product = Product.query.get_or_404(id)
    if request.method == 'POST':
        product.name = request.form.get('name')
        product.description = request.form.get('description')
        product.price = float(request.form.get('price'))
        product.category_id = int(request.form.get('category'))
        image = request.files.get('image')
        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            product.image_url = f'/static/images/{filename}'
        db.session.commit()
        flash('Product updated successfully')
        return redirect(url_for('admin_products'))
    categories = Category.query.all()
    return render_template('admin/edit_product.html', product=product, categories=categories)

@app.route('/admin/products/delete/<int:id>', methods=['POST'])
@login_required
def delete_product(id):
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    flash('Product deleted successfully')
    return redirect(url_for('admin_products'))

@app.route('/admin/categories/add', methods=['POST'])
@login_required
def add_category():
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    name = request.form.get('name')
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return redirect(url_for('admin_products'))

@app.route('/admin/orders')
@login_required
def admin_orders():
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    orders = Order.query.all()
    return render_template('admin/orders.html', orders=orders)

@app.route('/admin/orders/update/<int:id>', methods=['POST'])
@login_required
def update_order_status(id):
    if not current_user.is_admin or request.args.get('key') != 'velora2026':
        return redirect(url_for('index'))
    order = Order.query.get_or_404(id)
    status = request.form.get('status')
    order.status = status
    db.session.commit()
    return redirect(url_for('admin_orders'))