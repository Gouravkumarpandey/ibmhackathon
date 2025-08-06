# File Upload Backend

A Node.js/Express backend for handling file uploads with duplicate detection and categorization.

## Features

- 📁 **Folder Upload Support**: Preserves folder structure during upload
- 🔍 **Duplicate Detection**: Uses MD5 hashing to detect and prevent duplicate files
- 📂 **File Categorization**: Automatically categorizes files by type (Images, Documents, Videos, etc.)
- 🚀 **RESTful API**: Clean API endpoints for upload management
- 📊 **Upload Analytics**: Track upload history and statistics
- 🗑️ **File Management**: Delete files and manage storage

## Project Structure

```
backend/
├── controllers/
│   └── uploadController.js        # Logic for handling file uploads, duplicate detection, categorization
├── middleware/
│   └── fileUpload.js              # Multer config for folder upload (preserve folder structure)
├── routes/
│   └── uploadRoutes.js            # API route for file/folder uploads
├── utils/
│   ├── hashUtil.js                # Function to generate hash for duplicate detection
│   └── fileCategorizer.js         # Logic to categorize files (by type, extension, etc.)
├── uploads/                       # Uploaded files stored here (structured by user/folder)
├── server.js                      # Main entry point (Express app setup)
├── package.json                   # NPM dependencies and scripts
└── .gitignore                     # To ignore uploads/, node_modules/, etc.
```

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Edit the `.env` file with your configuration

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Upload Files
- **POST** `/api/upload/`
- Upload files or folders with duplicate detection and categorization
- **Body**: Form data with `files` field and optional `folderPath`

### Get Upload Status
- **GET** `/api/upload/status/:uploadId?`
- Get status of a specific upload or all uploads

### Get Categories
- **GET** `/api/upload/categories`
- Get all file categories with file counts

### Check Duplicates
- **POST** `/api/upload/check-duplicates`
- Check if files are duplicates before uploading
- **Body**: `{ "hashes": ["hash1", "hash2", ...] }`

### Get Files by Category
- **GET** `/api/upload/files/:category?`
- Get files filtered by category

### Delete File
- **DELETE** `/api/upload/files/:fileId`
- Delete a specific file

### Health Check
- **GET** `/health`
- Check if the server is running

## File Categories

The system automatically categorizes files into:

- **Images**: JPG, PNG, GIF, SVG, WebP, etc.
- **Documents**: PDF, DOC, DOCX, TXT, RTF, etc.
- **Spreadsheets**: XLS, XLSX, CSV, ODS, etc.
- **Presentations**: PPT, PPTX, ODP, KEY, etc.
- **Videos**: MP4, AVI, MOV, WebM, etc.
- **Audio**: MP3, WAV, FLAC, AAC, etc.
- **Archives**: ZIP, RAR, 7Z, TAR, etc.
- **Code**: JS, TS, HTML, CSS, Python, Java, etc.
- **Data**: JSON, XML, YAML, SQL, etc.
- **Fonts**: TTF, OTF, WOFF, WOFF2, etc.
- **Other**: Files that don't match other categories

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 50MB)
- `MAX_FILES_PER_UPLOAD`: Maximum files per upload (default: 100)
- `UPLOAD_PATH`: Path to store uploaded files (default: ./uploads)
- `CORS_ORIGIN`: CORS origin for frontend (default: http://localhost:5173)

### File Upload Limits

- Maximum file size: 50MB per file
- Maximum files per upload: 100 files
- Supported: All file types

## Security Features

- File type validation
- File size limits
- CORS protection
- Input sanitization
- Error handling

## Data Storage

Currently uses in-memory storage for demonstration. For production use, consider:

- MongoDB for file metadata
- PostgreSQL for relational data
- Redis for caching
- Cloud storage (AWS S3, Google Cloud Storage)

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] File sharing capabilities
- [ ] Virus scanning
- [ ] Image thumbnail generation
- [ ] Search functionality
- [ ] Bulk operations
- [ ] Storage quotas

## Dependencies

- **express**: Web framework
- **multer**: File upload middleware
- **cors**: Cross-origin resource sharing
- **crypto**: Hash generation
- **fs-extra**: Enhanced file system operations
- **dotenv**: Environment variable loading

## License

[Add your license here]
