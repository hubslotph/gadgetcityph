const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirectories = () => {
  const dirs = [
    'public/images/products',
    'public/images/products/thumbnails',
    'public/images/temp'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// Create directories on module load
createDirectories();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store in temp directory first, then move after processing
    cb(null, path.join(process.cwd(), 'public/images/temp'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + extension);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files per upload
  }
});

// Middleware for handling single image upload
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Middleware for handling multiple image uploads
const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

// Middleware for handling mixed fields (text + files)
const uploadFields = (fields) => {
  return upload.fields(fields);
};

// Helper function to move file from temp to permanent location
const moveToPermanent = (tempPath, productId, index = 0) => {
  const ext = path.extname(tempPath);
  const filename = `${productId}_${index + 1}${ext}`;
  const permanentPath = path.join(process.cwd(), 'public/images/products', filename);

  // Ensure products directory exists
  if (!fs.existsSync(path.dirname(permanentPath))) {
    fs.mkdirSync(path.dirname(permanentPath), { recursive: true });
  }

  // Move file
  fs.renameSync(tempPath, permanentPath);

  return {
    filename,
    url: `/images/products/${filename}`,
    path: permanentPath
  };
};

// Helper function to create thumbnail
const createThumbnail = (imagePath, productId, index = 0) => {
  const ext = path.extname(imagePath);
  const thumbnailFilename = `${productId}_${index + 1}_thumb${ext}`;
  const thumbnailPath = path.join(process.cwd(), 'public/images/products/thumbnails', thumbnailFilename);

  // For now, just copy the original as thumbnail
  // In production, you'd use sharp to resize
  fs.copyFileSync(imagePath, thumbnailPath);

  return {
    filename: thumbnailFilename,
    url: `/images/products/thumbnails/${thumbnailFilename}`,
    path: thumbnailPath
  };
};

// Helper function to delete old images
const deleteOldImages = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls)) return;

  imageUrls.forEach(image => {
    if (image.url) {
      const fullPath = path.join(process.cwd(), 'public', image.url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  });
};

// Helper function to clean temp directory
const cleanTempDirectory = () => {
  const tempDir = path.join(process.cwd(), 'public/images/temp');
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  moveToPermanent,
  createThumbnail,
  deleteOldImages,
  cleanTempDirectory
};
