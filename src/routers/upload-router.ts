import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
// import { validationHandler } from "../middlewares/validation";
// import { userCSVSchema } from "../models/upload";

const uploadRouter = express.Router();

//POST/upload:
uploadRouter.post(
  "/upload",
  authenticateHandler,
  authorize("admin"),
  async (req, res, next) => {
    const fileCSVContent = readFileSync("./users.csv", "utf-8");
    const contenCSV = parse(fileCSVContent, {
      columns: true,
    });
    console.log(contenCSV);
    try {
      const getUsers = await contenCSV;
      res.json({
        ok: true,
        data: {
          success: [getUsers],
        },
      });
    } catch (error) {}
  }
);

export default uploadRouter;
