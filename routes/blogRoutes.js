const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// 👉 Configuración de Multer y Cloudinary
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // 👈 usamos el storage ya configurado
const upload = multer({ storage });

// Rutas del blog
router.post('/create', upload.single('image'), blogController.createPost);      // Crear post
router.get('/list', blogController.getPosts);                                   // Listar todos
router.put('/update/:id', upload.single('image'), blogController.updatePost);   // Actualizar
router.delete('/delete/:id', blogController.deletePost);                        // Eliminar
router.get('/published', blogController.getPublishedPosts);                     // Publicados
router.get('/:slug', blogController.getPostBySlug);                             // Por slug

module.exports = router;
