const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');

// Configuración de almacenamiento para las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blog'); // carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + file.fieldname + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// Rutas del blog
router.post('/create', upload.single('image'), blogController.createPost);      // Crear post
router.get('/list', blogController.getPosts);                                   // Listar posts
router.put('/update/:id', upload.single('image'), blogController.updatePost);   // Actualizar post
router.delete('/delete/:id', blogController.deletePost); // Eliminar post   
router.get('/published', blogController.getPublishedPosts);
router.get('/:slug', blogController.getPostBySlug);


module.exports = router;
