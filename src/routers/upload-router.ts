import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { readFileSync, unlinkSync } from "fs";
import { parse } from "csv-parse/sync";
import { ApiError } from "../middlewares/error";
import { UserParams, userCSVSchema } from "../models/upload";
import { ZodError } from "zod";
import * as db from "../db";

import multer from "multer";
// import { truncateTable } from "../db/utils";

const uploadRouter = express.Router();

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
      return cb(new Error("Only allow .csv files"));
    }
    cb(null, true);
  },
});

//POST/upload:
uploadRouter.post(
  "/upload",
  authenticateHandler,
  authorize("admin"),
  upload.single("CSVFile"),
  async (req, res, next) => {
    console.log(req.file);
    try {
      if (!req.file) {
        throw new ApiError("No file uploaded", 400);
      }
      const fileCSVContent = readFileSync(req.file.path, "utf-8");
      const parsedCSV = parse(fileCSVContent, {
        columns: true,
        cast: (value, context) => {
          if (context.column === "age") return Number(value);
          return value;
        },
      });
      console.log(parsedCSV);
      const successData: UserParams[] = [];
      const errorData: { row: number; details: Record<string, string> }[] = [];

      // Lógica para procesar los datos y detectar errores
      for (const [index, record] of parsedCSV.entries()) {
        try {
          // Validar el registro según el esquema de Zod
          const validatedRecord = userCSVSchema.parse(record);
          successData.push(validatedRecord);
        } catch (validationError: any) {
          const details: Record<string, string> = {};
          // Convertir los errores de validación de Zod a un objeto plano de detalles de error
          (validationError as ZodError).errors.forEach((error) => {
            details[error.path[0]] = error.message;
          });
          // Agregar el registro con errores al array de datos erróneos
          errorData.push({ row: index + 1, details: details });
        }
      }
      // await truncateTable("users");
      const values = successData
        .map((user) => `('${user.name}','${user.email}','${user.age}')`)
        .join(", ");
      let query = `INSERT INTO users (name, email, age) VALUES ${values}  RETURNING id,name,email,age`;
      const insertUsers = await db.query(query);

      res.json({
        ok: true,
        data: {
          success: [insertUsers.rows],
          error: [errorData],
        },
      });
      unlinkSync(req.file.path);
    } catch (error) {
      if (req.file) {
        unlinkSync(req.file.path);
      }
      next(error);
    }
  }
);

export default uploadRouter;
