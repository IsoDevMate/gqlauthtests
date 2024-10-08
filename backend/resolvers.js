
const db = require('./db/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const resolvers = {
  
  users: async () => {
    return await db.getUsers();
  },
    user: async ({ id }) => {
    return await db.getUser(id);
    },
    badges: async () => {
    try{
    return await db.getBadges();
     } catch (error) {
         console.error('Error fetching badges:', error);
         return [];
       }
    },
    badge: async ({ id }) => {
    
    return await db.getBadge(id)
    },
    register: async ({ username, input }) => {
        const { email, password } = input;
        try {
          const user = await db.createUser(username, email, password);
          if (!user || user.length === 0) {
            throw new Error('Failed to create user');
          }
          return user[0]; 
        } catch (error) {
          console.error('Error registering user:', error);
          throw new Error('Registration failed');
        }
      },
  login: async ({ input }) => {
    const { email, password } = input;
    const authPayload = await db.loginUser(email, password);
    return authPayload;
  },
  purchaseBadge: async ({ userId, badgeId }) => {
    const badge = await db.getBadge(badgeId);
    if (badge) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: badge.name,
              },
              unit_amount: badge.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4000/success',
        cancel_url: 'http://localhost:4000/cancel',
      });

      return { url: session.url };
    }
    throw new Error('Invalid badge');
  },
  verifyUser: async ({ userId }) => {
    await db.verifyUser(userId);
    return 'User verified successfully';
  },
    }


module.exports = resolvers;
