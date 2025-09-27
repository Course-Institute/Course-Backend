import request from 'supertest';
import app from '../app.js';
import { StudentModel } from '../components/students/model/student.model.js';
import mongoose from 'mongoose';

async function testStudentLogin() {
    try {
        // Connect to database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-student-login');
            console.log('Connected to database');
        }

        // Clear existing test data
        await StudentModel.deleteMany({});
        console.log('Cleared existing test data');

        // Create a test student
        const studentData = {
            registrationNo: '123456789012',
            candidateName: 'Test Student',
            dateOfBirth: '1995-05-15',
            emailAddress: 'student@test.com',
            contactNumber: '9876543210',
            faculty: 'Engineering',
            course: 'Computer Science'
        };

        const student = new StudentModel(studentData);
        await student.save();
        console.log('Created test student:', {
            registrationNo: student.registrationNo,
            name: student.candidateName,
            dob: student.dateOfBirth
        });

        // Test successful login
        console.log('\n=== Testing Successful Login ===');
        const loginData = {
            registrationNo: '123456789012',
            dateOfBirth: '1995-05-15'
        };

        const response = await request(app)
            .post('/api/user/student-login')
            .send(loginData);

        console.log('Login Response Status:', response.status);
        console.log('Login Response Body:', JSON.stringify(response.body, null, 2));

        if (response.status === 200) {
            console.log('✅ Student login successful!');
            console.log('Token received:', response.body.data.token ? 'Yes' : 'No');
        } else {
            console.log('❌ Student login failed');
        }

        // Test failed login with wrong registration number
        console.log('\n=== Testing Failed Login (Wrong Registration Number) ===');
        const wrongRegData = {
            registrationNo: '999999999999',
            dateOfBirth: '1995-05-15'
        };

        const failResponse = await request(app)
            .post('/api/user/student-login')
            .send(wrongRegData);

        console.log('Failed Login Response Status:', failResponse.status);
        console.log('Failed Login Response Body:', JSON.stringify(failResponse.body, null, 2));

        if (failResponse.status === 401) {
            console.log('✅ Failed login handled correctly!');
        } else {
            console.log('❌ Failed login not handled correctly');
        }

        // Test failed login with wrong DOB
        console.log('\n=== Testing Failed Login (Wrong DOB) ===');
        const wrongDobData = {
            registrationNo: '123456789012',
            dateOfBirth: '1990-01-01'
        };

        const failDobResponse = await request(app)
            .post('/api/user/student-login')
            .send(wrongDobData);

        console.log('Failed DOB Response Status:', failDobResponse.status);
        console.log('Failed DOB Response Body:', JSON.stringify(failDobResponse.body, null, 2));

        if (failDobResponse.status === 401) {
            console.log('✅ Failed DOB login handled correctly!');
        } else {
            console.log('❌ Failed DOB login not handled correctly');
        }

        // Test missing fields
        console.log('\n=== Testing Missing Fields ===');
        const emptyResponse = await request(app)
            .post('/api/user/student-login')
            .send({});

        console.log('Empty Request Response Status:', emptyResponse.status);
        console.log('Empty Request Response Body:', JSON.stringify(emptyResponse.body, null, 2));

        if (emptyResponse.status === 400) {
            console.log('✅ Missing fields validation working!');
        } else {
            console.log('❌ Missing fields validation not working');
        }

        // Clean up
        await StudentModel.deleteMany({});
        console.log('\nCleaned up test data');
        
        console.log('\n🎉 Student login demo completed successfully!');

    } catch (error) {
        console.error('Error during student login demo:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

// Run the demo
testStudentLogin();
