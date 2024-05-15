import { query } from "../db";
import { User } from "../models/auth";

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<User> {
  return (
    await query(
      "INSERT INTO registered_users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, password, role]
    )
  ).rows[0];
}

export async function getUserByEmail(email: string): Promise<User> {
  return (await query("SELECT * FROM registered_users WHERE email=$1", [email]))
    .rows[0];
}
