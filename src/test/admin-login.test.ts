import request from 'supertest';
import app from '../app.js';
import { UserModel } from '../components/users/models/user.model.js';
import mongoose from 'mongoose';

describe('Admin Login System', () => {
    beforeAll(async () => {
        // Connect to test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-admin-login');
        }
    });

    afterAll(async () => {
        // Clean up test data
        await UserModel.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear users before each test
        await UserModel.deleteMany({});
    });

    describe('POST /api/user/admin-login', () => {
        it('should login admin with valid credentials', async () => {
            // First register an admin
            const adminData = {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123'
            };

            // Register admin (this would normally require password validation)
            const registerResponse = await request(app)
                .post('/api/user/register')
                .query({ password: process.env.PASSWORD || 'admin123' })
                .send(adminData);

            expect(registerResponse.status).toBe(201);

            // Now test login
            const loginData = {
                email: 'admin@test.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/user/admin-login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe('Admin logged in successfully');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.role).toBe('admin');
        });

        it('should reject login with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@test.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/user/admin-login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should reject login with invalid password', async () => {
            // First register an admin
            const adminData = {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123'
            };

            await request(app)
                .post('/api/user/register')
                .query({ password: process.env.PASSWORD || 'admin123' })
                .send(adminData);

            // Try login with wrong password
            const loginData = {
                email: 'admin@test.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/user/admin-login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should reject login for non-admin users', async () => {
            // Create a regular user (not admin)
            const regularUser = new UserModel({
                name: 'Regular User',
                email: 'user@test.com',
                password: 'password123',
                role: 'user'
            });
            await regularUser.save();

            const loginData = {
                email: 'user@test.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/user/admin-login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Access denied. Admin role required.');
        });

        it('should require email and password', async () => {
            const response = await request(app)
                .post('/api/user/admin-login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Email and password are required');
        });
    });

    describe('GET /api/admin/profile', () => {
        let adminToken: string;

        beforeEach(async () => {
            // Register and login an admin
            const adminData = {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123'
            };

            await request(app)
                .post('/api/user/register')
                .query({ password: process.env.PASSWORD || 'admin123' })
                .send(adminData);

            const loginResponse = await request(app)
                .post('/api/user/admin-login')
                .send({
                    email: 'admin@test.com',
                    password: 'password123'
                });

            adminToken = loginResponse.body.data.token;
        });

        it('should get admin profile with valid token', async () => {
            const response = await request(app)
                .get('/api/admin/profile')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.data.role).toBe('admin');
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/admin/profile');

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Access token required');
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/admin/profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Invalid or expired token');
        });
    });

    describe('GET /api/admin/dashboard', () => {
        let adminToken: string;

        beforeEach(async () => {
            // Register and login an admin
            const adminData = {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123'
            };

            await request(app)
                .post('/api/user/register')
                .query({ password: process.env.PASSWORD || 'admin123' })
                .send(adminData);

            const loginResponse = await request(app)
                .post('/api/user/admin-login')
                .send({
                    email: 'admin@test.com',
                    password: 'password123'
                });

            adminToken = loginResponse.body.data.token;
        });

        it('should access admin dashboard with valid token', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe('Admin dashboard accessed successfully');
            expect(response.body.data).toHaveProperty('admin');
        });
    });
});
