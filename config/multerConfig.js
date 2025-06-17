const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegura que la carpeta uploads exista
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Configuración de almacenamiento con normalización de nombre de archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);

        const normalizedBase = baseName
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\-]/g, "_")
            .toLowerCase();

        const uniqueName = `${Date.now()}-${normalizedBase}${extension}`;
        cb(null, uniqueName);
    }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip/;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedTypes.test(ext));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
