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
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     console.log("Request Origin:", origin)
    
//     // Allow specific ports
//     const allowedOrigins = [
//       'http://localhost:4000',
//       'http://127.0.0.1:4000',
//       'http://localhost:5173',
//       'http://127.0.0.1:5173',
//       'http://localhost:5000',
//       'http://127.0.0.1:5000'
//     ];
    
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
    
//     return callback(new Error('Not allowed by CORS'));
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
//   exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 200
// }));
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