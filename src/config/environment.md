# Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/course-backend

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRES_IN=24h

# Admin Registration Protection
PASSWORD=admin123

# Environment
NODE_ENV=development
```

## Security Notes

1. **JWT_SECRET**: Use a long, random string (at least 32 characters)
2. **PASSWORD**: This protects admin registration - keep it secure
3. **MONGODB_URI**: Use a secure MongoDB connection string
4. Never commit the `.env` file to version control
