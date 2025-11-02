```js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user fromdb
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

```


```js
import multer from "multer";

// Configure how multer will store incoming files locally
const storage = multer.diskStorage({
  // STEP: 1 Decide where to save the uploaded files
  destination: function (req, file, cb) {
    // Save files in "./backend/public/temp" folder
    cb(null, "./backend/public/temp");
  },

  // STEP: 2 Decide the name of the saved file
  filename: function (req, file, cb) {
    // Use the file's original name (as uploaded by client)
    cb(null, file.originalname);
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage, // use the storage rules above
});

```