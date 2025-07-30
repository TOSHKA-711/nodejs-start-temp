import multer from "multer";
import { allowedExtensions } from "../utils/allowedExtensions.js";

export const multerHost = (extensions) => {
  if (!extensions) {
    extensions = allowedExtensions.images;
  }

  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (extensions.includes(file.mimetype)) {
      return cb(null , true);
    }

    cb(new Error("invalid file type", { cause: 400 }));
  };

  const fileUpload = multer({ fileFilter, storage, limits: { files: 4 } });

  return fileUpload;
};