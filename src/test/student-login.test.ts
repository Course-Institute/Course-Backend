import request from 'supertest';
import app from '../app.js';
import { StudentModel } from '../components/students/model/student.model.js';
import mongoose from 'mongoose';

describe('Student Login System', () => {
    beforeAll(async () => {
        // Connect to test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-student-login');
        }
    });

    afterAll(async () => {
        // Clean up test data
        await StudentModel.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear students before each test
        await StudentModel.deleteMany({});
    });

    describe('POST /api/user/student-login', () => {
        it('should login student with valid registration number and DOB', async () => {
            // First create a test student
            const studentData = {
                registrationNo: '123456789012',
                candidateName: 'Test Student',
                dateOfBirth: '1995-05-15',
                emailAddress: 'student@test.com',
                contactNumber: '9876543210'
            };

            const student = new StudentModel(studentData);
            await student.save();

            // Now test login
            const loginData = {
                registrationNo: '123456789012',
                dateOfBirth: '1995-05-15'
            };

            const response = await request(app)
                .post('/api/user/student-login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe('Student login successful');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.role).toBe('student');
            expect(response.body.data.user.registrationNo).toBe('123456789012');
        });

        it('should reject login with invalid registration number', async () => {
            // Create a test student
            const studentData = {
                registrationNo: '123456789012',
                candidateName: 'Test Student',
                dateOfBirth: '1995-05-15',
                emailAddress: 'student@test.com'
            };

            await new StudentModel(studentData).save();

            // Try login with wrong registration number
            const loginData = {
                registrationNo: '999999999999',
                dateOfBirth: '1995-05-15'
            };

            const response = await request(app)
                .post('/api/user/student-login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Invalid registration number or date of birth');
        });

        it('should reject login with invalid date of birth', async () => {
            // Create a test student
            const studentData = {
                registrationNo: '123456789012',
                candidateName: 'Test Student',
                dateOfBirth: '1995-05-15',
                emailAddress: 'student@test.com'
            };

            await new StudentModel(studentData).save();

            // Try login with wrong date of birth
            const loginData = {
                registrationNo: '123456789012',
                dateOfBirth: '1990-01-01'
            };

            const response = await request(app)
                .post('/api/user/student-login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Invalid registration number or date of birth');
        });

        it('should require registration number and date of birth', async () => {
            const response = await request(app)
                .post('/api/user/student-login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Registration number and date of birth are required');
        });

        it('should require registration number', async () => {
            const response = await request(app)
                .post('/api/user/student-login')
                .send({ dateOfBirth: '1995-05-15' });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Registration number and date of birth are required');
        });

        it('should require date of birth', async () => {
            const response = await request(app)
                .post('/api/user/student-login')
                .send({ registrationNo: '123456789012' });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('Registration number and date of birth are required');
        });
    });
});
