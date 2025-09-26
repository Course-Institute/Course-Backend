import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userDal from '../../users/dals/user.dal';

interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    token: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

    async registerAdmin(data: RegisterData): Promise<any> {
        try {
            // Check if user already exists
            const existingUser = await userDal.checkUserExists(data.email);
            if (existingUser) {
                throw new Error('Admin with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 12);
            
            // Create admin user
            const user = await userDal.createAdmin({
                name: data.name,
                email: data.email,
                password: hashedPassword
            });

            // Generate JWT token
            const token = this.generateToken(user._id.toString(), user.role);

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async adminLogin(data: LoginData): Promise<LoginResponse> {
        try {
            // Find user by email using DAL
            const user = await userDal.findUserByEmail(data.email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check if user is admin
            if (user.role !== 'admin') {
                throw new Error('Access denied. Admin role required.');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = this.generateToken(user._id.toString(), user.role);

            return {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    private generateToken(userId: string, role: string): string {
        return jwt.sign(
            { 
                userId, 
                role,
                type: 'admin'
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
        );
    }

    async getAdminById(userId: string): Promise<any> {
        try {
            const user = await userDal.findAdminById(userId);
            if (!user || user.role !== 'admin') {
                throw new Error('Admin not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();
