import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { JWT } from '../utils/jwt';
import { UserRepository } from '../repositories/user-repository';
import { PasswordHash } from '../utils/password-hash';

export async function loginRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const loginSchema = z.object({
      email: z
        .string({ required_error: '"email" deve ser informado!' })
        .email({ message: '"email" invalido!' }),
      password: z.string({ required_error: '"password" deve ser informado!' }),
    });

    const parsedLogin = loginSchema.safeParse(request.body);
    if (!parsedLogin.success) {
      const errorsList = parsedLogin.error.errors.map((error) => error.message);

      return reply
        .status(400)
        .send({ error: `Parametros invalidos: ${errorsList.join(',')}` });
    }

    const { email, password } = parsedLogin.data;

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
  });
}
