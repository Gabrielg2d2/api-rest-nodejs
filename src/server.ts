import Fastify from "fastify";
import { knex } from "./database";

const app = Fastify({
  logger: true,
});

app.get("/hello", async function handler(request, response) {
  const tables = await knex("sqlite_schema").select("*");

  return tables;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
