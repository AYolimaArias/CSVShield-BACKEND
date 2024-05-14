import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    age INTEGER CHECK (age > 0) NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
  );
  `);
};
export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE USERS`);
};
