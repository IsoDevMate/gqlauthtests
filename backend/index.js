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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { GraphQLClient, gql } = require('graphql-request');


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

// GraphQL client to call the GraphQL API
const graphQLClient = new GraphQLClient('http://localhost:4000/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;

      const mutation = gql`
        mutation VerifyUser($userId: ID!) {
          verifyUser(userId: $userId)
        }
      `;

      try {
        await graphQLClient.request(mutation, { userId });
      } catch (error) {
        console.error('Error verifying user:', error);
      }

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});


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