import { configDotenv } from "dotenv";
import { query, pool } from "..";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

const generateFakeUser = (): User => {
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = faker.internet.email();
  const name = faker.person.firstName();
  const role = faker.helpers.arrayElement(["user", "admin"]);
  return {
    id: 0,
    name,
    email,
    password: hashedPassword,
    role,
  };
};
const insertFakeUsers = async () => {
  try {
    const numUsers = 10;
    const usersToInsert: User[] = Array.from({ length: numUsers }, () =>
      generateFakeUser()
    );

    const values = usersToInsert
      .map(
        (user) =>
          `('${user.name}', '${user.email}', '${user.password}','${user.role}')`
      )
      .join(",");
    const usersQueryText = `INSERT INTO registered_users (name, email, password, role) VALUES ${values}`;
    await query(usersQueryText);
  } catch (error) {
    console.error("Error al insertar datos falsos:", error);
  } finally {
    pool.end();
  }
};
insertFakeUsers();
