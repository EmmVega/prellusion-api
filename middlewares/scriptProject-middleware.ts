import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const fileUpload = multer({
   limits: { fileSize: 200000 },
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
         const ext = "pdf";
         cb(null, uuidv4() + "." + ext);
      },
   }),
   fileFilter: (req, file, cb) => {
      const isValid = file.mimetype === "application/pdf";
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(null, isValid);
   },
});
