import "dotenv/config";
import { type Knex, knex as setupKnex } from "knex";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not defined");

export const configKnex: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(configKnex);
