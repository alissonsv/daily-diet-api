import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id', { primaryKey: true }).notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
