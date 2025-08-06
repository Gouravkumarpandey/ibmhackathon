const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

/**
 * Generate MD5 hash for a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - MD5 hash of the file
 */
const generateFileHash = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    return hash;
  } catch (error) {
    console.error('Error generating hash for file:', filePath, error);
    throw new Error('Failed to generate file hash');
  }
};

/**
 * Generate hash from file content (for duplicate detection)
 * @param {Buffer} fileBuffer - File buffer
 * @returns {string} - MD5 hash
 */
const generateBufferHash = (fileBuffer) => {
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
};

/**
 * Generate SHA256 hash for more secure hashing
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - SHA256 hash of the file
 */
const generateSHA256Hash = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    return hash;
  } catch (error) {
    console.error('Error generating SHA256 hash for file:', filePath, error);
    throw new Error('Failed to generate SHA256 hash');
  }
};

/**
 * Compare two files by their hashes
 * @param {string} filePath1 - Path to first file
 * @param {string} filePath2 - Path to second file
 * @returns {Promise<boolean>} - True if files are identical
 */
const compareFiles = async (filePath1, filePath2) => {
  try {
    const hash1 = await generateFileHash(filePath1);
    const hash2 = await generateFileHash(filePath2);
    return hash1 === hash2;
  } catch (error) {
    console.error('Error comparing files:', error);
    return false;
  }
};

/**
 * Generate a unique identifier for uploads
 * @returns {string} - Unique upload ID
 */
const generateUploadId = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = {
  generateFileHash,
  generateBufferHash,
  generateSHA256Hash,
  compareFiles,
  generateUploadId
};
