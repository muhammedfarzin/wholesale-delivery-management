import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadToCloudinary = async (
  path: string,
  folder: string = "uploads"
) => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder: folder });

    return data.secure_url;
  } catch (err) {
    throw err;
  }
};

export const removeFromCloudinary = async (path: string) => {
  const publicId = path.split("/").slice(-2).join("/").split(".")[0];
  cloudinary.uploader.destroy(publicId, (error) => {
    if (error) return console.log(error);
  });
};
