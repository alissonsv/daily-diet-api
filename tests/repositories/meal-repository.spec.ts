import { execSync } from 'node:child_process';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { knex } from '../../src/database';
import { MealRepository } from '../../src/repositories/meal-repository';
import { makeFakeMeal } from '../mocks/meal';
import { randomUUID } from 'node:crypto';

describe('Meal Repository', () => {
  beforeEach(async () => {
    execSync('npm run knex migrate:latest');
  });

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all');
  });

  it('Should create a meal successfully', async () => {
    const sut = new MealRepository();

    const fakeMeal = makeFakeMeal();
    await sut.createMeal(fakeMeal);

    const insertedMeal = await knex('meals').select().first();
    expect(insertedMeal).toEqual({
      id: fakeMeal.id,
      name: fakeMeal.name,
      user_id: fakeMeal.user_id,
      description: fakeMeal.description,
      datetime: fakeMeal.datetime.getTime(),
      within_diet: Number(fakeMeal.within_diet),
    });
  });

  it('Should update a meal successfully', async () => {
    const sut = new MealRepository();
    const fakeMeal = makeFakeMeal();
    await knex('meals').insert(fakeMeal);

    const updatedFakeMeal = {
      ...fakeMeal,
      name: 'a new random name for testing',
    };

    await sut.updateMealById(updatedFakeMeal, fakeMeal.id);

    const updatedMeal = await knex('meals').select().first();

    expect(updatedMeal).toEqual(
      expect.objectContaining({
        id: fakeMeal.id,
        name: updatedFakeMeal.name,
      }),
    );
  });

  it('Should return a meal by its id', async () => {
    const sut = new MealRepository();
    const fakeMeal = makeFakeMeal();

    await knex('meals').insert(fakeMeal);
    const response = await sut.searchMealById(fakeMeal.id);

    expect(response).toEqual(
      expect.objectContaining({
        id: fakeMeal.id,
        name: fakeMeal.name,
        description: fakeMeal.description,
      }),
    );
  });

  it('Should delete a meal by its id', async () => {
    const sut = new MealRepository();
    const fakeMeal = makeFakeMeal();

    await knex('meals').insert(fakeMeal);

    await sut.deleteMealById(fakeMeal.id);

    const deletedMeal = await knex('meals')
      .select()
      .where({ id: fakeMeal.id })
      .first();
    expect(deletedMeal).toBeUndefined();
  });

  it('Should return a list with all meals of an user', async () => {
    const sut = new MealRepository();
    const fakeUserId = randomUUID();

    const fakeMeal1 = makeFakeMeal();
    const fakeMeal2 = makeFakeMeal();
    fakeMeal1.user_id = fakeUserId;
    fakeMeal2.user_id = fakeUserId;

    await knex('meals').insert([fakeMeal1, fakeMeal2]);

    const response = await sut.getMealsOfUser(fakeUserId);

    expect(response).lengthOf(2);
  });

  it('Should return a empty list if an user has no inserted meals', async () => {
    const sut = new MealRepository();

    const response = await sut.getMealsOfUser(randomUUID());
    expect(response).lengthOf(0);
  });
});
