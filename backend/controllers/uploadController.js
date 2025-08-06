const fs = require('fs-extra');
const path = require('path');
const { generateFileHash, generateUploadId } = require('../utils/hashUtil');
const { categorizeFile, categorizeFiles, getFileSizeCategory, getAllCategories } = require('../utils/fileCategorizer');

// In-memory storage for demonstration (use database in production)
let uploadDatabase = [];
let fileDatabase = [];

/**
 * Handle file/folder upload
 */
const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    const uploadId = generateUploadId();
    const uploadTimestamp = new Date().toISOString();
    const duplicates = [];
    const uploaded = [];
    const errors = [];

    // Process each uploaded file
    for (const file of req.files) {
      try {
        // Generate hash for duplicate detection
        const fileHash = await generateFileHash(file.path);
        
        // Check for duplicates
        const existingFile = fileDatabase.find(f => f.hash === fileHash);
        
        if (existingFile) {
          duplicates.push({
            originalname: file.originalname,
            existingFile: existingFile.originalname,
            path: file.path,
            uploadDate: existingFile.uploadDate
          });
          
          // Remove duplicate file
          await fs.remove(file.path);
        } else {
          // Categorize file
          const category = categorizeFile(file.originalname, file.mimetype);
          const sizeCategory = getFileSizeCategory(file.size);
          
          // Create file record
          const fileRecord = {
            id: generateUploadId(),
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            hash: fileHash,
            category: category,
            sizeCategory: sizeCategory,
            uploadId: uploadId,
            uploadDate: uploadTimestamp,
            relativePath: path.relative(path.join(__dirname, '../uploads'), file.path)
          };
          
          fileDatabase.push(fileRecord);
          uploaded.push(fileRecord);
        }
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    // Create upload record
    const uploadRecord = {
      id: uploadId,
      timestamp: uploadTimestamp,
      totalFiles: req.files.length,
      uploadedFiles: uploaded.length,
      duplicateFiles: duplicates.length,
      errorFiles: errors.length,
      folderPath: req.body.folderPath || 'general',
      status: 'completed'
    };

    uploadDatabase.push(uploadRecord);

    // Categorize uploaded files for response
    const categorizedFiles = categorizeFiles(uploaded);

    res.json({
      success: true,
      message: 'Upload completed',
      uploadId: uploadId,
      summary: {
        total: req.files.length,
        uploaded: uploaded.length,
        duplicates: duplicates.length,
        errors: errors.length
      },
      uploadedFiles: uploaded,
      duplicates: duplicates,
      errors: errors,
      categories: categorizedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
};

/**
 * Get upload status/history
 */
const getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.params;

    if (uploadId) {
      const upload = uploadDatabase.find(u => u.id === uploadId);
      if (!upload) {
        return res.status(404).json({
          error: 'Upload not found',
          message: 'No upload found with the specified ID'
        });
      }

      const files = fileDatabase.filter(f => f.uploadId === uploadId);
      
      res.json({
        upload: upload,
        files: files
      });
    } else {
      // Return all uploads
      res.json({
        uploads: uploadDatabase.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        totalUploads: uploadDatabase.length,
        totalFiles: fileDatabase.length
      });
    }
  } catch (error) {
    console.error('Error getting upload status:', error);
    res.status(500).json({
      error: 'Failed to get upload status',
      message: error.message
    });
  }
};

/**
 * Get available file categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = getAllCategories();
    
    // Add file counts for each category
    const categoriesWithCounts = categories.map(category => {
      const count = fileDatabase.filter(file => file.category.category === category.key).length;
      return {
        ...category,
        fileCount: count
      };
    });

    res.json({
      categories: categoriesWithCounts,
      totalFiles: fileDatabase.length
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
};

/**
 * Check for duplicates without uploading
 */
const checkDuplicates = async (req, res) => {
  try {
    const { hashes } = req.body;
    
    if (!hashes || !Array.isArray(hashes)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Please provide an array of file hashes'
      });
    }

    const duplicates = hashes.map(hash => {
      const existing = fileDatabase.find(f => f.hash === hash);
      return {
        hash: hash,
        isDuplicate: !!existing,
        existingFile: existing || null
      };
    });

    res.json({
      duplicates: duplicates,
      duplicateCount: duplicates.filter(d => d.isDuplicate).length
    });
  } catch (error) {
    console.error('Error checking duplicates:', error);
    res.status(500).json({
      error: 'Failed to check duplicates',
      message: error.message
    });
  }
};

/**
 * Get files by category
 */
const getFilesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    let files = fileDatabase;
    
    if (category && category !== 'all') {
      files = fileDatabase.filter(f => f.category.category.toLowerCase() === category.toLowerCase());
    }

    // Sort by upload date (newest first)
    files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    res.json({
      category: category || 'all',
      files: files,
      count: files.length
    });
  } catch (error) {
    console.error('Error getting files by category:', error);
    res.status(500).json({
      error: 'Failed to get files',
      message: error.message
    });
  }
};

/**
 * Delete a file
 */
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const fileIndex = fileDatabase.findIndex(f => f.id === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({
        error: 'File not found',
        message: 'No file found with the specified ID'
      });
    }

    const file = fileDatabase[fileIndex];
    
    // Remove file from filesystem
    try {
      await fs.remove(file.path);
    } catch (fsError) {
      console.warn('File already removed from filesystem:', file.path);
    }

    // Remove from database
    fileDatabase.splice(fileIndex, 1);

    res.json({
      success: true,
      message: 'File deleted successfully',
      deletedFile: {
        id: file.id,
        originalname: file.originalname
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      message: error.message
    });
  }
};

module.exports = {
  uploadFiles,
  getUploadStatus,
  getCategories,
  checkDuplicates,
  getFilesByCategory,
  deleteFile
};
