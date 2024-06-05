import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { User } from '../models/User';
import { randomUUID } from 'crypto';
import { UserRepository } from '../repositories/user-repository';
import { JWT } from '../utils/jwt';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', { schema: {} }, async (request, reply) => {
    const userSchema = z.object({
      name: z.string(),
      password: z.string(),
      email: z.string().email(),
    });

    const { name, password, email } = userSchema.parse(request.body);

    const user: User = {
      id: randomUUID(),
      name,
      password,
      email,
    };

    const userRepository = new UserRepository();
    await userRepository.createUser(user);

    const token = JWT.createToken({ userId: user.id });
    reply.status(201).send({ token });
  });
}
