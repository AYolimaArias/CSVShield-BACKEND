import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { ApiError } from "../middlewares/error";
import { UserParams, userCSVSchema } from "../models/upload";
import { ZodError } from "zod";
// import { validationHandler } from "../middlewares/validation";
// import { userCSVSchema } from "../models/upload";

const uploadRouter = express.Router();

//POST/upload:
uploadRouter.post(
  "/upload",
  authenticateHandler,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const fileCSVContent = readFileSync("./upload/users.csv", "utf-8");
      const contentCSV = parse(fileCSVContent, {
        columns: true,
        cast: (value, context) => {
          if (context.column === "age") return Number(value);
          return value;
        },
      });
      console.log(contentCSV);
      const successData: UserParams[] = [];
      const errorData: { row: number; details: Record<string, string> }[] = [];

      // Lógica para procesar los datos y detectar errores
      for (const [index, record] of contentCSV.entries()) {
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
      //   const getUsers = await contenCSV;
      //   if (){}
      res.json({
        ok: true,
        data: {
          success: [successData],
          error: [errorData],
        },
      });
    } catch (error) {
      next(new ApiError("Unauthorized", 401));
    }
  }
);

export default uploadRouter;
