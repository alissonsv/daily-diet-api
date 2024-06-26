import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { faker } from '@faker-js/faker';
import { app } from '../../src/app';
import { JWT } from '../../src/utils/jwt';
import { MealRepository } from '../../src/repositories/meal-repository';
import { makeFakeMeal } from '../mocks/meal';

function createFakeRequestMealData() {
  return {
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.words({ min: 3, max: 5 }),
    datetime: faker.date.recent(),
    within_diet: Math.random() < 0.5,
  };
}

const fakeUserId = randomUUID();
const fakeToken = JWT.createToken({ userId: fakeUserId });

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /meals - Create Meal', () => {
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

  describe('PATCH /meals - Update meal', () => {
    it('Should update a meal and return 200', async () => {
      const fakeMeal = makeFakeMeal();
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce({
        ...fakeMeal,
        user_id: fakeUserId,
      });
      vi.spyOn(
        MealRepository.prototype,
        'updateMealById',
      ).mockResolvedValueOnce();

      await request(app.server)
        .patch(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ name: faker.lorem.word() })
        .expect(200);
    });

    it('Should return 404 if tries to update a meal and it does not exists', async () => {
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(undefined);
      await request(app.server)
        .patch(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ name: faker.lorem.word() })
        .expect(404);
    });

    it('Should return 404 if a user tries to update a meal that does not belong to him', async () => {
      const fakeMeal = makeFakeMeal();
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(fakeMeal);

      await request(app.server)
        .patch(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ name: faker.lorem.word() })
        .expect(404);
    });
  });

  describe('DELETE /meals - Delete Meal', () => {
    it('Should delete a meal and return 200', async () => {
      const fakeMeal = makeFakeMeal();
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce({
        ...fakeMeal,
        user_id: fakeUserId,
      });
      vi.spyOn(
        MealRepository.prototype,
        'deleteMealById',
      ).mockResolvedValueOnce();

      await request(app.server)
        .delete(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send()
        .expect(200);
    });

    it('Should return 404 if a meal does not exists', async () => {
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(undefined);
      await request(app.server)
        .delete(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ name: faker.lorem.word() })
        .expect(404);
    });

    it('Should return 404 if a user tries to delete a meal that does not belong to him', async () => {
      const fakeMeal = makeFakeMeal();
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(fakeMeal);

      await request(app.server)
        .delete(`/meals/${faker.string.uuid()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ name: faker.lorem.word() })
        .expect(404);
    });
  });

  describe('GET /meals - select all meals of an user', () => {
    it('Should return a list with all meals of an user', async () => {
      const fakeMeal1 = makeFakeMeal();
      const fakeMeal2 = makeFakeMeal();
      fakeMeal1.user_id = fakeUserId;
      fakeMeal2.user_id = fakeUserId;

      vi.spyOn(
        MealRepository.prototype,
        'getMealsOfUser',
      ).mockResolvedValueOnce([fakeMeal1, fakeMeal2]);

      const response = await request(app.server)
        .get('/meals')
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.meals).toHaveLength(2);
    });
  });

  describe('GET /meals/summary - return a summary of meals', () => {
    it('Should return an object containing the total of meals of an user', async () => {
      const fakeMeal1 = makeFakeMeal();
      const fakeMeal2 = makeFakeMeal();
      fakeMeal1.user_id = fakeUserId;
      fakeMeal2.user_id = fakeUserId;

      vi.spyOn(
        MealRepository.prototype,
        'getMealsOfUser',
      ).mockResolvedValueOnce([fakeMeal1, fakeMeal2]);

      const response = await request(app.server)
        .get('/meals/summary')
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          total: 2,
        }),
      );
    });

    it('Should return an object containing the total of meals within the diet', async () => {
      const fakeMeal1 = makeFakeMeal();
      const fakeMeal2 = makeFakeMeal();
      fakeMeal1.user_id = fakeUserId;
      fakeMeal1.within_diet = true;
      fakeMeal2.user_id = fakeUserId;
      fakeMeal2.within_diet = false;

      vi.spyOn(
        MealRepository.prototype,
        'getMealsOfUser',
      ).mockResolvedValueOnce([fakeMeal1, fakeMeal2]);

      const response = await request(app.server)
        .get('/meals/summary')
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          totalWithinDiet: 1,
        }),
      );
    });

    it('Should return an object containing the total of meals outside the diet', async () => {
      const fakeMeal1 = makeFakeMeal();
      const fakeMeal2 = makeFakeMeal();
      fakeMeal1.user_id = fakeUserId;
      fakeMeal1.within_diet = true;
      fakeMeal2.user_id = fakeUserId;
      fakeMeal2.within_diet = false;

      vi.spyOn(
        MealRepository.prototype,
        'getMealsOfUser',
      ).mockResolvedValueOnce([fakeMeal1, fakeMeal2]);

      const response = await request(app.server)
        .get('/meals/summary')
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          totalOutsideDiet: 1,
        }),
      );
    });

    it('Should return an object containing the best streak within diet', async () => {
      const fakeMeal1 = makeFakeMeal();
      const fakeMeal2 = makeFakeMeal();
      fakeMeal1.user_id = fakeUserId;
      fakeMeal1.within_diet = true;
      fakeMeal2.user_id = fakeUserId;
      fakeMeal2.within_diet = true;

      vi.spyOn(
        MealRepository.prototype,
        'getMealsOfUser',
      ).mockResolvedValueOnce([fakeMeal1, fakeMeal2]);

      const response = await request(app.server)
        .get('/meals/summary')
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          bestStreak: 2,
        }),
      );
    });
  });

  describe('GET /meals/:id - select meal by id', () => {
    it('Should return 200 and a meal', async () => {
      const fakeMeal = makeFakeMeal();
      fakeMeal.user_id = fakeUserId;

      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(fakeMeal);

      const response = await request(app.server)
        .get(`/meals/${fakeMeal.id}`)
        .auth(fakeToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.meal).toEqual(
        expect.objectContaining({
          id: fakeMeal.id,
          name: fakeMeal.name,
          within_diet: fakeMeal.within_diet,
        }),
      );
    });

    it('Should return 404 if a meal was not found', async () => {
      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(undefined);

      await request(app.server)
        .get(`/meals/${randomUUID()}`)
        .auth(fakeToken, { type: 'bearer' })
        .send()
        .expect(404);
    });

    it('Should return 404 if a meal does not belong to user', async () => {
      const fakeMeal = makeFakeMeal();

      vi.spyOn(
        MealRepository.prototype,
        'searchMealById',
      ).mockResolvedValueOnce(fakeMeal);

      await request(app.server)
        .get(`/meals/${fakeMeal.id}`)
        .auth(fakeToken, { type: 'bearer' })
        .send()
        .expect(404);
    });
  });
});
