import { Router } from "express";

//importing contollers
import { signup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

//importing middlewares and validators
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { loginLimiter,signupLimiter } from "../utils/rateLimiters.js";
//validator(index.js) its is a method it will collect all the errors and throw them to middleware(validate)then next to route

const router = Router();

router.post("/signup", signupLimiter, userRegisterValidator(), validate, signup);
router.post("/login", loginLimiter, userLoginValidator(), validate, login);
router.post("/logout", verifyJWT, logout);

export default router;
