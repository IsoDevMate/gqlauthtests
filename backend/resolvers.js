const db = require('./db/db');

const resolvers = {
  users: async () => {
    return await db.getUsers();
  },
  register: async ({ username, input }) => {
    const { email, password } = input;
    const user = await db.createUser(username, email, password);
    return user[0];
  },
  login: async ({ input }) => {
    const { email, password } = input;
    const authPayload = await db.loginUser(email, password);
    return authPayload;
  }
};

module.exports = resolvers;
