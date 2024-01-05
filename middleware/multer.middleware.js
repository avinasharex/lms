import multer from 'multer';
import path from 'path';


// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Directory to save the uploaded files
  filename: (req, file, cb) => {
    // Preserve the original file extension
    const ext = path.extname(file.originalname);
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

export default upload