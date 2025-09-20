# Algorithms and Other Notes

```js

// STEP: 1. Import required modules (User, apiError, apiResponse, asyncHandler, utils/mail, crypto)
// STEP: 2. Extract user data (fullName, email, password) from req.body
// STEP: 3. Validate required fields (throw apiError if any missing)
// STEP: 4. Validate email format (regex) and password strength (min length, etc.)
// STEP: 5. Check if user already exists (by email), throw apiError if found
// STEP: 6. Save the new user to the database before.
// STEP: 7. finding user are created or not and removing password and refresh token
// STEP: 8. Create generateAccessAndRefreshTokens
// STEP: 9. Send welcome email (utils/mail) - try/catch to log errors but not fail signup
// STEP: 10. sending response to the user
```
