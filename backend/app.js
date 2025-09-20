import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

//NOTE: always setup .env 1st and global handler at the end as well as 404 handler before that


dotenv.config(); // Load environment variables from .env file



const app = express(); // create express app

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});



// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use("/api", limiter); // Apply rate limiting to all routes


// Logging Middleware
// app.use(morgan("dev"));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//common middleware
// basic configurations
app.use(express.json({ limit: "16kb" }));  // to handle json data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // to handle form data
app.use(express.static("public")); // to serve static files
app.use(cookieParser()); // to handle cookies
// cors configurations
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// console.log("Serving from:", process.env.BASE_URL);
console.log("CORS ORIGIN is:", process.env.CORS_ORIGIN);


//import routes
import healthcheck from "./routes/healthCheck.route.js";
import authRoutes from "./routes/auth.route.js";


//routes
app.use("/api", healthcheck);
app.use("/api/auth", authRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});


//GLOBAL ERROR HANDLER 
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;

// XSS = Cross-Site Scripting
// It’s a type of attack where an attacker injects malicious JavaScript into your app — usually via user input fields (forms, query params, comments, etc.).

// HPP = HTTP Parameter Pollution

// It’s a type of attack where an attacker sends multiple parameters with the same name in a single HTTP request.