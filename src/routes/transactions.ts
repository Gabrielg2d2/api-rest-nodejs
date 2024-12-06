import type { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/hello", async function handler() {
    const transactions = await knex("transactions").select("*");

    return transactions;
  });
}
