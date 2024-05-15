import express from "express";
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/auth";
import { createUser } from "../services/auth-service";
// import jwt from "jsonwebtoken";

// const jwtSecret = "ultra-secret";

const authRouter = express.Router();

//POST/signup:
authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      res.status(201).json({
        ok: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
