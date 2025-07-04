import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from 'dotenv';

dotenv.config();

let storage;

if (process.env.STORAGE_PROVIDER === 'local') {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, process.env.LOCAL_UPLOAD_DIR || "uploads/");
        },
        filename: (req, file, cb) => {
            const ext = "pdf";
            cb(null, uuidv4() + "." + ext);
        },
    });
} else {
    // In the future, you would add your GCS storage engine here
    // For now, we'll just throw an error if it's not 'local'
    throw new Error("Invalid STORAGE_PROVIDER specified in .env file");
}


export const fileUpload = multer({
   limits: { fileSize: 200000 },
   storage: storage,
   fileFilter: (req, file, cb) => {
      const isValid = file.mimetype === "application/pdf";
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(null, isValid);
   },
});
