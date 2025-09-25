// STEP: 1. Import required modules (User, apiError, apiResponse, asyncHandler, utils/mail, crypto)
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../utils/token.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

import dotenv from "dotenv";
dotenv.config();

const signup = asyncHandler(async (req, res) => {
  // STEP: 2. Extract user data (fullName, email, password) from req.body
  const { fullName, email, password } = req.body;
  // STEP: 3. Validate required fields (throw apiError if any missing)
  if (!email || !fullName || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // STEP: 4. Validate email format (regex) and password strength (min length, etc.)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  if (password.length <= 4) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  // STEP: 5. Check if user already exists (by email), throw apiError if found
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User with fullname or email already exists");
  }
  // STEP: 6. Save the new user to the database before.
  const user = await User.create({ fullName: fullName.trim(), email: email.trim(), password });

  //STEP: 7. finding user are created or not and removing password and refresh token
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  // STEP: 8. Create generateAccessAndRefreshTokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  //this line below is added to fix frontend signup bug

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refreshToken
  };
  //STEP: 9. Send welcome email (utils/mail) - try/catch to log errors but not fail signup
  try {
    await sendWelcomeEmail(createdUser.email, createdUser.fullName, process.env.CLIENT_URL);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
  // STEP: 10. sending response to the user
  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: createdUser }, "User registered successfully "));
});

const login = asyncHandler(async (req, res) => {
  // STEP: 2. Extract login data (email/username and password) from req.body
  const { email, password } = req.body;
  // STEP: 3. Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  // STEP: 4. Check if user exists; if not, send error
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  // STEP: 5. Compare provided password with stored hash
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }
  // STEP: 6. If password is correct, generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  // STEP: 7. Send tokens in cookies (using res.cookie and cookie-parser)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refreshToken
  };
  // STEP: 8. Send success response with user info (excluding sensitive data)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
export { signup, login };
