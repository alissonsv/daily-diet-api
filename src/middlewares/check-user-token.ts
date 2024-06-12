import { FastifyReply, FastifyRequest } from 'fastify';
import { JWT } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

export async function checkUserToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.headers.authorization) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }

  const [prefix, token] = request.headers.authorization.split(' ');

  if (prefix !== 'Bearer' || !token) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }

  try {
    const parsedToken = JWT.verifyToken(token) as JwtPayload;
    request.userId = parsedToken.userId;
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }
}
