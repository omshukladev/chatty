import multer from "multer";

// Configure how multer will store incoming files locally
const storage = multer.diskStorage({
  // STEP: 1 Decide where to save the uploaded files
  destination: function (req, file, cb) {
    // Save files in "./backend/public/temp" folder
    cb(null, "./backend/public/temp");
  },

  // STEP: 2 Decide the name of the saved file
  filename: function (req, file, cb) {
    // Use the file's original name (as uploaded by client)
    cb(null, file.originalname);
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage, // use the storage rules above
});
