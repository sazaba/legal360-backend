const db = require('../config/db');
const path = require('path');
const fs = require('fs/promises'); // Usa promesas modernas con fs

// Crear post
exports.createPost = async (req, res) => {
    try {
        const { title, slug, content, author, status } = req.body;
        const image_filename = req.file ? req.file.filename : null;

        if (!title || !slug || !content) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const [result] = await db.query(`
            INSERT INTO blog_posts (title, slug, content, image_filename, author, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, slug, content, image_filename, author || 'Anónimo', status || 'draft']
        );

        res.status(201).json({ message: 'Publicación creada', id: result.insertId });

    } catch (err) {
        if (req.file) {
            await fs.unlink(path.join('uploads/blog', req.file.filename));
        }

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El slug ya está en uso. Usa uno diferente.' });
        }

        console.error('Error al crear blog:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los posts
exports.getPosts = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_filename, author, created_at, status
            FROM blog_posts
            ORDER BY created_at DESC
        `);

        const posts = results.map(post => ({
            ...post,
            image_url: post.image_filename
                ? `${req.protocol}://${req.get('host')}/uploads/blog/${post.image_filename}`
                : null
        }));

        res.json(posts);
    } catch (err) {
        console.error('Error al obtener blogs:', err);
        res.status(500).json({ message: 'Error al obtener los posts' });
    }
};

// Actualizar post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, author, status } = req.body;
    const newImage = req.file ? req.file.filename : null;

    try {
        const [rows] = await db.query('SELECT image_filename FROM blog_posts WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const oldImage = rows[0].image_filename;
        const finalImage = newImage || oldImage;

        if (newImage && oldImage) {
            await fs.unlink(path.join('uploads/blog', oldImage)).catch(() => { });
        }

        await db.query(`
            UPDATE blog_posts SET
                title = ?, slug = ?, content = ?, image_filename = ?, author = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [title, slug, content, finalImage, author || 'Anónimo', status || 'draft', id]);

        res.json({ message: 'Publicación actualizada correctamente' });

    } catch (err) {
        console.error('Error al actualizar el blog:', err);
        res.status(500).json({ message: 'Error al actualizar la publicación' });
    }
};

// Eliminar post
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT image_filename FROM blog_posts WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const image_filename = rows[0].image_filename;

        await db.query('DELETE FROM blog_posts WHERE id = ?', [id]);

        if (image_filename) {
            await fs.unlink(path.join('uploads/blog', image_filename)).catch(() => { });
        }

        res.json({ message: 'Publicación eliminada correctamente' });

    } catch (err) {
        console.error('Error al eliminar publicación:', err);
        res.status(500).json({ message: 'Error al eliminar el blog' });
    }
};

// Obtener solo publicaciones publicadas
exports.getPublishedPosts = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_filename, author, created_at 
            FROM blog_posts 
            WHERE status = 'published' 
            ORDER BY created_at DESC
        `);

        const posts = results.map(post => ({
            ...post,
            image: post.image_filename
                ? `${req.protocol}://${req.get('host')}/uploads/blog/${post.image_filename}`
                : null
        }));

        res.json(posts);
    } catch (err) {
        console.error('Error al obtener publicaciones publicadas:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_filename, author, created_at
            FROM blog_posts
            WHERE slug = ?
            LIMIT 1
        `, [slug]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const blog = results[0];
        res.json({
            ...blog,
            image: blog.image_filename
                ? `${req.protocol}://${req.get('host')}/uploads/blog/${blog.image_filename}`
                : null
        });
    } catch (err) {
        console.error('Error al obtener publicación por slug:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
