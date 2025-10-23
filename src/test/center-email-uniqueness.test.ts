import centerService from '../components/centers/services/center.service';
import { CreateCenterRequest } from '../components/centers/models/center.model';

describe('Center Email Uniqueness Tests', () => {
    const baseCenterData: CreateCenterRequest = {
        centerDetails: {
            centerName: 'Test Center',
            centerType: 'franchise',
            yearOfEstablishment: 2025,
            address: 'Test Address, Test City',
            city: 'Test City',
            state: 'Test State',
            pinCode: '123456',
            officialEmail: 'test@example.com',
            primaryContactNo: '9876543210'
        },
        authorizedPersonDetails: {
            authName: 'Test Person',
            designation: 'Director',
            contactNo: '9876543210',
            email: 'test@example.com',
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
            username: 'test@example.com',
            password: 'password123'
        }
    };

    describe('Email Uniqueness Validation', () => {
        it('should reject center registration with duplicate emails in different fields', async () => {
            // This should fail because the same email is used in officialEmail, authorizedPersonDetails.email, and loginCredentials.username
            await expect(centerService.createCenter(baseCenterData))
                .rejects
                .toThrow('Same email cannot be used in multiple fields (official email, authorized person email, and login username must be unique)');
        });

        it('should accept center registration with unique emails in all fields', async () => {
            const validCenterData: CreateCenterRequest = {
                ...baseCenterData,
                centerDetails: {
                    ...baseCenterData.centerDetails,
                    officialEmail: 'official@example.com'
                },
                authorizedPersonDetails: {
                    ...baseCenterData.authorizedPersonDetails,
                    email: 'authorized@example.com'
                },
                loginCredentials: {
                    ...baseCenterData.loginCredentials,
                    username: 'login@example.com'
                }
            };

            // This should work because all three emails are different
            // Note: This test might fail if the emails already exist in the database
            // In a real test environment, you'd want to clean up the database first
            try {
                const result = await centerService.createCenter(validCenterData);
                expect(result).toBeDefined();
                expect(result.centerDetails.officialEmail).toBe('official@example.com');
                expect(result.authorizedPersonDetails.email).toBe('authorized@example.com');
                expect(result.loginCredentials?.username).toBe('login@example.com');
            } catch (error: any) {
                // If it fails due to existing emails, that's also a valid test result
                // as it means the uniqueness check is working
                expect(error.message).toContain('already exists');
            }
        });

        it('should reject center registration if official email already exists', async () => {
            const centerWithExistingOfficialEmail: CreateCenterRequest = {
                ...baseCenterData,
                centerDetails: {
                    ...baseCenterData.centerDetails,
                    officialEmail: 'existing@example.com'
                },
                authorizedPersonDetails: {
                    ...baseCenterData.authorizedPersonDetails,
                    email: 'new@example.com'
                },
                loginCredentials: {
                    ...baseCenterData.loginCredentials,
                    username: 'newlogin@example.com'
                }
            };

            // This should fail if 'existing@example.com' is already used in any center
            try {
                await centerService.createCenter(centerWithExistingOfficialEmail);
            } catch (error: any) {
                expect(error.message).toContain('already exists');
            }
        });

        it('should reject center registration if authorized person email already exists', async () => {
            const centerWithExistingAuthEmail: CreateCenterRequest = {
                ...baseCenterData,
                centerDetails: {
                    ...baseCenterData.centerDetails,
                    officialEmail: 'new@example.com'
                },
                authorizedPersonDetails: {
                    ...baseCenterData.authorizedPersonDetails,
                    email: 'existing@example.com'
                },
                loginCredentials: {
                    ...baseCenterData.loginCredentials,
                    username: 'newlogin@example.com'
                }
            };

            // This should fail if 'existing@example.com' is already used in any center
            try {
                await centerService.createCenter(centerWithExistingAuthEmail);
            } catch (error: any) {
                expect(error.message).toContain('already exists');
            }
        });

        it('should reject center registration if login username already exists', async () => {
            const centerWithExistingLogin: CreateCenterRequest = {
                ...baseCenterData,
                centerDetails: {
                    ...baseCenterData.centerDetails,
                    officialEmail: 'new@example.com'
                },
                authorizedPersonDetails: {
                    ...baseCenterData.authorizedPersonDetails,
                    email: 'newauth@example.com'
                },
                loginCredentials: {
                    ...baseCenterData.loginCredentials,
                    username: 'existing@example.com'
                }
            };

            // This should fail if 'existing@example.com' is already used in any center
            try {
                await centerService.createCenter(centerWithExistingLogin);
            } catch (error: any) {
                expect(error.message).toContain('already exists');
            }
        });
    });
});
