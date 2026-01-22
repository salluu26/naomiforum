import multer from "multer";

/**
 * ✅ Upload middleware for POSTS (images + videos)
 * Uses memory storage for Cloudinary
 */
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ 100MB (videos need this)
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(
        new Error(
          "Unsupported file type. Only images and videos are allowed."
        ),
        false
      );
    } else {
      cb(null, true);
    }
  },
});

export default upload;
