import { describe, it, expect } from "vitest";
import request from "supertest";
import { truncateTable } from "../db/utils";
import { app } from "../app";

//REGISTERED_USERS TABLE:
describe("SIGNUP API", () => {
  truncateTable("registered_users");

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

  //POST/login:
  it("Should login the account created", async () => {
    const loginData = {
      email: "probino@gmail.com",
      password: "123456",
    };
    const response = await request(app).post("/login").send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
  });

  it("Should return an error if my email or paswword are invalid", async () => {
    const loginData = {
      email: "probino@.com",
      password: "123456",
    };
    const response = await request(app).post("/login").send(loginData);
    expect(response.statusCode).toBe(401);
    expect(response.body.ok).toBeFalsy();
  });
});
