import multer from "multer";
import { NextFunction, Request, Response } from "express";

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only .csv files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("error uploading file", err);
    } else {
      console.log("success uploading file", req.file);
    }
    next();
  });
};

export default multerMiddleware;
