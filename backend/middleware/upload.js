import fs from "fs";
import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const storage = useCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "meri-awaj-issues",
        allowed_formats: ["jpg", "jpeg", "png"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
      },
    });

const upload = multer({ storage });
export default upload;

