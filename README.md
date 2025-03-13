# XUXU-Backend

A simple ecommerce backend project built with Node.js, Express, MongoDB, and Redis that supports user email verification via OTP.

## Features

- **User Authentication**: Handles registration, login, logout, token refresh, and profile retrieval.
- **OTP Verification**: Secure email verification using OTP sent via Gmail.
- **JWT-Based Security**: Protects routes using JSON Web Tokens.
- **Redis Integration**: Stores refresh tokens securely.
- **Modular Structure**: Organized folders for controllers, routes, models, middlewares, services, and database connections.

## Project Structure
├── .env ├── .gitignore ├── package.json ├── README.md ├── server.js ├── controllers │ └── authController.js ├── lib │ ├── db.js │ └── redis.js ├── middlewares │ └── authMiddleware.js ├── models │ └── userModel.js ├── routes │ └── authRoutes.js └── services └── otpVerification.js


## Installation

1. Clone the repository: `git clone https://github.com/AgrimGupta195/XUXU-Backend.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables.

   ```env
   PORT=4000
   MONGO_URL="your_mongodb_connection_string"
   GMAIL_PASSWORD="your_gmail_password"
   GMAIL_USER="your_gmail_user"
   REDIS_URL="your_redis_connection_string"
   ```

4. Start the server: `npm run dev`

## API Endpoints

- **Register User**: `POST /api/auth/register`
- **Verify OTP**: `POST /api/auth/verifyOtp`
- **Resend OTP**: `POST /api/auth/resendOtp`
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Refresh Token**: `POST /api/auth/refreshToken`
- **Get Profile** (protected): `GET /api/auth/getProfile`

Protected routes are secured using the middleware defined in [`authMiddleware.js`](./middlewares/authMiddleware.js).
