# Chatty - Secure End-to-End Encrypted Messaging

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-v24.6.0-green" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/Express-v4.21.2-blue" alt="Express Version" />
  <img src="https://img.shields.io/badge/MongoDB-v8.18.1-brightgreen" alt="MongoDB Version" />
  <img src="https://img.shields.io/badge/React-Vite-purple" alt="React with Vite" />
  <img src="https://img.shields.io/badge/Socket.IO-v4-red" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/End--to--End%20Encryption-AES--256--CBC-orange" alt="Encryption" />
</div>

<p align="center">A modern, secure, and scalable full-stack chat application with end-to-end encryption and real-time messaging.</p>


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Real-time Messaging](#-real-time-messaging)
- [Encryption Implementation](#-encryption-implementation)
- [Logging System](#-logging-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **End-to-End Encryption**
  - AES-256-CBC encryption for messages
  - Secure message storage in database
  - Client-side decryption
- **Real-time Communication**
  - Instant message delivery with Socket.IO
  - Online status indicators
  - Typing indicators
  - Read receipts
- **Robust Authentication System**
  - Signup, login, logout functionality with JWT
  - Secure HTTP-only cookies
  - Token refresh mechanism
  - Password hashing with bcrypt
- **User Profile Management**
  - Update profile information
  - Upload profile pictures (with Cloudinary integration)
  - Get current user data
- **Advanced Messaging Features**
  - Text messages with encryption
  - Image sharing with Cloudinary
  - Message history with pagination
  - Optimistic UI updates
- **Email Notifications**
  - Welcome emails via Resend API
  - HTML email templates
- **Advanced Security**
  - Rate limiting (global and per-route)
  - Protection against XSS, CSRF, NoSQL injection
  - Secure headers with Helmet
  - Input validation with Express Validator
- **Sound Effects**
  - Notification sounds
  - Keyboard typing sounds
  - Toggleable sound settings
- **Professional Logging**
  - Winston logger with multiple transports
  - HTTP request logging with Morgan
  - Environment-based log levels

## 🛠️ Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Crypto** - End-to-end encryption (AES-256-CBC)
- **Winston** - Logging
- **Multer** - File uploads
- **Cloudinary** - Cloud storage for images
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Resend** - Email service

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **CryptoJS** - Client-side encryption/decryption
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
chatty/
├── backend/
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   └── healthCheck.controller.js
│   ├── db/                  # Database connection
│   ├── emails/              # Email templates and handlers
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── socket.auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── validator.middleware.js
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── public/              # Static files and uploads
│   │   └── temp/            # Temporary file storage
│   ├── routes/              # API routes
│   ├── socket/              # Socket.IO setup
│   │   └── socket.js
│   ├── utils/               # Helper utilities
│   │   ├── encryption.js    # Encryption/decryption
│   │   ├── apiError.js      # Custom error class
│   │   ├── apiResponse.js   # Response formatter
│   │   ├── asyncHandler.js  # Async error handler
│   │   ├── cloudinary.js    # Cloudinary integration
│   │   ├── logger.js        # Winston logger setup
│   │   ├── loggerHelpers.js # Logging utilities
│   │   ├── token.js         # JWT utilities
│   │   └── rateLimiters.js  # Rate limiting config
│   ├── validators/          # Input validation rules
│   ├── app.js               # Express app setup
│   ├── constants.js         # Application constants
│   └── index.js             # Entry point
├── frontend/                # React frontend (Vite)
│   ├── public/              # Static assets
│   │   └── sounds/          # Sound effects
│   └── src/
│       ├── components/      # UI components
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility libraries
│       │   ├── axios.js     # Axios config
│       │   └── encryption.js # Client-side encryption
│       ├── pages/           # Route pages
│       ├── store/           # Zustand state stores
│       │   ├── useAuthStore.js
│       │   └── useChatStore.js
│       ├── App.jsx          # App component
│       └── main.jsx         # Entry point
├── .env                     # Environment variables
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/omshukladev/chatty.git
   cd chatty
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server
   PORT=4000
   NODE_ENV=development

   # Client URL for CORS
   CLIENT_URL=http://localhost:5173

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   # Encryption
   AES_SECRET=your_32_char_encryption_key

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=onboarding@resend.dev
   EMAIL_FROM_NAME=Chatty App

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   For the frontend, create a `.env` file in the frontend directory:

   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   VITE_SOCKET_URL=http://localhost:4000
   VITE_AES_SECRET_FRONTEND=your_32_char_encryption_key
   ```

4. **Run the Development Server**

   ```bash
   # Backend
   npm run dev

   # Frontend (in a separate terminal)
   cd frontend && npm run dev
   ```

5. **Access the Application**
   - Backend API: `http://localhost:4000`
   - Frontend: `http://localhost:5173`

## 📝 API Documentation

### Auth Endpoints

- **POST** `/api/auth/signup`
  - Register a new user
  - Body: `{ email, password, fullName }`
  - Returns: User object with JWT tokens

- **POST** `/api/auth/login`
  - Login a user
  - Body: `{ email, password }`
  - Returns: User object with JWT tokens

- **POST** `/api/auth/logout`
  - Logout a user (requires authentication)
  - Returns: Success message

- **GET** `/api/auth/me`
  - Get current user data (requires authentication)
  - Returns: User object

- **PUT** `/api/auth/update-profile`
  - Update user profile (requires authentication)
  - Body: Form data with optional `fullName` and `profilePic`
  - Returns: Updated user object

### Message Endpoints

- **GET** `/api/messages/contacts`
  - Get all available contacts (requires authentication)
  - Returns: Array of users

- **GET** `/api/messages/chats`
  - Get all chat partners (requires authentication)
  - Returns: Array of users with whom the current user has chatted

- **GET** `/api/messages/:id`
  - Get messages with a specific user (requires authentication)
  - Returns: Array of messages with decrypted text

- **POST** `/api/messages/send/:id`
  - Send a message to a user (requires authentication)
  - Body: Form data with optional `text` and file
  - Returns: Created message object with decrypted text

### Health Check Endpoint

- **GET** `/api/health`
  - Check API status
  - Returns: Health status information

## 🔒 Security Features

- **End-to-End Encryption**
  - AES-256-CBC algorithm for message encryption
  - Server-side encryption before storing in database
  - Client-side decryption for display
  - Initialization vectors (IV) for added security

- **JWT Authentication**
  - Access tokens and refresh tokens
  - Secure HTTP-only cookies
  - Token invalidation on logout
  - Socket authentication middleware

- **Rate Limiting**
  - Global API rate limits
  - Specific limits for login and signup
  - Protection against brute force attacks

- **Input Validation**
  - Validation for all request data
  - Custom validation error responses

- **Security Headers**
  - HTTP security headers with Helmet
  - XSS protection
  - NoSQL injection protection
  - HTTP Parameter Pollution prevention

- **CORS Configuration**
  - Restricted origin access
  - Credentials support

## 📡 Real-time Messaging

The application implements real-time messaging using Socket.IO:

- **Connection Management**
  - JWT-based authentication for socket connections
  - User tracking with socket mapping
  - Online status tracking and broadcasting

- **Event Handling**
  - New message notifications
  - Online user status updates
  - Typing indicators (in progress)
  - Read receipts (in progress)

- **Optimistic UI Updates**
  - Messages appear instantly before server confirmation
  - Smooth transition to confirmed messages
  - Error handling for failed message delivery


## 📊 Logging System

The application uses Winston for advanced logging:

- **Console Logs**: Colored, formatted logs during development
- **File Logs**:
  - `app.log`: All application logs
  - `error.log`: Error-specific logs
- **HTTP Logging**: Morgan integration for request logging
- **Log Levels**: Different severities (debug, info, warn, error)
- **Environment-Based**: Verbose in development, minimal in production

## 🌐 Deployment

### Production Build

```bash
# Build the frontend
cd frontend
npm run build

# Start production server
cd ..
npm start
````

### Environment Considerations

- Set `NODE_ENV=production` in your production environment
- Ensure all security features are enabled
- Configure proper CORS settings for your domain
- Use HTTPS in production

## 🧑‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Developer

Developed by [Om Shukla](https://github.com/omshukladev)
