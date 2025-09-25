current readme.md will be update in future as I keep adding more features to the app.
---

# Chatty

A modern, secure, and scalable full-stack chat application built with Node.js, Express, MongoDB, and React. Features robust authentication, email notifications, rate limiting, and industry-standard security practices.

---

## 📁 Folder Structure

```
chatty/
├── Backend.md
├── package.json
├── readme.md
├── backend/
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── healthCheck.controller.js
│   │   ├── message.controller.js
│   │   └── !Controllers.md
│   ├── db/
│   │   └── db.js
│   ├── emails/
│   │   ├── docs.md
│   │   ├── emailHandlers.js
│   │   ├── emailTemplates.js
│   │   └── sendEmail.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validator.middleware.js
│   ├── models/
│   │   ├── message.model.js
│   │   ├── user.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── healthCheck.route.js
│   │   ├── message.route.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   ├── rateLimiters.js
│   │   ├── token.js
│   ├── validators/
│   │   ├── validator.js
│   │   └── !validator.md
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── assets/
│           └── react.svg
```

---

## 🚀 Features

- **User Authentication**: Signup, login, logout with JWT and secure cookies
- **Email Notifications**: Welcome emails via Resend
- **Rate Limiting**: Global and per-route protection against abuse
- **Input Validation**: Express-validator for robust data validation
- **Security**: Helmet, XSS, NoSQL injection, HPP, CORS, bcrypt
- **Error Handling**: Centralized global error handler and custom error classes
- **Scalable Architecture**: MVC pattern, modular code, reusable utilities
- **Environment Config**: Sensitive data managed via .env

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/omshukladev/chatty.git
cd chatty
```

### 2. Install dependencies

```bash
npm install
cd frontend
npm install
```

### 3. Set up environment variables

Create a .env file in the root with your configuration:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Chatty App
```

### 4. Start the backend server

```bash
npm run dev
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

---

## 📦 Backend Structure

- **controllers/**: Route logic (auth, messages, health check)
- **models/**: Mongoose schemas (User, Message)
- **routes/**: API endpoints
- **middlewares/**: Auth, validation, error handling
- **utils/**: Helpers (rate limiters, error/response classes, async handler)
- **emails/**: Email templates, handlers, and service integration
- **validators/**: Express-validator rules

---

## 🔒 Security Highlights

- Helmet for HTTP headers
- XSS and NoSQL injection protection
- Rate limiting (global and per-route)
- Secure cookies and JWT
- Input validation everywhere

---

## 📝 API Endpoints

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout (JWT protected)
- `GET /api/health` — Health check

---

## 🧑‍💻 Contributing

Pull requests and issues are welcome! Please follow best practices and write clean, modular code.

---

## 📄 License

ISC

---

## ✨ Credits

Developed by [omshukladev](https://github.com/omshukladev)

---

Let me know if you want to add usage examples, API docs, or anything else!