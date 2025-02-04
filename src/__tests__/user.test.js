const request = require('supertest');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const app = require('../index');
const User = require('../models/user.model');

describe('User API', () => {
  let redisClient;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await redisClient.flushAll();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
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
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].email).toBe(user.email);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(user.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .get(`/api/users/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
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
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });
}); 