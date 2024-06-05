import { knex } from '../database';
import { User } from '../models/User';

export class UserRepository {
  async createUser(user: User) {
    await knex('users').insert(user);
  }
}
