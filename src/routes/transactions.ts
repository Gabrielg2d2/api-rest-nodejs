import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { ITypeMessageGlobal } from "../global/types/typeMessage";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    try {
      const transactions = await knex("transactions").select("*");

      return {
        data: {
          transactions,
        },
        message: {
          en: "",
          pt: "",
        },
        typeMessage: ITypeMessageGlobal.SUCCESS,
      };
    } catch (error) {
      return {
        data: { transactions: [] },
        message: {
          en: "Internal server error",
          pt: "Erro interno do servidor",
        },
        typeMessage: ITypeMessageGlobal.FATAL,
      };
    }
  });

  app.get("/:id", async (request) => {
    try {
      const getTransactionSchema = z.object({
        id: z.string().uuid(),
      });

      const verifyParams = getTransactionSchema.safeParse(request.params);

      if (!verifyParams.success) {
        return {
          data: {
            transaction: null,
          },
          message: {
            en: "Invalid data",
            pt: "Dados inválidos",
          },
          typeMessage: ITypeMessageGlobal.ERROR,
          errors: verifyParams.error.errors,
        };
      }

      const { id } = verifyParams.data;

      const transaction = await knex("transactions").where({ id }).first();

      return {
        data: {
          transaction,
        },
        message: {
          en: "",
          pt: "",
        },
        typeMessage: ITypeMessageGlobal.SUCCESS,
      };
    } catch (error) {
      return {
        data: { transaction: [] },
        message: {
          en: "Internal server error",
          pt: "Erro interno do servidor",
        },
        typeMessage: ITypeMessageGlobal.FATAL,
      };
    }
  });

  app.get("/summary", async () => {
    try {
      const transactions = await knex("transactions").select("*");

      const summary = transactions.reduce(
        (acc, transaction) => {
          if (transaction.amount > 0) {
            acc.deposit += transaction.amount;
          } else {
            acc.withdraw += transaction.amount;
          }

          acc.total += transaction.amount;
          return acc;
        },
        {
          deposit: 0,
          withdraw: 0,
          total: 0,
        }
      );

      return {
        data: {
          summary,
        },
        message: {
          en: "",
          pt: "",
        },
        typeMessage: ITypeMessageGlobal.SUCCESS,
      };
    } catch (error) {
      return {
        data: {
          summary: {
            deposit: 0,
            withdraw: 0,
            total: 0,
          },
        },
        message: {
          en: "Internal server error",
          pt: "Erro interno do servidor",
        },
        typeMessage: ITypeMessageGlobal.FATAL,
      };
    }
  });

  app.post("/", async (request, response) => {
    try {
      const createTransactionSchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });

      const verifyBody = createTransactionSchema.safeParse(request.body);

      if (!verifyBody.success) {
        return response.status(400).send({
          data: {
            transaction: null,
          },
          message: {
            en: "Invalid data",
            pt: "Dados inválidos",
          },
          typeMessage: ITypeMessageGlobal.ERROR,
          errors: verifyBody.error.errors,
        });
      }

      const body = verifyBody.data;

      await knex("transactions").insert({
        id: randomUUID(),
        title: body.title,
        amount: body.type === "credit" ? body.amount : -body.amount,
      });

      return response.status(201).send({
        data: {
          transaction: {
            title: body.title,
            amount: body.amount,
            type: body.type,
          },
        },
        message: {
          en: "Transaction created successfully",
          pt: "Transação criada com sucesso",
        },
        typeMessage: ITypeMessageGlobal.SUCCESS,
      });
    } catch (error) {
      return response.status(500).send({
        data: {
          transaction: null,
        },
        message: {
          en: "Internal server error",
          pt: "Erro interno do servidor",
        },
        typeMessage: ITypeMessageGlobal.FATAL,
      });
    }
  });
}
