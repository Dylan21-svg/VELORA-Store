from app import app, db
from models import User, Category, Product, Review, Wishlist, Transaction
from werkzeug.security import generate_password_hash

def init_db():
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("Creating admin user...")
            admin = User(username='admin', password=generate_password_hash('VeloraAdmin2026!@#Secure'), is_admin=True)
            db.session.add(admin)
            db.session.commit()
        
        # Add sample categories and products if none exist
        if Category.query.count() == 0:
            print("Seeding database with sample data...")
            categories = [
                Category(name='Clothing'),
                Category(name='Shoes'),
                Category(name='Accessories'),
                Category(name='Bags')
            ]
            db.session.add_all(categories)
            db.session.commit()
            
            products = [
                Product(name='Elegant Dress', description='A beautiful evening dress', price=89.99, image_url='/static/images/product-01.jpg', category_id=1, stock_quantity=10),
                Product(name='Casual T-Shirt', description='Comfortable cotton t-shirt', price=29.99, image_url='/static/images/product-02.jpg', category_id=1, stock_quantity=50),
                Product(name='Running Shoes', description='High-performance running shoes', price=129.99, image_url='/static/images/product-03.jpg', category_id=2, stock_quantity=15),
                Product(name='Leather Boots', description='Classic leather boots', price=199.99, image_url='/static/images/product-04.jpg', category_id=2, stock_quantity=8),
                Product(name='Gold Necklace', description='Elegant gold necklace', price=149.99, image_url='/static/images/product-05.jpg', category_id=3, stock_quantity=5),
                Product(name='Designer Sunglasses', description='Stylish sunglasses', price=79.99, image_url='/static/images/product-06.jpg', category_id=3, stock_quantity=20),
                Product(name='Leather Handbag', description='Premium leather handbag', price=249.99, image_url='/static/images/product-07.jpg', category_id=4, stock_quantity=3),
                Product(name='Backpack', description='Durable canvas backpack', price=59.99, image_url='/static/images/product-08.jpg', category_id=4, stock_quantity=25)
            ]
            db.session.add_all(products)
            db.session.commit()
        print("Database initialized successfully.")

if __name__ == '__main__':
    init_db()
