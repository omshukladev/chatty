# current folder structure
```
chatty/
├── Backend.md
├── package.json
├── readme.md
├── backend/
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── healthCheck.controller.js
│   │   ├── message.controller.js
│   │   └── !Controllers.md
│   ├── db/
│   │   └── db.js
│   ├── emails/
│   │   ├── docs.md
│   │   ├── emailHandlers.js
│   │   ├── emailTemplates.js
│   │   └── sendEmail.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validator.middleware.js
│   ├── models/
│   │   ├── message.model.js
│   │   ├── user.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── healthCheck.route.js
│   │   ├── message.route.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   ├── rateLimiters.js
│   │   ├── token.js
│   ├── validators/
│   │   ├── validator.js
│   │   └── !validator.md
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── assets/
│           └── react.svg
```