/**
 * Role-Based Login System Test
 * 
 * This file demonstrates how to test the role-based authentication system.
 * In a real application, you would use a testing framework like Jest.
 */

import userService from '../components/users/services/user.service';
import { UserRole } from '../components/users/model/user.model';

// Test data
const testUsers = [
    {
        email: 'admin@example.com',
        password: 'password',
        expectedRole: UserRole.ADMIN
    },
    {
        email: 'center@example.com',
        password: 'password',
        expectedRole: UserRole.CENTER
    },
    {
        email: 'student@example.com',
        password: 'password',
        expectedRole: UserRole.STUDENT
    }
];

// Test functions
async function testRoleBasedLogin() {
    console.log('🧪 Testing Role-Based Login System\n');

    for (const testUser of testUsers) {
        try {
            console.log(`Testing login for ${testUser.email}...`);
            
            const result = await userService.userLogin({
                email: testUser.email,
                password: testUser.password
            });

            console.log(`✅ Login successful for ${testUser.email}`);
            console.log(`   Role: ${result.role}`);
            console.log(`   Token: ${result.token.substring(0, 20)}...`);
            console.log(`   User ID: ${result.user.id}`);
            console.log(`   Expected Role: ${testUser.expectedRole}`);
            console.log(`   Role Match: ${result.role === testUser.expectedRole ? '✅' : '❌'}\n`);

        } catch (error: any) {
            console.log(`❌ Login failed for ${testUser.email}: ${error.message}\n`);
        }
    }
}

async function testUserCreation() {
    console.log('🧪 Testing User Creation\n');

    try {
        const newUser = await userService.createUser({
            email: 'newuser@example.com',
            password: 'password123',
            firstName: 'New',
            lastName: 'User',
            role: UserRole.STUDENT
        });

        console.log('✅ User created successfully');
        console.log(`   Email: ${newUser.email}`);
        console.log(`   Role: ${newUser.role}`);
        console.log(`   ID: ${newUser.id}\n`);

    } catch (error: any) {
        console.log(`❌ User creation failed: ${error.message}\n`);
    }
}

async function testRoleBasedAccess() {
    console.log('🧪 Testing Role-Based Access\n');

    try {
        // Test getting users by role
        const admins = await userService.getUsersByRole(UserRole.ADMIN);
        const centers = await userService.getUsersByRole(UserRole.CENTER);
        const students = await userService.getUsersByRole(UserRole.STUDENT);

        console.log(`✅ Found ${admins.length} admin users`);
        console.log(`✅ Found ${centers.length} center users`);
        console.log(`✅ Found ${students.length} student users\n`);

    } catch (error: any) {
        console.log(`❌ Role-based access test failed: ${error.message}\n`);
    }
}

// API Endpoints Documentation
function printAPIEndpoints() {
    console.log('📚 Role-Based Login System API Endpoints\n');
    
    console.log('🔓 Public Endpoints:');
    console.log('   POST /user/login - User login');
    console.log('   POST /user/register - User registration\n');
    
    console.log('🔒 Protected Endpoints (require authentication):');
    console.log('   GET /user/profile - Get user profile');
    console.log('   GET /user/dashboard - Get role-based dashboard\n');
    
    console.log('👑 Admin-Only Endpoints:');
    console.log('   GET /user/users/role/:role - Get users by role');
    console.log('   PUT /user/users/:id/role - Update user role\n');
    
    console.log('👨‍🏫 Instructor Endpoints:');
    console.log('   GET /user/instructor/dashboard - Instructor dashboard\n');
    
    console.log('📝 Example Usage:');
    console.log('   1. Login: POST /user/login');
    console.log('      Body: { "email": "admin@example.com", "password": "password" }');
    console.log('      Response: { "user": {...}, "token": "jwt_token", "role": "admin" }\n');
    
    console.log('   2. Access protected route: GET /user/profile');
    console.log('      Headers: { "Authorization": "Bearer jwt_token" }\n');
    
    console.log('   3. Admin action: GET /user/users/role/student');
    console.log('      Headers: { "Authorization": "Bearer admin_jwt_token" }\n');
}

// Run tests
async function runTests() {
    printAPIEndpoints();
    await testRoleBasedLogin();
    await testUserCreation();
    await testRoleBasedAccess();
    
    console.log('🎉 Role-based login system testing completed!');
}

// Export for use in other files
export { runTests, testRoleBasedLogin, testUserCreation, testRoleBasedAccess };

