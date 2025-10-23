import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use environment-based upload path
        const uploadPath = process.env.NODE_ENV === 'production' 
            ? '/var/www/mivpsa/uploads/' 
            : path.join(process.cwd(), 'uploads');
        console.log('Upload path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

export const uploadStudentFiles = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// Configure multer for center file uploads
export const uploadCenterFiles = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

export const multerErrorHandler = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            status: false,
            message: 'File upload error: ' + error.message,
            error: error.message
        });
    }
    next(error);
};
