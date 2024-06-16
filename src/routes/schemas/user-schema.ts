import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export const validateUserSchema = (request: FastifyRequest) => {
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

    throw new Error(`Parametros invalidos: ${errorsList.join(',')}`);
  }

  return parsedUser.data;
};
