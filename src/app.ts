import express from "express";
import cors from "cors";

import { configDotenv } from "dotenv";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: process.env["CLIENT_ORIGIN"], // http:localhost:5173
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(sessionHandler());
// app.use(errorHandler);

// Configuración de rutas
