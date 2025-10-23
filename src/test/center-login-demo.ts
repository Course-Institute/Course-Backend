/**
 * Center Login API Demo
 * 
 * This script demonstrates the center login functionality.
 * 
 * Endpoint: POST /api/user/center-login
 * Payload: { "email": "jaat@gmail.com", "password": "123456" }
 */

import { Request, Response } from 'express';
import authService from '../components/auth/services/auth.service';

const demonstrateCenterLogin = async () => {
    console.log('🏢 Center Login API Demo\n');

    // Test case 1: Valid center login
    console.log('✅ Test 1: Valid center login');
    try {
        const result = await authService.centerLogin({
            email: 'jaat@gmail.com',
            password: '123456'
        });
        
        console.log('   🎉 Login successful!');
        console.log(`   👤 User ID: ${result.user.id}`);
        console.log(`   👤 Name: ${result.user.name}`);
        console.log(`   📧 Email: ${result.user.email}`);
        console.log(`   🏢 Role: ${result.user.role}`);
        console.log(`   🏢 Center Name: ${result.user.centerName}`);
        console.log(`   🏢 Center Code: ${result.user.centerCode}`);
        console.log(`   🔑 Token: ${result.token.substring(0, 50)}...`);
    } catch (error: any) {
        console.log(`   ❌ Login failed: ${error.message}`);
    }

    // Test case 2: Invalid email
    console.log('\n❌ Test 2: Invalid email');
    try {
        await authService.centerLogin({
            email: 'nonexistent@example.com',
            password: '123456'
        });
        console.log('   ❌ ERROR: Should have failed but succeeded');
    } catch (error: any) {
        console.log(`   ✅ Correctly rejected: ${error.message}`);
    }

    // Test case 3: Invalid password
    console.log('\n❌ Test 3: Invalid password');
    try {
        await authService.centerLogin({
            email: 'jaat@gmail.com',
            password: 'wrongpassword'
        });
        console.log('   ❌ ERROR: Should have failed but succeeded');
    } catch (error: any) {
        console.log(`   ✅ Correctly rejected: ${error.message}`);
    }

    // Test case 4: Center not approved
    console.log('\n⚠️  Test 4: Center not approved (if exists)');
    try {
        await authService.centerLogin({
            email: 'pending@example.com',
            password: '123456'
        });
        console.log('   ❌ ERROR: Should have failed but succeeded');
    } catch (error: any) {
        console.log(`   ✅ Correctly rejected: ${error.message}`);
    }

    console.log('\n🎯 Center Login API Features:');
    console.log('   • Validates email and password');
    console.log('   • Checks if center is approved');
    console.log('   • Returns JWT token for authentication');
    console.log('   • Includes center details in response');
    console.log('   • Handles all error cases gracefully');

    console.log('\n📋 API Usage:');
    console.log('   POST /api/user/center-login');
    console.log('   Content-Type: application/json');
    console.log('   Body: { "email": "jaat@gmail.com", "password": "123456" }');
    
    console.log('\n📤 Response Format:');
    console.log('   {');
    console.log('     "status": true,');
    console.log('     "message": "Center login successful",');
    console.log('     "data": {');
    console.log('       "user": {');
    console.log('         "id": "center_id",');
    console.log('         "name": "Center Owner Name",');
    console.log('         "email": "jaat@gmail.com",');
    console.log('         "role": "center",');
    console.log('         "centerName": "Center Name",');
    console.log('         "centerCode": "MIV-2025-12345"');
    console.log('       },');
    console.log('       "token": "jwt_token_here"');
    console.log('     }');
    console.log('   }');
};

// Run the demonstration
if (require.main === module) {
    demonstrateCenterLogin()
        .then(() => {
            console.log('\n✨ Center login API demonstration completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Demonstration failed:', error);
            process.exit(1);
        });
}

export default demonstrateCenterLogin;
