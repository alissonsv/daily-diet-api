import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { UserRepository } from '../../src/repositories/user-repository';
import { User } from '../../src/models/User';
import { faker } from '@faker-js/faker';
import { PasswordHash } from '../../src/utils/password-hash';

function createUserMock(): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    created_at: faker.date.anytime().toString(),
  };
}

describe('Login Route', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a token if an user login successfully', async () => {
    const userMock = createUserMock();

    vi.spyOn(UserRepository.prototype, 'readUserByEmail').mockResolvedValueOnce(
      userMock,
    );
    vi.spyOn(PasswordHash, 'verify').mockResolvedValueOnce(true);

    const response = await request(app.server).post('/login').send({
      email: userMock.email,
      password: userMock.password,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should return 400 if request with missing params', async () => {
    await request(app.server)
      .post('/login')
      .send({
        email: 'any_mail@mail.com',
      })
      .expect(400);
  });

  it('Should return 401 if an user is not found', async () => {
    vi.spyOn(UserRepository.prototype, 'readUserByEmail').mockResolvedValueOnce(
      undefined,
    );

    await request(app.server)
      .post('/login')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(401);
  });

  it('Should return 401 if an user exists but requested with wrong password', async () => {
    const userMock = createUserMock();

    vi.spyOn(UserRepository.prototype, 'readUserByEmail').mockResolvedValueOnce(
      userMock,
    );

    vi.spyOn(PasswordHash, 'verify').mockResolvedValueOnce(false);

    await request(app.server)
      .post('/login')
      .send({
        email: userMock.email,
        password: userMock.password,
      })
      .expect(401);
  });
});
