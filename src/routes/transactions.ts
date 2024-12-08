import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { ITypeMessageGlobal } from "../global/types/typeMessage";

export async function transactionsRoutes(app: FastifyInstance) {
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
          data: null,
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
          title: body.title,
          amount: body.amount,
          type: body.type,
        },
        message: {
          en: "Transaction created successfully",
          pt: "Transação criada com sucesso",
        },
        typeMessage: ITypeMessageGlobal.SUCCESS,
      });
    } catch (error) {
      return response.status(500).send({
        data: null,
        message: {
          en: "Internal server error",
          pt: "Erro interno do servidor",
        },
        typeMessage: ITypeMessageGlobal.FATAL,
      });
    }
  });
}
