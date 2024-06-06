import { knex } from '../database';
import { User } from '../models/User';
import { PasswordHash } from '../utils/password-hash';

export class UserRepository {
  async createUser(user: User) {
    const hashedPassword = await PasswordHash.hash(user.password);

    await knex('users').insert({
      ...user,
      password: hashedPassword,
    });
  }

  async readUserByEmail(email: string): Promise<User | undefined> {
    return knex('users')
      .where({
        email,
      })
      .first();
  }
}
