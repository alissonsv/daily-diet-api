import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { User } from '../../src/models/User';
import { UserRepository } from '../../src/repositories/user-repository';
import { knex } from '../../src/database';

const makeFakeUser = (): User => {
  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

describe('UserRepository', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:latest');
  });

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all');
  });

  it('Should create an user on database successfully', async () => {
    const fakeUser = makeFakeUser();
    const sut = new UserRepository();
    await sut.createUser(fakeUser);

    const insertedUser = await knex('users').select().first();
    expect(insertedUser).toEqual(
      expect.objectContaining({
        name: fakeUser.name,
        email: fakeUser.email,
      }),
    );
  });

  it('Should store user password with a hashed password', async () => {
    const fakeUser = makeFakeUser();
    const sut = new UserRepository();

    await sut.createUser(fakeUser);

    const insertedUser = await knex('users').select().first();
    expect(insertedUser?.password).not.toEqual(fakeUser.password);
  });
});
