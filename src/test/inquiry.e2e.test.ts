import request from 'supertest';
import app from '../app.js';

const endpoint = '/api/inquiry/newInquiry';

describe('Inquiry API', () => {
    it('creates inquiry successfully (201)', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                phone: '987-654-3210',
                programOfInterest: 'IT Programmes',
                message: 'I would like to know about course duration and fee.',
                inquiryType: 'student'
            });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('createdAt');
        expect(res.body.data.phone).toBe('9876543210');
    });

    it('fails validation (400)', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({
                fullName: 'J',
                email: 'bad-email',
                phone: '12',
                programOfInterest: '',
                message: 'short',
                inquiryType: 'other'
            });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body).toHaveProperty('message');
    });

    it('rate limits after 5 requests (429)', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post(endpoint)
                .send({
                    fullName: 'John Smith',
                    email: `john${i}@example.com`,
                    phone: '1234567890',
                    programOfInterest: 'CS',
                    message: 'Interested in CS program details',
                    inquiryType: 'center'
                });
        }
        const sixth = await request(app)
            .post(endpoint)
            .send({
                fullName: 'John Smith',
                email: 'johnx@example.com',
                phone: '1234567890',
                programOfInterest: 'CS',
                message: 'Interested in CS program details',
                inquiryType: 'center'
            });
        expect(sixth.status).toBe(429);
        expect(sixth.body.status).toBe(false);
    });
});


