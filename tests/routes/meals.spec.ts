import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, it, vi } from 'vitest';
import request from 'supertest';

import { faker } from '@faker-js/faker';
import { app } from '../../src/app';
import { JWT } from '../../src/utils/jwt';
import { MealRepository } from '../../src/repositories/meal-repository';

function createFakeRequestMealData() {
  return {
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.words({ min: 3, max: 5 }),
    datetime: faker.date.recent(),
    within_diet: Math.random() < 0.5,
  };
}

const fakeToken = JWT.createToken({ userId: randomUUID() });

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create a meal and return 201', async () => {
    const fakeMealData = createFakeRequestMealData();
    vi.spyOn(MealRepository.prototype, 'createMeal').mockResolvedValueOnce();

    await request(app.server)
      .post('/meals')
      .auth(fakeToken, { type: 'bearer' })
      .send(fakeMealData)
      .expect(201);
  });

  it('Should return 400 if tries to create meal with missing params', async () => {
    const fakeMealData = createFakeRequestMealData();

    await request(app.server)
      .post('/meals')
      .auth(fakeToken, { type: 'bearer' })
      .send({ ...fakeMealData, name: undefined })
      .expect(400);

    await request(app.server)
      .post('/meals')
      .auth(fakeToken, { type: 'bearer' })
      .send({ ...fakeMealData, datetime: undefined })
      .expect(400);

    await request(app.server)
      .post('/meals')
      .auth(fakeToken, { type: 'bearer' })
      .send({ ...fakeMealData, within_diet: undefined })
      .expect(400);
  });
});
