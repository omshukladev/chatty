// STEP: 1. Import validationResult from express-validator and ApiError from utils
import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

// STEP: 2. Create middleware function with (req, res, next)
const validate = (req, res, next) => {
  // STEP: 3. Get validation result: const errors = validationResult(req)
  const errors = validationResult(req);
  // STEP: 4. If errors.isEmpty(), call next()
  if (errors.isEmpty()) {
    return next();
  }
  // STEP: 5. If errors exist, map errors.array() to extract { [err.path]: err.msg } and push it inside
  const extractedErrors = [];
  errors.array().map((err) => {
    extractedErrors.push({
      [err.path]: err.msg,
    });
  });
  // STEP: 6. Return or throw ApiError with extracted errors and appropriate status code
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};

export { validate };
