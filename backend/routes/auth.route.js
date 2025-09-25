import { Router } from "express";

//importing contollers
import {signup} from "../controllers/auth.controller.js";
import {login} from "../controllers/auth.controller.js";
// import {logout} from "../controllers/auth.controller.js";

//importing middlewares and validators 
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/validator.js"
import { validate } from "../middlewares/validator.middleware.js";
//validator(index.js) its is a method it will collect all the errors and throw them to middleware(validate)then next to route


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

router.post("/signup", userRegisterValidator(), validate, signup);
router.post("/login",loginLimiter, userLoginValidator(), validate, login);
// router.post("/logout", verifyJWT, logout);


export default router;