import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('user_id').notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.datetime('datetime').notNullable();
    table.boolean('within_diet').notNullable();

    table.foreign('user_id').references('users.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
