import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE "session" (
    "sid" varchar(255) NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  );
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  CREATE INDEX "IDX_session_expire" ON "session" ("expire");
  `);
};
export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE "session";`);
};
