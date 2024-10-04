
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTableIfNotExists('users', function (table) {
       table.uuid('id').primary().defaultTo(uuidv4());
       table.string('username').notNullable();
       table.string('email').notNullable().unique();
      table.string('password').notNullable();
    //   table.string('verificationlevel').defaultTo('Bronze');
       table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema.dropTableIfExists('users');
};
