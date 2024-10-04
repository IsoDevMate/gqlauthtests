// index.js
const express = require('express');
const app = express();
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const knex = require('knex');
const knexfile = require('./db/knexfile');
const dbs = knex(knexfile.development);
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');
const db = require('./db/db');
const PORT = process.env.PORT || 4000;

const cors = require('cors');

app.use(bodyParser.json());
app.use(cors(
  {
    origin: '*',
    credentials: true,
  }
));

// Read the schema file
const schemaPath = path.join(__dirname, 'schema.graphql');;
const schemaText = fs.readFileSync(schemaPath, 'utf-8');

const schema = buildSchema(schemaText);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

db.pingDatabase().then(isConnected => {
    if (isConnected) {
      app.listen(PORT, () => {
        console.log(`App is running at localhost:${PORT}`);
      });
    } else {
      console.error('Failed to connect to the database. Exiting...');
      process.exit(1);
    }
  });