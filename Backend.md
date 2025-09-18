
---

# **Realtime Chat App — Backend PRD (Professional)**

## **1. Project Overview**

This backend powers a full-stack, real-time chat application with the following features:

* User authentication (signup, login, logout) with JWT & cookies
* AES-encrypted message storage
* Real-time messaging with Socket.io
* Soft delete messages feature
* Profile management (avatar, full name)
* API protection with Arcjet & rate limiting

---

## **2. Tech Stack / Packages**

* **Node.js** & **Express**
* **MongoDB** & **Mongoose**
* **Socket.io** for real-time events
* **bcrypt** for password hashing
* **Cloudinary** for profile/image uploads
* **Resend** for transactional emails
* **JWT** for authentication
* **Arcjet** for API protection
* **Misc**: dotenv, cookie-parser, cors, morgan, multer, utils for encryption & async handling

---

## **3. Folder Structure**

```
backend/
│
├── models/
│   ├── index.js          # central export of all models
│   ├── User.js           # User schema with bcrypt
│   └── Message.js        # Message schema with AES encryption
│
├── controllers/
│   ├── authController.js
│   └── messageController.js
│
├── routes/
│   ├── user.route.js
│   ├── message.route.js
│   └── index.js          # central router (optional)
│
├── middlewares/
│   ├── protectRoute.js   # JWT authentication
│   ├── arcjetProtection.js
│   └── errorHandler.js
│
├── sockets/
│   └── index.js          # socket.io event handlers
│
├── utils/
│   ├── apiError.js
│   ├── asyncHandler.js
│   ├── response.js
│   ├── mail.js
│   └── encryption.js     # AES encrypt/decrypt
│
├── db/
│   └── index.js          # MongoDB connection
│
├── config/
│   └── index.js          # JWT secret, Cloudinary, Resend configs
│
├── app.js
└── index.js              # server entry
```

---

## **4. Models**

### **User Model**

| Field      | Type    | Required | Default    | Notes                 |
| ---------- | ------- | -------- | ---------- | --------------------- |
| email      | String  | Yes      | —          | Unique identifier     |
| fullName   | String  | Yes      | —          | Display name          |
| password   | String  | Yes      | —          | Hashed with bcrypt    |
| profilePic | String  | No       | ""         | Cloudinary URL        |
| lastSeen   | Date    | No       | Date.now() | Last online timestamp |
| isOnline   | Boolean | No       | false      | Real-time status      |
| createdAt  | Date    | Auto     | —          | Timestamp             |
| updatedAt  | Date    | Auto     | —          | Timestamp             |

### **Message Model**

| Field         | Type     | Required | Default | Notes                    |
| ------------- | -------- | -------- | ------- | ------------------------ |
| senderId      | ObjectId | Yes      | —       | Reference to User        |
| receiverId    | ObjectId | Yes      | —       | Reference to User        |
| encryptedText | String   | No       | —       | AES encrypted message    |
| image         | String   | No       | —       | Optional image URL       |
| isDeleted     | Boolean  | No       | false   | Soft delete flag         |
| chatId        | ObjectId | No       | —       | Optional for group chats |
| createdAt     | Date     | Auto     | —       | Timestamp                |
| updatedAt     | Date     | Auto     | —       | Timestamp                |

---

## **5. Routes**

### **User / Auth Routes (`/api/auth`)**

| Method | Path     | Middleware       | Controller     | Notes                                                           |
| ------ | -------- | ---------------- | -------------- | --------------------------------------------------------------- |
| POST   | /signup  | arcjetProtection | signup         | Validate, hash pwd, save, send welcome email, return JWT cookie |
| POST   | /login   | arcjetProtection | login          | Compare password, return JWT cookie, update isOnline & lastSeen |
| POST   | /logout  | arcjetProtection | logout         | Clear JWT cookie, set isOnline=false                            |
| PUT    | /profile | protectRoute     | updateProfile  | Update user info, optionally upload profilePic                  |
| GET    | /me      | protectRoute     | getCurrentUser | Return user info excluding password                             |

### **Message Routes (`/api/messages`)**

| Method | Path       | Middleware                      | Controller          | Notes                                       |
| ------ | ---------- | ------------------------------- | ------------------- | ------------------------------------------- |
| GET    | /contacts  | arcjetProtection + protectRoute | getAllContacts      | Fetch all users except self                 |
| GET    | /chats     | arcjetProtection + protectRoute | getChatPartners     | Include last message                        |
| GET    | /\:id      | arcjetProtection + protectRoute | getMessagesByUserId | Decrypt AES text, sort by createdAt         |
| POST   | /send/\:id | arcjetProtection + protectRoute | sendMessage         | Encrypt message, save, emit Socket.io event |
| DELETE | /\:id      | arcjetProtection + protectRoute | deleteMessage       | Soft delete, emit Socket.io event           |

---

## **6. Controllers / Logic**

### **Auth / User Controllers**

* **signup** → input validation, bcrypt hash, save user, send email, JWT cookie
* **login** → check email/password, update lastSeen/isOnline, return JWT
* **logout** → clear JWT, set isOnline=false
* **updateProfile** → Cloudinary image upload, update fullName/profilePic
* **getCurrentUser** → return user object without password

### **Message Controllers**

* **getAllContacts** → fetch all users (excluding self), include online status
* **getChatPartners** → fetch all chat partners + last message
* **getMessagesByUserId** → decrypt messages, sort by timestamp
* **sendMessage** → encrypt text, save message, broadcast via Socket.io
* **deleteMessage** → soft delete, broadcast delete event

---

## **7. Middleware**

* **arcjetProtection** → rate limiting, bot detection
* **protectRoute** → JWT validation, attach user to request
* **errorHandler** → centralized error responses
* **validation** → optional schema validation using zod/joi

---

## **8. Socket.io Events**

| Event         | Description                                   |
| ------------- | --------------------------------------------- |
| connection    | Authenticate JWT, add user to online map      |
| sendMessage   | Broadcast new message to receiver             |
| deleteMessage | Broadcast message deletion                    |
| typing        | Indicate typing status                        |
| disconnect    | Update user `isOnline=false`, update lastSeen |

---

## **9. AES Encryption**

* Use `utils/encryption.js` for encrypt/decrypt functions.
* Only `text` in messages is encrypted, images remain plaintext.
* Decryption occurs on `getMessagesByUserId` before sending to frontend.

---

## **10. Notes / Best Practices**

1. **Consistent JSON responses** → `{ success, data, message }`
2. **Soft delete** → never remove messages from DB, set `isDeleted=true`
3. **Indexes** → optimize queries for messages (`senderId`, `receiverId`, `createdAt`)
4. **Folder separation** → models/controllers/routes/middleware/sockets/utils clearly separated
5. **Scalable** → ready for group chat, notifications, or more models

---

---


