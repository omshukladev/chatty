// index.js
import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

// Create HTTP server with Express app
const server = http.createServer(app);

console.log("CORS ORIGIN is:", process.env.CORS_ORIGIN);

// Connect to MongoDB, then start server + initialize Socket.IO
connectDB()
  .then(() => {
    // Initialize Socket.IO after DB and app are ready
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`⚙️ SERVER IS RUNNING ON PORT => ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongodb connection error:", err);
  });
