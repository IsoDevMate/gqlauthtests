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
  pingDatabase: async () => {
    try {
      await db.raw('SELECT 1');
      console.log('Database connected successfully.');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  },
  createUser: async (username, email, password) => {
    // Check if the email already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw new Error('A user with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4(); 
  return await db('users').insert({
    id: userId,
    username,
    email,
    password: hashedPassword
  }).returning('*');
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
  }
};
