// STEP: 1. Import required modules
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//crypto
import { encryptText, decryptText } from "../utils/encryption.js";
//socket
import { getReceiverSocketId, io } from "../socket/socket.js";

import dotenv from "dotenv";
dotenv.config();

//TODO: need to add socket.io 

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

//see all messages between logged-in user and another user
const getMessagesByUserId = asyncHandler(async (req, res) => {
  // STEP: 2. Extract current userId from req.user (set by verifyJWT middleware)
  const userId = req.user._id;
  // STEP: 3. Validate userId (throw ApiError if missing or invalid)
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  // STEP: 4. Extract the other user's id (chat partner) from req.params
  const { id: userToChatId } = req.params;
  // STEP: 5. Validate that param id exists and is valid
  if (!userToChatId) {
    throw new ApiError(400, "User to chat id is required");
  }
  // STEP: 6. Query database for all messages where
  //         (senderId = userId AND receiverId = paramId) OR
  //         (senderId = paramId AND receiverId = userId)
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: userId },
    ],
    //short to get the latest message at the bottom
  })
    .sort({ createdAt: 1 })
    .select("-__v");
  // Decrypt text
  messages.forEach((msg) => {
    if (msg.text) msg.text = decryptText(msg.text);
  });
  // STEP: 7. Return response (sorted by createdAt for readability)
  res.status(200).json(new ApiResponse(200, messages));
});

//This route is supposed to get all users you are chatting with
const getChatPartners = asyncHandler(async (req, res) => {
  // STEP: 1. Extract logged-in user id from req.user (set by verifyJWT middleware) validate it
  const loggedInUserId = req.user._id;
  if (!loggedInUserId) throw new ApiError(400, "User ID is required");
  // STEP: 2. Find all messages where the logged-in user is either sender or receiver
  const messages = await Message.find({
    $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
  });
  // STEP: 3. Extract unique user IDs of chat partners from these messages using set in this map function we are checking if the senderId is same as loggedInUserId then we will take the receiverId else we will take the senderId as
  // basically we are getting the id of the person with whom we are chatting and removing the duplicate ids by using set
  const chatPartnerIds = [
    ...new Set( 
      messages.map((msg) => 
        msg.senderId.toString() === loggedInUserId.toString() // If the logged-in user is the sender
          ? msg.receiverId.toString() // Get the receiverId
          : msg.senderId.toString() // Else, get the senderId
      )
    ),
  ];
  // STEP: 4. Query the User collection to get user details of these chat partners
  //         Exclude sensitive info like password
  //         Use $in operator to find users with _id in chatPartnerIds array
  const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
  // STEP: 5. Return response with list of chat partners
  res.status(200).json(new ApiResponse(200, chatPartners));
});

const sendMessage = asyncHandler(async (req, res) => {
  // STEP: 1. Extract userId from req.user (set by verifyJWT middleware) validate it
  const senderId = req.user?._id;
  if (!senderId) throw new ApiError(400, "Sender ID is required");

  // STEP: 2. Get uploaded file from multer and the receiver id from params validate it
  const receiverId = req.params.id;
  if (!receiverId) throw new ApiError(400, "Receiver ID is required");

  const fileLocalPath = req.file?.path;
  const { text } = req.body;

  if (!fileLocalPath && !text) {
    throw new ApiError(400, "Message must contain either text or an image");
  }
  let encryptedText = text ? encryptText(text) : null; // Encrypt the text if it exists

  // STEP: 3. Upload in cloudinary (if file exists)
  let imageUrl = null;
  if (fileLocalPath) {
    const uploadResponse = await uploadOnCloudinary(fileLocalPath, {
      folder: "chatty",
      resource_type: "auto",
    });
    if (!uploadResponse) throw new ApiError(500, "Failed to upload file to Cloudinary");
    imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
  }

  // STEP: 4. Save in database
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text: encryptedText,
    images: imageUrl,
  });
  // NOTE: SOCKET IO EMIT

  const receiverSocketId = getReceiverSocketId(receiverId); // get the socket id of the receiver
  if (receiverSocketId) { // if the receiver is online
    io.to(receiverSocketId).emit("newMessage", newMessage); // emit the newMessage event to the receiver
  }

  // STEP: 5. Return response
  res.status(200).json(new ApiResponse(200, newMessage, "Message sent successfully"));
});

export { getAllContacts, getMessagesByUserId, getChatPartners, sendMessage };
