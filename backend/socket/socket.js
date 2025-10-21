import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const userSocketMap = {}; // { userId: socketId }
let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user._id; 
    console.log("✅ User connected:", socket.user.fullName);

    // Save the user's socket ID
    userSocketMap[userId] = socket.id;

    // Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // When user disconnects
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.user.fullName);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

//  Function to get a user's socket ID (to check if they're online)
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
