# Database Connection

This folder contains the MongoDB database connection configuration.

## Files

- `connection.ts` - Main database connection function
- `index.ts` - Export file for easy imports

## Usage

```typescript
import { connectDB } from '../db';

// Connect to database
await connectDB();
```

## Environment Variables

Set the following environment variable in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/course-backend
```

## Features

- Automatic connection to MongoDB
- Error handling and logging
- Environment variable support
- Graceful connection management
