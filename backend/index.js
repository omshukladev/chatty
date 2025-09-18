import dotenv from "dotenv"
import app from "./app.js";
// import { connect } from "mongoose";  -- practice purpose delete this line if no use 
import connectDB from "./db/db.js";


dotenv.config({
  path: "./.env" //it is a secrect
})
const PORT = process.env.PORT || 8000
// console.log("Serving from:", process.env.BASE_URL);
console.log("CORS ORIGIN is:", process.env.CORS_ORIGIN);

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
    console.log (` ⚙️ SERVER IS RUNNING ON PORT => ${PORT}`)
  })
})
.catch((err)=>{
  console.log("Mongodb connection error",err)
})
