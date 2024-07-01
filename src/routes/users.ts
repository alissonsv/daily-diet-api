import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { User } from '../models/User';
import { UserRepository } from '../repositories/user-repository';
import { JWT } from '../utils/jwt';
import { validateUserSchema } from './schemas/user-schema';
import { userSwaggerSchema } from './swagger-schema/users';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', { schema: userSwaggerSchema }, async (request, reply) => {
    let parsedUser;
    try {
      parsedUser = validateUserSchema(request);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      } else {
        console.error(error);
        return reply.status(500).send();
      }
    }
    const { name, password, email } = parsedUser;

    const user: User = {
      id: randomUUID(),
      name,
      password,
      email,
    };

    const userRepository = new UserRepository();
    await userRepository.createUser(user);

    const token = JWT.createToken({ userId: user.id });
    return reply.status(201).send({ token });
  });
}
