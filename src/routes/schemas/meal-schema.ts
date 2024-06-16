import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export const validateMealSchema = (request: FastifyRequest) => {
  const mealSchema = z.object({
    name: z.string({ required_error: '"name" deve ser informado' }),
    description: z.string().optional(),
    datetime: z
      .string({ required_error: '"datetime" deve ser informado' })
      .datetime({
        message: '"datetime" string invalido! Deve ser em formato UTC.',
      }),
    within_diet: z.boolean({
      required_error: '"within_diet" deve ser informado',
      message: '"within_diet" boolean invalido!',
    }),
  });

  const parsedMeal = mealSchema.safeParse(request.body);
  if (!parsedMeal.success) {
    const errorsList = parsedMeal.error.errors.map((error) => error.message);

    throw new Error(`Parametros invalidos: ${errorsList.join(',')}`);
  }

  return parsedMeal.data;
};
