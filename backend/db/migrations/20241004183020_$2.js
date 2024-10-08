
const { v4: uuidv4 } = require('uuid');
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
      table.string('verificationlevel').defaultTo('0');
       table.timestamps(true, true);
    })
    .createTableIfNotExists('badges', function (table) {
        table.uuid('id').primary().defaultTo(uuidv4());
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('image').notNullable();
        table.integer('price').notNullable();
        table.timestamps(true, true);
     })
     .createTableIfNotExists('user_badges', function (table) {
         table.uuid('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
         table.uuid('badge_id').unsigned().notNullable().references('id').inTable('badges').onDelete('CASCADE');
         table.primary(['user_id', 'badge_id']);   //composite-key thus for many to many relationships
         table.timestamps(true, true);
     })
     .createTableIfNotExists('payments', function(table) {
        table.uuid('id').primary().defaultTo(uuidv4());
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('badge_id').notNullable().references('id').inTable('badges').onDelete('CASCADE');
        table.string('payment_intent_id').notNullable();
        table.timestamps(true, true);
    })
    .then(() => {
        // Insert predefined badges
        return knex('badges').insert([
            { id: uuidv4(), name: 'Gold', description: 'Gold Badge', image: 'gold.png', price: 30 }
        ]);
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
knex.schema.dropTableIfExists('users');
knex.schema.dropTableIfExists('badges');
knex.schema.dropTableIfExists('user_badges');
knex.schema.dropTableIfExists('payments');
};
