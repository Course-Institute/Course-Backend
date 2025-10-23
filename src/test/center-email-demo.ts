/**
 * Demonstration script showing the email uniqueness validation fix
 * 
 * This script demonstrates how the center registration now properly validates
 * email uniqueness across all three email fields:
 * 1. centerDetails.officialEmail
 * 2. authorizedPersonDetails.email  
 * 3. loginCredentials.username
 */

import centerService from '../components/centers/services/center.service';
import { CreateCenterRequest } from '../components/centers/models/center.model';

const demonstrateEmailUniqueness = async () => {
    console.log('🔍 Testing Center Email Uniqueness Validation...\n');

    // Test case 1: Same email used in multiple fields (should fail)
    console.log('❌ Test 1: Same email in multiple fields');
    const duplicateEmailData: CreateCenterRequest = {
        centerDetails: {
            centerName: 'Test Center',
            centerType: 'franchise',
            yearOfEstablishment: 2025,
            address: 'Test Address',
            city: 'Test City',
            state: 'Test State',
            pinCode: '123456',
            officialEmail: 'same@example.com', // Same email
            primaryContactNo: '9876543210'
        },
        authorizedPersonDetails: {
            authName: 'Test Person',
            designation: 'Director',
            contactNo: '9876543210',
            email: 'same@example.com', // Same email
            idProofNo: '123456789012',
            photo: 'test-photo.jpg'
        },
        infrastructureDetails: {
            numClassrooms: 5,
            numComputers: 50,
            internetFacility: true,
            seatingCapacity: 100,
            infraPhotos: ['test-infra.jpg']
        },
        bankDetails: {
            bankName: 'Test Bank',
            accountHolder: 'Test Account Holder',
            accountNumber: '123456789012',
            ifsc: 'TEST0001234',
            branchName: 'Test Branch',
            cancelledCheque: 'test-cheque.jpg'
        },
        documentUploads: {
            gstCertificate: 'test-gst.jpg',
            panCard: 'test-pan.jpg',
            addressProof: 'test-address.jpg',
            directorIdProof: 'test-director.jpg'
        },
        declaration: {
            declaration: true,
            signatureUrl: 'test-signature.jpg'
        },
        loginCredentials: {
            username: 'same@example.com', // Same email
            password: 'password123'
        }
    };

    try {
        await centerService.createCenter(duplicateEmailData);
        console.log('   ❌ ERROR: Should have failed but succeeded');
    } catch (error: any) {
        console.log(`   ✅ Correctly rejected: ${error.message}`);
    }

    // Test case 2: Unique emails in all fields (should work)
    console.log('\n✅ Test 2: Unique emails in all fields');
    const uniqueEmailData: CreateCenterRequest = {
        ...duplicateEmailData,
        centerDetails: {
            ...duplicateEmailData.centerDetails,
            officialEmail: 'official@example.com'
        },
        authorizedPersonDetails: {
            ...duplicateEmailData.authorizedPersonDetails,
            email: 'authorized@example.com'
        },
        loginCredentials: {
            ...duplicateEmailData.loginCredentials,
            username: 'login@example.com'
        }
    };

    try {
        const result = await centerService.createCenter(uniqueEmailData);
        console.log('   ✅ Successfully created center with unique emails');
        console.log(`   📧 Official Email: ${result.centerDetails.officialEmail}`);
        console.log(`   📧 Authorized Person Email: ${result.authorizedPersonDetails.email}`);
        console.log(`   📧 Login Username: ${result.loginCredentials?.username}`);
    } catch (error: any) {
        console.log(`   ⚠️  Failed (might be due to existing data): ${error.message}`);
    }

    console.log('\n🎯 Summary of Email Uniqueness Validation:');
    console.log('   • Prevents same email in multiple fields within same registration');
    console.log('   • Checks official email uniqueness across all centers');
    console.log('   • Checks authorized person email uniqueness across all centers');
    console.log('   • Checks login username uniqueness across all centers');
    console.log('   • Validates against existing users in the system');
};

// Run the demonstration
if (require.main === module) {
    demonstrateEmailUniqueness()
        .then(() => {
            console.log('\n✨ Email uniqueness validation demonstration completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Demonstration failed:', error);
            process.exit(1);
        });
}

export default demonstrateEmailUniqueness;
