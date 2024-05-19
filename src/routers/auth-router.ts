import express from "express";
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/auth";
import { createUser, validateCredentials } from "../services/auth-service";
import jwt from "jsonwebtoken";
import { ApiError } from "../middlewares/error";

const jwtSecret = "ultra-secret";

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
        message: "Signup successful",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      next(new ApiError("Invalid credentials", 400));
    }
  }
);

//POST/login:

authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await validateCredentials(req.body);
    const payload = { userId: user.id, userRole: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });
    res.json({
      ok: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    next(new ApiError("Incorrect credentials", 401));
  }
});

export default authRouter;
