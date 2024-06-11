import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { User } from '../models/User';
import { UserRepository } from '../repositories/user-repository';
import { JWT } from '../utils/jwt';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      name: z.string(),
      password: z.string(),
      email: z.string().email(),
    });

    const parsedUser = userSchema.safeParse(request.body);
    if (!parsedUser.success) {
      return reply.status(400).send({ error: 'Parametros invalidos!' });
    }

    const { name, password, email } = parsedUser.data;
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
