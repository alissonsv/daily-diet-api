import { execSync } from 'node:child_process';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { makeFakeUser } from '../mocks/user';
import { knex } from '../../src/database';
import { Meal } from '../../src/models/Meal';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { MealRepository } from '../../src/repositories/meal-repository';

const fakeUser = makeFakeUser();

const makeFakeMeal = (): Meal => {
  return {
    id: randomUUID(),
    user_id: fakeUser.id,
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.words({ min: 3, max: 10 }),
    datetime: faker.date.recent(),
    within_diet: Math.random() < 0.5,
  };
};

describe('Meal Repository', () => {
  beforeEach(async () => {
    execSync('npm run knex migrate:latest');

    await knex('users').insert(fakeUser);
  });

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all');
  });

  it.only('Should create a meal successfully', async () => {
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
});
