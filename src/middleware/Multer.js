import multer from 'multer';
import fs from 'fs';

export const allowedExtensions = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  video: ['video/mp4', 'video/webm'],
  pdf: ['application/pdf'],
};

export const MulterHost = (customeExtension) => {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (!customeExtension.includes(file.mimetype)) {
      cb(new Error('Invalid File'));
    } else {
      cb(null, true);
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};

export const MulterLocal = (customePath, customeExtension) => {
  const fullPath = `uploads/${customePath}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '_' + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (!customeExtension.includes(file.mimetype)) {
      cb(new Error('Invalid File'));
    } else {
      cb(null, true);
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};
