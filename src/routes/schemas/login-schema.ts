import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export const validateLoginSchema = (request: FastifyRequest) => {
  const loginSchema = z.object({
    email: z
      .string({ required_error: '"email" deve ser informado!' })
      .email({ message: '"email" invalido!' }),
    password: z.string({ required_error: '"password" deve ser informado!' }),
  });

  const parsedLogin = loginSchema.safeParse(request.body);
  if (!parsedLogin.success) {
    const errorsList = parsedLogin.error.errors.map((error) => error.message);

    throw new Error(`Parametros invalidos: ${errorsList.join(',')}`);
  }

  return parsedLogin.data;
};
