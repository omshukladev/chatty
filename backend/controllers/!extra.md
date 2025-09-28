# fullname + profile pic upload contoller 

```javascript
// Update User Controller with Multer + Cloudinary
const updateUser = asyncHandler(async (req, res) => {
  const { fullName } = req.body; // ✅ text fields (like fullName) still come from req.body

  // File uploaded by multer (stored temporarily in ./public/temp)
  const profilePicLocalPath = req.file?.path; 

  if (!fullName && !profilePicLocalPath) {
    throw new ApiError(400, "At least one field (fullName or profilePic) is required");
  }

  const userId = req.user._id;

  // Build update object
  const updateData = {};
  if (fullName) updateData.fullName = fullName;

  if (profilePicLocalPath) {
    // Upload the local file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePicLocalPath, {
      folder: "profile_pics",
      resource_type: "auto",
    });

    updateData.profilePic = uploadResponse.secure_url;
  }

  // Update in DB
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

```