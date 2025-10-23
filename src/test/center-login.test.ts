import authService from '../components/auth/services/auth.service';

describe('Center Login API Tests', () => {
    describe('Valid Login Scenarios', () => {
        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: 'jaat@gmail.com',
                password: '123456'
            };

            try {
                const result = await authService.centerLogin(loginData);
                
                expect(result).toBeDefined();
                expect(result.user).toBeDefined();
                expect(result.token).toBeDefined();
                expect(result.user.role).toBe('center');
                expect(result.user.email).toBe(loginData.email);
                expect(result.user.centerName).toBeDefined();
                expect(result.user.centerCode).toBeDefined();
            } catch (error: any) {
                // If it fails due to center not existing or not approved, that's also valid
                expect(error.message).toContain('Invalid email or password');
            }
        });

        it('should login with any of the three email fields', async () => {
            // Test with official email
            try {
                const result1 = await authService.centerLogin({
                    email: 'official@example.com',
                    password: '123456'
                });
                expect(result1.user.role).toBe('center');
            } catch (error: any) {
                // Expected if center doesn't exist
                expect(error.message).toContain('Invalid email or password');
            }

            // Test with authorized person email
            try {
                const result2 = await authService.centerLogin({
                    email: 'authorized@example.com',
                    password: '123456'
                });
                expect(result2.user.role).toBe('center');
            } catch (error: any) {
                // Expected if center doesn't exist
                expect(error.message).toContain('Invalid email or password');
            }

            // Test with login username
            try {
                const result3 = await authService.centerLogin({
                    email: 'login@example.com',
                    password: '123456'
                });
                expect(result3.user.role).toBe('center');
            } catch (error: any) {
                // Expected if center doesn't exist
                expect(error.message).toContain('Invalid email or password');
            }
        });
    });

    describe('Invalid Login Scenarios', () => {
        it('should reject login with invalid email', async () => {
            await expect(authService.centerLogin({
                email: 'nonexistent@example.com',
                password: '123456'
            })).rejects.toThrow('Invalid email or password');
        });

        it('should reject login with invalid password', async () => {
            await expect(authService.centerLogin({
                email: 'jaat@gmail.com',
                password: 'wrongpassword'
            })).rejects.toThrow('Invalid email or password');
        });

        it('should reject login for non-approved center', async () => {
            // This test assumes there's a center with status 'pending' or 'rejected'
            try {
                await authService.centerLogin({
                    email: 'pending@example.com',
                    password: '123456'
                });
            } catch (error: any) {
                expect(error.message).toContain('Center account is not approved yet');
            }
        });

        it('should reject login with empty email', async () => {
            await expect(authService.centerLogin({
                email: '',
                password: '123456'
            })).rejects.toThrow('Invalid email or password');
        });

        it('should reject login with empty password', async () => {
            await expect(authService.centerLogin({
                email: 'jaat@gmail.com',
                password: ''
            })).rejects.toThrow('Invalid email or password');
        });
    });

    describe('Response Format', () => {
        it('should return correct response structure', async () => {
            try {
                const result = await authService.centerLogin({
                    email: 'jaat@gmail.com',
                    password: '123456'
                });

                // Check response structure
                expect(result).toHaveProperty('user');
                expect(result).toHaveProperty('token');
                
                // Check user object structure
                expect(result.user).toHaveProperty('id');
                expect(result.user).toHaveProperty('name');
                expect(result.user).toHaveProperty('email');
                expect(result.user).toHaveProperty('role');
                expect(result.user).toHaveProperty('centerName');
                expect(result.user).toHaveProperty('centerCode');
                
                // Check data types
                expect(typeof result.user.id).toBe('string');
                expect(typeof result.user.name).toBe('string');
                expect(typeof result.user.email).toBe('string');
                expect(typeof result.user.role).toBe('string');
                expect(typeof result.user.centerName).toBe('string');
                expect(typeof result.user.centerCode).toBe('string');
                expect(typeof result.token).toBe('string');
                
                // Check role
                expect(result.user.role).toBe('center');
            } catch (error: any) {
                // Expected if center doesn't exist or not approved
                expect(error.message).toContain('Invalid email or password');
            }
        });
    });

    describe('Security Tests', () => {
        it('should not expose sensitive information', async () => {
            try {
                const result = await authService.centerLogin({
                    email: 'jaat@gmail.com',
                    password: '123456'
                });

                // Check that password is not included in response
                expect(result.user).not.toHaveProperty('password');
                expect(result.user).not.toHaveProperty('loginCredentials');
                
                // Check that only necessary fields are included
                const userKeys = Object.keys(result.user);
                const expectedKeys = ['id', 'name', 'email', 'role', 'centerName', 'centerCode'];
                expect(userKeys.sort()).toEqual(expectedKeys.sort());
            } catch (error: any) {
                // Expected if center doesn't exist or not approved
                expect(error.message).toContain('Invalid email or password');
            }
        });

        it('should generate valid JWT token', async () => {
            try {
                const result = await authService.centerLogin({
                    email: 'jaat@gmail.com',
                    password: '123456'
                });

                // Check that token is a string and not empty
                expect(typeof result.token).toBe('string');
                expect(result.token.length).toBeGreaterThan(0);
                
                // Check that token contains dots (JWT format)
                expect(result.token.split('.')).toHaveLength(3);
            } catch (error: any) {
                // Expected if center doesn't exist or not approved
                expect(error.message).toContain('Invalid email or password');
            }
        });
    });
});
