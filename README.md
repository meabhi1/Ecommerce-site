🛒 E-Commerce Web Application

A full-stack E-Commerce Web Application that allows users to browse products, add items to cart, and place orders. The project includes authentication, product management, and order handling using a Node.js + Express + SQL backend.

🚀 Features
🔐 User Authentication (Signup / Login)
🛍️ Product Listing (Clothes, Electronics, Smartphones)
🛒 Add to Cart functionality
➕ Increase / ➖ Decrease quantity
💳 Order placement system
📦 Order success page
📡 Backend API integration
💾 Database connectivity (SQL)
🏗️ Tech Stack
Frontend:
HTML5
CSS3
JavaScript
Backend:
Node.js
Express.js
Database:
SQL (MySQL / similar)
📂 Project Structure
project/
│── index.html          # Homepage
│── login.html          # Login page
│── signup.html         # Signup page
│── clothes.html        # Clothes category
│── Electronic.html     # Electronics category
│── Smartphone.html     # Smartphones category
│── script.js           # Frontend logic
│── style.css           # Styling
│
│── server.js           # Main backend server
│── db.js               # Database connection
│
│── routes/
│   ├── auth.js         # Authentication routes
│   ├── products.js     # Product routes
│   └── orders.js       # Order routes
│
│── images/             # Product images
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/ecommerce-project.git
cd ecommerce-project
2️⃣ Install dependencies
npm install
3️⃣ Configure Database
Create a SQL database
Update credentials in db.js
4️⃣ Run the server
node server.js
5️⃣ Open in browser
http://localhost:3000
🔌 API Endpoints
Auth
POST /signup → Register user
POST /login → Login user
Products
GET /products → Get all products
Orders
POST /order → Place order
📸 Screens Included
Homepage UI
Product pages
Cart system
Order success page
🎯 Future Enhancements
💳 Payment Gateway Integration
🧑 Admin Dashboard
⭐ Product Reviews & Ratings
🔍 Advanced Search & Filters
📱 Responsive Mobile UI
