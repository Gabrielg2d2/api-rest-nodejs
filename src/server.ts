import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/", async function handler(request, response) {
  return { hello: "world" };
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
