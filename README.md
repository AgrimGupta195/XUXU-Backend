# XUXU-Backend

A simple and efficient **eCommerce backend** built with **Node.js, Express, MongoDB, and Redis**. This backend supports **user authentication, email verification via OTP, JWT-based security, and product management**.

## 🚀 Features

- **User Authentication**: Register, login, logout, refresh token, and profile retrieval.
- **OTP Verification**: Secure email verification using OTP sent via Gmail.
- **JWT-Based Security**: Protects routes using JSON Web Tokens (JWT).
- **Redis Integration**: Stores refresh tokens securely for session management.
- **Product Management**: Full CRUD operations for products.
- **Modular Code Structure**: Well-organized folders for scalability and maintainability.

## 📂 Project Structure

```
XUXU-Backend/
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── lib/
│   ├── cloudinary.js
│   ├── db.js
│   └── redis.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── models/
│   ├── productModel.js
│   └── userModel.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
└── services/
    └── otpVerification.js
```

## 🛠 Installation & Setup

### 1️⃣ Clone the repository
```sh
$ git clone https://github.com/AgrimGupta195/XUXU-Backend.git
```

### 2️⃣ Install dependencies
```sh
$ npm install
```

### 3️⃣ Create a `.env` file and configure your environment variables:
```env
PORT=4000
MONGO_URL=your_mongodb_connection_string
GMAIL_USER=your_gmail_user
GMAIL_PASSWORD=your_gmail_password
REDIS_URL=your_redis_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

## 🔗 API Endpoints

### 🛡️ Authentication Routes

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | `/api/auth/register`    | Register a new user             |
| POST   | `/api/auth/verifyOtp`   | Verify OTP for email validation |
| POST   | `/api/auth/resendOtp`   | Resend OTP                      |
| POST   | `/api/auth/login`       | User login                      |
| POST   | `/api/auth/logout`      | User logout                     |
| POST   | `/api/auth/refreshToken` | Refresh JWT token               |
| GET    | `/api/auth/getProfile`  | Get user profile (protected)     |

### 🛍️ Product Routes

| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/api/products/`          | Create a new product (protected) |
| GET    | `/api/products/`          | Get all products                |
| GET    | `/api/products/:id`      | Get product by ID               |
| PUT    | `/api/products/:id`      | Update a product (protected)    |
| DELETE | `/api/products/:id`      | Delete a product (protected)    |

⚠️ **Protected routes** require authentication and use the middleware from `authMiddleware.js`.

## 🛠 Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database & ORM
- **Redis** - Token storage
- **JWT (JSON Web Token)** - Authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email sending

### ⭐ Don't forget to **star** this repository if you found it useful! ⭐
