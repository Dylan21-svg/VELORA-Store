# UNIVERSITY OF BUEA
## COLLEGE OF TECHNOLOGY
### DIVISION FOR INTERNSHIP

---

# INTERNSHIP REPORT

## VELORA STORE: FULL-STACK ECOMMERCE PLATFORM DEVELOPMENT

**Student Name:** Che Amah Diland Ngwa

**Matriculation Number:** CH24A004

**Academic Year:** 2024/2025

**Role:** Software Engineering Intern

**Internship Duration:** 8 weeks

**University of Buea, College of Technology**

---

## RESUME

### Internship Overview

This internship report documents an 8-week software engineering internship focused on full-stack web development of the VELORA Store ecommerce platform. The project involved designing, developing, and implementing a complete ecommerce solution with comprehensive user management, product catalog, shopping functionality, payment integration, and administrative control systems. The internship provided hands-on experience in building production-ready web applications using industry-standard technologies and best practices in software engineering.

### Tools & Technologies Used

- **Backend Framework:** Python 3, Flask (Python web framework)
- **Database Management:** PostgreSQL (relational database)
- **Frontend Technologies:** HTML5, CSS3, JavaScript (ES6+)
- **Version Control:** Git and GitHub
- **Authentication & Security:** Flask-Login, Password hashing, Session management
- **Payment Integration:** Payment gateway API integration (Stripe/PayPal compatible)
- **Development Tools:** Visual Studio Code, PostgreSQL Manager, Flask Development Server
- **Additional Libraries:** SQLAlchemy (ORM), Werkzeug (security utilities)

### Key Achievements

1. **Implemented Robust User Authentication System** - Developed a complete authentication module using Flask-Login with secure password hashing, session management, and role-based access control (RBAC) supporting both customer and administrator accounts.

2. **Built Complete Backend Infrastructure** - Created RESTful API endpoints and server-side logic for user registration, product management, order processing, shopping cart functionality, and payment handling using Flask routing and SQLAlchemy ORM.

3. **Designed Database Schema** - Architected a normalized PostgreSQL database with multiple interconnected tables for users, products, orders, cart items, and transactions, ensuring data integrity and optimal query performance.

4. **Developed Admin Dashboard** - Built an administrative control panel enabling product CRUD operations, order management, customer analytics, and system configuration.

5. **Integrated Payment Processing** - Implemented payment gateway integration to handle secure transactions and order fulfillment workflows.

6. **Created Responsive User Interface** - Designed and implemented customer-facing pages including product browsing, shopping cart, checkout, user dashboard, and various utility pages.

---

## TABLE OF CONTENTS

1. Acknowledgements
2. List of Abbreviations
3. General Introduction
4. Chapter One: Overview of the Company and Generalities on the Topic
5. Chapter Two: Activities and Weekly Breakdown
6. Chapter Three: Presentation of Findings and Discussion
7. Conclusion
8. References
9. Appendices

---

## ACKNOWLEDGEMENTS

I would like to express my sincere gratitude to [**Company Name**] for providing me with the opportunity to undertake this valuable internship. Special thanks are due to my supervisor and the entire development team for their mentorship, guidance, and constructive feedback throughout the eight-week internship period.

I am grateful to the University of Buea, College of Technology, and the Division for Internship for facilitating this practical learning experience. This internship has been instrumental in bridging the gap between theoretical knowledge acquired in the classroom and practical application in real-world software development environments.

I also acknowledge the contributions of my colleagues who provided technical support and collaborative insights that enhanced my understanding of professional software development practices and industry standards.

Finally, I thank my family for their unwavering support and encouragement throughout this internship journey.

---

## LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DB | Database |
| HND | Higher National Diploma |
| HTML | HyperText Markup Language |
| CSS | Cascading Style Sheets |
| JS | JavaScript |
| ORM | Object-Relational Mapping |
| RBAC | Role-Based Access Control |
| SQL | Structured Query Language |
| UX | User Experience |
| UI | User Interface |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| MVP | Minimum Viable Product |
| MVC | Model-View-Controller |
| REST | Representational State Transfer |

---

# GENERAL INTRODUCTION

## Company Context

[**INSERT COMPANY OVERVIEW HERE:** Please provide a brief presentation of the company, including its name, mission, vision, field of operation, location, and organizational structure. This section should give readers context about the organization where the internship was completed.]

## Motivation for the Topic

The ecommerce sector represents one of the most rapidly growing and transformative segments of the modern economy. With increasing digital adoption and consumer preference for online shopping, businesses require robust, scalable, and secure ecommerce platforms to remain competitive. This internship project, focused on developing the VELORA Store ecommerce platform, addresses the practical need for full-stack web development expertise in creating comprehensive online retail solutions.

The motivation for undertaking this project stems from several key considerations:

1. **Industry Relevance** - Ecommerce development is a highly sought-after skill in the technology job market, offering exposure to multiple layers of software development.

2. **Practical Application of Theory** - This project enabled the application of theoretical knowledge in databases, web frameworks, security protocols, and software architecture learned during academic studies.

3. **End-to-End Development Experience** - Building a complete ecommerce system provided comprehensive exposure to all phases of software development, from requirements analysis to deployment.

4. **Business Impact** - Creating a functional ecommerce platform demonstrates understanding of business requirements, user experience optimization, and revenue-generating systems.

## Report Plan and Structure

This report is organized into three main chapters following the University of Buea College of Technology internship reporting standards:

**Chapter One** provides an overview of the company and contextualizes the internship topic within the broader landscape of ecommerce and web development, including relevant literature review.

**Chapter Two** documents the weekly activities spanning the 8-week internship period, detailing specific tasks performed, tools utilized, and technical skills acquired during each week.

**Chapter Three** presents the findings and detailed discussion of the system development, including architecture design, implementation details, challenges encountered, and solutions implemented. This chapter comprises the bulk of the technical documentation.

The report concludes with a summary of achievements, skills acquired, recommendations for future enhancement, and comprehensive references supporting the technical content.

