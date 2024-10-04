require('dotenv').config({path: '../.env'});
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);


module.exports = {

  development:  {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME || 'gqlbadge',
      user: process.env.DB_USER || 'baro',
      password: process.env.POSTGRES_PASSWORD || '53WsN7c3h7HazxyYq3vMwIgyEfgwVFSw',
      host: process.env.DB_HOST || 'dpg-cro36ne8ii6s73f26c60-a.oregon-postgres.render.com',
      port: process.env.DB_PORT || 5432,
      ssl: true,
      acquireConnectionTimeout: 10000
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },
}; 

