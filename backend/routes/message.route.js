//NOTE: we need 2 main thing 1st is contacts whinh will show all the users and the 2nd thing will be chats which will show all the messages between the users
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { GlobalLimiter } from "../utils/rateLimiters.js";
import { upload } from "../middlewares/multer.middleware.js";

import { getAllContacts } from "../controllers/message.controller.js";

const router = express.Router();

//? Get all contacts routes get /api/messages/contacts -->getAllContacts
router.get("/contacts", GlobalLimiter, verifyJWT, getAllContacts);

//? Get all users which you are chatting with routes get /api/messages/chats -->getChatPartners
//? Get the user id that shows all the messages b/w them with routes get /api/messages/:id -->getMessagesByUserId
//? send the messages to the user you have selected with routes post /api/messages/send/:id -->sendMessage

export default router;

//* | Route            | Purpose                   | Middlewares                                                     |
//* | ---------------- | ------------------------- | --------------------------------------------------------------- |
//* | GET `/contacts`  | All contacts              | verifyJWT, optional rate limiter                                |
//* | GET `/chats`     | Users you’ve chatted with | verifyJWT, optional rate limiter                                |
//* | GET `/:id`       | Messages with one user    | verifyJWT, optional rate limiter, optional ObjectId validator   |
//* | POST `/send/:id` | Send message              | verifyJWT, optional rate limiter, validator, multer (if images) | 	✅ upload.single("image")
