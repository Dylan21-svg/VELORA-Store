from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Product, Category, Order, OrderItem
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-default-secret-key')

# Database configuration - use SQLite by default for local dev
db_url = os.environ.get('DATABASE_URL')
if not db_url or db_url.strip() == '':
    db_url = 'sqlite:///database.db'
    
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'images')

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Import routes after app setup to avoid circular imports
from routes.main import *
from routes.auth import *
from routes.admin import *

from init_db import init_db

@app.route('/init-db')
def db_init():
    try:
        init_db()
        return "Database initialized successfully.", 200
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run( debug=os.environ.get('FLASK_DEBUG', '0') == '1')

    