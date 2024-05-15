import bcrypt from "bcrypt";
import { User, UserParams } from "../models/auth";
import * as userDB from "../data/auth-data";
import { ApiError } from "../middlewares/error";

//POST/signup:

export async function createUser(data: UserParams): Promise<User> {
  const { name, email, password, role } = data;

  const user = await userDB.getUserByEmail(email);
  if (user) {
    throw new ApiError("Email already exist", 400);
  }

  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);
  const newUser = await userDB.createUser(name, email, hashedPassword, role);
  return newUser;
}
