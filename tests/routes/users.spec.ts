import { afterAll, beforeAll, describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { faker } from '@faker-js/faker';
import { UserRepository } from '../../src/repositories/user-repository';

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should insert an user and return a JWT', async () => {
    vi.spyOn(UserRepository.prototype, 'createUser').mockResolvedValueOnce();

    const response = await request(app.server)
      .post('/users')
      .send({
        name: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      })
      .expect(201);

    expect(response.body).toHaveProperty('token');
  });
});
