const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Preserve folder structure
    const uploadPath = req.body.folderPath || 'general';
    const fullPath = path.join(__dirname, '../uploads', uploadPath);
    
    // Ensure directory exists
    fs.ensureDirSync(fullPath);
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Preserve original filename
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, originalName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow all file types for now
  // You can add restrictions here if needed
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 100 // Maximum 100 files per upload
  }
});

// Middleware for handling folder uploads
const handleFolderUpload = upload.array('files'); // 'files' should match the frontend field name

// Error handling wrapper
const uploadMiddleware = (req, res, next) => {
  handleFolderUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large',
          message: 'File size should not exceed 50MB'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          error: 'Too many files',
          message: 'Maximum 100 files allowed per upload'
        });
      }
      return res.status(400).json({
        error: 'Upload error',
        message: err.message
      });
    } else if (err) {
      return res.status(500).json({
        error: 'Server error',
        message: err.message
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;
