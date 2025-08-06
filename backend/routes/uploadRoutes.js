const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/fileUpload');
const uploadController = require('../controllers/uploadController');

// Route for uploading files/folders
router.post('/', uploadMiddleware, uploadController.uploadFiles);

// Route for getting upload status/history
router.get('/status/:uploadId?', uploadController.getUploadStatus);

// Route for getting file categories
router.get('/categories', uploadController.getCategories);

// Route for checking duplicates
router.post('/check-duplicates', uploadController.checkDuplicates);

// Route for getting files by category
router.get('/files/:category?', uploadController.getFilesByCategory);

// Route for deleting files
router.delete('/files/:fileId', uploadController.deleteFile);

module.exports = router;
