/**
 * Admin Login System Demo
 * This script demonstrates how to use the admin authentication system
 */

import request from 'supertest';
import app from '../app';
import { UserModel } from '../components/users/models/user.model';
import mongoose from 'mongoose';

async function demoAdminLoginSystem() {
    console.log('🚀 Starting Admin Login System Demo\n');

    try {
        // Connect to database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-admin-demo');
            console.log('✅ Connected to database');
        }

        // Clean up any existing test data
        await UserModel.deleteMany({ email: /test.*admin/ });
        console.log('🧹 Cleaned up test data\n');

        // Step 1: Register a new admin
        console.log('📝 Step 1: Registering a new admin...');
        const adminData = {
            name: 'Demo Admin',
            email: 'testadmin@demo.com',
            password: 'securepassword123'
        };

        const registerResponse = await request(app)
            .post('/api/user/register')
            .query({ password: process.env.PASSWORD || 'admin123' })
            .send(adminData);

        if (registerResponse.status === 201) {
            console.log('✅ Admin registered successfully');
            console.log(`   Name: ${registerResponse.body.data.user.name}`);
            console.log(`   Email: ${registerResponse.body.data.user.email}`);
            console.log(`   Role: ${registerResponse.body.data.user.role}\n`);
        } else {
            console.log('❌ Admin registration failed:', registerResponse.body.message);
            return;
        }

        // Step 2: Login as admin
        console.log('🔐 Step 2: Logging in as admin...');
        const loginData = {
            email: 'testadmin@demo.com',
            password: 'securepassword123'
        };

        const loginResponse = await request(app)
            .post('/api/user/admin-login')
            .send(loginData);

        if (loginResponse.status === 200) {
            console.log('✅ Admin login successful');
            console.log(`   Token: ${loginResponse.body.data.token.substring(0, 20)}...`);
            console.log(`   User ID: ${loginResponse.body.data.user.id}\n`);
        } else {
            console.log('❌ Admin login failed:', loginResponse.body.message);
            return;
        }

        const adminToken = loginResponse.body.data.token;

        // Step 3: Access protected admin profile
        console.log('👤 Step 3: Accessing admin profile...');
        const profileResponse = await request(app)
            .get('/api/admin/profile')
            .set('Authorization', `Bearer ${adminToken}`);

        if (profileResponse.status === 200) {
            console.log('✅ Admin profile accessed successfully');
            console.log(`   Name: ${profileResponse.body.data.name}`);
            console.log(`   Email: ${profileResponse.body.data.email}`);
            console.log(`   Role: ${profileResponse.body.data.role}\n`);
        } else {
            console.log('❌ Profile access failed:', profileResponse.body.message);
        }

        // Step 4: Access admin dashboard
        console.log('📊 Step 4: Accessing admin dashboard...');
        const dashboardResponse = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);

        if (dashboardResponse.status === 200) {
            console.log('✅ Admin dashboard accessed successfully');
            console.log(`   Admin: ${dashboardResponse.body.data.admin.userId}`);
            console.log(`   Timestamp: ${dashboardResponse.body.data.timestamp}\n`);
        } else {
            console.log('❌ Dashboard access failed:', dashboardResponse.body.message);
        }

        // Step 5: Test unauthorized access
        console.log('🚫 Step 5: Testing unauthorized access...');
        const unauthorizedResponse = await request(app)
            .get('/api/admin/profile');

        if (unauthorizedResponse.status === 401) {
            console.log('✅ Unauthorized access properly blocked');
            console.log(`   Message: ${unauthorizedResponse.body.message}\n`);
        } else {
            console.log('❌ Unauthorized access was not properly blocked');
        }

        // Step 6: Test invalid token
        console.log('🔒 Step 6: Testing invalid token...');
        const invalidTokenResponse = await request(app)
            .get('/api/admin/profile')
            .set('Authorization', 'Bearer invalid-token-123');

        if (invalidTokenResponse.status === 401) {
            console.log('✅ Invalid token properly rejected');
            console.log(`   Message: ${invalidTokenResponse.body.message}\n`);
        } else {
            console.log('❌ Invalid token was not properly rejected');
        }

        console.log('🎉 Admin Login System Demo Completed Successfully!');
        console.log('\n📋 Summary:');
        console.log('   ✅ Admin registration with password protection');
        console.log('   ✅ Secure admin login with JWT tokens');
        console.log('   ✅ Role-based access control');
        console.log('   ✅ Protected admin routes');
        console.log('   ✅ Proper error handling and security');

    } catch (error) {
        console.error('❌ Demo failed:', error);
    } finally {
        // Clean up
        await UserModel.deleteMany({ email: /test.*admin/ });
        console.log('\n🧹 Cleaned up demo data');
    }
}

// Run the demo if this file is executed directly
if (require.main === module) {
    demoAdminLoginSystem().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('Demo error:', error);
        process.exit(1);
    });
}

export default demoAdminLoginSystem;
