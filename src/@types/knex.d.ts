// eslint-disable-next-line
import { Knex } from 'knex';
import { User } from '../models/User';

declare module 'knex/types/tables' {
  export interface Tables {
    users: User;
  }
}
