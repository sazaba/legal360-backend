// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pdfStorage, storage: blogImageStorage } = require("../config/cloudinary");

// 📁 Asegura que la carpeta uploads exista (por si usas disco local aún)
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// 💾 Almacenamiento local para pruebas o backups
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);

        const normalizedBase = baseName
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^\w\-]/g, "_")
            .toLowerCase();

        const uniqueName = `${Date.now()}-${normalizedBase}${extension}`;
        cb(null, uniqueName);
    }
});

// 🎯 Filtro de tipos de archivo (solo si usas disco local)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip/;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedTypes.test(ext));
};

// 📦 Subida local (opcional)
const uploadLocal = multer({ storage: localStorage, fileFilter });

// ☁️ Subida de imágenes al blog
const uploadBlogImage = multer({ storage: blogImageStorage });

// ☁️ Subida de PDFs a Cloudinary (PQRSF) con validación
const pdfFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);
    }
};

const uploadPQRSF = multer({
    storage: pdfStorage,
    fileFilter: pdfFileFilter
});

module.exports = {
    uploadLocal,      // por si lo necesitas
    uploadBlogImage,  // para imágenes (blog)
    uploadPQRSF       // para PDFs (pqrsf)
};
