// NOTE: we are going to make an scheema for message that have senderid recevier id and text and images and time stamp .Senderid and reciver id will be refrence of user model and text and images will be string and time stamp will be date

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: 2000,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
