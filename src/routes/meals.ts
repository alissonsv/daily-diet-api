import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { Meal } from '../models/Meal';
import { checkUserToken } from '../middlewares/check-user-token';
import { MealRepository } from '../repositories/meal-repository';
import {
  validateCreateMealSchema,
  validateUpdateMealSchema,
} from './schemas/meal-schema';
import { z } from 'zod';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserToken] }, async (request, reply) => {
    let parsedMeal;
    try {
      parsedMeal = validateCreateMealSchema(request);
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

  app.patch(
    '/:id',
    { preHandler: [checkUserToken] },
    async (request, reply) => {
      const paramSchema = z.object({ id: z.string().uuid() });
      const { id } = paramSchema.parse(request.params);

      let parsedMeal;
      try {
        parsedMeal = validateUpdateMealSchema(request);
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(400).send({ error: error.message });
        } else {
          console.error(error);
          return reply.status(500).send();
        }
      }

      const mealRepository = new MealRepository();
      const mealToBeUpdated = await mealRepository.searchMealById(id);

      if (!mealToBeUpdated || mealToBeUpdated.user_id !== request.userId) {
        return reply.status(404).send();
      }

      const updatedMeal: Meal = {
        ...mealToBeUpdated,
        ...parsedMeal,
      };

      await mealRepository.updateMealById(updatedMeal, id);
      return reply.send();
    },
  );

  app.delete(
    '/:id',
    { preHandler: [checkUserToken] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);

      const mealRepository = new MealRepository();
      const mealToBeDeleted = await mealRepository.searchMealById(id);

      if (!mealToBeDeleted || mealToBeDeleted.user_id !== request.userId) {
        return reply.status(404).send();
      }

      await mealRepository.deleteMealById(mealToBeDeleted.id);
    },
  );

  app.get('/', { preHandler: [checkUserToken] }, async (request, reply) => {
    const mealRepository = new MealRepository();
    const meals = await mealRepository.getMealsOfUser(request.userId!);

    return reply.status(200).send({
      meals,
    });
  });

  app.get('/summary', { preHandler: [checkUserToken] }, async (request) => {
    const mealRepository = new MealRepository();
    const meals = await mealRepository.getMealsOfUser(request.userId!);

    const totalWithinDiet = meals.reduce((count, meal) => {
      return meal.within_diet ? count + 1 : count;
    }, 0);

    const totalOutsideDiet = meals.reduce((count, meal) => {
      return meal.within_diet ? count : count + 1;
    }, 0);

    let bestStreak = 0;
    let currentStreak = 0;
    for (const meal of meals) {
      if (meal.within_diet) {
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }

    return {
      total: meals.length,
      totalWithinDiet,
      totalOutsideDiet,
      bestStreak,
    };
  });

  app.get(
    '/:meal_id',
    { preHandler: [checkUserToken] },
    async (request, reply) => {
      const paramsSchema = z.object({ meal_id: z.string() });
      const { meal_id } = paramsSchema.parse(request.params);

      const mealRepository = new MealRepository();
      const meal = await mealRepository.searchMealById(meal_id);

      if (!meal || meal.user_id !== request.userId) {
        return reply.status(404).send();
      }

      return reply.status(200).send({
        meal,
      });
    },
  );
}
