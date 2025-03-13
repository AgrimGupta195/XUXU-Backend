# XUXU Backend

A simple eCommerce backend built with **Node.js, Express, MongoDB, and Redis** that supports user email verification via OTP.

## 🚀 Features
- **User Authentication**: Registration, login, logout, token refresh, and profile retrieval.
- **OTP Verification**: Secure email verification using OTP.
- **JWT-Based Security**: Protects routes using JSON Web Tokens.
- **Redis Integration**: Securely stores refresh tokens.
- **Product Management**: CRUD operations for products.
- **Cart Management**: Add, update, and remove products.
- **Coupon Management**: Validate and apply discount coupons.
- **Analytics**: Retrieve sales and user analytics.
- **Modular Structure**: Organized controllers, routes, models, middlewares, and services.

## 📂 Project Structure
```
XUXU-Backend/
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── couponController.js
│   └── analyticController.js
├── lib/
│   ├── cloudinary.js
│   ├── db.js
│   └── redis.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── productModel.js
│   ├── userModel.js
│   ├── couponModel.js
│   └── orderModel.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── couponRoutes.js
│   ├── paymentRoutes.js
│   └── analyticRoutes.js
└── services/
    └── otpVerification.js
```

## 🔗 API Endpoints

### 🔑 Authentication Routes
- **Register User**: `POST /api/auth/register`
- **Verify OTP**: `POST /api/auth/verifyOtp`
- **Resend OTP**: `POST /api/auth/resendOtp`
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Refresh Token**: `POST /api/auth/refreshToken`
- **Get Profile**: `GET /api/auth/getProfile` (Protected)

### 🛍️ Product Routes
- **Create Product**: `POST /api/products` (Protected)
- **Get All Products**: `GET /api/products`
- **Get Product by ID**: `GET /api/products/:id`
- **Update Product**: `PUT /api/products/:id` (Protected)
- **Delete Product**: `DELETE /api/products/:id` (Protected)
- **Get Featured Products**: `GET /api/products/featured`
- **Get Recommended Products**: `GET /api/products/recommendations`
- **Get Products by Category**: `GET /api/products/category/:category`
- **Toggle Product Featured Status**: `PATCH /api/products/:id` (Protected)

### 🛒 Cart Routes
- **Get Cart Products**: `GET /api/cart` (Protected)
- **Add to Cart**: `POST /api/cart` (Protected)
- **Remove All from Cart**: `DELETE /api/cart` (Protected)
- **Update Cart Quantity**: `PUT /api/cart/:id` (Protected)

### 🎟️ Coupon Routes
- **Get Coupon**: `GET /api/coupons` (Protected)
- **Validate Coupon**: `POST /api/coupons/validate` (Protected)

### 📊 Analytics Routes
- **Get Analytics Data**: `GET /api/analytics` (Protected, Admin)

⚠️ **Protected routes** are secured using the middleware defined in `authMiddleware.js`.

## 🛠️ Installation & Setup
```sh
# Clone the repository
git clone https://github.com/AgrimGupta195/XUXU-Backend.git

# Install dependencies
npm install

# Start the server
node server.js
```

## 🔧 Environment Variables
Create a `.env` file and configure the following:
```env
PORT=4000
MONGO_URL="your_mongodb_connection_string"
GMAIL_PASSWORD="your_gmail_password"
GMAIL_USER="your_gmail_user"
REDIS_URL="your_redis_connection_string"
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
CLOUDINARY_SECRET="your_cloudinary_secret"
CLOUDINARY_KEY="your_cloudinary_key"
CLOUDINARY_NAME="your_cloudinary_name"
```

