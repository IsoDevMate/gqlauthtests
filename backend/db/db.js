const knex = require('knex');
const knexfile = require('./knexfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const db = knex(knexfile.development);

module.exports = {
  getUsers: async () => {
    return await db('users').select('*');
  },
  getUser: async (id) => {
    return await db('users').where({ id }).select('*').first();
  },
  getUserByEmail: async (email) => {
    return await db('users').where({ email }).first();
  },
  getBadges: async () => {
        return await db('badges').select('*');
 },  
 getBadge: async (id) => {
        return await db('badges').where({ id }).select('*').first();
    },

    createUser: async (username, email, password) => {
        try {
          const existingUser = await db('users').where({ email }).first();
          if (existingUser) {
            throw new Error('A user with this email already exists');
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
          const userId = uuidv4(); 
          const newUser = await db('users').insert({
            id: userId,
            username,
            email,
            password: hashedPassword,
            verificationlevel: '0'
          }).returning('*');
      
          if (!newUser || newUser.length === 0) {
            throw new Error('User creation failed');
          }
      
          return newUser;
        } catch (error) {
          console.error('Error creating user:', error);
          throw new Error('Error during user creation');
        }
      },
      
  loginUser: async (email, password) => {
    const user = await db('users').where({ email }).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },
  purchaseBadge: async (userId, badgeId) => {
    return await db('user_badges').insert({ user_id: userId, badge_id: badgeId });
  },

  verifyUser: async (userId) => {
    return await db('users').where({ id: userId }).update({ verificationlevel: 'Gold' });
  },

  pingDatabase: async () => {
    try {
      await db.raw('SELECT 1');
      console.log('Database connected successfully.');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

};
