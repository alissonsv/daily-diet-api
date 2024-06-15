// eslint-disable-next-line
import { Knex } from 'knex';
import { User } from '../models/User';
import { Meal } from '../models/Meal';

declare module 'knex/types/tables' {
  export interface Tables {
    users: User;
    meals: Meal;
  }
}
