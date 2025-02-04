const User = require('../models/user.model');
const logger = require('../utils/logger');

class UserService {
  async createUser(userData) {
    const user = await User.create(userData);
    await this.invalidateCache();
    return user;
  }

  async getUsers() {
    const cacheKey = 'users:all';
    const cachedUsers = await global.redisClient.get(cacheKey);
    
    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await User.find({}, { password: 0 });
    await global.redisClient.set(cacheKey, JSON.stringify(users), { EX: 300 });
    return users;
  }

  async getUserById(userId) {
    const cacheKey = `user:${userId}`;
    const cachedUser = await global.redisClient.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await User.findById(userId, { password: 0 });
    if (user) {
      await global.redisClient.set(cacheKey, JSON.stringify(user), { EX: 300 });
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    await this.invalidateCache(userId);
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    await this.invalidateCache(userId);
    return user;
  }

  async invalidateCache(userId = null) {
    try {
      await global.redisClient.del('users:all');
      if (userId) {
        await global.redisClient.del(`user:${userId}`);
      }
    } catch (error) {
      logger.error('Cache invalidation failed:', error);
    }
  }
}

module.exports = new UserService(); 