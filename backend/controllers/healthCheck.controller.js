import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req,res)=>{
  return res.status(200).json(new apiResponse(true,200, "API is working fine health check has been passed", null, null))
})

export { healthCheck }