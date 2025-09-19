import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  //grab token from cookies or headers
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
    //why we use replace? because the token is sent as a Bearer token in the Authorization header so we replace this with empty string

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  //above one was undecoded token we were just trying to fet hold of that token but what if i get it then i will decode it using try catch and will find the user by id and compare our token 

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken ", //-emailVerificationToken -emailVerificationExpiry maybe add this if want to send email verification token as well
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    //-----------here is what you are looking for------------------
    req.user = user; // Attach user information to the request object why we do this ? because we want to access user information in the next middleware or route handler
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
