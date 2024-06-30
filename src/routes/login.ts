import { FastifyInstance } from 'fastify';

import { JWT } from '../utils/jwt';
import { UserRepository } from '../repositories/user-repository';
import { PasswordHash } from '../utils/password-hash';
import { validateLoginSchema } from './schemas/login-schema';
import { loginSwaggerSchema } from './swagger-schema/login';

export async function loginRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: loginSwaggerSchema,
    },
    async (request, reply) => {
      let parsedLogin;
      try {
        parsedLogin = validateLoginSchema(request);
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(400).send({ error: error.message });
        } else {
          console.error(error);
          return reply.status(500).send();
        }
      }
      const { email, password } = parsedLogin;

      const userRepository = new UserRepository();
      const user = await userRepository.readUserByEmail(email);
      if (!user) {
        return reply.status(401).send({ error: 'Email ou senha invalidos!' });
      }

      const isPasswordCorrect = await PasswordHash.verify(
        user.password,
        password,
      );
      if (!isPasswordCorrect) {
        return reply.status(401).send({ error: 'Email ou senha invalidos!' });
      }

      const token = JWT.createToken({ userId: user.id });
      return { token };
    },
  );
}
