import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { User } from '../models/User';
import { UserRepository } from '../repositories/user-repository';
import { JWT } from '../utils/jwt';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      name: z.string({ required_error: '"name" deve ser informado!' }),
      password: z.string({ required_error: '"password" deve ser informado!' }),
      email: z
        .string({ required_error: '"email" deve ser informado!' })
        .email({ message: '"email" invalido!' }),
    });

    const parsedUser = userSchema.safeParse(request.body);
    if (!parsedUser.success) {
      const errorsList = parsedUser.error.errors.map((error) => error.message);

      return reply
        .status(400)
        .send({ error: `Parametros invalidos: ${errorsList.join(',')}` });
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