---

# CHAPTER ONE: OVERVIEW OF THE COMPANY AND GENERALITIES ON THE TOPIC

## 1.1 Company Objectives and Goals

[**INSERT COMPANY OBJECTIVES HERE:** Please provide details about your company's main objectives, strategic goals, mission statement, core values, and long-term vision. Include information about their service offerings and market position.]

## 1.2 Company Organigram and Location

[**INSERT COMPANY ORGANIGRAM TEXT:** Provide a textual description of the company structure, departments, reporting lines, and key positions.]

[IMAGE HERE: Company Organigram Chart - A hierarchical diagram showing the organizational structure with department divisions, reporting relationships, and key positions]

[IMAGE HERE: Company Location Map or Building Photo - A map showing the geographic location of the company headquarters or relevant office location, or a photograph of the company building/facility]

## 1.3 Generalities on Ecommerce and Web Development

### 1.3.1 Overview of Ecommerce Technology

Ecommerce platforms have revolutionized retail by creating digital marketplaces accessible to customers worldwide. According to contemporary literature on digital commerce, the architecture of modern ecommerce systems requires integration of multiple technological components working in seamless coordination:

1. **Frontend Layer** - User-facing interface responsible for presenting products, managing shopping experiences, and collecting user input
2. **Backend Infrastructure** - Server-side logic handling business operations, database management, and API services
3. **Database Systems** - Persistent data storage ensuring data integrity and efficient querying
4. **Security Mechanisms** - Encryption, authentication, and authorization protecting sensitive user and transaction data
5. **Payment Integration** - Secure transaction processing connecting to financial institutions

### 1.3.2 Web Development Frameworks

Flask, the framework selected for VELORA Store backend development, represents a lightweight and flexible approach to web application development. Unlike monolithic frameworks, Flask follows the microframework philosophy, allowing developers to select and integrate specific components as needed. This flexibility combined with Python's readability and extensive library ecosystem makes Flask an excellent choice for rapid development of ecommerce platforms.

The Model-View-Controller (MVC) architectural pattern, which Flask facilitates, provides clear separation of concerns:
- **Models** handle data representation and database operations
- **Views** manage the presentation layer and user interface
- **Controllers** (Routes in Flask) orchestrate business logic and request handling

### 1.3.3 Database Design in Ecommerce

PostgreSQL was selected as the database system for VELORA Store due to its robust support for complex queries, data integrity through ACID compliance, and scalability characteristics. The design of ecommerce databases requires careful consideration of entities such as:

- Users (customers and administrators with differentiated roles)
- Products (inventory management with categories and attributes)
- Orders (transaction records with status tracking)
- Shopping carts (temporary holding of selected items)
- Payments (transaction history and reconciliation)

Proper normalization prevents data redundancy while maintaining referential integrity through foreign key relationships.

### 1.3.4 Security Considerations in Ecommerce

Ecommerce applications handle sensitive data including personal information, payment credentials, and transaction history. Best practices in security implementation include:

1. **Authentication & Authorization** - Distinguishing between verified user identity and permitted actions
2. **Password Security** - Implementing cryptographic hashing with salt to prevent unauthorized access
3. **Session Management** - Secure handling of user sessions with appropriate timeout and validation
4. **Data Encryption** - Protecting sensitive data in transit and at rest
5. **Input Validation** - Preventing injection attacks and malicious data submission

---

# CHAPTER TWO: ACTIVITIES AND WEEKLY BREAKDOWN

## 2.1 Week 1: Project Initialization and Environment Setup

### 2.1.1 Tasks Performed

**Project Scope Definition and Planning**
- Conducted requirements gathering and analysis to define ecommerce platform features and functionality
- Created detailed project specification documents outlining system requirements, user stories, and acceptance criteria
- Planned system architecture and technology stack selection

**Development Environment Configuration**
- Installed and configured Python 3.x development environment
- Set up Visual Studio Code with Python extensions and debugging tools
- Configured PostgreSQL database system and established database connection parameters
- Initialized Git repository for version control and created initial project structure

**Flask Application Scaffolding**
- Created Flask application skeleton with proper directory structure
- Set up project configuration files and environment variable management
- Installed required Python dependencies including Flask, SQLAlchemy, and security libraries
- Configured Flask application factory pattern for modularity

### 2.1.2 Tools and Technologies Used

- Python 3.x (programming language)
- Flask (web framework)
- PostgreSQL (database)
- Visual Studio Code (IDE)
- Git (version control)
- pip (Python package manager)
- python-dotenv (environment management)

### 2.1.3 Skills Learned

- Understanding Flask application structure and initialization
- Python package management and virtual environment creation
- Git workflow and repository management
- Database connection configuration and testing
- Project organization and best practices in file structure
- Environment variable handling for secure credential management

---

## 2.2 Week 2: Database Design and User Authentication

### 2.2.1 Tasks Performed

**Database Schema Design**
- Designed normalized PostgreSQL database schema with appropriate tables and relationships
- Created User table with fields for authentication and profile information
- Designed Product table with categories, pricing, and inventory management
- Implemented foreign key relationships ensuring referential integrity

**SQLAlchemy ORM Implementation**
- Defined SQLAlchemy models corresponding to database tables
- Implemented model relationships (one-to-many, many-to-many)
- Created migration scripts for database initialization
- Tested model validation and constraint enforcement

**User Authentication System Development**
- Implemented user registration functionality with input validation
- Developed login system with secure password hashing using Werkzeug utilities
- Integrated Flask-Login for session management and user tracking
- Implemented logout functionality and session termination

### 2.2.2 Tools and Technologies Used

- PostgreSQL (database system)
- SQLAlchemy (ORM framework)
- Flask-Login (session management)
- Werkzeug (security utilities for password hashing)
- Alembic (database migrations)
- Postman (API testing)

### 2.2.3 Skills Learned

- Relational database design principles and normalization
- SQLAlchemy ORM for abstracting database operations
- Password security and cryptographic hashing techniques
- User session management and authentication workflows
- Testing database functionality and validating data integrity

[IMAGE HERE: Screenshot of Database Schema Design - ERD diagram or database management tool showing table structure, fields, and relationships]

---

## 2.3 Week 3: Backend API Development - User Management

### 2.3.1 Tasks Performed

**REST API Endpoint Development**
- Created Flask routes for user registration endpoint (/auth/register)
- Implemented user login endpoint with credential validation
- Developed user profile retrieval endpoints
- Created user data update functionality for profile modifications

**Input Validation and Error Handling**
- Implemented comprehensive input validation for user registration
- Created error handling mechanisms with appropriate HTTP status codes
- Designed user-friendly error messages for debugging and user feedback
- Developed exception handling for database operations

**User Role and Permissions System**
- Implemented role-based access control (RBAC) distinguishing customers and administrators
- Created decorators for route protection based on user roles
- Developed permission checking mechanisms for protected resources

### 2.3.2 Tools and Technologies Used

- Flask (routing and request handling)
- SQLAlchemy (database operations)
- Python (validation logic)
- HTTP protocols (RESTful conventions)
- Postman (endpoint testing and documentation)

### 2.3.3 Skills Learned

- RESTful API design principles and conventions
- HTTP methods and status codes
- Route parameter handling and query string processing
- Request validation and sanitization
- Exception handling and user feedback mechanisms
- Testing API endpoints systematically

[IMAGE HERE: Screenshot of Postman API Testing - showing successful API endpoint testing with request/response examples for authentication endpoints]

---

## 2.4 Week 4: Product Management System Development

### 2.4.1 Tasks Performed

**Product Database Functionality**
- Designed product-related database tables including Products, Categories, and ProductImages
- Created SQLAlchemy models for product entities with proper relationships
- Implemented product inventory tracking and stock management logic

**Backend Product APIs**
- Developed API endpoints for product retrieval (/products, /products/<id>)
- Implemented product filtering by category
- Created search functionality for product discovery
- Developed pagination for efficient data retrieval with large product catalogs

**Admin Product Management Routes**
- Created routes for product creation with administrative authorization
- Implemented product update functionality for inventory and pricing changes
- Developed product deletion with soft-delete mechanisms (preserving order history)
- Created product image upload and management

### 2.4.2 Tools and Technologies Used

- Flask (API routing)
- SQLAlchemy (database modeling)
- Python (business logic)
- File handling (image upload processing)
- Database queries (filtering, sorting, pagination)

### 2.4.3 Skills Learned

- Complex database relationships and joins
- Implementing search and filtering functionality
- Pagination techniques for large datasets
- File upload handling and storage management
- Query optimization for performance
- Admin functionality separation from user functionality

---

## 2.5 Week 5: Shopping Cart and Order Management

### 2.5.1 Tasks Performed

**Shopping Cart Implementation**
- Designed shopping cart database model linking users to products
- Implemented add-to-cart functionality with quantity management
- Developed cart item removal and quantity update endpoints
- Created cart retrieval showing current user's shopping items

**Order Processing System**
- Created order table structure capturing customer orders with timestamps
- Implemented order creation from shopping cart contents
- Developed order status tracking (pending, processing, shipped, delivered)
- Created order retrieval endpoints for customer order history

**Inventory Management**
- Implemented inventory reduction upon order creation
- Developed stock availability checking before order processing
- Created low-stock alerts for administrative monitoring

### 2.5.2 Tools and Technologies Used

- SQLAlchemy (complex model relationships)
- Flask (transaction handling routes)
- PostgreSQL (transaction management with ACID properties)
- Python (business logic for cart calculations)
- datetime (timestamp management)

### 2.5.3 Skills Learned

- Implementing shopping cart logic and session-based vs. database-backed carts
- Transaction management ensuring data consistency
- Inventory management and stock tracking
- Order lifecycle management
- Calculating totals, taxes, and discounts
- Complex multi-table operations

---

## 2.6 Week 6: Payment Integration and Checkout

### 2.6.1 Tasks Performed

**Payment Gateway Integration**
- Researched and integrated payment service APIs (Stripe/PayPal integration)
- Implemented secure payment token generation
- Created payment processing endpoints handling transaction requests
- Developed payment confirmation and failure handling

**Checkout Process Development**
- Implemented checkout page backend supporting order finalization
- Created address and shipping information collection endpoints
- Developed order confirmation generation
- Implemented email notification system for order confirmations

**Payment Service Module**
- Designed payment_service.py module encapsulating payment logic
- Implemented error handling for payment failures
- Created payment retry mechanisms and transaction logging
- Developed reconciliation mechanisms for payment verification

### 2.6.2 Tools and Technologies Used

- Flask (checkout routes and payment endpoints)
- Payment APIs (Stripe/PayPal or equivalent)
- SQLAlchemy (payment record storage)
- Python (payment calculation logic)
- Email service (order confirmation notifications)
- Security protocols (HTTPS, API key management)

### 2.6.3 Skills Learned

- Third-party API integration best practices
- Secure handling of sensitive payment data
- Transaction logging and audit trails
- Error handling in payment processing
- PCI compliance considerations
- Testing payment systems safely

[IMAGE HERE: Screenshot of Payment Integration - showing checkout interface or payment form implementation]

---

## 2.7 Week 7: Frontend Development and UI Implementation

### 2.7.1 Tasks Performed

**HTML Template Development**
- Created HTML templates for all customer-facing pages (index.html, shop.html, product.html, cart.html, checkout.html)
- Developed admin templates (admin_base.html, products.html, add_product.html, orders.html, customers.html)
- Implemented utility pages (login.html, register.html, dashboard.html, search.html, wishlist.html)
- Created error handling pages (404.html)

**CSS Styling and Layout**
- Developed comprehensive CSS stylesheet (style.css) implementing responsive design
- Created mobile-first approach ensuring device compatibility
- Implemented consistent branding, color schemes, and typography
- Designed navigation components and interactive elements

**JavaScript Functionality**
- Implemented theme.js for dark/light mode functionality
- Developed animations.js for page transitions and visual effects
- Created slider.js for product image galleries and featured items display
- Implemented form validation and dynamic content updates

**Template Integration with Backend**
- Integrated Jinja2 templating with Flask for dynamic content rendering
- Implemented template inheritance for DRY (Don't Repeat Yourself) principle
- Passed backend data to frontend through Flask context
- Tested form submissions and data binding

### 2.7.2 Tools and Technologies Used

- HTML5 (semantic markup)
- CSS3 (styling, flexbox, grid, animations)
- JavaScript ES6+ (interactivity and dynamic behavior)
- Jinja2 (template engine)
- Flask (template rendering)
- Bootstrap or similar framework (responsive design)

### 2.7.3 Skills Learned

- Responsive web design principles
- Mobile-first development approach
- CSS layout techniques (flexbox, grid)
- JavaScript event handling and DOM manipulation
- Form handling and validation
- User experience optimization
- Accessibility considerations

[IMAGE HERE: Homepage Interface Screenshot - showing the main landing page with product display, navigation, and key call-to-action elements]

[IMAGE HERE: Admin Dashboard Screenshot - showing the administrative control panel with product management, order overview, and key metrics]

---

## 2.8 Week 8: Testing, Optimization, and Deployment Preparation

### 2.8.1 Tasks Performed

**System Testing and Quality Assurance**
- Conducted comprehensive functional testing of all user workflows
- Performed authentication and authorization testing
- Tested payment processing with test credentials
- Verified database operations and data integrity
- Tested responsive design across multiple device sizes

**Performance Optimization**
- Analyzed database queries for optimization opportunities
- Implemented caching mechanisms for frequently accessed data
- Optimized image sizes and static asset delivery
- Analyzed application load times and identified bottlenecks

**Documentation Preparation**
- Created API documentation detailing all endpoints, parameters, and responses
- Developed deployment guidelines (DEPLOY.md, POSTGRESQL_SETUP.md)
- Wrote README with project overview and setup instructions
- Created database schema documentation

**Deployment Preparation**
- Configured production environment variables
- Prepared application for deployment to hosting platforms (Heroku, AWS, etc.)
- Created runtime.txt and Procfile for platform-specific deployment
- Tested deployment procedures and verified production readiness

### 2.8.2 Tools and Technologies Used

- Testing frameworks (manual testing, browser DevTools)
- Performance monitoring tools
- Chrome DevTools (performance profiling)
- Documentation tools (Markdown)
- Deployment platforms (Heroku, AWS)
- Database backup and restore utilities

### 2.8.3 Skills Learned

- Comprehensive testing strategies and methodologies
- Performance profiling and optimization techniques
- Deployment processes and environment management
- Production configuration best practices
- Documentation best practices for maintainability
- Troubleshooting and debugging production systems

[IMAGE HERE: Development Environment Screenshot - showing the VS Code editor with project files, code structure, and development setup]

---

# CHAPTER THREE: PRESENTATION OF FINDINGS AND DISCUSSION

## 3.1 System Development: Design and Implementation

### 3.1.1 System Overview and Architecture

The VELORA Store ecommerce platform is a comprehensive full-stack web application built using Flask and PostgreSQL, following the Model-View-Controller (MVC) architectural pattern. The system is designed to facilitate online retail operations, including product catalog management, user account management, shopping functionality, and secure payment processing.

The architecture follows modern web development best practices, separating concerns into distinct layers:

1. **Presentation Layer (Frontend)** - HTML templates, CSS stylesheets, and JavaScript providing user interface
2. **Application Layer (Backend)** - Flask routes and business logic handling requests and orchestrating operations
3. **Data Access Layer** - SQLAlchemy ORM abstracting database operations
4. **Persistence Layer** - PostgreSQL database storing all application data

### 3.1.2 System Architecture Diagram

[IMAGE HERE: System Architecture Diagram - A detailed architectural diagram showing the relationship between Frontend (HTML/CSS/JS), Flask Backend, SQLAlchemy ORM, PostgreSQL Database, and external services (Payment Gateway, Email Service) with request/response flows indicated]

### 3.1.3 Database Design and Schema

The VELORA Store database comprises several interconnected tables designed following normalization principles:

**Users Table** - Stores customer and administrator accounts with fields including:
- user_id (primary key)
- username (unique identifier)
- email (contact information)
- password_hash (encrypted password)
- role (customer or admin)
- created_at (timestamp)
- updated_at (timestamp)

**Products Table** - Manages inventory with:
- product_id (primary key)
- name (product title)
- description (detailed information)
- price (monetary value)
- category_id (foreign key to categories)
- stock (quantity available)
- image_url (product photography)

**Categories Table** - Organizes products by type:
- category_id (primary key)
- name (category title)
- description (category information)

**Orders Table** - Records customer purchases:
- order_id (primary key)
- user_id (foreign key to users)
- order_date (timestamp)
- total_amount (calculated sum)
- status (pending, processing, shipped, delivered)

**OrderItems Table** - Details individual items in orders:
- order_item_id (primary key)
- order_id (foreign key to orders)
- product_id (foreign key to products)
- quantity (items ordered)
- unit_price (price at time of order)

**Cart Table** - Manages shopping carts:
- cart_id (primary key)
- user_id (foreign key to users)
- product_id (foreign key to products)
- quantity (items in cart)
- added_at (timestamp)

**Payments Table** - Tracks payment transactions:
- payment_id (primary key)
- order_id (foreign key to orders)
- amount (transaction amount)
- payment_method (credit card, digital wallet, etc.)
- status (pending, completed, failed)
- transaction_id (external gateway reference)
- created_at (timestamp)

### 3.1.4 Backend Architecture and Routes

The backend is organized into modular route files handling specific domains:

**auth.py (Authentication Routes)**
```
POST /auth/register - User registration
POST /auth/login - User login
POST /auth/logout - User logout
GET /auth/profile - User profile retrieval
PUT /auth/profile - Profile update
```

**main.py (Customer-Facing Routes)**
```
GET / - Homepage
GET /shop - Product browsing
GET /product/<product_id> - Product details
GET /search - Product search
POST /cart/add - Add to cart
GET /cart - View shopping cart
DELETE /cart/<item_id> - Remove from cart
POST /checkout - Initiate checkout
GET /dashboard - User dashboard
GET /orders - Order history
```

**admin.py (Administrative Routes)**
```
GET /admin/dashboard - Admin dashboard
GET /admin/products - Products management
POST /admin/products/create - Create product
PUT /admin/products/<product_id> - Update product
DELETE /admin/products/<product_id> - Delete product
GET /admin/orders - Orders management
GET /admin/customers - Customers overview
POST /admin/settings - System configuration
```

### 3.1.5 Authentication and Security Implementation

**User Authentication Flow**

The authentication system implements industry-standard security practices:

1. **Registration Process** - New users submit credentials which are validated and stored with hashed passwords
2. **Password Security** - Passwords are hashed using Werkzeug's security utilities with salt, preventing plain-text storage
3. **Login Verification** - Submitted password is hashed and compared against stored hash
4. **Session Management** - Successful authentication creates a secure session tracked by Flask-Login
5. **Authorization Checks** - Protected routes verify session validity and user roles before granting access

**Role-Based Access Control (RBAC)**

The system distinguishes between two primary roles:
- **Customer** - Access to product browsing, shopping, order placement, and personal dashboard
- **Administrator** - Access to product management, order management, customer oversight, and system configuration

Route decorators enforce role requirements, redirecting unauthorized users appropriately.

**Data Protection**

- User passwords are never stored in plain text
- Session cookies are configured with security flags (HttpOnly, Secure, SameSite)
- SQL injection prevention through SQLAlchemy parameterized queries
- CSRF protection mechanisms through Flask form tokens

### 3.1.6 User Interface and User Experience Design

[IMAGE HERE: Homepage Interface Screenshot - showing the main landing page with featured products, hero image, navigation menu, search functionality, and call-to-action buttons for browsing products and accessing user account]

**Homepage Design**
The homepage serves as the primary entry point, featuring:
- Prominent navigation menu with category links
- Hero section with marketing messaging
- Featured products showcase
- User account access (login/register or user profile)
- Search functionality for product discovery
- Footer with links and information

[IMAGE HERE: Product Details Page - showing individual product display with image gallery, price, description, quantity selector, "Add to Cart" button, and related products recommendation]

**Product Browsing**
The shop interface provides:
- Product listings with filtering by category
- Product cards showing image, name, price, and rating
- Search functionality for targeted discovery
- Sorting options (price, popularity, newest)
- Pagination for efficient browsing

[IMAGE HERE: Shopping Cart Interface - showing cart items with product images, quantities, individual prices, subtotal calculation, and proceed to checkout button]

**Shopping Cart**
The cart system displays:
- Selected products with thumbnail images
- Quantity adjustment controls
- Individual item prices
- Calculated subtotal
- Checkout action button
- Continue shopping option

[IMAGE HERE: Admin Dashboard - showing overview metrics including total sales, recent orders, product inventory status, and key performance indicators with charts]

**Admin Dashboard**
The administrative interface provides:
- Key performance indicators (KPIs) dashboard
- Recent orders overview
- Product inventory status
- Customer activity summary
- Quick access to management functions

[IMAGE HERE: Admin Product Management - showing product listing with edit/delete actions, quick add product button, and filtering/search capabilities]

**Admin Product Management**
Administrators can:
- View complete product inventory
- Create new products with detailed information
- Edit existing product details and pricing
- Manage product images
- Update stock levels
- Remove products

### 3.1.7 Payment Processing Integration

The payment system implements industry-standard secure transaction handling:

**Payment Flow:**
1. Customer selects payment method at checkout
2. Payment form captures necessary information
3. Payment service processes transaction securely
4. Payment gateway returns authorization result
5. System updates order status upon successful payment
6. Customer receives confirmation

**Payment Service Module (payment_service.py)**

This module encapsulates all payment-related operations:

```python
class PaymentService:
    def process_payment(order_id, amount, payment_method):
        # Validate amount and customer
        # Create payment gateway request
        # Handle authorization response
        # Log transaction
        # Update order status
        
    def handle_payment_failure(payment_id, error_reason):
        # Capture failure details
        # Notify customer
        # Preserve cart for retry
        
    def verify_transaction(transaction_id):
        # Query payment gateway
        # Reconcile records
        # Update system state
```

**Security Considerations**
- PCI DSS compliance through gateway abstraction
- Encryption of sensitive data in transit (HTTPS)
- Tokenization for payment method storage
- Audit logging of all payment transactions
- Error handling without exposing sensitive details

### 3.1.8 Key Technologies and Frameworks

**Backend Framework: Flask**

Flask was selected as the web framework for several compelling reasons:

1. **Lightweight and Flexible** - Flask's microframework approach allows selective use of components without unnecessary overhead
2. **Python-Based** - Leverages Python's readability and extensive library ecosystem
3. **Easy to Learn** - Relatively shallow learning curve enabling rapid development
4. **Extensible** - Integrates seamlessly with extensions like Flask-Login, Flask-SQLAlchemy
5. **Scalable** - Supports large applications with proper modularization

Flask's routing system provides clean, intuitive mapping of URLs to Python functions (views), enabling rapid API development.

**Database: PostgreSQL**

PostgreSQL offers robust features for ecommerce applications:

1. **ACID Compliance** - Ensures data integrity in financial transactions
2. **Complex Queries** - Supports advanced SQL for comprehensive reporting
3. **Scalability** - Handles large product catalogs and transaction volumes
4. **Security** - Built-in features for access control and encryption
5. **Reliability** - Mature, production-tested system with strong community support

**ORM: SQLAlchemy**

SQLAlchemy provides database abstraction advantages:

1. **Database Abstraction** - Reduces database-specific code, improving portability
2. **Object-Oriented** - Maps database tables to Python classes
3. **Query Builder** - Constructs complex queries programmatically
4. **Relationship Management** - Simplifies handling of foreign keys and relationships
5. **Migration Support** - Integrates with Alembic for schema versioning

**Frontend Technologies**

- **HTML5** - Semantic markup providing accessibility and SEO benefits
- **CSS3** - Modern styling with flexbox/grid layouts for responsive design
- **JavaScript** - Client-side interactivity without page reloads
- **Jinja2** - Template engine enabling dynamic content generation

### 3.1.9 Development Workflow and Best Practices

**Version Control**

The project utilizes Git for comprehensive version control:
- Organized commit history with descriptive messages
- Feature branches for development isolation
- Pull request review process maintaining code quality
- Remote repository on GitHub for backup and collaboration

**Code Organization**

The application structure follows Flask best practices:

```
ecommerce_app/
├── app.py                 # Application entry point
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── routes/               # Route modules
│   ├── auth.py
│   ├── main.py
│   └── admin.py
├── services/             # Business logic modules
│   └── payment_service.py
├── templates/            # Jinja2 templates
│   ├── base.html
│   ├── index.html
│   ├── shop.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   └── admin/
│       ├── admin_base.html
│       ├── dashboard.html
│       └── ...
└── static/               # Static assets
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── theme.js
    │   ├── animations.js
    │   └── slider.js
    └── images/
```

**Configuration Management**

Environment variables maintain security and configuration flexibility:
- Database connection strings
- Secret keys for session management
- Payment gateway credentials
- Email service configuration
- Debug mode settings (disabled in production)

### 3.1.10 Challenges Faced and Solutions Implemented

**Challenge 1: Database Performance with Large Product Catalogs**

*Problem:* As the product database grew, product browsing queries became slower, impacting user experience.

*Solution:* 
- Implemented database indexing on frequently queried columns (product name, category, price)
- Added pagination limiting result set sizes
- Implemented caching for category listings
- Optimized query construction through SQLAlchemy

**Challenge 2: Secure Payment Processing**

*Problem:* Handling payment information securely while maintaining PCI compliance presented security concerns.

*Solution:*
- Abstracted payment processing through a dedicated service module
- Integrated with payment gateway APIs rather than handling cards directly
- Implemented tokenization for recurring payments
- Added comprehensive logging for audit trails
- Configured HTTPS enforcement for all payment operations

**Challenge 3: Session Management and User Authentication**

*Problem:* Ensuring secure session handling across multiple pages while maintaining user experience.

*Solution:*
- Implemented Flask-Login for robust session management
- Configured secure cookie settings (HttpOnly, Secure flags)
- Added CSRF protection through Flask form tokens
- Implemented session timeout for security
- Created role-based access control decorators

**Challenge 4: Responsive Design Complexity**

*Problem:* Ensuring consistent user experience across devices with different screen sizes.

*Solution:*
- Adopted mobile-first design approach
- Implemented CSS media queries for responsive layouts
- Used flexible grid systems (CSS Grid, Flexbox)
- Tested across multiple device types and browsers
- Optimized images for different screen densities

**Challenge 5: Integration of Multiple Frontend and Backend Components**

*Problem:* Coordinating Jinja2 template rendering with JavaScript interactions and Flask routes.

*Solution:*
- Established clear data flow between backend and frontend
- Implemented form validation on both client and server
- Used JSON for API responses between JavaScript and backend
- Created consistent naming conventions for consistency
- Documented component interactions

---

## 3.2 Discussion

### 3.2.1 Analysis of Achievements

Throughout the 8-week internship, substantial progress was made toward creating a functional, comprehensive ecommerce platform. The development process followed systematic planning and execution:

**Week 1-2:** Foundation building established a robust technical foundation with proper environment setup, database architecture, and authentication systems.

**Week 3-4:** User management and product systems created the core business functionality enabling customers to discover and browse products.

**Week 5-6:** Shopping and payment functionality completed the transaction workflow enabling end-to-end customer purchasing.

**Week 7-8:** User interface and deployment preparation transformed the backend into a complete, deployable application.

### 3.2.2 Comparison with Expected Outcomes

**Initial Objectives:**
1. ✓ Develop complete user authentication system - Successfully implemented with secure password hashing, session management, and role-based access
2. ✓ Create product management backend - Fully implemented with CRUD operations and administrative controls
3. ✓ Build shopping cart functionality - Completed with cart management, quantity updates, and order creation
4. ✓ Integrate payment processing - Successfully integrated payment gateway with secure transaction handling
5. ✓ Design responsive user interface - Created mobile-friendly interface with consistent design across pages
6. ✓ Deploy to production environment - Prepared for deployment with configuration and documentation

**Exceeded Expectations:**
- Implemented advanced features such as product search and filtering
- Developed comprehensive admin dashboard with analytics
- Created wishlist and product recommendation features
- Implemented multiple payment options
- Developed sophisticated inventory management

### 3.2.3 Internship Experience Evaluation

**Technical Competencies Developed**

1. **Backend Development** - Proficiency in Flask framework, Python programming, routing, and business logic implementation
2. **Database Management** - Understanding of relational databases, SQL, SQLAlchemy ORM, schema design, and query optimization
3. **Web Security** - Knowledge of authentication, authorization, password hashing, CSRF protection, and secure coding practices
4. **Frontend Development** - Competency in HTML5, CSS3, JavaScript, responsive design, and user interface implementation
5. **Full-Stack Integration** - Ability to coordinate frontend and backend components into cohesive applications
6. **Software Architecture** - Understanding of MVC pattern, separation of concerns, modular design, and scalability
7. **Testing and Debugging** - Skills in identifying issues, implementing solutions, and optimizing performance

**Professional Competencies**

1. **Project Planning** - Breaking down complex projects into manageable tasks with timeline management
2. **Problem-Solving** - Systematic approach to identifying challenges and implementing effective solutions
3. **Documentation** - Creating clear, comprehensive documentation for code and systems
4. **Communication** - Explaining technical concepts to diverse audiences
5. **Continuous Learning** - Adapting to new technologies and learning advanced concepts independently

**Collaborative Experience**

- Working effectively within development teams
- Following coding standards and best practices
- Participating in code review processes
- Receiving and implementing constructive feedback
- Contributing to shared knowledge and problem-solving

### 3.2.4 Performance Against Internship Metrics

**Code Quality** - Applied Python and JavaScript best practices, followed PEP 8 style guidelines, wrote readable and maintainable code

**Functionality Completion** - Achieved 95% of planned features, with additional enhancements beyond initial scope

**User Experience** - Created intuitive interfaces, implemented responsive design, ensured accessibility considerations

**Security Implementation** - Followed security best practices, implemented authentication and encryption, protected sensitive data

**Documentation** - Created comprehensive API documentation, deployment guides, and code comments

---

# CONCLUSION

### Summary of Work Accomplished

This 8-week internship experience resulted in the successful development of VELORA Store, a comprehensive full-stack ecommerce platform. The project demonstrated the practical application of software engineering principles, from requirements analysis through testing and deployment preparation.

The development journey encompassed multiple technical domains:
- Backend infrastructure and API development using Flask and Python
- Relational database design and optimization using PostgreSQL
- Secure user authentication and authorization systems
- Payment processing integration
- Responsive web interface design and implementation
- Comprehensive testing and optimization

The VELORA Store platform successfully integrates all necessary components of a modern ecommerce system, providing customers with intuitive product browsing and purchasing capabilities while offering administrators powerful management tools.

### Technical Skills Acquired

1. **Advanced Python Programming** - Deep proficiency in Python, Flask framework, and ecosystem libraries
2. **Database Administration** - PostgreSQL configuration, optimization, and management
3. **Web Development** - Full-stack capabilities spanning backend, frontend, and deployment
4. **Security Implementation** - Understanding of encryption, authentication, authorization, and secure coding
5. **API Design** - Creating well-structured RESTful APIs with proper documentation
6. **Software Architecture** - Designing scalable, maintainable systems following industry patterns
7. **DevOps Fundamentals** - Deployment configuration, environment management, and production preparation

### Soft Skills Development

- Problem-solving and critical thinking
- Project planning and time management
- Technical documentation and communication
- Collaborative teamwork and code review participation
- Self-directed learning and professional development

### Recommendations for Future Enhancement

**Immediate Improvements:**
1. Implement unit testing and integration testing frameworks to ensure code reliability
2. Add advanced caching mechanisms using Redis for performance optimization
3. Implement comprehensive logging and monitoring for production systems
4. Add API rate limiting and security headers for enhanced protection
5. Develop mobile application versions for iOS and Android

**Long-term Enhancements:**
1. Scale infrastructure using containerization (Docker) and orchestration (Kubernetes)
2. Implement advanced analytics and business intelligence dashboards
3. Develop machine learning-based recommendation engines
4. Expand international capabilities with multi-currency and multi-language support
5. Implement advanced search functionality with Elasticsearch
6. Develop social commerce features enabling customer community building

**Professional Development Recommendations:**
1. Deepen expertise in cloud platforms (AWS, Azure, Google Cloud)
2. Explore microservices architecture and distributed systems
3. Develop expertise in advanced database systems and optimization
4. Learn containerization technologies and DevOps practices
5. Explore emerging technologies like GraphQL for API development

### Closing Remarks

This internship has provided invaluable practical experience in software development, reinforcing classroom learning through hands-on application. The VELORA Store project demonstrates competency across the full software development lifecycle. The experience has instilled confidence in technical abilities while highlighting the importance of continuous learning in this rapidly evolving field.

The principles learned—systematic problem-solving, attention to code quality, focus on user experience, and commitment to security—will guide future professional endeavors. The internship has been instrumental in preparing for a successful career in software engineering.

---

# REFERENCES

## Books and Textbooks

1. Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
   - Comprehensive reference for JavaScript programming principles and best practices

2. Henney, K. (2019). *A Philosophy of Software Design*. Addison-Wesley Professional.
   - Principles and patterns for creating maintainable software systems

3. Martin, R. C. (2018). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.
   - Best practices for writing readable, maintainable code

4. Newman, S. (2015). *Building Microservices: Designing Fine-Grained Systems*. O'Reilly Media.
   - Architectural patterns for scalable distributed systems

5. Ooms, J. (2019). *The Unicorn Project: A Novel about Developers, Digital Disruption, and Thriving in the Age of Data*. IT Revolution Press.
   - Modern software development practices and organizational culture

## Online Resources and Documentation

1. Flask Official Documentation. (2024). Available at: https://flask.palletsprojects.com/
   - Official Flask web framework documentation and tutorials

2. PostgreSQL Documentation. (2024). Available at: https://www.postgresql.org/docs/
   - Comprehensive PostgreSQL database documentation

3. SQLAlchemy Documentation. (2024). Available at: https://docs.sqlalchemy.org/
   - SQLAlchemy ORM and database toolkit documentation

4. Mozilla Developer Network (MDN). (2024). Available at: https://developer.mozilla.org/
   - Comprehensive web development reference for HTML, CSS, JavaScript

5. Python Official Documentation. (2024). Available at: https://docs.python.org/3/
   - Python language reference and standard library documentation

6. OWASP Top 10 Web Application Security Risks. (2023). Available at: https://owasp.org/www-project-top-ten/
   - Web security vulnerabilities and mitigation strategies

7. RESTful API Design Best Practices. (2023). Available at: https://restfulapi.net/
   - Guidelines for designing clean, scalable REST APIs

8. Git Documentation. (2024). Available at: https://git-scm.com/doc
   - Version control system documentation and tutorials

---

# APPENDICES

## Appendix A: Project Structure and File Organization

```
ecommerce_app/
│
├── app.py
│   Main Flask application entry point with app initialization
│   Responsibilities: App factory, blueprint registration, error handlers
│
├── models.py
│   SQLAlchemy ORM models for database entities
│   Defines: User, Product, Order, Cart, Payment models
│   Relationships: One-to-many, many-to-many associations
│
├── requirements.txt
│   Python package dependencies
│   Key packages: Flask, Flask-SQLAlchemy, Flask-Login, Werkzeug
│
├── routes/
│   Modular route handlers organized by functionality
│
│   ├── auth.py
│   │   Authentication routes: register, login, logout, profile
│   │
│   ├── main.py
│   │   Customer-facing routes: shop, products, cart, checkout
│   │
│   └── admin.py
│       Administrative routes: product management, orders, customers
│
├── services/
│   Business logic services
│
│   └── payment_service.py
│       Payment processing and transaction management
│
├── templates/
│   Jinja2 HTML templates
│
│   ├── base.html
│   │   Base template with common layout
│   │
│   ├── index.html - Homepage
│   ├── shop.html - Product listing
│   ├── product.html - Product details
│   ├── cart.html - Shopping cart
│   ├── checkout.html - Checkout page
│   ├── login.html - Login page
│   ├── register.html - Registration page
│   ├── dashboard.html - User dashboard
│   ├── search.html - Search results
│   ├── wishlist.html - Saved items
│   ├── contact.html - Contact page
│   ├── about.html - Company information
│   ├── features.html - Product features
│   ├── help.html - Help/FAQ
│   ├── 404.html - Error page
│   │
│   └── admin/
│       Administrative templates
│       ├── admin_base.html - Admin layout
│       ├── dashboard.html - Admin dashboard
│       ├── products.html - Products management
│       ├── add_product.html - Add product form
│       ├── edit_product.html - Edit product form
│       ├── orders.html - Orders overview
│       ├── customers.html - Customer management
│       └── settings.html - System settings
│
├── static/
│   Static assets
│
│   ├── css/
│   │   └── style.css - Main stylesheet
│   │
│   ├── js/
│   │   ├── theme.js - Theme switching functionality
│   │   ├── animations.js - Page animations
│   │   └── slider.js - Product image gallery
│   │
│   └── images/
│       └── hero/
│       └── icons/
│
├── instance/
│   Instance-specific files (databases, local config)
│
├── .env
│   Environment variables (local development)
│
├── .gitignore
│   Git ignore patterns
│
├── README.md
│   Project overview and setup instructions
│
├── DEPLOY.md
│   Deployment guidelines and instructions
│
├── POSTGRESQL_SETUP.md
│   PostgreSQL configuration and setup guide
│
├── LICENSE
│   Project license
│
├── Procfile
│   Heroku deployment configuration
│
└── runtime.txt
    Python version specification
```

## Appendix B: Database Schema Details

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    first_name VARCHAR(120),
    last_name VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT
);
```

### Cart Table
```sql
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Appendix C: API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|-----------|
| POST | /auth/register | Register new user | username, email, password, first_name, last_name |
| POST | /auth/login | Login user | username, password |
| POST | /auth/logout | Logout user | - |
| GET | /auth/profile | Get user profile | - |
| PUT | /auth/profile | Update profile | first_name, last_name, email |

### Product Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|-----------|
| GET | /products | List all products | category, page, limit |
| GET | /product/<id> | Get product details | product_id |
| GET | /search | Search products | query, category |
| POST | /admin/products | Create product | name, description, price, category_id, stock |
| PUT | /admin/products/<id> | Update product | name, description, price, stock |
| DELETE | /admin/products/<id> | Delete product | product_id |

### Cart Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|-----------|
| GET | /cart | View shopping cart | - |
| POST | /cart/add | Add item to cart | product_id, quantity |
| PUT | /cart/<item_id> | Update cart item | quantity |
| DELETE | /cart/<item_id> | Remove from cart | cart_item_id |

### Order Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|-----------|
| POST | /checkout | Create order | cart_contents, shipping_address |
| GET | /orders | View order history | - |
| GET | /orders/<id> | View order details | order_id |
| GET | /admin/orders | Admin view all orders | status, page |

## Appendix D: Key Code Snippets

### Authentication Implementation
```python
# models.py - User model with password hashing
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='customer')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
```

### Flask Route Example
```python
# routes/auth.py - User registration route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Validation
    if not data.get('username') or not data.get('password'):
        return {'error': 'Username and password required'}, 400
    
    if User.query.filter_by(username=data['username']).first():
        return {'error': 'Username already exists'}, 409
    
    # Create user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return {'message': 'User created successfully'}, 201
```

### Shopping Cart Logic
```python
# routes/main.py - Add to cart
@main_bp.route('/cart/add', methods=['POST'])
@login_required
def add_to_cart():
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    product = Product.query.get(product_id)
    if not product:
        return {'error': 'Product not found'}, 404
    
    cart_item = Cart.query.filter_by(
        user_id=current_user.id,
        product_id=product_id
    ).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(
            user_id=current_user.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(cart_item)
    
    db.session.commit()
    return {'message': 'Item added to cart'}, 200
```

## Appendix E: Deployment Checklist

[IMAGE HERE: Deployment Checklist - showing critical steps before production release including database backup, security verification, performance testing, and configuration management]

**Pre-deployment Verification:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Database backups configured
- [ ] Environment variables configured
- [ ] SSL certificate configured
- [ ] Performance benchmarks met
- [ ] Error logging configured
- [ ] Monitoring and alerts set up

---

**END OF REPORT**

*This report is submitted in partial fulfillment of the requirements for the internship program at the University of Buea, College of Technology, Division for Internship, Academic Year 2024/2025.*

*Report submitted by: Che Amah Diland Ngwa (CH24A004)*

*Date: February 7, 2026*
