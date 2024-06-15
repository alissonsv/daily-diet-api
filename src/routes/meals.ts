import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { Meal } from '../models/Meal';
import { checkUserToken } from '../middlewares/check-user-token';
import { MealRepository } from '../repositories/meal-repository';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserToken] }, async (request, reply) => {
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

      return reply
        .status(400)
        .send({ error: `Parametros invalidos: ${errorsList.join(',')}` });
    }

    const { name, description, datetime, within_diet } = parsedMeal.data;

    const meal: Meal = {
      id: randomUUID(),
      user_id: request.userId!,
      name,
      description,
      datetime: new Date(datetime),
      within_diet,
    };

    const mealRepository = new MealRepository();
    await mealRepository.createMeal(meal);

    return reply.status(201).send();
  });
}
