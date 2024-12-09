import { describe } from "node:test";
import request from "supertest";
import { afterAll, beforeAll, expect, test } from "vitest";
import { app } from "../../app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("Routes Transactions", () => {
  describe("Create Transaction", () => {
    test("Create a new transaction", async () => {
      const response = await request(app.server).post("/transactions").send({
        title: "car",
        amount: 3000,
        type: "credit",
      });

      expect(response.statusCode).toBe(201);
    });

    test("Create a new transaction with invalid amount", async () => {
      const response = await request(app.server).post("/transactions").send({
        title: "car",
        amount: "invalid",
        type: "credit",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("List Transactions", () => {
    test("List transactions", async () => {
      const createTransactionResponse = await request(app.server)
        .post("/transactions")
        .send({
          title: "car",
          amount: 3000,
          type: "credit",
        });

      const cookies = createTransactionResponse.get("Set-Cookie");

      if (!cookies) {
        throw new Error("No cookies set in response");
      }

      const response = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(response.body).toEqual({
        data: {
          transactions: [
            {
              created_at: expect.any(String),
              id: expect.any(String),
              session_id: expect.any(String),
              amount: 3000,
              title: "car",
            },
          ],
        },
        message: { en: "", pt: "" },
        typeMessage: "success",
      });
      expect(response.body).toEqual({
        data: {
          transactions: [
            {
              created_at: expect.any(String),
              id: expect.any(String),
              session_id: expect.any(String),
              amount: 3000,
              title: "car",
            },
          ],
        },
        message: { en: "", pt: "" },
        typeMessage: "success",
      });
    });
  });
});
