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

//POST/login:

export async function validateCredentials(
  credentials: UserParams
): Promise<User> {
  const { email, password } = credentials;
  const user = await userDB.getUserByEmail(email);
  const isValid = await bcrypt.compare(password, user?.password || "");
  if (!user || !isValid) {
    throw new ApiError("Incorrect credentials", 401);
  }
  return user;
}
