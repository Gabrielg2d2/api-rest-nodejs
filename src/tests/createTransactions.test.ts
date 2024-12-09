import request from "supertest";
import { beforeAll, expect, test } from "vitest";
import { app } from "../app";

beforeAll(async () => {
  await app.ready();
});

test("Criar transações", async () => {
  const response = await request(app.server).post("/transactions").send({
    title: "car",
    amount: 3000,
    type: "credit",
  });

  expect(response.statusCode).toBe(201);
});
