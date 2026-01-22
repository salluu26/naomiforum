import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith("video");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
        quality: "auto",
        fetch_format: "auto",
        transformation: isVideo
          ? [
              { quality: "auto" },
              { video_codec: "auto" },
            ]
          : [
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
