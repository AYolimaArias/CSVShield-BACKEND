import { NextFunction, Request, Response } from "express";
import { User } from "../models/auth";
import { ApiError } from "./error";

export function authorize(...allowedRoles: User["role"][]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const role = req.userRole;
    if (!role) return next(new ApiError("Unauthorized", 401));

    if (allowedRoles.includes(role as User["role"])) {
      next();
    } else {
      next(new ApiError("Acceso denegado", 403));
    }
  };
}
