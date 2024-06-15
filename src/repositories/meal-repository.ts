import { knex } from '../database';
import { Meal } from '../models/Meal';

export class MealRepository {
  async createMeal(meal: Meal) {
    await knex('meals').insert(meal);
  }
}
