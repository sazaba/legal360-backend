// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'legal360/blog',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'legal360/pqrsf',
        resource_type: 'raw', // Para PDFs u otros archivos no imagen
        allowed_formats: ['pdf'],
    },
});

module.exports = { cloudinary, storage, pdfStorage };
