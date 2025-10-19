```js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import app from "../app.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const server = http.createServer(app); // Create HTTP server using Express app

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
```


```js
import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const server = http.createServer(app);

// Initialize Socket.IO with CORS and credentials
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Map to store userId → socketId
const userSocketMap = new Map(); 

// Helper to get a user's socketId
export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

// ✅ Apply authentication middleware
io.use(socketAuthMiddleware);

// ✅ Handle socket connection
io.on("connection", (socket) => {
  const user = socket.user;

  if (!user?._id) {
    console.warn("⚠️  Socket connected without valid user");
    socket.disconnect();
    return;
  }

  userSocketMap.set(user._id.toString(), socket.id);

  console.log(`✅ ${user.fullName} connected | ID: ${socket.id}`);

  // Notify all clients of online users
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  // Handle disconnection
  socket.on("disconnect", () => {
    userSocketMap.delete(user._id.toString());
    console.log(`❌ ${user.fullName} disconnected`);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, server };

```