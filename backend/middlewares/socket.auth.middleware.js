import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Extract cookies (example: "jwt=abc123; another=xyz")
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Unauthorized - No cookies provided"));
    }

    // Extract access token (assuming you set cookie name as 'accessToken')
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      console.log("❌ No accessToken found in cookies");
      return next(new Error("Unauthorized - No token found"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded._id) {
      console.log("❌ Invalid or expired access token");
      return next(new Error("Unauthorized - Invalid token"));
    }

    // Find the user
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      console.log("❌ Socket rejected: User not found in DB");
      return next(new Error("Unauthorized - User not found"));
    }

    // Attach user info to socket
    socket.user = user;

    console.log(`🔐 Socket authenticated: ${user.fullName} (${user._id})`);
    next();
  } catch (err) {
    console.error("⚠️ Socket authentication failed:", err.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
