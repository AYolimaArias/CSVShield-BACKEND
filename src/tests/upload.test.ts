import { describe, it, expect } from "vitest";
import request from "supertest";
import { truncateTable } from "../db/utils";
import { app } from "../app";

const jwt = require("jsonwebtoken");
const jwtSecret = "ultra-secret";

//USERS TABLE:
describe("UPLOAD API", () => {
  truncateTable("registered_users");

  //POST/signup:
  it("Should create an account with an encrypted password ", async () => {
    const signupData = {
      name: "Alejandro",
      email: "alejo@gmail.com",
      password: "123456",
      role: "admin",
    };
    const response = await request(app).post("/signup").send(signupData);
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBeTruthy();
  });

  //POST/login:
  it("Should login the account created", async () => {
    const loginData = {
      email: "alejo@gmail.com",
      password: "123456",
    };
    const response = await request(app).post("/login").send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
  });

  //POST/Update:

  it("Should only an 'admin' role to upload the CSV files ", async () => {
    //TOKEN
    const payload = { userId: 2, userRole: "admin" };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });
    let response = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
