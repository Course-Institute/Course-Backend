import request from 'supertest';
import app from '../app.js';
describe('Admin Student Management API', () => {
    let adminToken: string;

    beforeAll(async () => {
        // Login as admin to get token
        const loginResponse = await request(app)
            .post('/user/admin-login')
            .send({
                email: 'admin@example.com', // Replace with actual admin email
                password: 'admin123' // Replace with actual admin password
            });

        if (loginResponse.body.status) {
            adminToken = loginResponse.body.data.token;
        }
    });

    describe('GET /admin/students', () => {
        it('should list all students with pagination', async () => {
            const response = await request(app)
                .get('/admin/students/')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Cookie', `token=${adminToken}`)
                .query({
                    page: 1,
                    limit: 10
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.data).toHaveProperty('students');
            expect(response.body.data).toHaveProperty('pagination');
            expect(Array.isArray(response.body.data.students)).toBe(true);
        });

        it('should filter students by faculty', async () => {
            const response = await request(app)
                .get('/admin/students/')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Cookie', `token=${adminToken}`)
                .query({
                    faculty: 'Engineering',
                    page: 1,
                    limit: 5
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            
            // Check if all returned students belong to Engineering faculty
            if (response.body.data.students.length > 0) {
                response.body.data.students.forEach((student: any) => {
                    expect(student.faculty).toBe('Engineering');
                });
            }
        });

        it('should search students by name', async () => {
            const response = await request(app)
                .get('/admin/students/')
                .set('Authorization', `Bearer ${adminToken}`)
                .query({
                    search: 'john', // Replace with actual student name
                    page: 1,
                    limit: 10
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .get('/admin/students/');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /admin/students/:registrationNo', () => {
        it('should get student details by registration number', async () => {
            // First, get a student from the list
            const listResponse = await request(app)
                .get('/admin/students/')
                .set('Authorization', `Bearer ${adminToken}`)
                .query({ limit: 1 });

            if (listResponse.body.data.students.length > 0) {
                const registrationNo = listResponse.body.data.students[0].registrationNo;
                
                const response = await request(app)
                    .get(`/admin/students//${registrationNo}`)
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(true);
                expect(response.body.data.registrationNo).toBe(registrationNo);
            }
        });

        it('should return 404 for invalid registration number', async () => {
            const response = await request(app)
                .get('/admin/students//invalid123456')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.status).toBe(false);
        });
    });

    describe('GET /admin/dashboard', () => {
        it('should return dashboard statistics', async () => {
            const response = await request(app)
                .get('/admin/dashboard/')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.data).toHaveProperty('totalStudents');
            expect(response.body.data).toHaveProperty('recentRegistrations');
            expect(response.body.data).toHaveProperty('studentsByFaculty');
            expect(response.body.data).toHaveProperty('studentsByCourse');
            expect(response.body.data).toHaveProperty('studentsBySession');
            expect(response.body.data).toHaveProperty('monthlyRegistrations');
        });
    });
});
