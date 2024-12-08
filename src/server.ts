import cookie from "@fastify/cookie";
import Fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = Fastify({
  logger: true,
});

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "/transactions",
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  });
