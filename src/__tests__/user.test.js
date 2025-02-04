const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer } = require('../index');
const User = require('../models/user.model');

describe('User API', () => {
  beforeAll(async () => {
    await startServer();
  }, 30000); 

  afterAll(async () => {
    await mongoose.connection.close();
    if (global.redisClient) {
      await global.redisClient.quit();
    }
    // prevent jest from closing the server before the tests are done
    await new Promise(resolve => setTimeout(resolve, 500)); 
  });

  beforeEach(async () => {
    await User.deleteMany({});
    if (global.redisClient) {
      await global.redisClient.flushAll();
    }
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Duplicate field value');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const user = await User.create({
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].email).toBe(user.email);
      expect(response.body.data[0].password).toBeUndefined();
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const user = await User.create({
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .get(`/api/users/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      });

      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(user.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put(`/api/users/${new mongoose.Types.ObjectId()}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        name: 'mock user',
        email: 'mockuser@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .delete(`/api/users/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });
}); 