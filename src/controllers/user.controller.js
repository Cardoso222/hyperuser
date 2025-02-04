const userService = require('../services/user.service');
const { publishUserEvent } = require('../utils/messageQueue');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      await publishUserEvent('user.created', user);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      await publishUserEvent('user.updated', user);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      await publishUserEvent('user.deleted', { id: req.params.id });
      res.json({
        success: true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(); 