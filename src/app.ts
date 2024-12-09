import cookie from "@fastify/cookie";
import Fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";

export const app = Fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "/transactions",
});
