import { FastifyRequest } from 'fastify';
import { z } from 'zod';

const mealSchema = z.object({
  name: z.string({ required_error: '"name" deve ser informado' }),
  description: z.string().optional(),
  datetime: z.coerce.date(),
  within_diet: z.boolean({
    required_error: '"within_diet" deve ser informado',
    message: '"within_diet" boolean invalido!',
  }),
});

export const validateCreateMealSchema = (request: FastifyRequest) => {
  const parsedMeal = mealSchema.safeParse(request.body);
  if (!parsedMeal.success) {
    const errorsList = parsedMeal.error.errors.map((error) => error.message);

    throw new Error(`Parametros invalidos: ${errorsList.join(',')}`);
  }

  return parsedMeal.data;
};

export const parseUpdateMealSchema = (request: FastifyRequest) => {
  const partialMealSchema = mealSchema.partial();

  return partialMealSchema.parse(request.body);
};
