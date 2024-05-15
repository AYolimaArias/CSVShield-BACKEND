import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { truncateTable } from "../db/utils";
import { app } from "../app";
import * as db from "../db";

const testRegisteredUsers = [
  {
    name: "Nicole Sofia",
    email: "sofi.123@gmail.com",
    password: "123456",
    role: "admin",
  },
  {
    name: "Testino Diprueba",
    email: "testino@gmail.com",
    password: "123456",
    role: "user",
  },
];

//REGISTERED_USERS TABLE:
describe("SIGNUP API", () => {
  beforeEach(async () => {
    await truncateTable("registered_users");
    const values = testRegisteredUsers
      .map(
        (user) =>
          `('${user.name}','${user.email}','${user.password}','${user.role}')`
      )
      .join(", ");
    let query = `INSERT INTO registered_users (name, email, password, role) VALUES ${values} RETURNING *`;
    await db.query(query);
  });

  //POST/signup:
  it("Should create an account with an encrypted password ", async () => {
    const signupData = {
      name: "Probino",
      email: "probino@gmail.com",
      password: "123456",
      role: "admin",
    };
    const response = await request(app).post("/signup").send(signupData);
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBeTruthy();
  });
});
