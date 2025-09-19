import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// NOTE: the thing we are getting from client are email and password  fullname and profile pic all are in string default profile pic will be default-avatar.png
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [4, "Password must be at least 4 characters"],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    profilePic: {
      type: String,
      default: "default-avatar.png",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//bycrpyt

//just save hone se phale use hota hai ye pre hook
// save ,validate , remove ,updateOne, deleteOne , init

userSchema.pre("save", async function (next) {
  //jab mai passowrd update karu tab hi chale ye code
  //basically agar modified nahi hua toh niklo yaha se otherwise run karo code
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  //it takes password hash it 10 times
  next();
});

// custom methods password comprare kar ke true ya false bhej dega
//bycrpt mai use hoga
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //password - client ka hai this.password - ye increpyt wala do db ke pass hai
};

//jsonwebtoken
//jwt hamara ek brear token hai it is a type of key

/* It generates an access token and a refresh token based on the user's ID (user._id).
  Then it stores both tokens in two variables: accessToken and refreshToken.*/
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, //this._id is from mongo db
      email: this.email, //what this line does is whenever we generate access token it will also include email and fullname in the payload
      fullName: this.fullName, //so that whenever we decode the token we can get these details without querying the database again
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
