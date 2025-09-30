// STEP: 1. Import required modules
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../utils/token.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();

const getAllContacts = asyncHandler(async (req, res) => {
  // STEP: 2. Extract userId from req.user (set by verifyJWT middleware)
  const userId = req.user._id;
  // STEP: 3. Validate userId (throw ApiError if missing or invalid)
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  // STEP: 4. Query database for all users except the logged-in user
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
  // STEP: 5. Return response
  res.status(200).json(new ApiResponse(200, filteredUsers));
});

export { getAllContacts };
