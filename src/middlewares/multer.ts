import multer from "multer";
import { NextFunction, Request, Response } from "express";

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Solo se permiten archivos .csv"));
    }
    cb(null, true);
  },
}).single("file");

// Middleware de Multer para manejar la carga de archivos
const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("Error al cargar el archivo:", err);
    } else {
      console.log("Archivo cargado correctamente:", req.file);
    }
    next();
  });
};

export default multerMiddleware;
