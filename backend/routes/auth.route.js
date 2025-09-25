import { Router } from "express";

import {signup} from "../controllers/auth.controller.js";
import {login} from "../controllers/auth.controller.js";

// NOTE: why we use 2 different limiters?
// Global limiter is for all routes to prevent abuse
// Login limiter is specifically for login route to prevent brute-force attacks

import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable the X-RateLimit headers
});

const router = Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);

export default router;