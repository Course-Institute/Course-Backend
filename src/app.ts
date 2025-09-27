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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
