# Algorithms and Other Notes

**Signup STEPS**

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

**Login STEPS**

```js
// STEP: 1. Import required modules (models, utils, cookie-parser, etc.)
// STEP: 2. Extract login data (email/username and password) from req.body
// STEP: 3. Validate required fields
// STEP: 4. Check if user exists; if not, send error
// STEP: 5. Compare provided password with stored hash
// STEP: 6. If password is correct, generate access and refresh tokens
// STEP: 7. Send tokens in cookies (using res.cookie and cookie-parser)
// STEP: 8. Send success response with user info (excluding sensitive data)
```

**Logout STEPS**

```js
// STEP: 1. Get user ID from req.user._id (set by verifyJWT middleware)
// STEP: 2. Find user in DB and set refreshToken to empty string by using $set no need to hold this variable
// STEP: 3. Save updated user and get the latest user object
// STEP: 4. Clear accessToken and refreshToken cookies using cookie options
// STEP: 5. Send a success response with the updated user info
```

**getCurrentUser STEPS**

```js
// STEP: 1. Create an async arrow function for the controller
// STEP: 2. Get the user info from req.user (set and sanitized by verifyJWT middleware)
// STEP: 3. Send a response with the user info and a success message
```

**getCurrentUser STEPS**

```js
// STEP: 1. Create an async arrow function for the controller
// STEP: 2. Extract the data from client you want to update and validate it
// STEP: 3. Get the user info from req.user (set and sanitized by verifyJWT middleware)
// STEP: 4. Find the user in the database using the ID from req.user
// STEP: 5. Update the image in cloudinary 
// STEP: 6. Update the user fields in db by find by id and update and do new true to get the updated user
// STEP: 7. Send a response with the updated user info and a success message
```