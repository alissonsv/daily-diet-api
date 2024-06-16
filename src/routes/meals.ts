import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { Meal } from '../models/Meal';
import { checkUserToken } from '../middlewares/check-user-token';
import { MealRepository } from '../repositories/meal-repository';
import { validateMealSchema } from './schemas/meal-schema';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserToken] }, async (request, reply) => {
    let parsedMeal;
    try {
      parsedMeal = validateMealSchema(request);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      } else {
        console.error(error);
        return reply.status(500).send();
      }
    }
    const { name, description, datetime, within_diet } = parsedMeal;

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
