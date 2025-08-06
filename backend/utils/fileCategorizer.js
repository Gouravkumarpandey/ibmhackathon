const path = require('path');

// File type categories
const FILE_CATEGORIES = {
  IMAGES: {
    name: 'Images',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff', '.tif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp']
  },
  DOCUMENTS: {
    name: 'Documents',
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },
  SPREADSHEETS: {
    name: 'Spreadsheets',
    extensions: ['.xls', '.xlsx', '.csv', '.ods', '.numbers'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
  },
  PRESENTATIONS: {
    name: 'Presentations',
    extensions: ['.ppt', '.pptx', '.odp', '.key'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  },
  VIDEOS: {
    name: 'Videos',
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'],
    mimeTypes: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/webm']
  },
  AUDIO: {
    name: 'Audio',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg']
  },
  ARCHIVES: {
    name: 'Archives',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'],
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar']
  },
  CODE: {
    name: 'Code',
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.sass', '.less', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.dart', '.vue', '.svelte'],
    mimeTypes: ['text/javascript', 'text/html', 'text/css', 'application/json']
  },
  DATA: {
    name: 'Data',
    extensions: ['.json', '.xml', '.yaml', '.yml', '.sql', '.db', '.sqlite'],
    mimeTypes: ['application/json', 'application/xml', 'text/xml', 'application/x-sqlite3']
  },
  FONTS: {
    name: 'Fonts',
    extensions: ['.ttf', '.otf', '.woff', '.woff2', '.eot'],
    mimeTypes: ['font/ttf', 'font/otf', 'font/woff', 'font/woff2']
  },
  OTHER: {
    name: 'Other',
    extensions: [],
    mimeTypes: []
  }
};

/**
 * Categorize a file based on its extension and MIME type
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {object} - Category information
 */
const categorizeFile = (filename, mimeType = '') => {
  const extension = path.extname(filename).toLowerCase();
  
  for (const [categoryKey, categoryInfo] of Object.entries(FILE_CATEGORIES)) {
    if (categoryKey === 'OTHER') continue;
    
    // Check by extension first
    if (categoryInfo.extensions.includes(extension)) {
      return {
        category: categoryKey,
        categoryName: categoryInfo.name,
        type: 'extension'
      };
    }
    
    // Check by MIME type
    if (mimeType && categoryInfo.mimeTypes.some(mime => mimeType.includes(mime))) {
      return {
        category: categoryKey,
        categoryName: categoryInfo.name,
        type: 'mimetype'
      };
    }
  }
  
  // Default to OTHER category
  return {
    category: 'OTHER',
    categoryName: FILE_CATEGORIES.OTHER.name,
    type: 'default'
  };
};

/**
 * Get file size category
 * @param {number} sizeInBytes - File size in bytes
 * @returns {string} - Size category
 */
const getFileSizeCategory = (sizeInBytes) => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  
  if (sizeInMB < 1) return 'SMALL'; // < 1MB
  if (sizeInMB < 10) return 'MEDIUM'; // 1-10MB
  if (sizeInMB < 100) return 'LARGE'; // 10-100MB
  return 'VERY_LARGE'; // > 100MB
};

/**
 * Get all available categories
 * @returns {array} - Array of category information
 */
const getAllCategories = () => {
  return Object.entries(FILE_CATEGORIES).map(([key, info]) => ({
    key,
    name: info.name,
    extensions: info.extensions,
    mimeTypes: info.mimeTypes
  }));
};

/**
 * Categorize multiple files
 * @param {array} files - Array of file objects
 * @returns {object} - Categorized files
 */
const categorizeFiles = (files) => {
  const categorized = {};
  
  files.forEach(file => {
    const category = categorizeFile(file.originalname, file.mimetype);
    const categoryKey = category.category;
    
    if (!categorized[categoryKey]) {
      categorized[categoryKey] = {
        categoryName: category.categoryName,
        files: []
      };
    }
    
    categorized[categoryKey].files.push({
      ...file,
      category: category
    });
  });
  
  return categorized;
};

/**
 * Get file type description
 * @param {string} filename - Name of the file
 * @returns {string} - File type description
 */
const getFileTypeDescription = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  
  const typeDescriptions = {
    '.pdf': 'PDF Document',
    '.doc': 'Microsoft Word Document',
    '.docx': 'Microsoft Word Document',
    '.txt': 'Text File',
    '.jpg': 'JPEG Image',
    '.jpeg': 'JPEG Image',
    '.png': 'PNG Image',
    '.gif': 'GIF Image',
    '.mp4': 'MP4 Video',
    '.mp3': 'MP3 Audio',
    '.zip': 'ZIP Archive',
    '.js': 'JavaScript File',
    '.css': 'CSS Stylesheet',
    '.html': 'HTML Document',
    '.json': 'JSON Data'
  };
  
  return typeDescriptions[extension] || `${extension.toUpperCase().slice(1)} File`;
};

module.exports = {
  FILE_CATEGORIES,
  categorizeFile,
  getFileSizeCategory,
  getAllCategories,
  categorizeFiles,
  getFileTypeDescription
};
