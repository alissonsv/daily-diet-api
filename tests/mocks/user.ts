import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

import { User } from '../../src/models/User';

export const makeFakeUser = (): User => {
  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};
