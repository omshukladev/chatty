import path from "path";
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
import logger from "./utils/logger.js";
import { requestLogger, logExamples } from "./utils/loggerHelpers.js";
import { fileURLToPath } from "url";
//NOTE: always setup .env 1st and global handler at the end as well as 404 handler before that

dotenv.config(); // Load environment variables from .env file

const app = express(); // create express app
// ✅ Proper __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
// ✅ Trust Render proxy (fixes X-Forwarded-For warning)
app.set("trust proxy", 1);
// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use("/api", limiter); // Apply rate limiting to all routes

// Request logging middleware (logs all requests)
app.use(requestLogger);

// Log startup message
logger.info(`Server starting in ${process.env.NODE_ENV} mode`);

// Define Morgan format string
const morganFormat = process.env.NODE_ENV === "development" ? "dev" : "combined";

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          logger.info(message.trim());
        },
      },
    })
  );
}

// Log examples of different log levels
logExamples();

//common middleware
// basic configurations
app.use(express.json({ limit: "5mb" })); // to handle json data
app.use(express.urlencoded({ extended: true, limit: "5mb" })); // to handle form data
app.use(express.static("backend/public")); // to serve static files
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
import messagesRoutes from "./routes/message.route.js";

//routes
app.use("/api", healthcheck);
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);



// -------------------- Serve Frontend in Production --------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // ✅ Catch-all for React routes (must come before 404)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  logger.error(`Global Error Handler: ${err.message}`);

  if (process.env.NODE_ENV === "development") {
    logger.debug(`Stack: ${err.stack}`);
    if (err.errors) {
      logger.debug(`Validation errors: ${JSON.stringify(err.errors)}`);
    }
  }

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

