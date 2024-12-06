import Fastify from "fastify";
import { knex } from "./database";

const app = Fastify({
  logger: true,
});

app.get("/hello", async function handler(request, response) {
  // const newTransaction = await knex("transactions")
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: "Transação Teste",
  //     amount: 400,
  //   })
  //   .returning("*");

  // return newTransaction;

  const transactions = await knex("transactions").select("*");

  return transactions;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
