import type { FastifyReply, FastifyRequest } from "fastify";
import { ITypeMessageGlobal } from "../global/types/typeMessage";

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
}
