import { execSync } from 'node:child_process';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { UserRepository } from '../../src/repositories/user-repository';
import { knex } from '../../src/database';
import { makeFakeUser } from '../mocks/user';

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

  it('Should select an user by its email and return it', async () => {
    const fakeUser = makeFakeUser();
    const sut = new UserRepository();

    await sut.createUser(fakeUser);

    const selectedUser = await sut.readUserByEmail(fakeUser.email);
    expect(selectedUser).toEqual(
      expect.objectContaining({
        name: fakeUser.name,
        email: fakeUser.email,
      }),
    );
  });
});
