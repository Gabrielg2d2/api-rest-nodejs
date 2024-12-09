import type { FastifyInstance, FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { ITypeMessageGlobal } from "../global/types/typeMessage";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

function errorInternalServer(reply: FastifyReply) {
  return reply.status(500).send({
    data: null,
    message: {
      en: "Internal server error",
      pt: "Erro interno do servidor",
    },
    typeMessage: ITypeMessageGlobal.FATAL,
  });
}

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId;

        if (!sessionId) {
          return reply.status(401).send({
            data: null,
            message: {
              en: "Unauthorized",
              pt: "Não autorizado",
            },
            typeMessage: ITypeMessageGlobal.ERROR,
          });
        }

        const transactions = await knex("transactions")
          .where("session_id", sessionId)
          .select("*");

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
        return errorInternalServer(reply);
      }
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const getTransactionSchema = z.object({
          id: z.string().uuid(),
        });

        const verifyParams = getTransactionSchema.safeParse(request.params);

        if (!verifyParams.success) {
          return reply.status(400).send({
            data: null,
            message: {
              en: "Invalid data",
              pt: "Dados inválidos",
            },
            typeMessage: ITypeMessageGlobal.ERROR,
            errors: verifyParams.error.errors,
          });
        }

        const { id } = verifyParams.data;

        const transaction = await knex("transactions").where({ id }).first();

        return reply.status(200).send({
          data: {
            transaction,
          },
          message: {
            en: "",
            pt: "",
          },
          typeMessage: ITypeMessageGlobal.SUCCESS,
        });
      } catch (error) {
        return errorInternalServer(reply);
      }
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (_, reply) => {
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

        return reply.status(200).send({
          data: {
            summary,
          },
          message: {
            en: "",
            pt: "",
          },
          typeMessage: ITypeMessageGlobal.SUCCESS,
        });
      } catch (error) {
        return errorInternalServer(reply);
      }
    }
  );

  app.post(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const createTransactionSchema = z.object({
          title: z.string(),
          amount: z.number(),
          type: z.enum(["credit", "debit"]),
        });

        const verifyBody = createTransactionSchema.safeParse(request.body);

        if (!verifyBody.success) {
          return reply.status(400).send({
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

        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
          sessionId = randomUUID();

          reply.setCookie("sessionId", sessionId, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }

        await knex("transactions").insert({
          id: randomUUID(),
          title: body.title,
          amount: body.type === "credit" ? body.amount : -body.amount,
          session_id: sessionId,
        });

        return reply.status(201).send({
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
        return errorInternalServer(reply);
      }
    }
  );
}
