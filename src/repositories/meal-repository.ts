import { knex } from '../database';
import { Meal } from '../models/Meal';

export class MealRepository {
  async createMeal(meal: Meal) {
    await knex('meals').insert(meal);
  }

  async searchMealById(id: string) {
    return knex('meals').where({ id }).select().first();
  }

  async updateMealById(meal: Meal, mealId: string) {
    await knex('meals').where({ id: mealId }).update(meal);
  }

  async deleteMealById(mealId: string) {
    await knex('meals').where({ id: mealId }).delete();
  }
}
