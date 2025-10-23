/**
 * Debug Center Login Script
 * 
 * This script helps debug center login issues by checking:
 * 1. If the center exists in the database
 * 2. What the center status is
 * 3. What emails are associated with the center
 * 4. If the password is correct
 */

import centerDal from '../components/centers/dals/center.dal';
import bcrypt from 'bcryptjs';

const debugCenterLogin = async (email: string, password: string) => {
    console.log('🔍 Debugging Center Login');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('');

    try {
        // Step 1: Check if center exists
        console.log('1️⃣ Checking if center exists...');
        const center = await centerDal.findCenterByEmail(email);
        
        if (!center) {
            console.log('❌ Center not found for email:', email);
            console.log('');
            console.log('💡 Possible solutions:');
            console.log('   • Check if the email is correct');
            console.log('   • Check if the center is registered');
            console.log('   • Try using a different email field (official, authorized, or login)');
            return;
        }

        console.log('✅ Center found!');
        console.log('🏢 Center Name:', center.centerDetails?.centerName);
        console.log('📊 Center Status:', center.status);
        console.log('');

        // Step 2: Check center status
        console.log('2️⃣ Checking center status...');
        if (center.status !== 'approved') {
            console.log('❌ Center is not approved');
            console.log('📊 Current status:', center.status);
            console.log('');
            console.log('💡 Solution:');
            console.log('   • The center needs to be approved by an admin');
            console.log('   • Contact admin to approve the center');
            return;
        }

        console.log('✅ Center is approved');
        console.log('');

        // Step 3: Check email fields
        console.log('3️⃣ Checking email fields...');
        const emails = {
            official: center.centerDetails?.officialEmail,
            authorized: center.authorizedPersonDetails?.email,
            login: center.loginCredentials?.username
        };
        
        console.log('📧 Official Email:', emails.official);
        console.log('📧 Authorized Person Email:', emails.authorized);
        console.log('📧 Login Username:', emails.login);
        console.log('');

        // Step 4: Check password
        console.log('4️⃣ Checking password...');
        if (!center.loginCredentials?.password) {
            console.log('❌ No password found in login credentials');
            console.log('');
            console.log('💡 Solution:');
            console.log('   • The center registration might be incomplete');
            console.log('   • Check if login credentials were properly saved');
            return;
        }

        console.log('✅ Password hash found');
        
        const isPasswordValid = await bcrypt.compare(password, center.loginCredentials.password);
        console.log('🔍 Password valid:', isPasswordValid);
        
        if (!isPasswordValid) {
            console.log('❌ Password is incorrect');
            console.log('');
            console.log('💡 Solutions:');
            console.log('   • Check if the password is correct');
            console.log('   • Try the original password used during registration');
            console.log('   • Contact admin to reset password');
            return;
        }

        console.log('✅ Password is correct');
        console.log('');

        // Step 5: All checks passed
        console.log('🎉 All checks passed! The center should be able to login.');
        console.log('');
        console.log('📋 Center Details:');
        console.log('   • ID:', center._id);
        console.log('   • Name:', center.centerDetails?.centerName);
        console.log('   • Code:', center.centerDetails?.centerCode);
        console.log('   • Status:', center.status);
        console.log('   • Authorized Person:', center.authorizedPersonDetails?.authName);

    } catch (error: any) {
        console.log('❌ Error during debug:', error.message);
    }
};

// Test with the provided credentials
const testCenterLogin = async () => {
    console.log('🧪 Testing Center Login Debug');
    console.log('================================');
    console.log('');
    
    await debugCenterLogin('jaat@gmail.com', '123456');
    
    console.log('');
    console.log('🔧 Additional Debugging Steps:');
    console.log('1. Check server logs for detailed error messages');
    console.log('2. Verify the center exists in the database');
    console.log('3. Check if the center status is "approved"');
    console.log('4. Verify the password matches the stored hash');
    console.log('5. Check if all required fields are present');
};

// Run the debug
if (require.main === module) {
    testCenterLogin()
        .then(() => {
            console.log('\n✨ Debug completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Debug failed:', error);
            process.exit(1);
        });
}

export default debugCenterLogin;
