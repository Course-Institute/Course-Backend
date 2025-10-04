import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dirname, join } from 'path';
import connectDB from './db/connection.js';
import indexRoutes from './router/index.router.js';
import { fileURLToPath } from 'url';

// // Setup __dirname for CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// CORS configuration for your frontend running on port 3001
const corsOptions = {
  origin: [
    'http://localhost:3001',  // Your current frontend port
    'http://localhost:4000',  // Alternative frontend port
    'http://localhost:5173',  // Vite dev server default port
    'http://127.0.0.1:3001',  // Alternative localhost
    'https://mivpsa.in'       // Production domain
  ],
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory (outside app folder)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api', indexRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;