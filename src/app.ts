import express from "express";
import cors from "cors";

import { configDotenv } from "dotenv";
import errorHandler from "./middlewares/error";
import authRouter from "./routers/auth-router";
import uploadRouter from "./routers/upload-router";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: true, // http:localhost:5173
  optionsSuccessStatus: 200,
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());

// ROUTERS:
app.use(authRouter);
app.use(uploadRouter);

app.use(errorHandler);
