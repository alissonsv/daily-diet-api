import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';

import { Meal } from '../../src/models/Meal';

export const makeFakeMeal = (): Meal => {
  return {
    id: randomUUID(),
    user_id: randomUUID(),
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.words({ min: 3, max: 10 }),
    datetime: faker.date.recent(),
    within_diet: Math.random() < 0.5,
  };
};
